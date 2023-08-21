const axios = require("axios").default;
const type = {
    "None": "El usuario no tiene ningún emblema.",
    "Affiliate": "Afiliado.",
    "Partner": "Partner"
}
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "twitchinfo",
    usage: "twitchinfo | twitch <username>",
    aliases: ["twitch"],
    cooldown: 2,
    example: "twitchinfo | twitch <twitch>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de algun usuario de Twitch.",
    async run(client, message, args, prefix) {
   try {
    let username;
    username = args[0];

    if(!username) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3612" })
            .setDescription(`No se ha proporcionado el nombre de usuario.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se busca la información del usuario de Twitch.")
            ]
        }).then(async(m) => {
            await axios.get(`https://luminabot.xyz/api/json/twitch-info?username=${username}`).then(response => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setThumbnail(response.data.thumbnail)
                    .setAuthor({ name: `Información de: ${response.data.displayname}`, url: `${response.data.twitch_profile}` })
                    .setDescription(`Tipo de cuenta de Twitch: ${type[response.data.broadcaster_type]}
Nombre de usuario de Twitch: ${response.data.displayname}
Descripción del usuario de Twitch: ${response.data.description}
Creación del usuario de Twitch: ${response.data.created_on}
Ultima transmición realizada: ${response.data.last_live}
Ultima categoria transmitida: ${response.data.stream.latest_game}
Seguidores de la cuenta de Twitch: ${response.data.followers}
Vistas en total de la cuenta de Twitch: ${response.data.views}
Actualmente esta en directo: ${response.data.currently_live ? "En directo." : "No esta en directo."}`)
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 5298" })
                    .setDescription("Ha ocurrido un error al intentar buscar la información o no se han encontrado resultados.")
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