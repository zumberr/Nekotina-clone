const { secondsToHms } = require("../../monitors/secondsToHms")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "secondstohms",
    usage: "secondstohms | stohms <segundos>",
    aliases: ["stohms"],
    cooldown: 2,
    example: "secondstohms | stohms <10000 | 100000>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Convertir segundos en formato de horas, minutos y segundos.",
    async run(client, message, args, prefix) {
   try {
    let number;
    number = args[0];

    if(!number) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7462" })
            .setDescription(`No se ha proporcionado la cantidad de segundos.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(isNaN(number)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7314" })
            .setDescription("No se ha proporionado una cantidad de segundos válida.")
            ]
        })
    } else try {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Cantidad de segundos sin convertir: ${number} segundos\nCantidad de segundos convertido: ${secondsToHms(number)}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 8414" })
            .setDescription("Ha ocurrido un error al intentar convertir la cantidad de segundos a formato largo.")
            ]
        })
    }
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}