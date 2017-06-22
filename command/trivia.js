
/**
 * Trivia Game
 * ------------------
 * Play a game about trivia
 */

function Session(id, question, correct_answer, incorrect_answer) {
	this.id               = id;
	this.question         = question;
	this.correct_answer   = correct_answer;
	this.incorrect_answer = incorrect_answer;

  this.update = function() {
    this.question         = this.question + "0";
    this.correct_answer   = "halo";
    this.incorrect_answer = ["hai","pakabar?"];
  };

	this.getQuestion = function() {
		var q   = "";
		var opt = this.incorrect_answer.concat([this.correct_answer]);
		opt.sort();

		q += this.question;
		opt.forEach(function(item,index) {
			q += "\n";
			q += String.fromCharCode(97 + (index % 26));
			q += ". ";
			q += item;
		});

		return q;
	};

	this.getAnswer = function() {
		return this.correct_answer;
	};
}

module.exports = {
	event      : '',
	client     : '',
	session    : '',
	session_id : '',
  base_path  : __dirname + '/../data/trivia/',

	receive  : function(argc, args, client, event) {
		this.event  = event;
		this.client = client;

		if (event.source.type === "user") {
			this.session_id = event.source.userId;
		} else if (event.source.type === "group") {
			this.session_id = event.source.groupId;
		}

    session = this.getThisSession();

		if (argc < 2) {
			reply_text  = "Trivia Game!\n";
			reply_text += "- new    : start a new game\n";
			reply_text += "- answer : see the answer of current game";

			return client.replyMessage(event.replyToken,{
				type : "text",
				text : reply_text,
			});

		} else {
			switch (args[1]) {
				case "new":
					return this.getNewQuestion();
				case "answer":
					return this.getSessionAnswer();
        case "question":
          return this.getLastQuestion();
				default:
					return client.replyMessage(event.replyToken, {
						type : "text",
						text : "Invalid command, use /trivia for help",
					});
			}
		}
	},

	getThisSession : function() {
    var fs    = require('fs');
    var path  = this.base_path + this.session_id;

    if (!fs.existsSync(path)) {
      return this.makeNewSession();
    } else {
      var result = JSON.parse(fs.readFileSync(path));
      return new Session(
        result.id,
        result.question,
        result.correct_answer,
        result.incorrect_answer
      );
    }
	},

  makeNewSession : function() {
    var fs    = require('fs');
    var path  = this.base_path + this.session_id;

    var new_session = new Session(this.session_id, "", "", []);
    fs.writeFileSync(path, JSON.stringify(new_session));

    return new_session;
  },

	getNewQuestion : function() {
		this.session.update();

    var fs    = require('fs');
    var path  = this.base_path + this.session_id;

    fs.writeFileSync(path, JSON.stringify(this.session));

		return this.getLastQuestion();
	},

  getLastQuestion : function() {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : this.session.getQuestion(),
    }); 
  },

	getSessionAnswer : function() {

		if (session.getAnswer !== "") {

			return this.client.replyMessage(this.event.replyToken,{
				type : "text",
				text : this.session.getAnswer(),
			});	

		} else {

			return this.client.replyMessage(this.event.replyToken,{
				type : "text",
				text : "there are no question yet",
			});	

		}
	},
};