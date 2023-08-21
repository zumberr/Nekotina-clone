const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removenotes",
    usage: "removenotes | removent <@member | memberID>",
    aliases: ["removent"],
    cooldown: 2,
    example: "removenotes | removent <@Discord#0000 | 1234567890>",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Eliminar/remover la notas del usuario.",
    async run(client, message, args, prefix) {
   try {
    let member, notes;
    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    notes = await client.database.get(`notes_${message.guild.id}_${member.id}`);

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!notes || notes === undefined || notes === null) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7613" })
            .setDescription(`${member} no tiene ninguna nota actualmente.`)
            ]
        })
    } else try {
        client.database.delete(`notes_${message.guild.id}_${member.id}`)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se han eliminado todas las notas de ${member} correctamente.`)
            ]
        })
    } catch(error) {
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