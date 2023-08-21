const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "nekogirl ",
    usage: "nekogirl | neko <null>",
    aliases: ["neko"],
    cooldown: 2,
    example: "nekogirl | neko <null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener una imágen de algun neko.",
    async run(client, message, args, prefix) {
   try {
    await message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Por favor, espere mientras se recolecta la información de la imágen.`)
        ]
    }).then(async m => {
        await axios.get(`https://waifu.pics/api/sfw/neko`).then(res => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setImage(res.data.url)
                ]
            })
        }).catch(() => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6621" })
                .setDescription("Ha ocurrido un error al obtener la información.")
                ]
            })
        })
    })
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}