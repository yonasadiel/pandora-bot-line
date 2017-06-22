
/**
 * Help
 * ------------------
 * Give an about reply about the bot
 *
 */

module.exports = {
	receive : function(argc, args, client, event) {
		if (argc > 0) {
			return client.replyMessage(event.replyToken,{
				type: "text",
				text: "don't understand the argument",
			});
		} else {
			return client.replyMessage(event.replyToken,{
				type: "text",
				text: "Pandora Bot built by Yonas Adiel with NodeJS in HerokuApp",
			});
		}
	}
};