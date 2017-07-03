
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
  console.log(req.body.events);
  for (var i in req.body.events) {
    handleEvent(req.body.events[i]);
  }
  // use this to do async way
  // Promise
  //   .all(req.body.events.map(handleEvent))
  //   .then((result) => res.json(result));
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  if (event.source.type == 'room' && event.source.roomId == 'R8f3279543e04b85d2740eda92ca9f428') {
    return client.replyMessage(event.replyToken,[{
      type : "text",
      text : 'Happy Birthday Airin!\nWish U All The Best!\nSori ya telat, baru pulang dari kerjaan. Eh tau nda kalo aku lagi kerja? Enak di sini, kerja sambil belajar. Eh, ini ucapan ulang tahun deng, kok malah aku yang cerita.\n\nSemoga harapan-harapanmu dalam tahun ini bisa terwujud! Eh omong2 emang harapanmu apa?\n\nCantik? Sudah kok.\nPinter? Juga sudah.\nPacar? Aku juga belom loh.\n#ehem #abaikan\n\nPokoknya aku bantu amini.',
    },{
      type : "text",
      text : 'Seize The Day! Terus berkarya, membanggakan orang tua, menjadi yang terbaik di antara yang terbaik. Percaya diri kalo kamu bisa, entah dunia berkata apa. Jangan pernah puas sama diri sendiri. Terus magis, berkembang, tak kenal lelah. Percaya Tuhan selalu menyertai.',
    },{
      type : "text",
      text : 'Karena tempat teksnya sudah hampir habis (maksimal 3 balon juga) jadi terpaksa sekian ucapannya (padahal sebenernya memang nda pinter ngarang kata2 T.T maafkan, maklum cowok). But srsly, jarang2 aku bikin ucapan ulang tahun sepanjang ini. Liat sendiri juga kan nek di grup KEKL mesti cuma HBD <nama> tok.\nGood luck kuliahnya. Stay in Touch. Kalo ke Semarang kabari ya, kangen (minta ditraktir maksudnya).',
    }]);
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