const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'clorox',
    aliases: [],
    description: '¿clorox?.',
    category: 'Interaccion',
    usage: '<prefix>clorox [@user/id]',
  
    async run(client, message, args, Discord) {

        var clorox = [

            'https://i.imgur.com/BXmcGsq.jpeg',
            'https://i.imgur.com/gksEfz4.gif',
        
        ]

        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
        let ramdonclorox = clorox[Math.floor(Math.random()*clorox.length)]

        while (!ramdonclorox || ramdonclorox === null || ramdonclorox === '' || ramdonclorox === undefined) {
            
            ramdonclorox = clorox[Math.floor(Math.random()*clorox.length)]

        }

        if (!img || img.id === message.author.id) {
  
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se ahoga con un buen clorox!`)
            .setImage(ramdonclorox)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
  
        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`¿Clorox?`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
        
        } else {
  
            const embed = new MessageEmbed()
            .setDescription(`**${img.user.username}**, vamos a ahogarnos en la soledad con un clorox invitado por ${message.author.username}.`)
            .setImage(ramdonclorox)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
    
        }

    }

}