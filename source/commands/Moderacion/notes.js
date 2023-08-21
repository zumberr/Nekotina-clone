const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "notes",
    usage: "notes <@member | memberID>",
    aliases: [""],
    cooldown: 2,
    example: "notes <@Discord#0000 | 1234567890>",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la lista de notas del usuario mencionado.",
    async run(client, message, args, prefix) {
   try {
    let member, note_system, array, count;
    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    note_system = await client.database.get(`notes_${message.guild.id}_${member.id}`);
    array = [];
    count = 0;

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!note_system) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6135" })
            .setDescription(`${member} No tiene ninguna nota actualmente.`)
            ]
        })
    } else {
        while(count < note_system.length) {
            if(note_system[count] !== null) {
            array.push([`Numero de nota: ${note_system[count].noteID}\nRazón de la nota: ${note_system[count].content}\nModerador propietario de la nota: <@${note_system[count].moderator}>\nFecha de creación de la nota: <t:${note_system[count].timestamp}:R>`].join(""));
            count = (count + 1)
            }
        }
    }

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Lista de notas de ${member.user.tag}` })
        .setDescription([`${array.join("\n\n")}`].join(""))
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}