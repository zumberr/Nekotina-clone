const star = require('star-labs')
const { MessageEmbed } = require('discord.js');
module.exports =  {
    name: 'dance',
    aliases: ['bailando','bailar'],
    description: '¿Bailamos?',
    category: 'Interaccion',
    usage: '<prefix>dance [@user/id]',

    async run client, message, args, Discord) {

        let dance = star.dance()
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));

        while (!dance || dance === null || dance === '' || dance === undefined) {

            dance = star.dance()
        }

        if (!img || img.id === message.author.id) {

            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** está mostrandonos sus pasos prohibidos.`)
            .setImage(dance)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        } else if (img.user.bot){

            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [

                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`yo no sé bailar u.u`)
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
        } else {

            const embed = new MessageEmbed()
            .setDescription(`**${img.user.username}** y **${message.author.username}** están bailando juntos`)
            .setImage(dance)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

        }

    }

}
