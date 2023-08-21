const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'cry',
    aliases: ['llorar'],
    description: 'Sad mood.',
    category: 'Interaccion',
    use: '<prefix>cry [@user/id]',
  
    async run(client, message, args, Discord) { 

        var cry = [

            'https://i.imgur.com/MieyWrt.gif',
            'https://i.imgur.com/DHawcrE.gif',
            'https://i.imgur.com/EyT3wYS.gif',
            'https://i.imgur.com/OB50VDV.gif',
            'https://i.imgur.com/3Dyo0RH.gif',
            'https://i.imgur.com/vKB9C5j.gif',
            'https://i.imgur.com/EuoGFE2.gif',
            'https://i.imgur.com/BDOfmSO.gif',
            'https://i.imgur.com/0njPbV3.gif',
            'https://i.imgur.com/aNj3mv7.gif',
            'https://i.imgur.com/piQ9Yb0.gif',
            'https://i.imgur.com/ZMiEvse.gif',
            'https://i.imgur.com/qqRGzE3.gif',
            'https://i.imgur.com/W9yHs4t.gif',
            'https://i.imgur.com/U83C71w.gif',
            'https://i.imgur.com/f0NP6vY.gif',
            'https://i.imgur.com/sbVIswx.gif',
            'https://i.imgur.com/CwUSjuy.gif',
            'https://i.imgur.com/xsyIxxf.gif',
            'https://i.imgur.com/7Yffi3x.gif',
            'https://i.imgur.com/pls8egF.gif',
            'https://i.imgur.com/UjIb9DT.gif',
            'https://i.imgur.com/PcU00J4.gif',
            'https://i.imgur.com/Dm6n95I.gif',
            'https://i.imgur.com/KZtIoTd.gif',
            'https://i.imgur.com/evaPvIa.gif',
            'https://i.imgur.com/MSxWi8a.gif',
            'https://i.imgur.com/W4ulgbm.gif',
            'https://i.imgur.com/iEkGy0K.gif',
            'https://i.imgur.com/L7uGp75.gif',
            'https://i.imgur.com/GMy2eUD.gif',
            'https://i.imgur.com/pJuUyPC.gif',
            'https://i.imgur.com/7tQDnEJ.gif',
            'https://i.imgur.com/4vwuGzK.gif',
        
        ]

        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
        let ramdoncry = cry[Math.floor(Math.random()*cry.length)]
    
        while (!ramdoncry || ramdoncry === null || ramdoncry === '' || ramdoncry === undefined) {
            
            ramdoncry = cry[Math.floor(Math.random()*cry.length)]

        }
        
        if (!img || img.id === message.author.id) {
    
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** no llores, tqm <3`)
            .setImage(ramdoncry)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] });
    
        } else if (img.user.bot){
          
            return message.reply({ allowedMentions: { repliedUser: false }, embeds: [
          
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`No me hagas llorar T-T`)
          
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
          
        } else {
    
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** y **${img.user.username}** están llorando. T-T`)
            .setImage(ramdoncry)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
      
        }

    }

}