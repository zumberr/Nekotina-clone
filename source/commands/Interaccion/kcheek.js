const { MessageEmbed } = require('discord.js');
module.exports =  {

    
    name: 'kcheek',
    aliases: ['kc','kiss-cheek'],
    description: ' Un beso en la mejilla.',
    category: 'Interaccion',
    use: '<prefix>kc <@user/id>',
    owner: false,
    vip: false,
    slash: false,
  
    async run(client, message, args, Discord) { 

        var kc = [
            
            'https://i.imgur.com/H2P306T.gif',
            'https://i.imgur.com/ifglpCn.gif',
            'https://i.imgur.com/GNra2jh.gif',
            'https://i.imgur.com/oYoxiCT.gif',
            'https://i.imgur.com/KFpNsmj.gif',
            'https://i.imgur.com/DQhI5yV.gif',
            'https://i.imgur.com/RV5z2ro.gif',
            'https://i.imgur.com/6USjFDv.gif',
            
            
        ]

        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
        let ramdonkc = kc[Math.floor(Math.random()*kc.length)]

        while (!ramdonkc || ramdonkc === null || ramdonkc === '' || ramdonkc === undefined) {
            
            ramdonkc = kc[Math.floor(Math.random()*kc.length)]

        }
        
        if (!img || img.id === message.author.id) return message.reply({embeds: [
          
            new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
            .setColor('RED')
            .setDescription(`¿A quién deseas besar?`)
        
        ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        if (img.user.bot) return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
          
            new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
            .setColor('RED')
            .setDescription(`Soy una loli, no me beses >~<`)
        
        ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        const embed = new MessageEmbed()
        .setDescription(`**${message.author.username}** le da un beso en la mejilla a **${img.user.username}** >3<`)
        .setImage(ramdonkc)
        .setColor('RANDOM')
        .setTimestamp(new Date())
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })
  
        message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

    }

}