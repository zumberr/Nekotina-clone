const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "reverse",
    usage: "reverse <contenido>",
    aliases: [""],
    cooldown: 0,
    example: "reverse Hello!",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Cambiar la forma del texto  reversa.",
    async run(client, message, args, prefix) {
    try {
    let content;
    content = args.slice(0).join(" ")

    if(!content) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: "})
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .addField("No transformado", `\`\`\`css\n${content}\`\`\``)
            .addField("Transformado", `\`\`\`css\n${content.split("").reverse().join("")}\`\`\``)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}