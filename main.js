const express = require('express');
const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: 'iJNPgHXNKjWIZZadSQuraOJJ8aPfFWg0hlXzFSQmbepYFqVhjm85mnrJpYZxUJD8p7hrSRUKaZag4uh21cONkwi57kDycdOmAF7wPhEOz5ekqe45voycraGZSojPfSk+MYjwK7BNb6IMuCY4irnuZwdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'bbf6df9f8e8b323b4cd584538a3d3e37'
};

const app = express();
app.post('/line_webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));

  console.log(JSON.stringify(req));
});

var text = "undefined";

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  var sent_text = text;
  text = event.message.text;

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: sent_text
  });
}

app.listen(process.env.PORT || 5000);