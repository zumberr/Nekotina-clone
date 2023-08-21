const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "customprefix",
    usage: "customprefix | guildprefix <add | remove> <add | newprefix>",
    aliases: ["guildprefix"],
    cooldown: 2,
    example: "customprefix | guildprefix add a!",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD"],
    description: "Personalización del prefix del Servidor.",
    async run(client, message, args, prefix) {
   try {
    let subcommand;
    subcommand = args[0];;
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    if(!subcommand) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3792" })
            .setDescription(`No se ha proporcionado el tipo de selección.\n\nUso corecto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(subcommand === "add") {
        let format; 
        format = args[1];
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
        if(!format) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5528" })
                .setDescription(`No se ha proporcionado el nuevo prefix.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(format.length > 4) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5112" })
                .setDescription("Se ha proporcionado un prefix mayor de 4 caracteres.")
                ]
            })
        } else if(format.length < 2) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6787" })
                .setDescription("Se ha proporcionado un prefix de menos de 2 caracteres.")
                ]
            })
        } else try {
            await database.set(`prefix_${message.guild.id}`, format)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha modificado el prefix del servidor.\nEste el nuevo prefix del servidor: \` ${format.toString()} \``)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 2592" })
                .setDescription("No se ha podido personalizar el prefix del servidor.")
                ]
            })
        }
    } else if(subcommand === "remove") {
        let getprefix = await database.get(`prefix_${message.guild.id}`)

        if(getprefix === null) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5352" })
                .setDescription("En la configuración del servidor, no se han hecho cambios sobre el prefix del servidor.")
                ]
            })
        } else try {
            database.delete(`prefix_${message.guild.id}`)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha modificado el prefix del servidor.\nEste el nuevo prefix del servidor: \` * \``)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 2592" })
                .setDescription("No se ha podido remover el prefix del servidor.")
                ]
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}