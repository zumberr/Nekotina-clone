const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "xpsystem",
    usage: "xpsystem | xpsm <enable | disable>",
    aliases: ["xpsm"],
    cooldown: 2,
    example: "xpsystem | xpsm enable | disable",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Activar o desactivar el sistema de XP",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4979" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso corecto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "enable") {
        try {
            await client.database.set(`xprank_${message.guild.id}`, true)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha activado el sistema de XP en el servidor correctamente.`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 8713" })
                .setDescription("Ha ocurrido un error al intentar activar el sistema de XP.")
                ]
            })
        }
    } else if(format === "disable") {
        try {
            client.database.delete(`xprank_${message.guild.id}`)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha desactivado el sistema de XP en el servidor correctamente.`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 8713" })
                .setDescription("Ha ocurrido un error al intentar desactivar el sistema de XP.")
                ]
            })
        }
    } else return;
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}