const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "unban",
    usage: "unban <memberID>",
    aliases: [""],
    cooldown: 0,
    example: "unban 13456789123456789",
    ownerOnly: false,
    UserPerms: ["BAN_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
    description: "Desbanear a un miembro.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let reason;
    let checkerBan;
    member = args[0];
    reason = args.slice(1).join(" ") || "No se ha proporcionado la razón.";
    checkerBan = await message.guild.bans.fetch();

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!checkerBan.get(member)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4210" })
            .setDescription(`El usuario mencionado actualmente no esta baneado.`)
            ]
        })
    } else try {
        await message.guild.members.unban(member.id, reason)
        message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`<@${member}> ha sido desbaneado del servidor correctamente.`)
            .addField("Informacion desbaneo", `Razón del desbaneo: ${reason}
Moderador propietario: ${message.author}
Fecha del desbaneo: <t:${Math.ceil(new Date() / 1000)}:R>`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3711" })
            .setDescription("Ha ocurrido un error al intentar desbanear al miembro.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}