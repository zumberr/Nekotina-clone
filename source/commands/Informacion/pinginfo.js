const ms = require("ms")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "pinginfo",
    usage: "pinginfo | ping <No Args>",
    aliases: ["ping"],
    cooldown: 2,
    example: "pinginfo | ping <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información del \"Message Latency\" y del \"Client Latency\".",
    async run(client, message, args, prefix) {
   try {
    let fetch = await message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Obteniendo información de la latencia del mensaje y la del cliente...`)
        ]
    })

    let time = "3s";
    setTimeout(async function() {
        await fetch.edit({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Esta ha sido la información obtenida.
            \nLatencia del Cliente: ${Math.round(client.ws.ping)}ms.
            Latencia del Mensaje: ${fetch.createdTimestamp - message.createdTimestamp + "ms."}`)
            ]
        })
    }, ms(time))
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} | ${message.author}`)
        }
    }
}