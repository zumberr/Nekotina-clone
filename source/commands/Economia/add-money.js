const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "add-money",
    usage: "add-money <@member | memberID> <amount>",
    aliases: [""],
    cooldown: 0,
    example: "add-money @usuario#1610 1200",
    ownerOnly: true,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Agregarle dinero a un usuario en especifico.",
    async run(client, message, args, prefix) {
    try {
    let member, amount;
    member = message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
    amount = args[1];

    if(!member) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else if(!amount) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1742" })
            .setDescription(`No se ha proporcionado el monto.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else if(isNaN(amount)) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5327" })
            .setDescription("Se ha proporcionado una cantidad invalida.")
            ])
        })
    } else if(amount > 10000) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2501" })
            .setDescription("Se ha proporcionado una cantidad que supera los `10.000`, por lo tanto, no se le puede agregar al usuario.")
            ])
        })
    }

    await db.add(`balance_${message.guild.id}_${member.id}`, amount)

    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Se le ha agregado \`${amount}\` al usuario ${member}`)
        ])
    })

    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}