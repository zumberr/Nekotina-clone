const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "movieinfo",
    usage: "movieinfo | movie <nombre de la pelicula>",
    aliases: ["movie"],
    cooldown: 4,
    example: "movieinfo | movie Iron Man",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre alguna pelicula proporcionada.",
    async run(client, message, args, prefix) {
   try {
    let moviename = args.join("+");

    if(!moviename) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6910" })
            .setDescription(`No se ha proporcionado el nombre de la pelicula.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se recopila la información sobre la pelicula.`)
            ]
        }).then(async(m) => {
            await axios.get(`https://api.popcat.xyz/imdb?q=${moviename}`).then(response => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setThumbnail(`${response.data.poster}`)
                    .setAuthor({ name: `Información de: ${response.data.title}`, url: `${response.data.imdburl}` })
                    .setDescription(`Titulo de la pelicula: ${response.data.title}
Año de produccion de la pelicula: ${response.data.year}
Clasificación de edad de la pelicula: ${response.data.rated}
Fecha de lanzamiento de la pelicula: <t:${Math.floor(new Date(response.data.released).getTime() / 1000)}:R>
Duración completa de la pelicula: ${response.data.runtime}
Generos de la pelicula: ${response.data.genres}
Director ejecutivo de la pelicula: ${response.data.director}
Escritor del guión de la pelicula: ${response.data.writer}
Actores de la pelicula: ${response.data.actors}
Lenguajes oficiales de la pelicula: ${response.data.languages}
País de produccion de la pelicula: ${response.data.country}
Premios actuales de la pelicula: ${response.data.awards}
Calificación publica de la pelicula: ${response.data.rating}
Votos actuales sobre la calificación de la pelicula: ${response.data.votes}
                    
Descripción de la pelicula: ${response.data.plot}`)
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 5485" })
                    .setDescription(`Ha ocurrido un error al intentar recopilar la información o no se han encontrado resultados.`)
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