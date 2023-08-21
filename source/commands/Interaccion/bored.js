const anime = require('anime-actions')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'bored',
    aliases: ['aburrido'],
    description: 'Aburrido...',
    category: 'Interaccion',
    usage: '<prefix>bored',
  
    async run(client, message, args, Discord) { 

        let bored = await anime.bored()

        while (!bored || bored === null || bored === '' || bored === undefined) {
            
            bored = await anime.bored()

        }

        const embed = new MessageEmbed()
        .setDescription(`**${message.author.username}** está aburrid@ :/`)
        .setImage(bored)
        .setColor('RANDOM')
        .setTimestamp(new Date())
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

        message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
       
    }

}