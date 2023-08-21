const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "choose",
    usage: "choose <primera opción> || <segunda opción>",
    aliases: [""],
    cooldown: 2,
    example: "choose XD || xD",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Entre las opcionés que me des elegire la que mejor me parezca.",
    async run(client, message, args, prefix) {
   try {
    let option, result;
    option = message.content.split(" ").slice(1).join(" ").split("||")

    if(!option) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6512" })
            .setDescription(`No se ha proporcionado las 2 opcionés.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        result = option[Math.floor(Math.random() * option.length)]
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Creo que elegiré...${result}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 8142" })
            .setDescription("Ha ocurrido un error al intentar elegir entre las opcionés.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}