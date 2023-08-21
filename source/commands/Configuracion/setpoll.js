const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "setpoll",
    usage: "setpoll <#channel | channelID>",
    aliases: [""],
    cooldown: 2,
    example: "setpoll #suggestions",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Establecer el canal de encuestas del servidor.",
    async run(client, message, args, prefix) {
   try {
    let channel;
    channel = await message.mentions.channels.first() || message.guild.channels.cache.get() || client.channels.fetch({ allowUnknownGuild: true });

    if(!channel) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4711" })
            .setDescription(`No se ha proporcionado la mención/ID del canal.\n\nUso corecto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        await database.set(`channelpoll_${message.guild.id}`, channel.id)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Se ha modificado la configuración del servidor" })
            .setDescription(`Se ha modificado el canal de encuestas del servidor.\nEste el nuevo canal de encuestas del servidor: ${channel}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5660" })
            .setDescription("No se ha podido establecer el canal de encuestas.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}