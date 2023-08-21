const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "periodictable",
    usage: "periodictable | pertable <symbol | name> <...>",
    aliases: ["pertable"],
    cooldown: 2,
    example: "periodictable | pertable",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre los elementos de la tabla periodica.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7916" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "symbol") {
        let symbol = args[1]
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se recolecta la información del elemento...`)
            ]
        }).then(async (m) => {
            await axios.get(`https://periodictableapi.herokuapp.com/api/getElement/bySymbol/${symbol.toLowerCase()}`).then((response) => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `Resultados de: ${symbol.toLowerCase()}` })
                    .setDescription(`Símbolo del elemento: ${response.data.symbol.toUpperCase()}
Nombre del elemento: ${response.data.name}
Clase del elemento: ${response.data.class}
Densidad del elemento: ${response.data.density}
Masa atomica del elemento: ${response.data.atomicMass}
Número atomico del elemento: ${response.data.atomicNumber}
Punto de fusion del elemento: ${response.data.meltingPoint}
Electronegatividad del elemento: ${response.data.electronegativity}
Punto de ebullición del elemento: ${response.data.boilingPoint}
Números de oxidación del elemento: ${response.data.oxidationNumbers}
Energía de ionización del elemento: ${response.data.ionizationEnergy}
Configuración electronica del elemento: ${response.data.electronConfiguration}`)
                    .setFooter({ text: `Descubrimiento del elemento: ${response.data.discovery}` })
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 6419" })
                    .setDescription("Ha ocurrido un error al intentar recolectar la información o no se han encontrado resultados.")
                    ]
                })
            })
        })
    } else if(format === "name") {
        let symbol = args[1]

        if(!symbol) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7651" })
                .setDescription(`No se ha proporcionado el nombre del elemento.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        }
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se recolecta la información del elemento...`)
            ]
        }).then(async (m) => {
            await axios.get(`https://periodictableapi.herokuapp.com/api/getElement/byName/${symbol.toLowerCase()}`).then((response) => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `Resultados de: ${symbol.toLowerCase()}` })
                    .setDescription(`Símbolo del elemento: ${response.data.symbol.toUpperCase()}
                    Nombre del elemento: ${response.data.name}
                    Clase del elemento: ${response.data.class}
                    Densidad del elemento: ${response.data.density}
                    Masa atomica del elemento: ${response.data.atomicMass}
                    Número atomico del elemento: ${response.data.atomicNumber}
                    Punto de fusion del elemento: ${response.data.meltingPoint}
                    Electronegatividad del elemento: ${response.data.electronegativity}
                    Punto de ebullición del elemento: ${response.data.boilingPoint}
                    Números de oxidación del elemento: ${response.data.oxidationNumbers}
                    Energía de ionización del elemento: ${response.data.ionizationEnergy}
                    Configuración electronica del elemento: ${response.data.electronConfiguration}`)
                    .setFooter({ text: `Descubrimiento del elemento: ${response.data.discovery}` })
                    ]
                })
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 6419" })
                    .setDescription("Ha ocurrido un error al intentar recolectar la información o no se han encontrado resultados.")
                    ]
                })
            })
        })
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}