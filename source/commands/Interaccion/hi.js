const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'hi',
    aliases: ['hola','saludar'],
    description: 'Saluda a un miembro del servidor o a todos.',
    category: 'Interaccion',
    usage: '<prefix>hi [@user/id]',
  
    async run(client, message, args, Discord) {

        var hi = [

            'https://i.imgur.com/yM0Do4k.gif',
            'https://i.imgur.com/jrnA8Ei.gif',
            'https://i.imgur.com/q8cppWX.gif',
            'https://i.imgur.com/WXQWIZP.gif',
            'https://i.imgur.com/IxIdEdi.gif',
            


        ]

        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
        let ramdonhi = hi[Math.floor(Math.random()*hi.length)]
     
        while (!ramdonhi || ramdonhi === null || ramdonhi === '' || ramdonhi === undefined) {
            
            ramdonhi = hi[Math.floor(Math.random()*hi.length)]

        }
        
        if (!img || img.id === message.author.id) {
    
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** saluda a todo el servidor!`)
            .setImage(ramdonhi)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
    
        } else if (img.bot){
          
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
          
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`Holi <3`)
          
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
          
        } else {
    
            const embed = new MessageEmbed()
            .setDescription(`**${img.user.username}**, saluda a ${message.author.username}.`)
            .setImage(ramdonhi)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
    
        }

    }

}