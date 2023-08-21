const axios = require("axios").default;
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "randonanime",
    usage: "randonanime | ranime <null>",
    aliases: ["ranime"],
    cooldown: 2,
    example: "randomanime | ranime <null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Busca en la lista de animes y el cliente selecciona de manera random un anime.",
    async run(client, message, args, prefix) {
   try {
    await message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription("Por favor, espere mientras se recolecta el titulo del Anime...")
        ]
    }).then(async (m) => {
        await axios.get(`https://nekos.best/api/v2/blush`).then((response) => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Nombre del anime seleccionado: ${response.data.results[0].anime_name}`)
                ]
            })
        }).catch(() => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7618" })
                .setDescription("Ha ocurrido un error al intentar recolectar el titulo del anime.")
                ]
            })
        })
    })
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}