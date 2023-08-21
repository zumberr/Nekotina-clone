const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removeautorole",
    usage: "removeautorole",
    aliases: ["rautorole"],
    cooldown: 0,
    example: "removeautorole",
    ownerOnly: false,
    UserPerms: ["MANAGE_ROLES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    description: "Desactivar el autorole del servidor.",
    async run(client, message, args, prefix) {
   try {
    database.delete(`autorole_${message.guild.id}`)
    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Se ha modificado la configuracion del servidor" })
        .setDescription(`Se ha desactivado el autorole del servidor.`)
        ]
    })
    //codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6630" })
                .setDescription("Ha ocurrido un error al desactivar el autorole.")
                ]
            })
        }
    }
}