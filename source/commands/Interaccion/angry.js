const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'angry',
    aliases: ['enojao'],
    description: 'Te enojas.',
    category: 'Interaccion',
    use: '<prefix>angry',
  
    async run(client, message, args, Discord) { 

        var angry = [

            'https://i.imgur.com/HbRSFXI.gif',
            'https://i.imgur.com/lcdCm9P.gif',
            'https://i.imgur.com/uwf8FNj.gif',
            'https://i.imgur.com/Sy8mepf.gif',
            'https://i.imgur.com/i9v3epv.gif',
            'https://i.imgur.com/PILHuxB.gif',
            'https://i.imgur.com/V2DlPaw.gif',
            'https://i.imgur.com/fAEltrA.gif',
            'https://i.imgur.com/niBCXzL.gif',
            'https://i.imgur.com/uscnuA2.gif',
            'https://i.imgur.com/otRruhO.gif',
            'https://i.imgur.com/ZSFOdv4.gif',
            
        
        ]

        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
        let ramdonangry = angry[Math.floor(Math.random()*angry.length)]
    
        while (!ramdonangry || ramdonangry === null || ramdonangry === '' || ramdonangry === undefined) {
            
            ramdonangry = angry[Math.floor(Math.random()*angry.length)]

        }
        
        if (!img || img.id === message.author.id) {
    
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se ha enfadado >:c`)
            .setImage(ramdonangry)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] });
    
        } else if (img.user.bot){
          
            return message.reply({ allowedMentions: { repliedUser: false }, embeds: [
          
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`No me hagas enfadar, ni a otros bots >~<`)
          
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
          
        } else {
    
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se enfada con **${img.user.username}** >:c`)
            .setImage(ramdonangry)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
      
        }

    }

}