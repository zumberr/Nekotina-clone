const { MessageEmbed } = require("discord.js")

module.exports = {
        name: 'clown',
    aliases: [],
    description: 'Quedé clown..',
    category: 'Interaccion',
    usage: '<prefix>clown',
  
    async run(client, message, args, Discord) {
           try {
    return message.reply({
        embeds: [
            new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription (`**${message.author.username}** quedó clown xd`)
            .setImage ('https://cdn.discordapp.com/emojis/852665081179406390.png')
]
    })
                  } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}