const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "slowmode",
    usage: "slowmode | slmode <#channel | channelID | MessageChannel> <duración>",
    aliases: ["slmode"],
    example: "slowmode | slmode #general-chat 10m",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Activar el slowmode de algun canal en especificó.",
    async run(client, message, args, prefix) {
   try {
    let channel;
    let duration;
    channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    duration = args[1] || args[0];

    if(!duration) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5067" })
            .setDescription(`No se ha proporcionado la duración del slowmode.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(isNaN(duration)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5548" })
            .setDescription(`Se ha producido un error al activar el slowmode al canal, proporcione una duración válida.`)
            ]
        })
    } else if(duration > 21601) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3627" })
            .setDescription(`Se ha proporcionado una duración extremadamente larga.`)
            ]
        })
    } else {
        channel.setRateLimitPerUser(duration);

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se ha establecido a ${channel} un slowmode de ${duration} segundos.`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}