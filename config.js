
/**
 * Configuration File
 * ------------------
 * All variable that are needed
 * for configuration will be
 * presented here
 */

// you can get channel access token and channel secret in line developer page
var channelAccessToken = 'iJNPgHXNKjWIZZadSQuraOJJ8aPfFWg0hlXzFSQmbepYFqVhjm85mnrJpYZxUJD8p7hrSRUKaZag4uh21cONkwi57kDycdOmAF7wPhEOz5ekqe45voycraGZSojPfSk+MYjwK7BNb6IMuCY4irnuZwdB04t89/1O/w1cDnyilFU=';
var channelSecret      = 'bbf6df9f8e8b323b4cd584538a3d3e37';
// Customize your own command symbol
// only message prefixed with command symbol
// that will be processed
// You can leave it blank for processing all
// message received
var commandSymbol      = '/';

module.exports = {
	channelAccessToken : channelAccessToken,
	channelSecret      : channelSecret,
	commandSymbol      : commandSymbol
};