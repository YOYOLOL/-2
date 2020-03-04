const Discord = require('discord.js')
module.exports.run = (client,msg, args) => { 
msg.delete(500) 
const queue = msg.client.queue; 
const serverQueue = msg.client.queue.get(msg.guild.id); 
const voiceChannel = msg.member.voiceChannel; 
if (!voiceChannel)return msg.channel.send("您需要進入語音頻道才能循環播放音樂！");
 if (!serverQueue) return msg.channel.send('現在沒有音樂來循環播放音樂。');
 var loopt = 0 
var i = 0 
if (!args[0]) {
 loopt = 100 
for (i = 0; i < loopt; i++)
 { 
loops(msg)
 } 
} else { 
for (i = 0; i < loopt; i++) {
 loops(msg)
 }
 }
 function loops(msg) {
 if (serverQueue.loop !== true) { 
serverQueue.songs.push(serverQueue.songs[0]); 
} 
} 
}
