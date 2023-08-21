const { MessageEmbed } = require("discord.js")

module.exports = {
        name: 'mapamundi',
    aliases: ['map'],
    description: 'Muestra una foto del mapamundi.',
    category: 'Estudios',
    usage: '<prefix>mapamundi',
  
    async run(client, message, args, Discord) {
           try {
    return message.reply({
        embeds: [
            new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription ("")
            .setImage ('https://www.etapainfantil.com/wp-content/uploads/2015/11/Mapamundi-para-imprimir.jpg')
]
    })
                  } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}