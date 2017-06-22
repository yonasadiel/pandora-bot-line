
/**
 * Help
 * ------------------
 * Give an about reply about the bot
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

module.exports = {
	receive : function(argc, args, client, event) {
		if (argc > 1) {
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