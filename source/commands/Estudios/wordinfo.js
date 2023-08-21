const axios = require("axios")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "wordinfo",
    usage: "wordinfo | word <palabra>",
    aliases: ["word"],
    cooldown: 0,
    example: "wordinfo Sleep",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de alguna palabra.",
    async run(client, message, args, prefix) {
    try {
    let data;
    let request;
    let requestJSON;

    request = await axios(`http://api.urbandictionary.com/v0/define?term=${args.slice(0).join(" ")}`)
    requestJSON = request.data;

    if(!args[0]) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5550" })
            .setDescription(`No se ha proporcionado una palabra. \n\nUso correcto del comando: \n\` ${this.usage} \``)
            ])
        })
    } else if(!requestJSON.list[0]) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1222" })
            .setDescription("No se han encontrado resultados a tu búsqueda.")
            ])
        })
    }

    data = requestJSON.list[0];
    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `${data.word}`, url: `${data.permalink}` })
        .setDescription(`Definición: ${data.definition}\nEjemplos: ${data.example}`)
        .addField("Información secundaria", `Urban Likes: ${data.thumbs_up}\nUrban Dislikes: ${data.thumbs_down}`)
        ])
    })
    } catch (error) {
       console.log(`${error} || ${this.name}.js || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}