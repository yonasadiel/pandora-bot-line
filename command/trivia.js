
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

module.exports = {
	event    : "",
	client   : "",

	receive  : function(argc, args, client, event) {
		this.event  = event;
		this.client = client;

		if (argc < 2) {
			reply_text  = "Trivia Game!\n";
			reply_text += "- start  : start a new game\n";
			reply_text += "- answer : see the answer of current game";

			return client.replyMessage(event.replyToken,{
				type : "text",
				text : reply_text,
			});

		} else {
			switch (args[1]) {
				case "start":
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

	make_new : function() {
		return this.client.replyMessage(this.event.replyToken,{
			type : "text",
			text : "make_new",
		});
	},

	answer   : function() {
		return this.client.replyMessage(this.event.replyToken,{
			type : "text",
			text : "answer",
		});
	},
};