
/**
 * CMD
 * ------------------
 * Get list of available command
 */

module.exports = {
  event      : '',
  client     : '',

  receive  : function(argc, args, client, event) {
    this.event  = event;
    this.client = client;

    return this.getCommand();
  },

  getCommand : function() {
    const fs      = require('fs');

    let text = 'Command List:\n';
    let bool = false;

    fs.readdirSync('./command/').forEach(file => {
      if (bool) { text += ', '; }

      bool = true;

      text += file.substr(0, file.length-3);
    });

    return this.sendResponse(text);
  },

  sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },

};