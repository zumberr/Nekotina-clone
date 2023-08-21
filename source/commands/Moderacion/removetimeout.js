const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removetimeout",
    usage: "removetimeout | rtt <@member | memberID> <Opcional | Razón>",
    aliases: ["rtt"],
    cooldown: 0,
    example: "removetimeout | rtt @zumber#1610",
    ownerOnly: false,
    UserPerms: ["MUTE_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MUTE_MEMBERS"],
    description: "Des-silenciar a un usuario especificó.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let timeoutReason;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    timeoutReason = await args.slice(1).join(" ") || "No se ha proporcionado la razón";
    
    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID del miembro.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!member.isCommunicationDisabled()) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7811" })
            .setDescription("El miembro actualmente no esta muteado.")
            ]
        })
    } else try {
        await member.timeout(null, timeoutReason)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Se ha eliminado el timeout al miembro correctamente" })
            .setDescription(`Miembro DisableTimeout: ${member}
Razon del DisableTimeout: ${timeoutReason}
Moderador propietario: ${message.author}
Fecha de Ejecución del DisableTimeout: <t:${Math.floor(Date.now() / 1000)}:R>`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1621" })
            .setDescription("No se ha podido eliminar el tiempo.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}