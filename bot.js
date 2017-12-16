const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json')
const request = require('request-promise');
const bodyParser = require('body-parser');
const app = require('express')();
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
      url: 'https://i.imgur.com/wL1Q2Sk.png'
    },
    title: '**' + req.body.artist + '-' + req.body.title,
    url: req.body.url ,
    description: 'things will go here',
  }
  	
  });
  res.send(req.body)
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT)
});
