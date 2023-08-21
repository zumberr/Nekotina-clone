const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "bean",
    usage: "bean <@member | memberID>",
    aliases: [""],
    cooldown: 2,
    example: "bean <@Discord#0000 | 1234567890>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "\"Baenar\" a alguien del servidor (Fake-ban)",
    async run(client, message, args, prefix) {
   try {
    let member;
    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`${member} ha sido baneado de ${message.guild.name} correctamente`)
            .addField("Información Extra", `Moderador propietario: ${message.author}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3813" })
            .setDescription("Ha ocurrido un error al intentar \"Banear\" al usuario.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}