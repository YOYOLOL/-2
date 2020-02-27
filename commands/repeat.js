const Discord = require('discord.js')
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const queue = new Map();
const client = new Discord.Client({disableEveryone: true});
const api = require("./app");
const fs = require('fs' );
let config = require('./config.json');
var servers = {};
let prefix = config.prefix;
const youtube = new YouTube(config.youtube_api);
const {Util, RichEmbed } = require('discord.js')
const stations = require('./stations.json')
const SBL = require("spacebots");
const DiscordBotListAPI = require('dbl-api');
const DBL = require("dblapi.js");
const dbl = new DBL('DBL CODE',client);
const Owner = config.Owner;
const util = require('./util.js')
const { get } = require('node-superfetch');
const { load } = require('cheerio');
const number = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
var guild = {};
client.config = config;
client.util = util
client.queue = queue
client.on("ready", () => {
console.log(`Starting Nate Bot Version » 5.0`)
})

client.config = config;


fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
}); 

client.commands = new Discord.Collection();

    fs.readdir('./commands/', (err, categories) => {
        if (err) console.log(err);
        console.log(`NateBot » Found total ${categories.length} category.`);
        categories.forEach(category => {
            fs.readdir(`./commands/${category}`, (err, files) => {
                console.log(`NateBot » Found total ${files.length} command from ${category}.`)
                if (err) console.log(err);
                let commands = new Array();
                files.forEach(file => {
                    //delete require.cache[require.resolve(`./commands/${category}/${file}`)];
                    if (!file.endsWith('.js')) return;
                    let prop = require(`./commands/${category}/${file}`);
                    let cmdName = file.split('.')[0];
                   client.commands.set(cmdName, prop)
                })
            })
        })
    })



/*
  fs.readdir("./commands/admin/", (err, files) =>{
    if(err) return console.error(err);
    files.forEach(file => {
      if(!file.endsWith(".js")) return;
      let props = require(`./commands/admin/${file}`);
      let commandName = file.split(".")[0];
      client.commands.set(commandName, props);
    });
  });*/

