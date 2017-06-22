
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
	session    : "",
	session_id : "",

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
				default:
					return client.replyMessage(event.replyToken, {
						type : "text",
						text : "Invalid command, use /trivia for help",
					});
			}
		}
	},

	getThisSession : function() {
		var mysql = require('mysql');

		var con = mysql.createConnection({
		  host    : "localhost",
		  user    : "root",
		  password: "",
      database: "mydb",
		});

		con.connect(function(err) {
		  if (err) throw err;

		  con.query("SELECT * FROM trivia WHERE id = " + this.session_id, function (err, result) {
		    if (err) throw err;

        if (result.length < 1) {
          return this.makeNewSession();
        } else {
          return new Session(
            result[0].id,
            result[0].question,
            result[0].correct_answer,
            JSON.parse(result[0].incorrect_answer)
          );
        }
		  });
		});
	},

  makeNewSession : function() {
    var mysql = require('mysql');

    var con = mysql.createConnection({
      host    : "localhost",
      user    : "root",
      password: "",
      database: "mydb",
    });

    con.connect(function(err) {
      if (err) throw err;

      var query = "";

      query += "INSERT INTO trivia";
      query += " (id, question, correct_answer, incorrect_answer)";
      query += " values";
      query += " ('" + this.session_id + "', '', '', '[\"\"]')";

      con.query(query, function (err, result) {
        if (err) throw err;

        return new Session(
          this.session_id,
          "",
          "",
          [],
        );
      });
      
    });
  },

	getNewQuestion : function() {
		this.session.update();

    var mysql = require('mysql');

    var con = mysql.createConnection({
      host    : "localhost",
      user    : "root",
      password: "",
      database: "mydb",
    });

    con.connect(function(err) {
      if (err) throw err;

      var query = "";

      query += "UPDATE trivia SET";
      query += " question = '" + this.session.question + "'";
      query += ", correct_answer='" + this.session.correct_answer + "'";
      query += ", incorrect_answer='" + JSON.stringify(this.session.incorrect_answer) + "'";
      query += " WHERE";
      query += " id = " + this.session_id;

      con.query(query, function (err, result) {
        if (err) throw err;
      });
    });

		return this.client.replyMessage(this.event.replyToken,{
			type : "text",
			text : this.session.getQuestion(),
		});
	},

	getSessionAnswer : function() {

		if (session.getAnswer !== "") {

			return this.client.replyMessage(this.event.replyToken,{
				type : "text",
				text : this.sessions[session_index].getAnswer(),
			});	

		} else {

			return this.client.replyMessage(this.event.replyToken,{
				type : "text",
				text : "there are no question yet",
			});	

		}
	},
};