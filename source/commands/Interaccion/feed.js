const star = require('star-labs')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'feed',
    aliases: ['alimentar','comer','eat'],
    description: 'Tienes hambre?.',
    category: 'Interaccion',
    usage: '<prefix>feed [@user/id]',
  
    async run(client, message, args, Discord) { 

        let feed = star.feed()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));

        while (!feed || feed === null || feed === '' || feed === undefined) {
            
            feed = star.feed()
        }
        
        if (!img || img.id === message.author.id) {

            return message.reply({embeds: [
          
                new MessageEmbed()
                .setDescription(`**${message.author.username}** esta comiendo nun`) 
                .setImage(feed)
                .setColor('RANDOM')
               .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`Gracias, Ya comí!`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
        
        } else {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** le dió de comer a **${img.user.username}** OwO`)
            .setImage(feed)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

      }

    }

}