const { MessageEmbed } = require('discord.js')
module.exports = {
    config: {
        name: "actualizacion",
        aliases: ['botupdate'],
        category: 'info',
        description: 'Bot Updates',
        usage: '[mention]',
        accessableby: 'everyone'
    },
    run: async (bot, message, args) => {
        message.delete();
        const embed = new MessageEmbed()
        .setTitle("Recientes noticias del bot")
        .setColor("RANDOM")
        .setDescription("\( + \) Proximamente... -")
        .setFooter("Lena esta siendo actualizada")
        message.channel.send(embed)
    }
};