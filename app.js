require('dotenv').config();

const env = process.env;
const Twitter = require('twitter')
const { IncomingWebhook } = require('@slack/webhook');
const url = env.SLACK_WEBHOOK_URL;

let client = new Twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
  access_token_key: env.ACCESS_TOKEN_KEY,
  access_token_secret: env.ACCESS_TOKEN_SECRET
})

let params = {
  q: '#ちゃちゃまる'
};

client.get('search/tweets', params, (error, tweets, response) => {
  let images = [];
  for (let status of tweets.statuses) {
    let ents = status.extended_entities;
    if (!ents) continue;
    let media = ents.media;
    if (!media) continue;
    for (let medium of media) {
      images.push(medium.media_url_https);
    }
  }

  let webhook = new IncomingWebhook(url);
  for (let imageUrl of images) {
    let params = {
      text: imageUrl
    };
    webhook.send(params)
      .catch(err => console.error(err));
  }
});

