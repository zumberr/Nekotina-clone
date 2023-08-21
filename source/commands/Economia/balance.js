const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "balance",
    usage: "balance | bal <No ARGS>",
    aliases: ["bal"],
    cooldown: 0,
    example: "balance | bal <No ARGS>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de tu billetera y de tu cuenta bancaria.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let bankAccount;
    let walletAccount;

    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    walletAccount = await db.fetch(`balance_${message.guild.id}_${member.id}`)
    bankAccount = await db.fetch(`bankBalance_${message.guild.id}_${member.id}`)

    if(walletAccount === null) walletAccount = 0;
    if(bankAccount === null) bankAccount = 0;

    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Estadisticas de: ${member.user.tag}` })
        .addFields(
            {
                name: "Dinero en la Billetera",
                value: `\`\`\`\$${walletAccount}\`\`\``
            },
            {
                name: "Dinero en la cuenta del Banco",
                value: `\`\`\`\$${bankAccount}\`\`\``
            }
        )
        ])
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}