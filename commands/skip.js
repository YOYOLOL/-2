const Discord = require('discord.js');

module.exports.run = (client, msg, args) => {

      const queue = msg.client.queue;
      const serverQueue = msg.client.queue.get(msg.guild.id);

      if (!msg.member.voiceChannel) return msg.channel.send('ℹ你必須在語音頻道來停止音樂!ℹ');
      if (!serverQueue) return msg.channel.send('❌沒有任何歌曲在播放!');
		
      serverQueue.dispatcher.end()
      return msg.channel.send("⏩跳過音樂!")
}
