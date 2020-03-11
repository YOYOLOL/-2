const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const search = require('yt-search');

module.exports.run = async (client,msg, args) => {
       msg.delete(500)    
  
search(args.join(' '), (err, res) => {
      if(err) msg.channel.send('no')
       
      let videos = res.videos.slice(0, 10);
       
      let resp = '';
	
      resp += ":mag_right:正在搜尋中:`[" + args.join(' ') + "]`\n"
    
      for (var i in videos) {
            resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;
        }
        resp += `\n**在以下選擇一個數字 \`1-${videos.length}\``;
        msg.channel.send(resp);
        const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;
        const collector = msg.channel.createMessageCollector(filter, {max:1});
         
        collector.on('collect', m => {
        var urls = videos[(m.content) - 1].url
	musics(urls)
function musics(urls){

try {
      const queue = msg.client.queue;
      const serverQueue = msg.client.queue.get(msg.guild.id);

      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel)
        return msg.channel.send("您需要進入語音頻道才能播放音樂！");
      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("我需要獲得許可才能加入您的語音頻道並講話！");
      }
      
      
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
            
        queueContruct.songs.push(urls);
      
        try {                               
          var stream = ytdl(urls);
          stream.on('info', (info) => {
          return msg.channel.send("正在播放: `" + info.title + "`\n網址: " + urls);   
          });
          play(msg,queueContruct.songs[0]);
        } catch (error) {
          console.log(error);
          queue.delete(msg.guild.id);
          return msg.channel.send(err);
        }
      } else {
        serverQueue.songs.push(urls);
        var stream = ytdl(urls);
        stream.on('info', (info) => {
        return msg.channel.send("`" + info.title + "`已新增到隊列中!\n網址: " + urls);   
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
    }).catch((err) => msg.channel.send('err'))

 }	

}		
        //console.log(videos[(m.content)-1].url)
        });

})  
       
};
