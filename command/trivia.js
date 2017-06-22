
/**
 * Trivia Game
 * ------------------
 * Play a game about trivia
 * 
 * Every command file should have receive()
 * function with parameters:
 *   argc   : number of arguments
 *   args   : arguments presents on text message
 *   client : client object defined by line-bot-sdk
 *            for replying / etc
 *   event  : event webhook project that is sent
 *            by LINE messaging app, ex:
 *            "events": [
 *             {
 *               "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
 *               "type": "message",
 *               "timestamp": 1462629479859,
 *               "source": {
 *                 "type": "user",
 *                 "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
 *               },
 *               "message": {
 *                 "id": "325708",
 *                 "type": "text",
 *                 "text": "Hello, world"
 *               }
 *           },
 *             {
 *               "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
 *               "type": "follow",
 *               "timestamp": 1462629479859,
 *               "source": {
 *                 "type": "user",
 *                 "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
 *               }
 *             }
 *           ]
 */

function Session(id) {
	this.id               = id;
	this.state            = 0;
	this.question         = "0";
	this.correct_answer   = "";
	this.incorrect_answer = [""];

	this.new = function() {
		this.question         = this.question + "0";
		this.correct_answer   = "halo";
		this.incorrect_answer = ["hai","pakabar?"];
	};

	this.getId = function() {
		return this.id;
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
	}
}

module.exports = {
	event      : "",
	client     : "",
	sessions   : [],
	session_id : "",

	receive  : function(argc, args, client, event) {
		this.event  = event;
		this.client = client;

		if (event.source.type === "user") {
			this.session_id = event.source.userId;
		} else if (event.source.type === "group") {
			this.session_id = event.source.groupId;
		}

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
					return this.make_new();
				case "answer":
					return this.answer();
				default:
					return client.replyMessage(event.replyToken, {
						type : "text",
						text : "Invalid command, use /trivia for help",
					});
			}
		}
	},

	search_id : function() {
		var found = -1;
		this.sessions.forEach(function(item, index) {
			if (item.getId === this.session_id) {
				found = index;
			}
		});

		return found;
	},

	make_new : function() {
		var session_index = this.search_id();

		if (session_index === -1) {
			this.sessions.push(new Session(this.session_id));
			session_index = this.sessions.length-1;
		}

		this.sessions[session_index].new();
		return this.client.replyMessage(this.event.replyToken,{
			type : "text",
			text : this.sessions[session_index].getQuestion(),
		});
	},

	answer : function() {
		var session_index = this.search_id();

		if (session_index !== -1) {

			return this.client.replyMessage(this.event.replyToken,{
				type : "text",
				text : this.sessions[session_index].getQuestion(),
			});	

		} else {

			return this.client.replyMessage(this.event.replyToken,{
				type : "text",
				text : "there are no question yet",
			});	

		}
	},
};