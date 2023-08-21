const star = require('star-labs')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'happy',
    aliases: ['feliz','alegre','smile'],
    description: 'A mostrar su lado alegre.',
    category: 'Interaccion',
    usage: '<prefix>happy',
  
    async run(client, message, args, Discord) { 

        let happy = star.happy()

        while (!happy || happy === null || happy === '' || happy === undefined) {
        
            happy = star.happy()
            
        }

        const embed = new MessageEmbed()
        .setDescription(`**${message.author.username}** se siente feliz :D`)
        .setImage(happy)
        .setColor('RANDOM')
        .setTimestamp(new Date())
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

        message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

    }

}