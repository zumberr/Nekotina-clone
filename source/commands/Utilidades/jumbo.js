const { MessageEmbed, Util } = require("discord.js")

module.exports = {
    name: "jumbo",
    usage: "jumbo <emoji>",
    aliases: [""],
    cooldown: 2,
    example: "jumbo <emoji>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS_AND_STICKER"],
    description: "Obtener la imágen completa.",
    async run(client, message, args, prefix) {
   try {
    let emoji;
    let custom;
    emoji = args[0];
    custom = Util.parseEmoji(emoji);

    if(!emoji) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3867" })
            .setDescription(`No se ha proporcionado el emote.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!custom.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4232" })
            .setDescription(`El emote proporcionado no es un emote válido.\nEs posible que el emote proporcionado no esta en el servidor o sea un emote integrado de Discord.`)
            ]
        })
    } else if(custom.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setImage(`https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? 'gif' : 'png' }`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}