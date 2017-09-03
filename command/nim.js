
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
      return this.searchQuery();
    }
  },

  helpText : function() {
    let text = "";

    text += "Usage:\n";
    text += "!nim <nim|name> [page]\n\n";
    text += "Use web version for more\n";
    text += "yonasadiel.com/lamia"


    return this.sendResponse(text);
  },

  searchQuery : function() {
    let page = 0;
    let query = "";
    if (isNaN(this.args[this.argc-1])) {
      for (var i=1; i<this.argc  ; i++) { if (i != 1) query += " "; query += this.args[i]; }
    } else {
      for (var i=1; i<this.argc-1; i++) { if (i != 1) query += " "; query += this.args[i]; }
      page = 0-1+this.args[this.argc-1];
    }

    const request = require('request');
    var url       = 'https://yonasadiel.com/lamia/search';
    url          += '?query=' + query;
    url          += '&page='  + page;

    request(url, this.searchQueryCallback.bind(this));
  },

  searchQueryCallback : function(error, response, body) {
    let page = 1;
    let query = "";
    if (isNaN(this.args[this.argc-1])) {
      for (var i=1; i<this.argc  ; i++) { if (i != 1) query += " "; query += this.args[i]; }
    } else {
      for (var i=1; i<this.argc-1; i++) { if (i != 1) query += " "; query += this.args[i]; }
      page = this.args[this.argc-1];
    }

    data = JSON.parse(body);

    let text = "" + data["count"] + " data found for: " + query + "\nPage " + page;
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