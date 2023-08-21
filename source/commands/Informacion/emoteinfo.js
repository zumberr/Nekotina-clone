const { MessageEmbed, Util } = require("discord.js")

module.exports = {
    name: "emoteinfo",
    usage: "emoteinfo | emote | emoji <emote_name>",
    aliases: ["emote", "emoji"],
    cooldown: 0,
    example: "emoteinfo | emote | emoji XD",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS_AND_STICKERS"],
    description: "Obtener información de un Emote.",
    async run(client, message, args, prefix) {
    try {
    let emote;
    let request;
    emote = await client.emojis.cache.get(args[0]) || client.emojis.cache.find(e => e.name === args[0]);

    if(!args[0]) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3862" })
            .setDescription(`No se ha proporcionado el nombre del emote.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!emote) {
        request = Util.parseEmoji(args[0])
        if(!request.id) emote = client.emojis.cache.find(a => a.name === args[0])
        else emote = client.emojis.cache.get(request.id)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5116" })
            .setDescription("No se han encontrado emotes.")
            ]
        })
    } else {        
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `${emote.name}`, url: `${emote.url}` })
            .setDescription(`Emote ID: ${emote.id}
Emote Animado: ${emote.animated ? "Animado." : "No Animado."}
Emote Disponible: ${emote.available ? "Disponible." : "No Disponible."}
Fecha de creación: <t:${Math.floor(emote.createdTimestamp / 1000)}:R>
Que roles lo pueden usar: ${emote.roles.cache.first() ? emote.roles.cache.map((e) => e).join(", ") : "@everyone"}`)
            .setImage(`${emote.url}`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}