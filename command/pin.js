
/**
 * Pin Group
 * ------------------
 * Pin a message in a group
 */

const base_path = __dirname + '/../data/pin/';

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
      console.log(JSON.stringify(this.session));
      this.sendResponse(this.session.getText());
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
      var result = fs.readFileSync(path, "utf8");
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
    fs.writeFileSync(path, "no pinned message", "utf8");

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
      if (index !== 0) {
        text += " " + item;
      }
    });

    this.session.text = text;

    fs.writeFileSync(path, text);
  },
};