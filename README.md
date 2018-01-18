### np-chan

A bot that sends in-game "/np" info to your Discord channel!

## Installation

#### Setting up the discord bot

To use the discord side of np-chan youll need to host this bot somewhere.  Then fill in the variable names with your respective names.

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

Once hosted the Discord bot listens for a json object sent from the server side. It then uses the osu! API to get song info. It then sends an embed message to your specified Discord channelID.
 
## History


TODO: Implement setting channelID
## Credits
  Riker, Docflo7 & jeremyleitmeyer
## License
?
