const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "addnotes",
    usage: "addnotes | addnt <@member | memberID> <contenido de la nota>",
    aliases: ["addnt"],
    cooldown: 2,
    example: "addnotes | addnt <@Discord#0000 | 1234567890> <No.>",
    ownerOnly: false,
    UserPerms: ["BAN_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Agregar notas a un usuario en especifico.",
    async run(client, message, args, prefix) {
   try {
    let member, note_content, note_system;
    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    note_content = args.slice(1).join(" ");
    note_system = await client.database.get(`notes_${message.guild.id}_${member.id}`);

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!note_content) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7841" })
            .setDescription(`No se ha proporcionado la nota.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        if(!note_system) {
            note_system = []
        }

        note_system = client.database.push(`notes_${message.guild.id}_${member.id}`, {
            noteID: note_system.length + 1,
            content: note_content,
            moderator: message.author.id,
            timestamp: Math.floor(Date.now() / 1000)
        })

        await client.database.set((`notes_${message.guild.id}_${member.id}`), note_system)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`La nota de ${member} ha sido guardada en la base de datos del servidor correctamente.`)
            .addField("Información de la nota", `Contenido de la nota: ${note_content}\nModerador encargado: ${message.author}\nFecha de Creación de la nota: <t:${Math.floor(Date.now() / 1000)}:R>`)
            ]
        })
    } catch(error) {
        console.error(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7665" })
            .setDescription("Ha ocurrido un error al intentar agregarle la nota al usuario.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}