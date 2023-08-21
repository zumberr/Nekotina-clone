const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "colorviewer",
    usage: "colorviewer | viewcolor <hexColor>",
    aliases: ["viewcolor"],
    cooldown: 2,
    example: "colorviewer | viewcolor <ffffff | ff0000>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la imágen de algun color de la lista de hex colors.",
    async run(client, message, args, prefix) {
   try {
    let hexcode;
    hexcode = args[0];

    if(!hexcode) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7301" })
            .setDescription(`No se ha proporcionado el codigo del hex color.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(args[0].startsWith("#")) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7361" })
            .setDescription("No se puede utilizar `#` al buscar un hex color en el comando.")
            ]
        })
    } else try {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se recolecta la imágen del hex color.")
            ]
        }).then(async (m) => {
            return m.edit({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setImage(`https://some-random-api.ml/canvas/colorviewer?hex=${hexcode}`)
                ]
            })
        })
    } catch(error)  {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 8167" })
            .setDescription("Ha ocurrido un error al intentar recolectar la imágen del hex color.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}