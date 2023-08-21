const axios = require("axios").default;
const type = {"FINISHED": "Finalizado.", "RELEASING": "En emision."}
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "traceanime",
    usage: "traceanime | trace <attachment | URL>",
    aliases: ["trace"],
    cooldown: 2,
    example: "traceanime | trace <null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Encontrar un anime con una imágen.",
    async run(client, message, args, prefix) {
   try {
    let image;
    let request;    
    image = await message.attachments.size > 0 ? message.attachments.first().url : null;

    if(!image) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5112" })
            .setDescription(`No se ha proporcionado la imágen.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se busca la información del Anime.`)
            ]
        }).then(async (m) => {
        try {
            request = await axios.get(`https://api.trace.moe/search?url=${encodeURIComponent(image)}`).then(response => response.data)
            let results = await request.result[0];
            let details = await axios.post(`https://graphql.anilist.co`, {
                query: `query ($id: Int) {
                    Media(id: $id, type: ANIME) {
                    title {
                        english
                    }
                    coverImage {
                        large
                        color
                    }
                    status
                    episodes
                    description
                    bannerImage
                    }
                }`,
                variables: {id: results.anilist},
            }).then(response => response.data ? response.data.data.Media : null).catch(() => {})
            
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setThumbnail(`${details.coverImage.large}`)
                .setAuthor({ name: `Este es el anime encontrado: ${details.title.english}`, url: `https://anilist.co/anime/${results.anilist}` })
                .setDescription(`Sinopsís del Anime: ${details.description.substring(0, 200) + `...[Leer mas](https://anilist.co/anime/${results.anilist})`}
Total de episodios del Anime: ${details.episodes || "No se ha podido encontrar la cantidad de episodios."}
Estado de emisión del Anime: ${type[details.status]}
                
Precisión de la búsqueda: ${results.similarity}
Episodio de la imágen: ${results.episode}
Inicio del frotograma: ${results.from}
Final del frotograma: ${results.to}
Video del frotograma: [Click Aquí](${results.video})`)
                .setImage(details.bannerImage)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6391" })
                .setDescription("No se han encontrado resultados a tu búsqueda.")
                ]
            })
        }
    })}
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}