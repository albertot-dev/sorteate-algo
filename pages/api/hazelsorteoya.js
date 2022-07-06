const scrapeIt = require("scrape-it");

export default async function handler(req, res) {
  const result = {
    winner: null,
    attendees: [],
  };
  const { source } = JSON.parse(req.body);

  if (source.startsWith("#")) {
    const { data, includes } = await (
      await fetch(
        `https://api.twitter.com/2/tweets/search/recent?tweet.fields=author_id&user.fields=&query=${encodeURIComponent(
          source
        )}%20-is:retweet&expansions=author_id`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          },
        }
      )
    ).json();
    if (data) {
      return res.json({
        message: "No se encontraron resultados",
      });
    }
    result.attendees =
      data?.map((tweet) => {
        const user = includes.users.find((user) => user.id === tweet.author_id);
        return `${user.name}(@${user.username}) | ${tweet.text}`;
      }) || [];
  }

  if (source.indexOf("saraos.tech") > -1) {
    const {
      data: { attendees },
    } = await scrapeIt(
      source + "/rsvp", //"https://saraos.tech/@xaendevs/events/testeando-wvogwf2x57478l7ohxxjk/rsvp",
      {
        attendees: {
          listItem: "div.css-83quh3",
          data: {
            nombre: "p.css-lalfd2",
          },
        },
      }
    );
    result.attendees = attendees.map((attendee) => attendee.nombre);
  }
  if (source.indexOf("meetup.com") > -1) {
    const { code, name } = getNameAndCodeMeetup(source);
    const response = await fetch(
      `https://www.meetup.com/mu_api/urlname/events/eventId/attendees?queries=(endpoint:${name}/events/${code}/attendance,meta:(method:get),params:(fields:'answers'),ref:eventAttendance_${name}_${code},type:attendance)`
    );
    const { responses } = await response.json();
    if (responses[0].error) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    result.attendees = responses[0]
      ? responses[0]?.value?.map((attendee) => {
          return attendee.member.name;
        })
      : [];
  }

  const rand = ~~(Math.random() * result.attendees.length);
  result.winner = result.attendees[rand];

  res.status(200).json(result);
}

function getNameAndCodeMeetup(url) {
  const urlWithoutProtocol = url.replace("https://", "");
  const urlSplit = urlWithoutProtocol.split("/");
  const code = urlSplit[4];
  const name = urlSplit[2];

  return {
    code,
    name,
  };
}
