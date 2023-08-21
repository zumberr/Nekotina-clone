const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "meme",
    usage: "meme <No Args>",
    aliases: [""],
    cooldown: 2,
    example: "meme <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Simplemente un meme de Reddit",
    async run(client, message, args, prefix) {
   try {
    await message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription("Por favor, espere mientras se recolecta la imágen...")
        ]
    }).then(async (m) => {
        await axios.get(`https://luminabot.xyz/api/json/meme`).then((response) => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `${response.data.title}`, url: `${response.data.url}` })
                .setImage(`${response.data.image}`)
                ]
            })
        }).catch(() => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 8413" })
                .setDescription("Ha ocurrido un error al intentar obtener la imágen.")
                ]
            })
        })
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}