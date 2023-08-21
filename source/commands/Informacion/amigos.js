const { MessageEmbed } = require("discord.js")

module.exports = {
        name: 'amigos',
    aliases: [],
    description: 'Mostrar la cantidad de servidores donde estoy y sus usuarios.',
    category: 'Informacion',
    usage: '<prefix>amigos',
  
    async run(client, message, args, Discord) {
           try {
    return message.reply({
        embeds: [
            new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription (`Actualmente tengo ${client.users.cache.size} amigos <3\n Y he explorado ${client.guilds.cache.size} mundos diferentes :D`) 
            .setImage ('https://cdn.discordapp.com/attachments/1048727522709344377/1050134633406279740/tY5FD5IM.gif')
            
            ]
    })
                  } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}
        