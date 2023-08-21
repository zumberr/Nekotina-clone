const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "resetnickname",
    usage: "resetnickname | resetnick <@member | memberID>",
    aliases: ["resetnick"],
    cooldown: 0,
    example: "resetnickname | resetnick @usuario",
    ownerOnly: false,
    UserPerms: ["MANAGE_NICKNAMES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_NICKNAMES"],
    description: "Restablecer el nickname de algun miembro en especificó.",
    async run(client, message, args, prefix) {
   try {
    let member;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(member.user.id == message.guild.ownerId) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5998" })
            .setDescription(`No puedes restablecerle un nickname al dueño del servidor.`)
            ]
        })
    } else if(message.member.roles.highest.position < member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5357" })
            .setDescription(`No puedes restablecerle el nickname de ${member} ya que tiene un rol mayor que tu o igual.`)
            ]
        })
    } else if(message.guild.me.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4195" })
            .setDescription(`No puedo restablecerle el nickname ya que tiene un rol mayor al mio o igual.`)
            ]
        })
    } else {
        await member.setNickname(null).then(() => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se ha restablecido el apodo a ${member} correctamente.`)
                .addField("Información del Apodo", `Fecha de restablecimiento del apodo: <t:${Math.floor(Date.now() / 1000)}:R>`)
                ]
            })
        }).catch((commit) => {
            console.error(commit)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5623" })
                .setDescription("Ha ocurrido al restablecer el apodo correctamente.")
                ]
            })
        })
    }
    } catch (error) {
       console.error(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}