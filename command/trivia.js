
/**
 * Trivia Game
 * ------------------
 * Play a game about trivia
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

    if (! this.event.source.hasOwnProperty('userId')) {
      return this.sendResponse('This bot only support LINE version 7.5.0 or higher.\nTry updating, block, and re-add this bot.');
    }

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
    var url       = 'https://script.google.com/macros/s/AKfycbyiLiyDT88t2cBZq9sJFK6xkmnfdwCrsb7FF49eN0TrZKbFr7s/exec?app=trivia';
    url          += '&action=get';
    url          += '&id=' + this.session_id;

    request(url, this.getThisSessionCallback.bind(this));
  },

  getThisSessionCallback : function(error, response, body) {
    console.log(body);
    this.session = JSON.parse(body);

    if (this.indexOfPlayer() === -1) {
      this.client
        .getProfile(this.event.source.userId)
        .then((profile) => {
          this.session.players.push({
            id    : this.event.source.userId,
            name  : profile.displayName,
            score : 0,
          });
          this.saveProfile();
        })
        .catch((err) => {
          this.sendResponse('You have to add this bot first.');
        });
    } else {
      this.mainHandler();
    }    
  },

  mainHandler : function() {
    if (this.argc < 2) {
      var reply_text  = "Trivia Game!\n";
      reply_text     += "- new [cat] : start a new game with category\n";
      reply_text     += "- question : see current question\n";
      reply_text     += "- answer [a|b|c|d] : answer the question\n";
      reply_text     += "- reveal : open the answer\n";
      reply_text     += "- category : see available categories\n";
      reply_text     += "- score : get the latest score\n";
      reply_text     += "- about : more on trivia";

      this.sendResponse(reply_text);

    } else {
      switch (this.args[1]) {
        case "new":
          if (this.argc === 3) {
            return this.getNewQuestion(this.args[2]);
          } else if (this.argc === 2) {
            return this.getNewQuestion('random');
          } else {
            return this.sendResponse('invalid syntax');
          }
        case "answer":
          if (this.argc === 3) {
            return this.getAnswer(this.args[2]);
          } else {
            return this.sendResponse('Example Usage: "!trivia answer a"');
          }
        case "reveal":
          return this.getSessionAnswer();
        case "question":
          return this.getLastQuestion();
        case "category":
          return this.getCategoryList();
        case "score":
          return this.getScore();
        case "about":
          return this.sendResponse('Pandora Bot powered by opentdb.com');
        default:
          return this.sendResponse("Invalid command, use !trivia for help");
      }
    }
  },

  getNewQuestion : function(cat) {
    const request = require('request');
    var url = 'https://opentdb.com/api.php?amount=1';

    switch (cat) {
      case 'general': url += '&category=9';  break;
      case 'science': url += '&category=17'; break;
      case 'cs':      url += '&category=18'; break;
      case 'tech':    url += '&category=30'; break;
      case 'math':    url += '&category=19'; break;
      case 'geo':     url += '&category=22'; break;
      case 'myth':    url += '&category=20'; break;
      case 'japan':   url += '&category=31'; break;
      case 'cartoon': url += '&category=32'; break;
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
    var result = JSON.parse(body);
    this.session.question         = '[' + result.results[0].category + ']\n' + result.results[0].question;
    this.session.correct_answer   = result.results[0].correct_answer;
    this.session.incorrect_answer = result.results[0].incorrect_answers;

    this.saveData();

    return this.getLastQuestion();
  },

  getLastQuestion : function() {
    if (this.session.question === '') {
      return this.sendResponse('no question. make new with !trivia new');
    }

    return this.sendResponse(this.getQuestion());
  },

  getSessionAnswer : function() {
    let correct_answer = 'The answer is ' + this.getCorrectAnswer();
    this.sendResponse(correct_answer);
    this.resetGame();
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
    cat_list += 'usage example: !trivia new general';

    return this.sendResponse(cat_list);
  },

  getScore : function()  {
    let reply_text  = '';
    let players_tmp = [];
    for (var i in this.session.players) {
      players_tmp.push([this.session.players[i].score, this.session.players[i].name]); 
    }
    players_tmp.sort(function(a, b) {
      return b[0]-a[0];
    });

    for (var i in players_tmp) {
      reply_text += '(' + players_tmp[i][0] + ') ' + players_tmp[i][1] + '\n';
    }
    this.sendResponse(reply_text);
  },

  resetGame : function() {
    this.session.question         = '';
    this.session.correct_answer   = '';
    this.session.incorrect_answer = [];
    this.saveData();
  },

  // ---------------------- //
  // SESSION CLASS FUNCTION //
  // ---------------------- //

  getQuestion : function() {
    let q   = "";
    let opt = this.session.incorrect_answer.concat([this.session.correct_answer]);
    opt.sort();

    q += this.session.question;
    opt.forEach(function(item,index) {
      q += "\n";
      q += String.fromCharCode(97 + (index % 26));
      q += ". ";
      q += item;
    });

    const Entities = require('html-entities').XmlEntities;
 
    const entities = new Entities();

    return entities.decode(q);
  },

  getAnswer : function(ans) {
    if (this.session.question === '') {
      return this.sendResponse('No new question. Make one with !trivia new');
    }

    let opt = this.session.incorrect_answer.concat([this.session.correct_answer]);
    opt.sort();

    let check = -1;
    for (var i in opt) {
      if (String.fromCharCode(97 + (i % 26)) == ans.toLowerCase()) {
        check = 0;
        if (opt[i] == this.session.correct_answer) {
          check = 1;
        }
      }
    }

    if (check === 0) {
      this.session.players[this.indexOfPlayer()].score-=5;
      this.saveData();

      let reply_text = 'WRONG!\n';
      reply_text += '-5 for ' + this.session.players[this.indexOfPlayer()].name + '\n';
      reply_text += 'Use "!trivia score" to check score.';
      this.sendResponse(reply_text);
    } else if (check === 1) {
      this.session.players[this.indexOfPlayer()].score++;
      this.resetGame();
      
      let reply_text = 'Correct!\n';
      reply_text += '+1 for ' + this.session.players[this.indexOfPlayer()].name + '\n';
      reply_text += 'Use "!trivia score" to check score.';
      this.sendResponse(reply_text);
    } else {
      this.sendResponse('Wrong format');
    }
  },

  getCorrectAnswer : function() {
    if (this.session.question === '') {
      return 'No new question. Make one with !trivia new';
    }

    const Entities = require('html-entities').XmlEntities;
 
    const entities = new Entities();

    return entities.decode(this.session.correct_answer);

  },

  // --------------- //
  // DATA CONTROLLER //
  // --------------- //

  indexOfPlayer : function() {
    let id_fnd = -1;
    for (var i in this.session.players) {
      if (this.session.players[i].id == this.event.source.userId) {
        id_fnd = i;
      }
    }
    return id_fnd;
  },

  saveData : function() {
    const request = require('request');
    var url       = 'https://script.google.com/macros/s/AKfycbyiLiyDT88t2cBZq9sJFK6xkmnfdwCrsb7FF49eN0TrZKbFr7s/exec?app=trivia';
    url          += '&action=save';
    url          += '&data=' + escape(JSON.stringify(this.session));

    request(url, function(error, response, body) {
      //
    });
  },

  saveProfile : function() {
    const request = require('request');
    var url       = 'https://script.google.com/macros/s/AKfycbyiLiyDT88t2cBZq9sJFK6xkmnfdwCrsb7FF49eN0TrZKbFr7s/exec?app=trivia';
    url          += '&action=save';
    url          += '&data=' + escape(JSON.stringify(this.session));

    request(url, this.saveProfileCallback.bind(this));
  },

  saveProfileCallback : function(error, response, body) {
    this.mainHandler();
    //
  },

};