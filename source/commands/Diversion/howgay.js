const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "howgay",
    usage: "howgay | hgay <@member | memberID | MessageMember>",
    aliases: ["hgay"],
    cooldown: 2,
    example: "howgay | hgay ID",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Medidor de la homosexualidad.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let result;
    member = await message.mentions.members.first() || message.guild.members.cache.get() || message.member;
    result = Math.floor(Math.random() * 100);

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Medidor de homosexualidad" })
        .setDescription(`${member} es ${result}% homosexual/gay.`)
        .setImage ('https://cdn.discordapp.com/attachments/1005696873769742480/1050138388784758814/11a652358f0c43a74c67cd8469858244.jpg')
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}