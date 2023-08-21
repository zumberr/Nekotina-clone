const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removepoll",
    usage: "removepoll <No ARGS>",
    aliases: [""],
    cooldown: 2,
    example: "removepoll <No ARGS>",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Establecer el canal de encuestas del servidor.",
    async run(client, message, args, prefix) {
   try {
    database.delete(`channelpoll_${message.guild.id}`)
    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Se ha modificado la configuración del servidor" })
        .setDescription(`Se ha removido el canal de encuestas del servidor.`)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5614" })
                .setDescription("No se ha podido remover el canal de encuestas.")
                ]
            })
        }
    }
}