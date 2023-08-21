const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "clear",
    usage: "clear | cls <#channel | channel> <cantidad>",
    aliases: ["cls"],
    cooldown: 0,
    example: "clear | cls 20",
    ownerOnly: false,
    UserPerms: ["MANAGE_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"],
    description: "Eliminar los mensajes de algun canal en el que estas.",
    async run(client, message, args, prefix) {
    try {
    let channel;
    let amountClear;

    channel = message.mentions.channels.first() || message.guild.channels.cache.get() || client.channels.cache.get() || message.channel;
    amountClear = args[1] || args[0];
    
    if(!amountClear) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1741" })
            .setDescription(`No se ha proporcionado la cantidad.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else if(isNaN(amountClear)) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2320" })
            .setDescription("La cantidad proporcionado es invalida.")
            ])
        })
    } else if(amountClear.length < 1) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2896" })
            .setDescription("Se ha proporcionado menos de una cantidad.")
            ])
        })
    } else if(channel.bulkDelete(amountClear, true)) {
        return message.channel.send({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se han eliminado \`${amountClear}\` mensajes en el canal ${channel} correctamente.`)
            ])
            })
        }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}