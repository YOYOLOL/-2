const Discord = require('discord.js');

module.exports.run = (client, msg, args) => {

       const queue = msg.client.queue;
       const serverQueue = msg.client.queue.get(msg.guild.id);
		if (!msg.member.voiceChannel) return msg.channel.send('你必須在語音頻道中來停止音樂!');
		serverQueue.songs = [];
		serverQueue.dispatcher.end();
	        return msg.channel.send("結束隊列離開語音通道！")
                                              
}
