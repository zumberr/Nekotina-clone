const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "owoify",
    usage: "owoify | owo <contenido>",
    aliases: ["owo"],
    cooldown: 2,
    example: "owoify | owo Hello!",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Convertir un texto normal a owoify",
    async run(client, message, args, prefix) {
   try {
    let content;
    content = args.join(" ");

    if(!content) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7591" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(content.length > 200) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7131" })
            .setDescription(`El contenido proporcionado supera los 200 caracteres, por lo tanto, no se puede convertir el contenido a owoify.`)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se convierte el contenido a owoify.")
            ]
        }).then(async (m) => {
            await axios.get(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(content)}`).then((response) => {
                return m.edit({ content: `${response.data.owo}`, embeds: [] })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 6512" })
                    .setDescription("Ha ocurrido un error al convertir el contenido a owoify.")
                    ]
                })
            })
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}