const star = require('star-labs')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'lick',
    aliases: ['lamer','lamida','lamiendo'],
    description: 'Lamer a un miembro del servidor.',
    category: 'Interaccion',
    usage: '<prefix>lick <@user/id>',
  
    async run(client, message, args, Discord) { 

        let lick = star.lick()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));

        if (!img || img.id === message.author.id) {

            return message.reply({embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`¿Te lamerías a ti mismo?`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`Soy loli, no gracias!`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
        
        } else {

            while (!lick || lick === null || lick === '' || lick === undefined) {
                
                lick = star.lick()
                
            }

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** está lamiendo a **${img.user.username}** 7u7`)
            .setImage(lick)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        }

    }

}