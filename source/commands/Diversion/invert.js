const { somerandomapi } = require("../../inhibitors/filter.json")["Configuracion General"]
const { MessageAttachment, MessageEmbed } = require("discord.js")

module.exports = {
    name: "invert",
    usage: "invert <@member | memberID>",
    aliases: [""],
    cooldown: 25,
    example: "invert",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Invertir los colores del avatar del usuario.",
    async run(client, message, args, prefix) {
   try {
       
    const member = await message.mentions.members.first(args[0]) || message.guild.members.cache.get(args[0]) || message.member;
    const attachment = new MessageAttachment (`https://some-random-api.ml/canvas/invert?avatar=${member.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })}&key=${somerandomapi}`, "invert.png")

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription("Por favor, espera un momento mientras se carga tu imagen...")
        ]
    }).then((m) => {
        return m.edit({ files: [attachment], embeds: [] })
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}