const anime = require('anime-actions')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'bite',
    aliases: ['morderse','morder'],
    description: '¡Muérdeme!.',
    category: 'Interaccion',
    use: '<prefix>bite [@user/id]',
    owner: false,
    vip: false,
    slash: false,
  
    async run(client, message, args, Discord) { 

        let bite = await anime.bite()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
   
        while (!bite || bite === null || bite === '' || bite === undefined) {
            
            bite = await anime.bite()

        }

        if (!img || img.id === message.author.id) {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se está mordiendo a si mismo :v`)
            .setImage(bite)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`No me muerdas >~<`)
        
            ]})
        
        } else {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** está mordiendo a **${img.user.username}** 7u7`)
            .setImage(bite)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        }

    }

}