exports.handleVideo = handleVideo
exports.queue = queue;
exports.youtube = youtube;
exports.queue = queue
exports.youtube = youtube;
  exports.ytdl = ytdl;
  exports.guild = guild;
  exports.config = config;

  client.on("message", async message =>{
 if(message.author.bot) return;
  if(message.channel.type === "dm") return;


    var args2 = message.content.substring(config.prefix.length).split(" ");
    if (!message.content.startsWith(config.prefix)) return;
  var searchString = args2.slice(0).join(' ');
  var url = args2[1] ? args2[1].replace(/<(.+)>/g, '$1') : '';
  var serverQueue = queue.get(message.guild.id);
    switch (args2[0].toLowerCase()) {
      case "skip":
    if (!message.member.voiceChannel) return message.channel.send(' **Music 🎵 |** You must connect to a Voice Channel.');
    if (!serverQueue) return message.channel.send('**Music 🎵 |** There is no music playing!\n\nPlay some music with **n!play <YouTube URL>** or **n!play <word>**.');
    serverQueue.connection.dispatcher.end('NateBot » Skip command has been used!');
    const embed = new Discord.RichEmbed()
      .setColor('#0xa8a8a8')
      .setAuthor('Music 🎵', 'https://i.imgur.com/Fm1edxi.png')
      .setDescription('Song Successfully Skipped ⏩')
      message.channel.send({embed});      
        return undefined; 
        break;
      case "np":
    if (!serverQueue) return message.channel.send('**Music 🎵 |** There is no music playing!\n\nPlay some music with **n!play <YouTube URL>** or **n!play <word>**.');

        let nowplayingemb = new Discord.RichEmbed()
    .setColor('#0x76d6ff')
    .setAuthor('Music 🎵', 'https://i.imgur.com/Fm1edxi.png')
    .setThumbnail("https://thumbs.gfycat.com/UnkemptWhiteKakapo-small.gif")
    .setDescription('**Now Playing** 🎶')
    .addField('Song Name', `**${serverQueue.songs[0].title}**`, true)

    return message.channel.send(nowplayingemb);
break;
 case "queue":
    if (!serverQueue) return message.channel.send('**Music 🎵 |** There is no music playing right now!\n\nPlay some music with **n!play <YouTube URL>** or **n!play <word>**.');
        let queueemb = new Discord.RichEmbed()
      .setAuthor('Music 🎵', 'https://i.imgur.com/s6OpKNC.jpg')
        .setTitle(`**Queue for ${message.guild.name}**`)
        .setDescription(`${serverQueue.songs.map(song => `**»** [${song.title}](https://www.youtube.com/watch?v=${song.id}})`).join('\n')}`)
        .setColor(`0xd677ff`)
    return message.channel.send(queueemb)
break;   
 case "leave":
    if (!message.member.voiceChannel) return message.channel.send('**Music 🎵 |** You must connect to a Voice Channel.');
        let stopemb = new Discord.RichEmbed()
        .setColor(0xff7777)
    .setAuthor(`Music 🎵`, 'https://i.imgur.com/Fm1edxi.png')
    .setDescription("Successfully Disconnected... ❌");
    message.guild.me.voiceChannel.leave();
  return message.channel.send(stopemb)
  break;
}
  })

async function handleVideo(video, message, voiceChannel, playlist = false) {
  var serverQueue = queue.get(message.guild.id);
 // console.log(video);
  var song = {
    id: video.id,
    title: video.title,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    channel: video.channel.title,
    durationm: video.duration.minutes,
    durations: video.duration.seconds,
    durationh: video.duration.hours,
    publishedAt: video.publishedAt,
  };
  if (!serverQueue) {
    var queueConstruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
      loop: true
    };
    queue.set(message.guild.id, queueConstruct);

    queueConstruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      var listener = await voiceChannel.join();
      connection.on('error', console.error);
      queueConstruct.connection = connection;
      play(message.guild, queueConstruct.songs[0]);
    } catch (error) {
      queue.delete(message.guild.id);
      return message.channel.send(`**Music 🎵 |** **Error Occured** ${error}`);
    }
  } else { 
    serverQueue.songs.push(song);
    //console.log(serverQueue.songs);
    if (playlist) return undefined;

    let queueemb = new Discord.RichEmbed()
    .setAuthor('Music 🎵', 'https://i.imgur.com/s6OpKNC.jpg')
    .setTitle(`**Song Successfully Queued!** 👍🏻`)
    .setColor(`#0xd677ff`)
    .addField(`**Uploader**`, `${song.channel}`, true)
    .addField(`**Video ID**`, song.id , true)
    .setFooter(`Published » ${song.publishedAt}`)
    .addField(`**Duration**`, `**\`${song.durationh}\`** Hours, **\`${song.durationm}\`** Minutes and **\`${song.durations}\`** Seconds`, true)
    .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
    .setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
    .setColor(`0xd677ff`)
    return message.channel.send(queueemb).then(msg => {
      message.delete(10000)
    })
  }
  return undefined;
}
  function play(guild, song) {
  var serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  //console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))

  .on('end', reason => {
      if (reason === 'NateBot » Stream is not generating quickly enough.') console.log('NateBot » Song ended.');
      else console.log(reason);
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
  .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    let playingemb = new Discord.RichEmbed()
    .setAuthor('Music 🎵', 'https://i.imgur.com/s6OpKNC.jpg')
    .setTitle(`**Now Playing!** 🎶`)
    .setColor(`0x76d6ff`)
    .addField(`**Uploader**`, `${song.channel}`, true)
    .addField(`**Video ID**`, song.id , true)
    .setFooter(`Published » ${song.publishedAt}`)
    .addField(`**Duration**`, `**\`${song.durationh}\`** Hours, **\`${song.durationm}\`** Minutes and **\`${song.durations}\`** Seconds`, true)
    .setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
    .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)

    serverQueue.textChannel.send(playingemb);

}
// Optional events
dbl.on('posted', () => {
  console.log('Server count posted!');
  console.log('NateBot » Server count posted!');
})

client.login(config.Token);
dbl.on('error', e => {
 console.log(`Oops! ${e}`);
 console.log(`NateBot » Oops! ${e}`);
})

  api.startApp(client);

client.login(config.Token);
