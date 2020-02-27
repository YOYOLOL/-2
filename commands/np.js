const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports.run =  (client,msg, args) => {
 const queue = msg.client.queue;     
 const serverQueue = msg.client.queue.get(msg.guild.id);
 if (!serverQueue) return msg.channel.send('There is nothing playing.');

 var stream = ytdl(serverQueue.songs[0]);
     stream.on('info', (info) => {
     return msg.channel.send("目前播放: `" + info.title + "`");   
     });               
}
