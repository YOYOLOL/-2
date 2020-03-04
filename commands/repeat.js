const Discord = require('discord.js')
module.exports.run = (client,msg, args) => {  
const queue = msg.client.queue; 
const serverQueue = msg.client.queue.get(msg.guild.id); 
const voiceChannel = msg.member.voiceChannel; 
if (!voiceChannel)return msg.channel.send("您需要進入語音頻道才能循環播放音樂！");
 if (!serverQueue) return msg.channel.send('現在沒有任何音樂循環播放。');
 var loopt = 0 
var i = 0 
if (!args[0]) {
 loopt = 100 
for (i = 0; i < loopt; i++) { 
loops(msg)
 } 
} else { 
for (i = 0; i < loopt; i++) {
 loops(msg)
 }
 }
 
 return msg.channel.send("你已把音樂循環播放")
 
 function loops(msg) {
 if (serverQueue.loop !== true) { 
serverQueue.songs.push(serverQueue.songs[0]); 
} 
} 
}
