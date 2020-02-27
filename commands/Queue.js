const { RichEmbed } = require('discord.js');
const { chunk } = require('../../util.js');

exports.run = async (client, msg, args) => {
    try{
        const serverQueue = client.queue.get(msg.guild.id);
        if(!serverQueue) return msg.channel.send('**Music 🎵 |** There is no music playing!\n\nPlay some music with **n!play <YouTube URL>** or **n!play <word>**.');
        let queues = [];
        serverQueue.songs.forEach((x, i) => {
            if(i !== 0){
                queues.push(x);
            }
        });
        const embed = new RichEmbed()
    .setColor('0xd677ff');
        if(!queues || queues.length < 1) return msg.channel.send(`**Music 🎵 |** **Now playing »** **${serverQueue.songs[0].title}**`, {embed: embed.setDescription('**Music 🎵 |** **There are no songs in the queue**')});
        if(queues.length > 10){
            let index = 0;
            queues = queues.map((x, i) => `\`${i +1}\`. __**[${x.title}](${x.url})**__ **by** *${msg.author.username}*`);
            queues = chunk(queues, 10);
      embed.setAuthor('Music 🎵', 'https://i.imgur.com/s6OpKNC.jpg')
            embed.setDescription(queues[index].join('\n'));
            embed.setFooter(`Page ${index+1} of ${queues.length}`);
            const queuesMess = await msg.channel.send(`**Music 🎵 |** **Now playing »** ${serverQueue.songs[0].title}`, {embed: embed});
            await queuesMess.react('⬅');
      await queuesMess.react('🔴');
            await queuesMess.react('➡');
      awaitReactions();
            function awaitReactions(){
                const filter = (rect, usr)=> ['⬅', '➡'].includes(rect.emoji.name) && usr.id === msg.author.id;
                queuesMess.createReactionCollector(filter, {time: 30000, max: 1})
                .on('collect', col => {
          if(col.emoji.name === '🔴') return queuesMess.delete();
                    if(col.emoji.name === '⬅') index--;
                    if(col.emoji.name === '➡') index++;
                    index = ((index % queues.length) + queues.length) % queues.length;
                    embed.setAuthor('Music 🎵', 'https://i.imgur.com/s6OpKNC.jpg')
          embed.setDescription(queues[index].join('\n'));
                    embed.setFooter(`Page ${index+1} of ${queues.length}`);
                    queuesMess.edit(`**Music 🎵 |** **Now playing »** ${serverQueue.songs[0].title}`, {embed: embed});
                    return awaitReactions();
                });
            }
        }else{
            embed.setDescription(queues.map((x, i) => `\`${i +1}\`. __**[${x.title}](${x.url})**__ **by** *${msg.author.username}*`).join('\n'));
            return msg.channel.send(`**Music 🎵 |** **Now playing »** ${serverQueue.songs[0].title}`, {embed: embed});
        }
    }catch(e){
        return msg.channel.send(`**Music 🎵 |** **Error Occured** :( \`\`\`${e.stack}\`\`\`try again later`);
    }
}

exports.conf = {
    aliases: [],
    cooldown: "3"
}

exports.help = {
    name: "queue",
    description: "Show music queue in this server",
    usage: "queue"
}
