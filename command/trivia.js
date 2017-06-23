
/**
 * Trivia Game
 * ------------------
 * Play a game about trivia
 */

const base_path = __dirname + '/../data/trivia/';

function Session(id, question, correct_answer, incorrect_answer) {
  this.id               = id;
  this.question         = question;
  this.correct_answer   = correct_answer;
  this.incorrect_answer = incorrect_answer;

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

    const Entities = require('html-entities').XmlEntities;
 
    const entities = new Entities();

    return entities.decode(q);
  };

  this.getAnswer = function() {
    const Entities = require('html-entities').XmlEntities;
 
    const entities = new Entities();

    return entities.decode(this.correct_answer);
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

    if (event.source.type === "group") {
      this.session_id = event.source.groupId;
    } else if (event.source.type === "room") {
      this.session_id = event.source.roomId;
    } else if (event.source.type === "user") {
      this.session_id = event.source.userId;
    }

    this.session = this.getThisSession();

    if (argc < 2) {
      var reply_text  = "Trivia Game!\n";
      reply_text     += "- new : start a new game\n";
      reply_text     += "- answer : see the answer of current game\n";
      reply_text     += "- question : see current question\n";
      reply_text     += "- category : see available categories\n";
      reply_text     += "- about : more on trivia";

      this.sendResponse(reply_text);

    } else {
      switch (args[1]) {
        case "new":
          if (argc === 3) {
            return this.getNewQuestion(args[2]);
          } else if (argc === 2) {
            return this.getNewQuestion('random');
          } else {
            return this.sendResponse('invalid syntax');
          }
        case "answer":
          return this.getSessionAnswer();
        case "question":
          return this.getLastQuestion();
        case "category":
          return this.getCategoryList();
        case "about":
          return this.sendResponse('Pandora Bot powered by opentdb.com');
        default:
          return this.sendResponse("Invalid command, use /trivia for help");
      }
    }
  },

  getThisSession : function() {
    const fs    = require('fs');
    var path    = base_path + this.session_id;

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
    const fs    = require('fs');
    var path    = base_path + this.session_id;

    var new_session = new Session(this.session_id, "", "", []);
    fs.writeFileSync(path, JSON.stringify(new_session));

    return new_session;
  },

  getNewQuestion : function(cat) {
    const request = require('request');
    var url = 'https://opentdb.com/api.php?amount=1';

    switch (cat) {
      case 'general':
        url += '&category=9'; break;
      case 'science':
        url += '&category=17'; break;
      case 'cs':
        url += '&category=18'; break;
      case 'tech':
        url += '&category=30'; break;
      case 'math':
        url += '&category=19'; break;
      case 'geo':
        url += '&category=22'; break;
      case 'myth':
        url += '&category=20'; break;
      case 'japan':
        url += '&category=31'; break;
      case 'cartoon':
        url += '&category=32'; break;
      case 'random':
        let cat = [9,17,18,30,19,22,20,31,32];
        let rand_cat = cat[Math.floor(Math.random()*cat.length)];
        url += '&category=' + rand_cat;
        break;
      default:
        return this.sendResponse('category not valid');
    }

    request(url, this.updateQuestion.bind(this));
  },

  updateQuestion : function(error, response, body) {
    const fs   = require('fs');
    var path   = base_path + this.session_id;
    
    var result = JSON.parse(body);
    this.session.question         = '[' + result.results[0].category + ']\n' + result.results[0].question;
    this.session.correct_answer   = result.results[0].correct_answer;
    this.session.incorrect_answer = result.results[0].incorrect_answers;

    fs.writeFileSync(path, JSON.stringify(this.session));

    return this.getLastQuestion();
  },

  getLastQuestion : function() {
    return this.sendResponse(this.session.getQuestion());
  },

  getSessionAnswer : function() {
    if (this.session.getAnswer() !== "") {
      return this.sendResponse(this.session.getAnswer())
    } else {
      return this.sendResponse("there are no question yet");
    }
  },

  sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },

  getCategoryList : function() {
    var cat_list = '';
    cat_list += 'Available category:\n';
    cat_list += '- general: General knowledge\n';
    cat_list += '- science: Sains umum\n';
    cat_list += '- cs: Computer science\n';
    cat_list += '- tech: Technology\n';
    cat_list += '- math: Mathematic\n';
    cat_list += '- geo: Geography\n';
    cat_list += '- myth: Mythology\n';
    cat_list += '- japan: Anime and Manga\n';
    cat_list += '- cartoon: Cartoon and Animation\n';
    cat_list += 'usage example: /trivia new general';

    return this.sendResponse(cat_list);
  },
};