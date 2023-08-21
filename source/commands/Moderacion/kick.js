const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "kick",
    usage: "kick <@member | memberID> <Opcional | Razón>",
    aliases: [""],
    example: "kick @usuario",
    ownerOnly: false,
    UserPerms: ["KICK_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "KICK_MEMBERS"],
    description: "Kickear a un usuario del servidor en especifico.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let reason;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    reason = args.slice(1).join(" ") || "No se ha proporcionado la razón.";

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4019" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(message.author.id === member.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3186" })
            .setDescription("No puedes kickearte a ti mismo.")
            ]
        })
    } else if(member.id === client.user.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2082" })
            .setDescription("No puedes kickearme.")
            ]
        })
    } else if(message.member.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4106" })
            .setDescription("El miembro mencionado tiene un rol superior o igual al tuyo.")
            ]
        })
    } else if(message.guild.me.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5859" })
            .setDescription("El miembro mencionado tiene un rol superior o igual al mio.")
            ]
        })
    } else if(!member.kickable) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3909" })
            .setDescription("Ha ocurrido un error al kickear al usuario.")
            ]
        })
    } else if(member.id === message.guild.ownerId) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4691" })
            .setDescription("No puedes kickear al creador/dueño del servidor.")
            ]
        })
    } else {
        await member.kick({ reason: reason }).then(() => {
            member.send({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Has sido kickeado de ${message.guild.name}.`)
                .addField("Información del Kickeo", `Moderador propietario: ${message.author}\nFecha de creación del Kickeo: <t:${Math.floor(Date.now() / 1000)}:R>`)
                ]
            })
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${member} ha sido kickeado del servidor correctamente.`)
                .addField("Información del Kickeo", `Miembro del Kickeo: ${member}
Razón del Kickeo: ${reason}
Moderador propietario: ${message.author}
Fecha de creación del Kickeo: <t:${Math.floor(Date.now() / 1000)}:R>`)
                ]
            })
        }).catch((error) => {
            console.error(error)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5412" })
                .setDescription("Ha ocurrido un error al intentar kickear al usuario mencionado.")
                ]
            })
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}