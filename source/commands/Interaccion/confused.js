const star = require('star-labs')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'confused',
    aliases: ['confundido'],
    description: '¿Confundido?.',
    category: 'Interaccion',
    usage: '<prefix>confused [@user/id]',
    owner: false,
    vip: false,
    slash: false,
  
    async run(client, message, args, Discord) { 
 
        let confus = star.confused()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
   
        while (!confus || confus === null || confus === '' || confus === undefined) {
            
            confus = star.confused()
            
        }

        if (!img || img.id === message.author.id) {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** está confundido O.o`)
            .setImage(confus)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`pq me quieres confundir? u.u`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        
        } else {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** está confundiendo a **${img.user.username}**`)
            .setImage(confus)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

      }

    }

}
