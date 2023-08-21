const ms = require("ms")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "pinginfo",
    permissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información del \"Message Latency\" y del \"Client Latency\".",
    async run(client, interaction, args) {
   try {
    let timeout = await interaction.followUp({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Obteniendo información de la latencia del mensaje y la del cliente...`)
        ]
    })

    let time = "3s";
    setTimeout(function() {
        timeout.edit({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Esta ha sido la información obtenida.
            \nLatencia del Cliente: ${Math.round(client.ws.ping)}ms.
            Latencia del Mensaje: ${timeout.createdTimestamp - interaction.createdTimestamp + "ms."}`)
            ]
        })
    }, ms(time))
    } catch (error) {
       console.log(`${error} || ${this.name} || ${interaction} || ${interaction.author} || ${interaction.guild.name}`)
        }
    }
}