const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "deposit",
    usage: "deposit | dep <all | monto>",
    aliases: ["dep"],
    cooldown: 0,
    example: "deposit | dep <all | 570>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Depositar un dinero de la billetera al banco.",
    async run(client, message, args, prefix) {
    try {
    let type;
    let member;
    let allwallet;

    type = args[0];
    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    allwallet = await db.fetch(`balance_${message.guild.id}_${member.id}`)

    if(type === "all") {
        type == allwallet;
    } else if(!type) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4290" })
            .setDescription(`No se ha proporcionado una cantidad. \n\nUso correcto del comando: \n\` ${this.usage} \``)
            ])
        })
    } else if(isNaN(type)) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3041" })
            .setDescription("Se ha proporcionado una cantidad invalida.")
            ])
        })
    }

    db.subtract(`balance_${message.guild.id}_${member.id}`, type)
    db.add(`bankBalance_${message.guild.id}_${member.id}`, type)

    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Se ha depositado \`\$${type}\` a la cuenta del banco.`)
        ])
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}