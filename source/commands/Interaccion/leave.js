const { MessageEmbed } = require("discord.js")

module.exports = {
        name: 'leave',
    aliases: ['bye'],
    description: 'Te vas del chat.',
    category: 'Interaccion',
    usage: '<prefix>leave | bye',
    
        async run(client, message, args, Discord) {
           try {
    return message.reply({
        embeds: [
            new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription (`**${message.author.username}** se fue del chat.`)
            .setImage ('https://media.tenor.com/N7oktkzS8rAAAAAd/eromanga-sensei-close-door.gif')
]
    })
                                 } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}