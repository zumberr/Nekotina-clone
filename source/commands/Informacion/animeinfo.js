const ms = require("ms");
const { get } = require("axios").default;
const { MessageEmbed } = require("discord.js");
const type = {"finished": "Finalizado", "current": "En Emisión"};

module.exports = {
    name: "animeinfo",
    usage: "animeinfo | anime <anime_name>",
    aliases: ["anime"],
    cooldown: 2,
    example: "animeinfo | anime Gotoubun No Hanayome",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener informacion de algun anime proporcionado.",
    async run(client, message, args, prefix) {
   try {
    let animeName;
    let animeRequest;
    animeName = args.slice(0).join(" ")
    animeRequest = await get(`https://kitsu.io/api/edge/anime?filter[text]=${animeName}`, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36'
        }
    }).then((res) => res.data.data[0]).catch(() => {})

    if(!animeName) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4450" })
            .setDescription(`No se ha proporcionado el nombre del anime.\n\nUso correcto del comando:\n\` ${this.usage} \``)
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
                .setAuthor({ name: `Información del anime: ${animeRequest.attributes.titles.en || animeRequest.attributes.canonicalTitle}` })
                .setDescription(`${animeRequest.attributes.synopsis}`)
                .addField("Información Principal", `Fecha de emisión: ${animeRequest.attributes.startDate || "El anime actualmente no se ha estrenado."}
Fecha de finalización: ${animeRequest.attributes.endDate || "El anime actualmente esta en emisión."}
Estado de la emisión: ${type[animeRequest.attributes.status]}
Tiempo aproximado de los episodios: ${animeRequest.attributes.episodeLength ? animeRequest.attributes.episodeLength : "No se conoce la duración especifica."}
Cantidad de episodios transmitidos: ${animeRequest.attributes.episodeCount || "La cantidad de episodios no se conoce."}
Fecha del proximo episodio: ${animeRequest.attributes.nextRelease || "El anime ha finalizado por lo tanto no hay nuevos episodios."}
Clasificación publica: ${animeRequest.attributes.ratingRank}
Clasificación de edad: ${animeRequest.attributes.ageRating}
Tipo de anime: ${animeRequest.attributes.subtype}
Anime NSFW/+18: ${animeRequest.attributes.nsfw ? "NSFW" : "No NSFW"}`)
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