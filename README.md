### np-chan

A bot that sends in-game "/np" info to your Discord channel!

## Installation

#### Setting up the discord bot

The first thing you'll need to run this bot is Node.js. You can download it [here](https://nodejs.org/en/). Then youll need to host this bot somewhere and fill in the environment variable names with your respective values.

Once the discord side is downloaded run `npm install` to install the dependencies. Before going any further you will need your own Osu! API key, your desired Discord channel ID (where you want the messages to appear), and your own bot token(see Discords API docs).



#### Setting up the osu! chat data reader

The chat reader is written in C, using libcurl. The steps will be described for an usage on Linux, but setting this to work with another OS should be possible.    

The first thing you will need to use this is an osu! account with the irc client access. You can get your irc login informations [here](https://osu.ppy.sh/p/irc).  

On your system, you need to install the irc client : [irssi](https://irssi.org/).  
Run it with :
```
irssi -c irc.ppy.sh -p 6667 -n <your_osu_username> -w <your_osu_irc_password>
``` 
You will see the main #osu channel, with a lot of messages about people quitting the channel. Type `/ignore * JOINS PARTS QUITS` to get rid of all these messages.  
The next step is about setting up auto-logging : 
```
/SET autolog_level MSGS 
/SET autolog_path set/your/path/here (you can configure this to daily logs)
/SET autolog ON
```

Next step is about compiling the C source file. You need to install [libcurl](https://curl.haxx.se/libcurl/). 
``` 
gcc chatReader.c -lcurl -o <your_output_file>
```

The last thing you will need is a `chatReader.token` containing a token set to agree with the discord bot. This file must be located in the same directory as the compiled binary file.

 
## Usage

To run the chatReader server : 
```
./<your_output_file> <path/to/your/irc_logfile>
```
or (if you want to save a debug file keeping track of the requests sent byt the server to the bot.)
```
./<your_output_file> <path/to/your/irc_logfile> -d <path/to/the/debug/output_file>
```

Run `node bot.js` and the Discord bot should start up and be ready to receive data from the IRC side of things. It is important to note that this expects a certain JSON object from the IRC side. 

```
{ "time" : "1524838757", "user" : "docflo7", "artist" : "Fujijo Seitokai Shikkou-bu", "title" : "Best FriendS", "url" : "https://osu.ppy.sh/b/1577478" }```

If you are using a different IRC chat bot the output must look like it does above.
 
## History


TODO: Implement setting channelID

## Credits
  Riker, Docflo7 & jeremyleitmeyer
## License
?
