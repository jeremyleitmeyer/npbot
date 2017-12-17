const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json')
const request = require('request-promise');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const Client = require('node-rest-client').Client;
const client = new Client();
// Your channelID goes here
const channelID = '391493353688137730';

app.use(bodyParser.json());
app.use(express.static('public'));

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
    bot.setPresence({game: {name:'osu!'}});
});

app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/np-chan', function(req,res){
	res.send("POST here with JSON")
});


// IRC chat bot sends json blob to post
app.post('/np-chan', function(req, res){  
	var total_length  
	// retrieve the beatmap ID
	var beatmap = req.body.url.split("/").pop();
	// put it in osu api
	var osu = "https://osu.ppy.sh/api/get_beatmaps?b=" + beatmap + "&k=" + auth.osu + "&limit=1";
	client.get(osu, function (data, response){
		// length comes back in seconds, change to min : seconds
		if (data == undefined){
			console.log("error")
		}else{

		var length = data[0].total_length;
		if (length > 60) {
		  var minutes = Math.floor(length / 60);
		  var seconds = length - minutes * 60;
		  var zero = "0"
		  if (seconds < 10){
		  	total_length = minutes+':'+zero+seconds
		  }else {
		  	total_length = minutes+':'+seconds
			}
		} else {
			total_length = length
		}

		//bot sends embed message on recieving post  
	  bot.sendMessage({
	    to: channelID,
	    message: '**' + req.body.user + '**' + ' is listening to:',
	    embed: {
	    color: 1139500,
	    footer: { 
	      text: '© Riker, Flo, & Tux'
	    },
	    thumbnail:
	    {
	      url: 'https://b.ppy.sh/thumb/' + data[0].beatmapset_id + 'l.jpg',
	      height: 100
	    },
	    title: req.body.artist + ' - ' + req.body.title,
	    description: 'BPM: ' + data[0].bpm + '\nLength: ' + total_length + '\nBeatmap: [View](' + req.body.url + ')'
	  };
	  	
	  });
	};
});
	// to check on obj
  res.send(req.body);
})

bot.on('message', function (user, userID, channelID, message, evt) {
  // will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];
   
    args = args.splice(1);
    switch(cmd) {
    	//commands
      case 'np-chan':
      console.log(channelID)
          bot.sendMessage({
              to: channelID,
              message: "GAAAH! I'm awake !!"
          });
      break;
     }
  }
})

// dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT);
});
