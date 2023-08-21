const ms = require("ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "timer",
    usage: "timer <tiempo>",
    aliases: [""],
    cooldown: 2,
    example: "timer 10m",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear un temporizador personalizado, y cuando el tiempo pase te avisara.",
    async run(client, message, args, prefix) {
   try {
    let time;
    time = args[0];

    if(!time) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5617" })
            .setDescription(`No se ha proporcionado el tiempo.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(ms(time) > 2147483647) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6391" })
            .setDescription("Se ha proporcionado un tiempo demasiado largo.")
            ]
        })
    } else if(ms(time) <= 1) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6417" })
            .setDescription("Se ha proporcionado un tiempo demasiado corto.")
            ]
        })
    } else try {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Temporizador! ⏱️`})
            .setDescription(`Tu temporizador se ha creado correctamente, el temporizador ya ha empezado y este acabara en: ${ms(ms(time), { long: true })}`)
            ]
        }).then((m) => {
            setTimeout(() => {
                m.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: `Temporizador! ⏱️`})
                    .setDescription(`El tiempo proporcionado en el temporizador se ha terminado, este ha terminado en: ${ms(ms(time), { long: true })}`)
                    ]
                })
            }, ms(time))
        })
    } catch(error) {
        console.error(error.stack)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6489" })
            .setDescription("Ha ocurrido un error al intentar crear el temporizador.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}