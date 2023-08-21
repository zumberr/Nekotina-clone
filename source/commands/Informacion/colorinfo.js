const axios = require("axios").default;
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "colorinfo",
    usage: "colorinfo | color <hexColor>",
    aliases: ["color"],
    cooldown: 2,
    example: "colorinfo | color ffffff",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre algun hex color.",
    async run(client, message, args, prefix) {
   try {
    let hexname;
    hexname = args[0];

    if(hexname.includes("#")) hexname = args[0].split("#")[1] 
    if(!hexname) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6621" })
            .setDescription(`No se ha proporcionado el codigo del hexcolor.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se recolecta la información del hex color.")
            ]
        }).then(async (m) => {
            await axios.get(`https://api.alexflipnote.dev/colour/${hexname}`).then((response) => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setDescription(`Identificación del hex color: ${response.data.hex}
Nombre en ingles del hex color: ${response.data.name}
Codigo RGB del hex color: ${response.data.rgb}
INT del hex color: ${response.data.int}
Color mas brillante del hex color: ${response.data.brightness}`)
                    .setImage(`https://singlecolorimage.com/get/${hexname}/800x800`)
                    ]
                })
            }).catch((e) => {
                console.error(e)
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 7571" })
                    .setDescription("Ha ocurrido un error al intentar recolectar la información del hex color o no se han encontrado resultados.")
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