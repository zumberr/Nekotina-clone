const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removeconfessions",
    usage: "removeconfessions | removeconfs <#channel | channelID>",
    aliases: ["removeconfs"],
    cooldown: 2,
    example: "removeconfessions | removeconfs #suggestions",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Remover el canal de confesiones del servidor.",
    async run(client, message, args, prefix) {
   try {
    database.delete(`confessions_${message.guild.id}`)
    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Se ha modificado la configuración del servidor" })
        .setDescription(`Se ha removido el canal de confesiones del servidor.`)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5614" })
                .setDescription("No se ha podido establecer el canal de confesiones.")
                ]
            })
        }
    }
}