const { mstotime } = require("../../monitors/timetoms")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "mstotime",
    usage: "mstotime | mstt <tiempo>",
    aliases: ["mstt"],
    cooldown: 2,
    example: "mstotime | mstt 60s",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Convertir milisegundos en un tiempo de formato largo.",
    async run(client, message, args, prefix) {
   try {
    let number;
    number = args[0];

    if(!number) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7961" })
            .setDescription(`No se ha proporcionado la cantidad de milisegundos.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(isNaN(number)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7317" })
            .setDescription("No se ha proporionado una cantidad de milisegundos válida.")
            ]
        })
    } else try {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Cantidad de milisegundos sin convertir: ${number} milisegundos\nCantidad de milisegundios convertido: ${mstotime(number)}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 8461" })
            .setDescription("Ha ocurrido un error al intentar convertir la cantidad de milisegundos a formato largo.")
            ]
        })
    }
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}