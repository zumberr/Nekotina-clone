const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "calculator",
    usage: "calculator | calc | math <operación>",
    aliases: ["calc", "math"],
    cooldown: 2,
    example: "calculator | calc 5 * | x 5",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Resolver una operación matematica en segundos.",
    async run(client, message, args, prefix) {
   try {
    let operation;
    operation = args[0];

    if(!operation) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6117" })
            .setDescription(`No se ha proporcionado la operación.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        operation = args[0].replace("x", "*")
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se resuelve la operación...`)
            ]
        }).then(async(m) => {
            await axios.get(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(operation)}`).then(response => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .addField("Operación sin resolver", `${operation.replace("*", "x")}`)
                    .addField("Operación resuelta", `${response.data}`)
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 7722" })
                    .setDescription(`Ha ocurrido un error al intentar resolver la operación proporcionada.`)
                    ]
                })
            })
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}