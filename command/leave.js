
/**
 * Leave
 * ------------------
 * Leave the group / room
 */

module.exports = {
  event      : '',
  client     : '',

	receive : function(argc, args, client, event) {
    this.event  = event;
    this.client = client;

    this.sendResponse('See You!');
    if (this.event.source.type === 'group') {
      this.client.leaveGroup(this.event.source.groupId).then();
    } else if (this.event.source.type === 'group') {
      this.client.leaveRoom(this.event.source.roomId).then();
    } else {
      this.sendResponse('What? Leave you! I will be in your side forever. DONT ask me to leave you anymore.');
    }
	},

  sendResponse : function(text) {
    return this.client.replyMessage(this.event.replyToken,{
      type : "text",
      text : text,
    });
  },

};