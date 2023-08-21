const star = require('star-labs')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'kickbutt',
    aliases: ['patear','patada'],
    description: 'Tira una patada a alguien.',
    category: 'Interaccion',
    usage: '<prefix>kickbutt <@user/id>',
    
    async run(client, message, args, Discord) { 

        let kick = star.kick()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
   
        if (!img || img.id === message.author.id) {

            return message.reply({embeds: [
          
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`¿A quién quieres patear?`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`¡No puedes conmigo!`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
        
        } else {

            while (!kick || kick === null || kick === '' || kick === undefined) {
                
                kick = star.kick()
                
            }

            const embed = new MessageEmbed()
            .setDescription(`**${img.user.username}**, ${message.author.username} te dió una patada xd`)
            .setImage(kick)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        }

    }

}