import { Client } from "twitter-api-sdk";
export default async function getWinnerFromTwitter(source) {
  const client = new Client(process.env.TWITTER_BEARER_TOKEN);

  let nexttoken = "first";
  let count = 0;
  let tweets = [];
  let users = [];
  while (nexttoken) {
    count++;
    const response = await client.tweets.tweetsRecentSearch({
      query: source + " -is:retweet",
      max_results: 100,
      expansions: "author_id",
      "tweet.fields": "author_id",
      "user.fields": "description",
      next_token: nexttoken === "first" ? undefined : nexttoken,
    });
    if (!response || !response.data) return [];
    tweets = [...tweets, ...response.data];
    users = [...users, ...response.includes.users];
    nexttoken = response.meta.next_token;
  }

  return tweets?.map((tweet) => {
    const user = users.find((user) => user.id === tweet.author_id);
    return `${user.name}(@${user.username}) | ${tweet.text}`;
  });
}
