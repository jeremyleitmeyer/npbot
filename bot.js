const Discord = require('discord.io');
const logger = require('winston');
const keys = require('./keys')
const request = require('request-promise');
const bodyParser = require('body-parser');
const app = require('express')();
const channelID = '380442081103183876'

app.use(bodyParser.json());

//logger settings
logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

const bot = new Discord.Client({
   token: process.env.TOKEN,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

app.get("/", function(req, res){
	res.sendFile(__dirname + './index.html');
});

app.get('/np-chan', function(req,res){
	res.send(req.user + "work bitch")
});

app.post('/np-chan', function(req, res){    // your JSON

	var data = req.body

  bot.sendMessage({
    to: channelID,
    message: data.user + " is listening to: " + req.body.title + " by: " + req.body.artist + ". Download it at: " + req.body.url  
  });
	res.redirect('/')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT)
});
