const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "invitesinfo",
    usage: "invitesinfo | invites <@member | memberID | MessageMember>",
    aliases: ["invites"],
    cooldown: 2,
    example: "invitesinfo | invites <@usuario#0111 | 123456789123456>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de las invitaciones de un usuario en especifico.",
    async run(client, message, args, prefix) {
   try {
    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let invites = await message.guild.invites.fetch()
    let memberInvites = invites.filter(i => i.inviter && i.inviter.id === member.user.id)
    let content = memberInvites.map(i => i.code).join(", ")
    let index = 0;
    await memberInvites.forEach(invite => index += invite.uses)

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Invitaciones de ${member.user.tag}` })
        .setDescription(`Todos los usos en total de todas las invitaciones: ${index}\nCodigo de la invitación(es): ${content}`)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}