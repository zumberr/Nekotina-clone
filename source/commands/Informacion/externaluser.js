const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "externaluser",
    usage: "externaluser | extuser <memberID>",
    aliases: ["extuser"],
    cooldown: 2,
    example: "externaluser | extuser <ID>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener informacion de usuarios los cuales no estan en el servidor.",
    async run(client, message, args, prefix) {
   try {
    let member, banner;
    member = await client.users.fetch(args[0])

    async function getUserBannerUrl(userId) {
        const user = await client.users.fetch(userId);
        return user.banner ? `https://cdn.discordapp.com/banners/${userId}/${user.banner}.${user.banner.startsWith("a_") ? "gif" : "png"}?size=4096` : null;
    }
    banner = await getUserBannerUrl(member.id, {
        dynamic: true,
        size: 4096
    })
    
    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Información de ${member.tag}` })
            .setThumbnail(`${member.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })}`)
            .setDescription(`Nombre del usuario: ${member.username}
Perfil/Cuenta de usuario: ${member}
Tipo de Cuenta de usuario: ${member.bot ? "Bot de Discord." : "Miembro de Discord."}
Discriminador del usuario: #${member.discriminator}
Identificación/ID del usuario: ${member.id}
Cuenta del Sistema de Discord: ${member.system ? "Cuenta Administrada por Discord." : "Cuenta Administrada por un Usuario."}
            
**Emblemas del usuario**
${member.flags?.toArray().join(", ") || "El usuario no tiene emblemas."}
            
**Información secundaria**
Avatar del usuario: [Click Aquí](${member.displayAvatarURL({ dynamic: true, format: "png", size: 4096 })})
Banner del usuario: ${banner ? `[Click Aquí](${banner})` : "El usuario no tiene un banner personalizado."}
Fecha de Creación del usuario: <t:${Math.floor(member.createdTimestamp / 1000)}:R>`)
            ]
        })
    } catch(error) {
        console.error(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1152" })
            .setDescription("No se ha podido encontrar el usuario.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}