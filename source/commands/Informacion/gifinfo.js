const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "gifinfo",
    usage: "gifinfo | gif <búsqueda>",
    aliases: ["gif"],
    cooldown: 2,
    example: "gifinfo | gif Anime",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener GIF de Giphy.",
    async run(client, message, args, prefix) {
   try {
    let content;
    content = args.join("+");

    if(!content) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3788" })
            .setDescription(`No se ha proporcionado la búsqueda.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se recolecta la información del GIF proporcionado.`)
            ]
        }).then(async(m) => {
            await axios.get(`https://api.giphy.com/v1/gifs/search?q=${content}&api_key=${client.config.giphyAPIKey}&limit=1`).then(res => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `Resultados de: ${args.join(" ")}`, url: `${res.data.data[0].bitly_url}` })
                    .setDescription(`Autor del GIF: ${res.data.data[0].username}
Nombre del GIF: ${res.data.data[0].title}
Identificación del GIF publico: ${res.data.data[0].id}
Clasficación de Edad del GIF: ${res.data.data[0].rating}
Fecha de subida del GIF publicamente: ${res.data.data[0].import_datetime}`)
                    .setImage(`${res.data.data[0].images.original.url}`)
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 2681" })
                    .setDescription("Ha ocurrido un error al intentar obtener la información o no se han encontrado resultados a tu búsqueda.")
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