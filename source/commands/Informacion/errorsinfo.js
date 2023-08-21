const { MessageEmbed } = require("discord.js")
const { findError } = require("../../monitors/errors")

module.exports = {
    name: "errorsinfo",
    usage: "errorsinfo | errors <errorID>",
    aliases: ["errors"],
    cooldown: 0,
    example: "errorsinfo | errors 3148",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de algun error.",
    async run(client, message, args, prefix) {
    try {
    let errorID;
    let fixError;

    errorID = args[0]

    if(!errorID) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 0000" })
            .setDescription(`No se ha proporcionado el codigo de error. \n\nUso correcto del comando: \n\` errorsinfo | errors <ErrorID> \``)
            ])
        })
    } else {
        fixError = findError(errorID);

        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Error ID: ${errorID}`})
            .setDescription(fixError)
            ])
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author}`)
        }
    }
}