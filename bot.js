var Discord = require('discord.io');
var logger = require('winston');
var request = require('request-promise');
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

app.get("/", function(req, res){
	rres.sendFile(__dirname + './index.html');
});

app.get('/np-chan', function(req,res){
	res.send(req.user + "work bitch")
});

// request({
//     url: 'http://npbot-osu.herokuapp.com/np-chan',
//     method: 'POST',
//     options: {
//     	simple: false
//     }
// }).catch(function (error) {
//         console.log(error);
//     }).then(function () {
//         console.log('OK')
//     });

app.post('/np-chan', function(req, res){
	var np = res.user
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
	redirect('/')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT)
});
