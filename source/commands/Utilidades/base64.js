const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "base64",
    usage: "base64 | b64 <encode | decode> <contenido>",
    aliases: ["b64"],
    cooldown: 2,
    example: "base64 | b64 encode Hello!",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Traducir tu texto a base64 y traducir contenido de base64 a texto.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7231" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "encode") {
        let string = args.slice(1).join(" ");

        if(!string || string.length === 0) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5512" })
                .setDescription(`No se ha proporcioando el contenido para traducir.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else try {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Traductor de formato base64" })
                .addField("Texto sin traducir", `\`\`\`js\n${string}\`\`\``)
                .addField("Texto traducido", `\`\`\`js\n${btoa(string)}\`\`\``)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6612" })
                .setDescription(`El contenido proporcionado no es un formato valido.`)
                ]
            })
        }
    } else if(format === "decode") {
        let string = args.slice(1).join(" ");

        if(!string || string.length === 0) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5512" })
                .setDescription(`No se ha proporcioando el contenido para traducir.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else try {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Traductor de formato base64" })
                .addField("Texto sin traducir", `\`\`\`js\n${string}\`\`\``)
                .addField("Texto traducido", `\`\`\`js\n${atob(string)}\`\`\``)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6612" })
                .setDescription(`El contenido proporcionado no es un formato valido.`)
                ]
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}