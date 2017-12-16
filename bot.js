const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json')
const request = require('request-promise');
const bodyParser = require('body-parser');
const app = require('express')();
const Client = require('node-rest-client').Client;
const client = new Client();
const channelID = '380442081103183876';

app.use(bodyParser.json());

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
    bot.setPresence({game:'osu!'})
});

app.get("/", function(req, res){
	res.sendFile(__dirname + './index.html');
});

app.get('/np-chan', function(req,res){
	res.send(req.user + "work bitch")
});

app.post('/np-chan', function(req, res){    // your JSON
	console.log(req.body)

	var beatmap = req.body.url.split("/").pop()

	var osu = "https://osu.ppy.sh/api/get_beatmaps?b=" + beatmap + "&k=" + auth.osu + "&limit=1"
	client.get(osu, function (data, response){

		var length = data[0].total_length.split('')
		if (length.length === 4){
			length.splice(2, 0, ':')
		} else if (length.length === 3) {
			length.splice(1, 0, ':')
		} else {
			length.splice(0, 0, ':')
		}

		var total_length = length.join('')
		console.log(osu)
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
	    title: req.body.artist + ' - ' + req.body.title,
	    description: 'BPM: ' + data[0].bpm + '\nLength: ' + total_length + '\nBeatmap: [Download](' + req.body.url + ')'
	  }
	  	
	  });
	})
  res.send(req.body)
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT)
});
