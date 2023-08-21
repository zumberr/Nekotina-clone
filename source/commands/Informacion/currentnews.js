const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "currentnews",
    usage: "currentnews | ctnews <null>",
    aliases: ["ctnews"],
    cooldown: 2,
    example: "currentnews | ctnews <null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la ultima noticia publicada.",
    async run(client, message, args, prefix) {
   try {
    await message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription("Por favor, espere mientras se recolecta la información de la noticia...")
        ]
    }).then(async (m) => {
        await axios.get(`https://newsapi.org/v2/everything?q=Apple&from=2022-05-28&sortBy=popularity&apiKey=bd97e6d7c21e4c588668ccb9d6ab4e2b`).then(res =>
//axios.get(`https://newsapi.org/v2/top-headlines?sources=reuters&pageSize=5&apiKey=bd97e6d7c21e4c588668ccb9d6ab4e2b`).then(res =>
          res.data.articles[0]).then((req) => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setThumbnail(req.urlToImage)
                .setAuthor({ name: `${req.title}`, url: `${req.url}` })
                .setDescription(`Título de la noticia: ${req.title}
                Descripción de la noticia: ${req.description}
                Autor y escritor de la noticia: ${req.author || "Autor indefinido."}
                Fecha de publicación de la noticia: <t:${Math.floor(new Date(req.publishedAt).getTime() / 1000)}:R>`)
                ]
            })
        }).catch((error) => {
            console.error(`${error.stack}`)
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5918" })
                .setDescription("Ha ocurrido un error al intentar obtener la lista de noticias.")
                ]
            })
        })
    })
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}