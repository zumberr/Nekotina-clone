const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "songinfo",
    usage: "songinfo | song <song_name>",
    aliases: ["song"],
    cooldown: 2,
    example: "songinfo | song GotoubunNoHanayome",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre una canción.",
    async run(client, message, args, prefix) {
   try {
    let song;
    song = args.slice(0).join("+")

    if(!song) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4163" })
            .setDescription(`No se proporcionado el nombre de la canción.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se intenta recolectar la información sobre la canción proporcionada.`)
            ]
        }).then(async(m) => {
            await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURI(song)}`).then(response => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `${response.data.title}`, url: `${response.data.url}` })
                    .setThumbnail(response.data.image)
                    .setDescription(`Titulo completo: ${response.data.full_title}
Autor de la canción: ${response.data.artist}
Lyrics de la canción:\n${response.data.lyrics}`)
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `Error Code: 5142` })
                    .setDescription("Ha ocurrido un erorr al intentar reoclectar la información de la canción o no se han encontrado resultados a tu búsqueda.")
                    ]
                })
            })
        })
    }
    } catch (error) {
       console.error(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}