const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "memberpermissions",
    usage: "memberpermissions | permissions | perms <@member | memberID | MessageMember>",
    aliases: ["permissions", "perms"],
    cooldown: 2,
    example: "memberpermissions | permissions| perms <@Discord#0000 | 1234567890 | null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener los permisos actuales de algun usuario.",
    async run(client, message, args, prefix) {
   try {
    let member;
    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Lista actual de los permisos de ${member}`)
        .addField("Permisos del servidor", `\`\`\`${member.permissions.toArray().map(u => u).join(", ") || "El usuario actualmente no tiene ningun permiso."}\`\`\``)
        ]
    })
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}