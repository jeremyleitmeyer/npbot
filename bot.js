var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var Client = require('node-rest-client').Client;
var client = new Client();

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
	  if(message === "this bot sucks"){
				bot.sendMessage({
          to: channelID,
          message: "I am sorry for my incompetence User-sama...   *bow*"
      	});
  	}
    // will listen for messages that will start with `!`
    if (message.substring(0, 1) == '/') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
        	//commands
            case 'np':
            var thing = seconds - (Math.random() * 1000000)
						var n = "https://ecchi.redditbooru.com/api/images/?limit=100&nsfw=true&afterDate=" + Math.round(thing)
							client.get(n, function (data, response) {
					    // parsed response body as js object
					    nsfw = data[Math.floor(Math.random() * 100)].cdnUrl 
					    
	              bot.sendMessage({
	                  to: channelID,
	                  message: nsfw
	              });
            	});
            break;
         }
     }
})