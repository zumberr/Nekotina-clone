const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "rolldice",
    usage: "rolldice | roll <maximo de dados>",
    aliases: ["roll"],
    cooldown: 2,
    example: "rolldice | roll 10",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Tirar los dados con un maximo personalizado.",
    async run(client, message, args, prefix) {
   try {
    let dice_max, random;
    dice_max = args[0];

    if(!dice_max) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6132" })
            .setDescription(`No se ha proporcionado una cantidad maxima de dados.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(dice_max <= 2 || isNaN(dice_max) || dice_max > 1000) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7664" })
            .setDescription("Se ha proporcionado una cantidad de dados maximos invalida.")
            ]
        })
    } else try {
        random = Math.floor(Math.random() * dice_max + 1)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Dados Tirados" })
            .setDescription(`Resultado de los dados tirados: ${random}`)
            ]
        })

    } catch (error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7211" })
            .setDescription("Ha ocurrido un error al intentar tirar los dados.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}