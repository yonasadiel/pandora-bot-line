
/**
 * Configuration File
 * ------------------
 * All variable that are needed
 * for configuration will be
 * presented here
 */

// you can get channel access token and channel secret in line developer page
var channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;
var channelSecret      = process.env.CHANNEL_SECRET;
// Customize your own command symbol
// only message prefixed with command symbol
// that will be processed
// You can leave it blank for processing all
// message received
var commandSymbol      = process.env.COMMAND_SYMBOL;

module.exports = {
	channelAccessToken : channelAccessToken,
	channelSecret      : channelSecret,
	commandSymbol      : commandSymbol
};