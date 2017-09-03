
/**
 * Nim
 * ------------------
 * Look for nim
 */

module.exports = {
  argc       : 0,
  args       : [],
  event      : '',
  client     : '',
  session    : {},
  session_id : '',

  receive  : function(argc, args, client, event) {
    this.argc   = argc;
    this.args   = args;
    this.event  = event;
    this.client = client;

    if (event.source.type === "group") {
      this.session_id = event.source.groupId;
    } else if (event.source.type === "room") {
      this.session_id = event.source.roomId;
    } else if (event.source.type === "user") {
      this.session_id = event.source.userId;
    }

    return this.mainHandler();
  },

  sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },

  mainHandler : function() {
    if (this.argc < 2) {
      return this.helpText();
    } else {
      if ((this.argc > 2 && isNaN(this.args[2])) || this.argc > 3) {
        return this.sendResponse("Invalid command usage");
      }
      return this.searchQuery();
    }
  },

  helpText : function() {
    let text = "";

    text += "Usage:\n";
    text += "!nim <nim|name> [page]";

    return this.sendResponse(text);
  },

  searchQuery : function() {
    let page = 0;
    if (this.argc > 2) { page = 0 - 1 + Number(this.args[2]); }

    const request = require('request');
    var url       = 'https://yonasadiel.com/lamia/search';
    url          += '?query=' + this.args[1];
    url          += '&page=' + page;

    request(url, this.searchQueryCallback.bind(this));
  },

  searchQueryCallback : function(error, response, body) {
    let page = 1;
    if (this.argc > 2) { page = this.args[2]; }
    console.log(body);

    data = JSON.parse(body);

    let text = "" + data["count"] + " data found for: " + this.args[1] + "\n Page " + page + "\n";
    for (var i = 0; i < data["result"].length; i++) {
      text += "\n\n";
      text += "[" + data["result"][i]["name"] + "]\n";
      text += data["result"][i]["nim_tpb"];
      if (data["result"][i]["nim_tpb"] != data["result"][i]["nim_prodi"])
        text += " | " + data["result"][i]["nim_tpb"];
      text += "\n";
      text += data["result"][i]["major"];
    }

    this.sendResponse(text);
  },
};