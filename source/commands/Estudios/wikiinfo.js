const axios = require("axios")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "wikiinfo",
    usage: "wikiinfo | wiki <búsqueda>",
    aliases: ["wiki"],
    cooldown: 2,
    example: "wikiinfo | wiki Supernova",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de alguna búsqueda por Wikipedia.",
    async run(client, message, args, prefix) {
    try {
    let query;
    query = args.slice(0).join(" ");

    if(!query) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1714" })
            .setDescription(`No se ha proporcionado la búsqueda.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await axios(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36'
            }
        }).then((res) => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setThumbnail(res.data.originalimage?.source)
                .setAuthor({ name: `${res.data.title}`, url: `${res.data.content_urls.desktop.page}` })
                .setDescription(`${res.data.extract}`)
                .setFooter({ text: "Información producida por: Wikipedia." })
                ]
            })
        }).catch(function(error) {
            if(error.response) {
                return;
            }
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)

            if(error.response) {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 2846" })
                    .setDescription("No se han encontrado resultados.")
                    ]
                })
            }
        }
    }
}