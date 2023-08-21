const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "howfurry",
    usage: "furro | howfurry <@member | memberID | MessageMember>",
    aliases: ["furro"],
    cooldown: 2,
    example: "furro | howfurry <@member>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Medidor de qué tan furro eres.",
    async run(client, message, args, prefix) {
   try {
           let member;
    let result;
    member = await message.mentions.members.first() || message.guild.members.cache.get() || message.member;
    result = Math.floor(Math.random() * 100);
    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "¿Qué tan furro eres?" })
        .setDescription(`${member} es ${result}% furro/a.`)
        .setImage ('https://cdn.discordapp.com/attachments/1005696873769742480/1050138395009105920/af127df134e5fe5d82834d0a9f696212.jpg')
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}