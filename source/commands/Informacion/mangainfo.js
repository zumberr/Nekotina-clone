const ms = require("ms");
const { get } = require("axios").default;
const { MessageEmbed } = require("discord.js");
const type = {"finished": "Finalizado", "current": "En Emisión"}

module.exports = {
    name: "mangainfo",
    usage: "mangainfo | manga <anime_name>",
    aliases: ["manga"],
    cooldown: 2,
    example: "mangainfo | manga Gotoubun No Hanayome",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener informacion de algun manga proporcionado.",
    async run(client, message, args, prefix) {
   try {
    let animeName;
    let animeRequest;
    animeName = args.slice(0).join(" ")
    animeRequest = await get(`https://kitsu.io/api/edge/manga?filter[text]=${animeName}`, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36'
        }
    }).then((res) => res.data.data[0]).catch(() => {})

    if(!animeName) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4450" })
            .setDescription(`No se ha proporcionado el nombre del manga.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        let format = await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se recopila la información.")
            ]
        })

        let time = "3s";
        setTimeout(function() {
            return format.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setThumbnail(`${animeRequest.attributes.posterImage.original}`)
                .setAuthor({ name: `Información del manga: ${animeRequest.attributes.titles.en || animeRequest.attributes.titles.en_jp || animeName}` })
                .setDescription(`${animeRequest.attributes.synopsis}`)
                .addField("Información Principal", `Fecha de emisión: ${animeRequest.attributes.startDate || "El manga actualmente no se ha estrenado."}
Fecha de finalización: ${animeRequest.attributes.endDate || "El manga actualmente esta en emisión."}
Estado de la emisión: ${type[animeRequest.attributes.status]}
Cantidad de volumenes transmitidos: ${animeRequest.attributes.volumeCount || "La cantidad de volumenes no se conoce."}
Cantidad de episodios transmitidos: ${animeRequest.attributes.chapterCount || "La cantidad de capitulos no se conoce."}
Fecha del proximo episodio: ${animeRequest.attributes.nextRelease || "El manga ha finalizado por lo tanto no hay nuevos capitulos."}
Clasificación publica: ${animeRequest.attributes.ratingRank}
Clasificación de edad: ${animeRequest.attributes.ageRating}
Tipo de manga: ${animeRequest.attributes.mangaType}
manga NSFW/+18: ${animeRequest.attributes.nsfw ? "NSFW" : "No NSFW"}`)
                ]
            })
        }, ms(time))
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4150" })
            .setDescription("No se han encontrado resultados al buscar el nombre proporcionado.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}