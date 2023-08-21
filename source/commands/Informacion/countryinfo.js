const axios = require("axios")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "countryinfo",
    usage: "countryinfo | country <país>",
    aliases: ["country"],
    cooldown: 3,
    example: "countryinfo | country Japan",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de algun país.",
    async run(client, message, args, prefix) {
   try {
    let country;
    country = args.slice(0).join(" ");

    if(!country) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2669" })
            .setDescription(`No se ha proporcionado el nombre del país.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await axios.get(`https://restcountries.com/v3.1/name/${country}`).then((res) => {
            if(res.data[0].name.common === "United States") {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setThumbnail(res.data[0].flags.png || null)
                    .setAuthor({ name: `Información de: ${res.data[0].name.common || res.data[0].name.official}`})
                    .setDescription(`Dominio del País: ${res.data[0].tld.join(" | ")}
Abreviación del Nombre del País: ${res.data[0].cca2}
País independizado: ${res.data[0].independent ? "País independiente" : "País no indenpendiente"}
Prefijo del País: ${res.data[0].idd.root}
Capital del País: ${res.data[0].capital}
Continente del País: ${res.data[0].region}
SubContinente del País: ${res.data[0].subregion}
Zona horaria del País: ${res.data[0].timezones.join(", ")}
Población del País: ${res.data[0].population}`)
                    ]
                })            
            } else {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setThumbnail(res.data[0].flags.png || null)
                    .setAuthor({ name: `Información de: ${res.data[0].name.common || res.data[0].name.official}`})
                    .setDescription(`Dominio del País: ${res.data[0].tld.join(" | ")}
Abreviación del Nombre del País: ${res.data[0].cca2}
País independizado: ${res.data[0].independent ? "País independiente." : "País no indenpendiente."}
Prefijo del País: ${res.data[0].idd.root}${res.data[0].idd.suffixes.join(", ")}
Capital del País: ${res.data[0].capital}
Continente del País: ${res.data[0].region}
SubContinente del País: ${res.data[0].subregion}
Zona horaria del País: ${res.data[0].timezones.join(", ")}
Población del País: ${res.data[0].population}`)
                    ]
                })
            }
        }).catch(function(error) {
            if(error.response) {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 2269" })
                    .setDescription(`Ha ocurrido un error al intentar obtener la información o no se han encontrado resultados.`)
                    ]
                })
            }
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}