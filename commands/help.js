const Discord = require('discord.js');

module.exports.run = async(client,msg, args,cmdnumber) => {
let helpEmbed = new Discord.RichEmbed()
.setColor('#00E3E3')
.setTitle('音樂指令')
.setThumbnail(client.user.avatarURL)
.setDescription("我是" + client.user.username + ",一個服務大眾的音樂機械人。\n如需要查看指令資訊，輸入: .help <指令>")
.addField(":headphones:音樂","`play` · `repeat` · `stop` · `skip`")
return msg.channel.send(helpEmbed)
}
