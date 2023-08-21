const anime = require('anime-actions')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'cuddle',
    aliases: ['acurrucarse','acurrucar'],
    description: 'Acurrúcate junto a alguien.',
    category: 'Interaccion',
    usage: '<prefix>cuddle [@user/id]',  
    async run(client, message, args, Discord) { 

        let cuddle = await anime.cuddle()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
   
        while (!cuddle || cuddle === null || cuddle === '' || cuddle === undefined) {
            
            cuddle = await anime.cuddle()
            
        }

        if (!img || img.id === message.author.id) {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se está acurrucando conmigo nwn`)
            .setImage(cuddle)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){
        
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
        
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`¿Acurrucarme?`)
        
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
        
        } else {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se acurrucó con **${img.user.username}** <3`)
            .setImage(cuddle)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        }

    }

}