const star = require('star-labs')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'blush',
    aliases: ['sonrojado','sonrojar'],
    description: '¿Sonrojad@?.',
    category: 'interaccion',
    usage: '<prefix>blush [@user/id]',
  
    async run(client, message, args, Discord) { 

        let blush = star.blush()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
   
        while (!blush || blush === null || blush === '' || blush === undefined) {
            
            blush = star.blush()
            
        }

        if (!img || img.id === message.author.id) {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se sonrojó >///<`)
            .setImage(blush)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription("Yo no me sonrojo... <:emoji_22:1049399611690844290>")
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
        
        } else {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se sonrojó por **${img.user.username}** >///<`)
            .setImage(blush)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        }

    }

}