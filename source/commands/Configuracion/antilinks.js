const database = require("quick.db");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "antilinks",
    usage: "antilinks <enable | disable>",
    aliases: [""],
    cooldown: 4,
    example: "antilinks disable",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Establecer el anti links.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5834" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso corecto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "enable") {
        try {
            await database.set(`antilinks_${message.guild.id}`, "true")

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription("Se ha activado el antilinks del servidor correctamente.")
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4578" })
                .setDescription("No se ha podido activar el anti-links en el servidor.")
                ]
            })
        }
    } else if(format === "disable") {
        let getactivite = await database.get(`antilinks_${message.guild.id}`, "true")

        if(getactivite === null) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3873" })
                .setDescription("El servidor actualmente no tiene activado el antilinks.")
                ]
            })
        } else try {
            database.delete(`antilinks_${message.guild.id}`)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha desactivado el antilinks del servidor.`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4578" })
                .setDescription("No se ha podido desactivar el anti-links en el servidor.")
                ]
            })
        }
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}