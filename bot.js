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
const channelID = '380442081103183876';

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
	// retrieve the beatmap ID
	var beatmap = req.body.url.split("/").pop();
	// put it in osu api
	var osu = "https://osu.ppy.sh/api/get_beatmaps?b=" + beatmap + "&k=" + auth.osu + "&limit=1";
	client.get(osu, function (data, response){
		// length comes back with a colon, this inserts it up to 9999
		var length = data[0].total_length.split('');
		if (length.length === 4){
			length.splice(2, 0, ':')
		} else if (length.length === 3){
			length.splice(1, 0, ':')
		} else {
			length.splice(0, 0, '')
		};

		var total_length = length.join('');
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
	      url: 'https://i.imgur.com/wL1Q2Sk.png',
	      height: 100
	    },
	    title: req.body.artist + ' -',
	    description: req.body.title + '\nBPM: ' + data[0].bpm + '\nLength: ' + total_length + '\nBeatmap: [Download](' + req.body.url + ')'
	  }
	  	
	  });
	})
	// to check on obj
  res.send(req.body);
})


// dynamic port
const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT);
});
