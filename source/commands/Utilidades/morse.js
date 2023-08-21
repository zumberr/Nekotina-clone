const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "morse",
    usage: "morse <encode | decode> <contenido>",
    aliases: [""],
    cooldown: 2,
    example: "morse <encode | decode> <contenido>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Convertir y traducir texto morse.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6071" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "encode") {
        let text = args.slice(1).join(" ");

        if(!text) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6595" })
                .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else {
            await message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Por favor, espere mientras se recopila la traducción.`)
                ]
            }).then(async m => {
                await axios.get(` http://www.morsecode-api.de/encode?string=${text}`).then(req => {
                    return m.edit({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Traductor del formato Morse" })
                        .addField("Texto sin traducir", `\`\`\`js\n${text}\`\`\``)
                        .addField("Texto traducido", `\`\`\`js\n${req.data.morsecode || "No se ha podido traducir el contenido proporcionado."}\`\`\``)
                        ]
                    })
                }).catch((err) => {
                    console.error(err)
                    return m.edit({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Error Code: 6612" })
                        .setDescription(`El contenido proporcionado no es un formato valido.`)
                        ]
                    })
                })
            })
        }
    } else if(format === "decode") {
        let text = args.slice(1).join(" ");

        if(!text) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6597" })
                .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else {
            await message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Por favor, espere mientras se recopila la traducción.`)
                ]
            }).then(async m => {
                await axios.get(`http://www.morsecode-api.de/decode?string=${text}`).then(req => {
                    return m.edit({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Traductor del formato Morse" })
                        .addField("Texto sin traducir", `\`\`\`js\n${text}\`\`\``)
                        .addField("Texto traducido", `\`\`\`js\n${String(req.data.plaintext).toLowerCase() || "No se ha podido traducir el contenido proporcionado."}\`\`\``)
                        ]
                    })
                }).catch(() => {
                    return m.edit({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Error Code: 6612" })
                        .setDescription(`El contenido proporcionado no es un formato valido.`)
                        ]
                    })
                })
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}