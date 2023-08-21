const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "clientlogs",
    usage: "clientlogs | logs  <enable | disable> <#channel | channelID>",
    aliases: ["logs"],
    cooldown: 2,
    example: "clientlogs | logs #server-logs enable",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD"],
    description: "Activar o desactivar el registro personalizado del servidor.",
    async run(client, message, args, prefix) {
   try {
    let format;
    let channel;
    format = args[0];
    channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5733" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso corecto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "enable") {
        if(!channel) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5831" })
                .setDescription(`No se ha proporcionado la mención/ID.\n\nUso corecto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else try {
            await database.set(`clientlogs_${message.guild.id}`, channel.id)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha modificado el canal de registro del servidor.\nEste el nuevo canal de registros del servidor: ${channel}`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5240" })
                .setDescription("No se ha podido establecer el nuevo canal de registro.")
                ]
            })
        }
    } else if(format === "disable") {
        try {
           await database.delete(`clientlogs_${message.guild.id}`)

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha removido el canal de registros del servidor.`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5614" })
                .setDescription("No se ha podido remover el canal de registro.")
                ]
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}