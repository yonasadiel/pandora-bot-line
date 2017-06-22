
/**
 * Index
 * ------------------
 * Main program of the bot
 * Will organize the route
 * and all the command
 */

const express = require('express');
const line    = require('@line/bot-sdk');
const fs      = require('fs');
const config  = require('./config');

const command_folder  = "./command/";

const app = express();
app.post('/line_webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // only process messages with commandsymbol in first character
  if (event.message.text.startsWith(config.commandSymbol)) {

    args = event.message.text.split(" ");
    argc = args.length;

    fs.readdirSync(command_folder).forEach(file => {

      if (config.commandSymbol + file === args[0] + ".js") {
        const command = require(command_folder + file);

        return command.receive(argc, args, client, event);
      }
    });

  }

}

app.listen(process.env.PORT || 5000);