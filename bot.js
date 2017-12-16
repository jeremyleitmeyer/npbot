var Discord = require('discord.io');
var logger = require('winston');
var keys = require('./keys')
var request = require('request-promise');
var bodyParser = require('body-parser');
var app = require('express')();

app.use(bodyParser.json());

//logger settings
logger.remove(logger.transports.Console);

logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

var bot = new Discord.Client({
   token: process.env.TOKEN,
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

app.post('/np-chan', function(req, res){    // your JSON

  bot.sendMessage({
    to: "general",
    message: "You are " + req.body.user
  });
	res.redirect('/')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
		console.log('Running on: ' + PORT)
});
