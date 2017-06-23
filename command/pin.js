
/**
 * Pin Group
 * ------------------
 * Pin a message in a group
 */

module.exports = {
  event      : '',
  client     : '',
  session    : {},
  session_id : '',

  receive  : function(argc, args, client, event) {
    this.event  = event;
    this.client = client;

    if (event.source.type === "group") {
      this.session_id = event.source.groupId;
    } else if (event.source.type === "room") {
      this.session_id = event.source.roomId;
    } else if (event.source.type === "user") {
      this.session_id = event.source.userId;
    }

    this.session = this.getThisSession();
  },

  getThisSession : function() {
    const request = require('request');
    var url       = 'https://script.google.com/macros/s/AKfycbyiLiyDT88t2cBZq9sJFK6xkmnfdwCrsb7FF49eN0TrZKbFr7s/exec?app=pin';
    url          += '&action=get';
    url          += '&id=' + this.session_id;

    request(url, this.getThisSessionCallback.bind(this));
  },

  getThisSessionCallback : function(error, response, body) {
    var result = JSON.parse(body);
    this.session = {
      id   : result.id,
      text : result.text
    };

    if (argc < 2) {
      this.sendResponse(this.session.text);
    } else {
      this.updateText(args);
      return this.sendResponse("Message pinned");
    }
  },

  sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },

  updateText : function(args) {    
    var text = "";
    args.forEach(function(item,index) {
      if (index !== 0) {
        text += " " + item;
      }
    });

    this.session.text = text;

    const request = require('request');
    var url       = 'https://script.google.com/macros/s/AKfycbyiLiyDT88t2cBZq9sJFK6xkmnfdwCrsb7FF49eN0TrZKbFr7s/exec?app=pin';
    url          += '&action=save';
    url          += '&data=' + escape(JSON.stringify(this.session));

    request(url, function(error, response, body) {
      //
    });
  },
};