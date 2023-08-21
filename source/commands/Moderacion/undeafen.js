const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "undeafen",
    usage: "undeafen | undeaf <@member | memberID> <Opcional | Razón>",
    aliases: ["undeaf"],
    cooldown: 3,
    example: "deafen | undeaf @yo#1819 Yes.",
    ownerOnly: false,
    UserPerms: ["DEAFEN_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "DEAFEN_MEMBERS"],
    description: "Desondecer a algun miembro de algun canal de voz.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let reason;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    reason = args.slice(1).join(" ") || "No se ha proporcionado una razón."

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID del miembro.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        await member.voice.setDeaf(false, reason)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`${member} ha sido desactivado el ensordecimiento al miembro correctamente.`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5084" })
            .setDescription(`Ha ocurrido un error al desactivar el ensordecimiento al miembro mencionado.`)
            ]
        })
    }
    } catch (error) {
      console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}