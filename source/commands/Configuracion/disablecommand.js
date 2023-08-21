const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "disablecommand",
    usage: "disablecommand | disablecmd <command_name>",
    aliases: ["disablecmd"],
    cooldown: 5,
    example: "disablecommand | disablecmd bigtext",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD"],
    description: "Desactivar comandos del servidor.",
    async run(client, message, args, prefix) {
   try {
    let filter;
    let request;
    filter = ["help", "aboutinfo", "botinfo", "changelog", "botinvite", "pinginfo", "policy", "uptimeinfo", "vote"]
    request = await client.commands.get(args[0]);

    if(!args[0]) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7712" })
            .setDescription(`No se ha proporcionado el nombre del comando.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!request) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5481" })
            .setDescription("No se ha encontrado el comando proporcionado en la lista de comandos del cliente.")
            ]
        })
    } else if(filter.some((fl) => message.content.toLowerCase().includes(fl))) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5123" })
            .setDescription("No puedes desactivar ese comando en especificó.")
            ]
        })
    } else try {
        let format = database.push(`command_${message.guild.id}`, {
            name: args[0]
        })

        await database.set((`command_${message.guild.id}`), format)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Se ha modificado la configuracion del servidor" })
            .setDescription(`El comando ${args[0]} ha sido desactivado del servidor correctamente.`)
            ]
        })
    } catch(error) {
        console.error(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4761" })
            .setDescription("No se ha podido desactivar el comando correctamente.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}