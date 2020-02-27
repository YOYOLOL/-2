const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports.run =  (client,msg, args) => {
       msg.delete(500)    
               
      try {
      const queue = msg.client.queue;
      const serverQueue = msg.client.queue.get(msg.guild.id);

      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel)
        return msg.channel.send("You need to be in a voice channel to play music!");
      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("I need the permissions to join and speak in your voice channel!");
      }

      if (!args[0]) return msg.channel.send("❌沒有網址")
      
      if (!serverQueue) {
        const queueContruct = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        queue.set(msg.guild.id, queueContruct);

        queueContruct.songs.push(args[0]);
      
        try {                               
          var stream = ytdl(args[0]);
          stream.on('info', (info) => {
          return msg.channel.send("正在播放: `" + info.title + "`\n網址: " + args[0]);   
          });
          play(msg,queueContruct.songs[0]);
        } catch (error) {
          console.log(error);
          queue.delete(msg.guild.id);
          return msg.channel.send(err);
        }
      } else {
        serverQueue.songs.push(args[0]);
        var stream = ytdl(args[0]);
        stream.on('info', (info) => {
        return msg.channel.send("`" + info.title + "`已新增到隊列中!\n網址: " + args[0]);   
        });               
      }
    } catch (error) {
      console.log(error);
      msg.channel.send(error.msg);
    }

function play(msg) {

    const queue = msg.client.queue;
    const guild = msg.guild;
    const serverQueue = queue.get(msg.guild.id);

    const voiceChannel = msg.member.voiceChannel;
          voiceChannel.join().then(connection => {
            
          serverQueue.dispatcher = connection.playStream(ytdl(serverQueue.songs[0],{ fliter: "audioonly" }))          
          
          serverQueue.dispatcher.on("end", function(){
            serverQueue.songs.shift();
            if(serverQueue.songs[0]){
                play(msg);
            } else {
                 voiceChannel.leave();                                 
                 queue.delete(guild.id);                          
            }          
         });
    });

}     
}; 
