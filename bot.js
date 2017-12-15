var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var Client = require('node-rest-client').Client;
var key = require('./api.json');
var client = new Client();
var osuapi = require('osu-api');
var app = require('express')();
var osu = new osuapi.Api(key);
var np, data, response;

var osuUser = "user"

var apiOne = "https://osu.ppy.sh/api/get_user_recent?u=" + osuUser + "&k=" + key.token + "&limit=1"

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



app.post('/np-chan', function(req, res){
	var np = res.user
	console.log(req)
	console.log(res)
	bot.on('message', function (user, userID, channelID, message, evt) {
  // will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
      var args = message.substring(1).split(' ');
      var cmd = args[0];
     
      args = args.splice(1);
      switch(cmd) {
      //commands
      case 'np':
        bot.sendMessage({
          to: channelID,
          message: "You are " + np
        });
	      break;
	    }
	  }
	})
})

