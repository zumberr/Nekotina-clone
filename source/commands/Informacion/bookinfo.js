const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "bookinfo",
    usage: "bookinfo | book <nombre del libro>",
    aliases: ["book"],
    cooldown: 2,
    example: "bookinfo | book Date A Live",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de algun libro que sea publico.",
    async run(client, message, args, prefix) {
   try {
    let book;
    book = args.slice(0).join(" ");

    if(!book) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6513" })
            .setDescription(`No se ha proporcionado el nombre del libro.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se recolecta la información del libro...")
            ]
        }).then(async (m) => {
            await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book}`).then((res) => {
                let data = res.data.items[0].volumeInfo;

                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setThumbnail(data.imageLinks ? data.imageLinks.thumbnail : null)
                    .setAuthor({ name: `Información de: ${data.title}`, url: `${data.previewLink}` })
                    .setDescription(`Identificación del libro: ${res.data.items[0].id}
Nombre actual del libro: ${data.title}
Autor(s) del libro: ${data.authors}
Publicador del libro: ${data.publisher}
Lenguaje/Idioma del libro: ${data.language}
Cantidad de paginas del libro: ${data.pageCount}
Fecha de publicación del libro: ${data.publishedDate}
                    
Descripción del libro: ${data.description}`)
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 7552" })
                    .setDescription(`Ha ocurrido un error al recolectar la información del libro o no se han encontrado resultados.`)
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