var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var Client = require('node-rest-client').Client;
var key = require('./api.json');
var client = new Client();
var osuapi = require('osu-api');
var osu = new osuapi.Api(key);
var np, data, response;

var osuUser = "7653158"

var n = "https://osu.ppy.sh/api/get_user_recent?u=" + osuUser + "&k=" + key.token + "&limit=1"

//logger settings
logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
  // will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
      var args = message.substring(1).split(' ');
      var cmd = args[0];
     
      args = args.splice(1);
      switch(cmd) {
      //commands
      case 'np':
			client.get(n, function (data, response) {
				// parsed response body as js object
				np = data[0].beatmap_id
			var b = "https://osu.ppy.sh/api/get_beatmaps?b=" + np + "&k=" + key.token + "&limit=1"
			   	client.get(b, function (data, response){
			    	title = data[0].title
			    	artist = data[0].artist
              bot.sendMessage({
                to: channelID,
                message: "Listen to this! " + title + " by: " + artist 
              });
          	});
			   	});	
      break;
    }
  }
})