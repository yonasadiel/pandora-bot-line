
/**
 * Help
 * ------------------
 * Give an about reply about the bot
 * 
 */

module.exports = {
  event      : '',
  client     : '',

	receive : function(argc, args, client, event) {
    this.event  = event;
    this.client = client;
    
		if (argc > 1) {
			return this.sendResponse("don't understand the argument");
		} else {
      let txt = 'Pandora Bot built by Yonas Adiel with NodeJS in HerokuApp\n';
      txt += 'See the project at https://github.com/yonasadiel/pandora-bot-line';
			return this.sendResponse(txt);
		}
	},

  sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },

};