const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "setautorole",
    usage: "setautorole <@role | roleID>",
    aliases: ["sautorole"],
    cooldown: 0,
    example: "setautorole <@Member | 1234567890>",
    ownerOnly: false,
    UserPerms: ["MANAGE_ROLES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    description: "Activar el autorole del servidor.",
    async run(client, message, args, prefix) {
   try {
    let format;
    let autorole;
    format = args[1];
    autorole = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    if(!autorole) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5512" })
            .setDescription(`No se ha proporcionado la mención/ID del rol.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        await database.set(`autorole_${message.guild.id}`, autorole.id)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Se ha modificado la configuracion del servidor" })
            .setDescription(`Se ha activado el autorole del servidor.`)
            .addField("Información del autorole", `Rol del autorole: ${autorole}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6652" })
            .setDescription("No se ha podido activar el autorole en el servidor.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}