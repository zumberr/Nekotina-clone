const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "shortener",
    usage: "shortener | short <URL/Link>",
    aliases: ["short"],
    cooldown: 2,
    example: "shortener | short <https://discord.com | www.discord.com>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Recortar una dirección web personalizada.",
    async run(client, message, args, prefix) {
   try {
    let direction;
    direction = args.join("+");

    if(!direction) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6845" })
            .setDescription(`No se ha proporcionado la dirección web.\n\nUso corredcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await axios.get(`https://is.gd/create.php?format=json&url=${direction}`).then(response => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${response.data.shorturl ? `Dirección web recortada: [Click Aquí](${response.data.shorturl})` : "La dirección web no es válida, por lo tanto, no se puede recortar nada."}`)
                ]
            })
        }).catch(() => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4119" })
                .setDescription("Ha ocurrido un error al intentar recortar la dirección web o la dirección url proporcionada no es válida.")
                ]
            })
        })
    }
    } catch (error) {
       console.error(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}