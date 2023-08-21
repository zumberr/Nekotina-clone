const axios = require("axios")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "binary",
    usage: "binary | biy <encode | decode> <contenido>",
    aliases: ["biy"],
    cooldown: 0,
    example: "binary | biy decode Hello!",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Convertir un texto a codigo binario o convertir un codigo binario a texto.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = await args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5843" })
            .setDescription(`No se proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "encode") {
        let content = await args.slice(1).join(" ")
        
        if(!content) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6875" })
                .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else {
            await axios.get(`https://some-random-api.ml/binary?text=${encodeURIComponent(content)}`).then((res) => {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Traductor de codigo binario" })
                    .setDescription(`Texto sin traducir: ${content}\nTexto traducido: ${res.data.binary}`)
                    ]
                })
            }).catch(function(error) {
                if(error.response) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Error Code: 6751" })
                        .setDescription("Ha ocurrido un error al traducir el contenido proporcioando.")
                        ]
                    })
                }
            })
        }
    } else if(format === "decode") {
        let content = await args.slice(1).join(" ")

        if(!content) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6875" })
                .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else {
            await axios.get(`https://some-random-api.ml/binary?decode=${encodeURIComponent(content)}`).then((res) => {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Traductor de codigo binario" })
                    .setDescription(`Codigo binario sin traducir: ${content}\nCodigo binario traducido: ${res.data.text}`)
                    ]
                })
            }).catch(function(error) {
                if(error.response) {
                    return message.reply({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Error Code: 6751" })
                        .setDescription("Ha ocurrido un error al traducir el contenido proporcioando.")
                        ]
                    })
                }
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}