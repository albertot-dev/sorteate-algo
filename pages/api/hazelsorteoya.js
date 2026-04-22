import getWinnerFromTwitter from "libs/twitter";

export default async function handler(req, res) {
  const result = {
    winner: null,
    attendees: [],
  };
  const { source } = JSON.parse(req.body);

  if (source.startsWith("#")) {
    // Para Twitter/X e Instagram ambos usan hashtags
    const platform = req.body ? JSON.parse(req.body).platform : null;
    result.attendees = await getWinnerFromTwitter(source, platform);
  }

  if (source.indexOf("saraos.tech") > -1) {
    const eventUrlParts = source.split("/");
    const eventNameId = eventUrlParts[eventUrlParts.length - 1].split("-");
    const eventId = eventNameId[eventNameId.length - 1];

    const response = await fetch(
      `https://saraos.tech/api/p/communities/xauendevs/events/${eventId}/attendances`,
      {
        headers: {
          "X-Api-Key": `${process.env.SARAOS_API_TOKEN}`,
        },
      }
    );

    const { data } = await response.json();

    if (!data) {
      return res.status(404).json({ message: "No se encontraron resultados" });
    }
    result.attendees = data
      .filter((attendee) => attendee.rsvp === "YES")
      .map((attendee) => attendee.user.name);
  }
  const rand = ~~(Math.random() * result.attendees.length);
  result.winner = result.attendees[rand];

  res.status(200).json(result);
}
