
/**
 * Pin Group
 * ------------------
 * Pin a message in a group
 */

const base_path = __dirname + '/../data/trivia/';

function Session(id, text) {
  this.id     = id;
  this.text   = text;

  this.getText = function() {
    return this.text;
  };
}

module.exports = {
  event      : '',
  client     : '',
  session    : {},
  session_id : '',

  receive  : function(argc, args, client, event) {
    this.event  = event;
    this.client = client;

    if (event.source.type === "user") {
      this.session_id = event.source.userId;
    } else if (event.source.type === "group") {
      this.session_id = event.source.groupId;
    }

    this.session = this.getThisSession();

    if (argc < 2) {
      this.sendResponse(this.session.text);
    } else {
      this.updateText(args);
      return this.sendResponse("Message pinned");
    }
  },

  getThisSession : function() {
    const fs    = require('fs');
    var path    = base_path + this.session_id;

    if (!fs.existsSync(path)) {
      return this.makeNewSession();
    } else {
      var result = fs.readFileSync(path);
      return new Session(
        this.session_id,
        result
      );
    }
  },

  makeNewSession : function() {
    const fs    = require('fs');
    var path    = base_path + this.session_id;

    var new_session = new Session(this.session_id, "no pinned message");
    fs.writeFileSync(path, JSON.stringify(new_session));

    return new_session;
  },

  sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },

  updateText : function(args) {
    const fs   = require('fs');
    var path   = base_path + this.session_id;
    
    var text = "";
    args.forEach(function(item,index) {
      if (index != 0) {
        text += " " + item;
      }
    });

    this.session.text = text;

    fs.writeFileSync(path, text);
  },
};