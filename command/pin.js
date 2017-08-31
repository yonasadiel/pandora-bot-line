
/**
 * Pin Group
 * ------------------
 * Pin a message in a group
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

    this.getThisSession();
  },

  getThisSession : function() {
    const request = require('request');
    var url       = 'https://script.google.com/macros/s/AKfycbyiLiyDT88t2cBZq9sJFK6xkmnfdwCrsb7FF49eN0TrZKbFr7s/exec?app=pin';
    url          += '&action=get';
    url          += '&id=' + this.session_id;

    request(url, this.getThisSessionCallback.bind(this));
  },

  getThisSessionCallback : function(error, response, body) {
    this.session = JSON.parse(body);

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
      switch (this.args[1]) {
        case "new":
          return this.makeNewTopic();
        case "rename":
          return this.renameTopic();
        case "show":
          return this.showTopic();
        case "view":
          return this.viewTopic();
        case "update":
          return this.updateTopic();
        case "delete":
          return this.deleteTopic();
        default:
          return this.sendResponse("Invalid command, use !pin for help");
      }
    }
  },

  helpText : function() {
    let text = "";

    text += "Usage:\n";
    text += "!pin new <topic>\n";
    text += "!pin rename <topic> <new_topic>\n";
    text += "!pin show\n";
    text += "!pin view <topic>\n";
    text += "!pin update <topic> <message>\n";
    text += "!pin delete <topic>\n";

    return this.sendResponse(text);
  },

  makeNewTopic : function() {
    if (this.argc < 3) { return this.sendResponse("Usage: !pin new <topic>"); }
    if (this.argc > 3) { return this.sendResponse("For now, the topic limited to 1 word only. use \"_\" to replace space."); }

    let new_topic = this.args[2];
    this.session.text[new_topic] = "- empty -";

    this.updateSession();
    return this.sendResponse("Topic " + new_topic + " created.");
  },

  renameTopic : function() {
    if (this.argc < 4) { return this.sendResponse("Usage: !pin rename <topic> <new_topic>"); }
    if (this.agrc > 4) { return this.sendResponse("For now, the topic limited to 1 word only. use \"_\" to replace space."); }

    let topic_name_old = this.args[2];
    let topic_name_new = this.args[3];

    if (typeof this.session.text[topic_name_old] == undefined) {
      return this.sendResponse("No topic " + topic_name_old + " found.");
    }

    this.session.text[topic_name_new] = this.session.text[topic_name_old];
    delete this.session.text[topic_name_old];

    this.updateSession();
    return this.sendResponse("Successfully renaming " + topic_name_old + " to " + topic_name_new + ".");
  },

  showTopic : function() {
    if (this.argc != 2) { this.sendResponse("Usage: !pin show"); }

    text = "List of topics:\n";
    for (let property in this.session.text) { text += "- " + property + "\n"; }

    return this.sendResponse(text);
  },

  viewTopic : function() {
    if (this.argc != 3) { this.sendResponse("Usage: !pin view <topic>"); }

    let topic = this.args[2];

    if (typeof this.session.text[topic] == undefined) {
      return this.sendResponse("No topic " + topic + " found.");
    }
    
    let text = "[" + topic + "]\n" + this.session.text[topic];
    return this.sendResponse(text);
  },

  updateTopic : function() {
    if (this.argc < 4) { this.sendResponse("Usage: !pin update <topic> <message>"); }

    let topic = this.args[2];
    let text = "";
    this.args.forEach(function(item,index) {
      if (index > 3) { text += " "; }
      if (index > 2) { text += item; }
    });

    if (typeof this.session.text[topic] == undefined) {
      return this.sendResponse("No topic " + topic + " found.");
    }

    this.session.text[topic] = text;
    this.updateSession();

    return this.sendResponse("Topic updated.");
  },

  deleteTopic : function() {
    if (this.argc != 3) { this.sendResponse("Usage: !pin delete <topic>"); }

    let topic = this.args[2];

    if (typeof this.session.text[topic] == undefined) {
      return this.sendResponse("No topic " + topic + " found.");
    }

    delete this.session.text[topic_name_old];

    this.sendResponse("Topic " + topic + " deleted.");

  },

  updateSession : function(args) {
    const request = require('request');
    var url       = 'https://script.google.com/macros/s/AKfycbyiLiyDT88t2cBZq9sJFK6xkmnfdwCrsb7FF49eN0TrZKbFr7s/exec?app=pin';
    url          += '&action=save';
    url          += '&data=' + escape(JSON.stringify(this.session));

    request(url, function(error, response, body) {
      //
    });
  },
};