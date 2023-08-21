const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "countrytime",
    usage: "countrytime | countime <zona horaria>",
    aliases: ["countime"],
    cooldown: 2,
    example: "countrytime | countime <America/Caracas | America/Punta Arenas>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la hora actual de cual zona horaria.",
    async run(client, message, args, prefix) {
   try {
    let timezone;
    timezone = args.join("_");

    if(!timezone) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6798" })
            .setDescription(`No se ha proporcionado la zona horaria.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se recolecta la información de la zona horaria.")
            ]
        }).then(async (m) => {
            await axios.get(`https://worldtimeapi.org/api/timezone/${timezone}`).then((response) => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `Información de la zona horaria: ${response.data.timezone}`})
                    .setDescription(`Abreviación de la zona horaria: ${response.data.abbreviation}
Tiempo actual de la zona horaria: <t:${response.data.unixtime}:T>`)
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 6563" })
                    .setDescription("Ha ocurrido un error al intentar recolectar la información de la zona horaria o no se han encontrado resultados en tu busqueda.")
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