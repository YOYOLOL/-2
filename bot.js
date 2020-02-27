const Discord = require('discord.js');
const Client = require('./client/Client');
const client = new Client();
const prefix = ","
const fs = require('fs');

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;   
    let props = require(`./commands/${file}`);  
    let commandName = file.split(".")[0];
    console.log(`正在戴入中文指令: ${commandName}`);
    client.commands.set(commandName, props);
  });
});

client.on('message', msg => {

if (!msg.content.startsWith(prefix)) return;
	
var messageArry = msg.content.split(" ");
var cmd = messageArry[0];	
var args = messageArry.slice(1);	
var commandfile = client.commands.get(cmd.slice(prefix.length));
 if (commandfile) {
   commandfile.run(client, msg, args);  
   console.log(commandfile)
 } 
});

client.login(process.env.BOT_TOKEN)
