const axios = require("axios").default;
const { MessageEmbed } = require("discord.js")
let baseURl = `https://serpapi.com/search?engine=google_play&store=apps&q=Discord&api_key=b0ee45e83f900c6d2f9a4cdb2736d1e1692a602fbbbe1c9cbf64c73e57a071e8`;

module.exports = {
    name: "googleplay",
    usage: "googleplay | gplay <nombre de la aplicación> <Opcional: número de aplicacion>",
    aliases: ["gplay"],
    cooldown: 2,
    example: "googleplay | gplay Discord",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre alguna aplicación subida a la Google Play",
    async run(client, message, args, prefix) {
   try {
    let appname, appnumber;
    appname = args.slice(0).join(" ");

    if(!appname) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4971" })
            .setDescription(`No se ha proporcionado el nombre de la aplicación.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se recolecta la información de la aplicación...")
            ]
        }).then(async (m) => {
            await axios.get(`https://serpapi.com/search?engine=google_play&store=apps&q=${appname}&api_key=b0ee45e83f900c6d2f9a4cdb2736d1e1692a602fbbbe1c9cbf64c73e57a071e8`).then((res) => res.data.organic_results[0].items[0]).then((req) => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setThumbnail(req.thumbnail)
                    .setAuthor({ name: `Información de: ${req.title}`, url: `${req.link}` })
                    .setDescription(`Dirección URL de la aplicación: [Click Aquí](${req.link})
Título de la aplicación: ${req.title}
Identificación de la aplicación: ${req.product_id ? `${req.product_id}` : "Identificación indefinida."}
Descripción de la aplicación: ${req.description ? `${req.description}` : "Descripción indefinida."}
Calificación de la aplicación: ${req.rating ? `${req.rating} estrellas` : "Estrellas indefinidas."}
Autor de la aplicación: ${req.extansion.name ? `${req.extansion.name}` : "Autor indefinido."}
Dirección URL del Autor de la aplicación: [Click Aquí](${req.extansion.link})`)
                    ]
                })
            }).catch((error) => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 7519" })
                    .setDescription("Ha ocurrido un error al intentar recolectar la información o no se han encontrado resultados a tu búsqueda.")
                    ]
                })
            })
        })
    }
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}