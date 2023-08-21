const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removesuggestions",
    usage: "removesuggestions | setsuggests <#channel | channelID>",
    aliases: ["setsuggests"],
    cooldown: 2,
    example: "removesuggestions | setsuggests #suggestions",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Remover el canal de sugerencias del servidor.",
    async run(client, message, args, prefix) {
   try {
    database.delete(`suggestion_${message.guild.id}`)
    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Se ha modificado la configuración del servidor" })
        .setDescription(`Se ha removido el canal de sugerencias del servidor.`)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5614" })
                .setDescription("No se ha podido establecer el canal de sugerencias.")
                ]
            })
        }
    }
}