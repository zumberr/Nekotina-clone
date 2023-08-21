const ms = require("ms");
const { MessageEmbed } = require("discord.js");
const results = require("../../inhibitors/filter.json");

module.exports = {
    name: "memberhack",
    usage: "memberhack | hack <@member | memberID>",
    aliases: ["hack"],
    cooldown: 2,
    example: "memberhack | hack <@Discord#0000 | 1234567890>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "\"Hackear\" a algun usuario de Discord.",
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
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se recolecta los datos del usuario...`)
            ]
        }).then((m) => {
            let time = "6s";
            setTimeout(function() {
                m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `Estos han sido los datos recolectados de: ${member.user.tag}` })
                    .setDescription(`Edad actual: ${results["Resultados del hackeo"].Edad[Math.floor(Math.random() * results["Resultados del hackeo"].Edad.length)]}
Signo zodiacal: ${results["Resultados del hackeo"].Zodiac[Math.floor(Math.random() * results["Resultados del hackeo"].Zodiac.length)]}
Tipo sanguíneo: ${results["Resultados del hackeo"].Sangre[Math.floor(Math.random() * results["Resultados del hackeo"].Sangre.length)]}
Numero de telefono: ${results["Resultados del hackeo"].Telefonos[Math.floor(Math.random() * results["Resultados del hackeo"].Telefonos.length)]}
Correo electronico: ${results["Resultados del hackeo"].Emails[Math.floor(Math.random() * results["Resultados del hackeo"].Emails.length)]}
Dirección IP: ${results["Resultados del hackeo"].IPS[Math.floor(Math.random() * results["Resultados del hackeo"].IPS.length)]}
Contraseña de su cuenta de Discord: ${results["Resultados del hackeo"].Contraseñas[Math.floor(Math.random() * results["Resultados del hackeo"].Contraseñas.length)]}                    País de origen de su cuenta: ${results["Resultados del hackeo"].Pais[Math.floor(Math.random() * results["Resultados del hackeo"].Pais.length)]}`)
                    ]
                })
            }, ms(time))
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7132" })
            .setDescription("Ha ocurrido un error al intentar hackear al usuario.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}