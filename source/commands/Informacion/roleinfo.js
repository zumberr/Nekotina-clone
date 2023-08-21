const moment = require("moment")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "roleinfo",
    usage: "roleinfo | role <@role | roleID>",
    aliases: ["role"],
    cooldown: 0,
    example: "roleinfo | role @Owner",
    ownerOnly: false,
    UserPerms: ["MANAGE_ROLES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGA_ROLES"],
    description: "Obtener información sobre algun rol.",
    async run(client, message, args, prefix) {
   try {
    let role;

    if(args[0]) {
        role = message.mentions.roles.first() || await message.guild.roles.fetch(args[0]).catch(e => {
            return;
        });
    } else {
        return;
    };

    if(!role) return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Error Code: 2178" })
        .setDescription("No se ha proporcionado la ID o la mencionado del rol. \n\nUso correcto del comando: \n` roleinfo | role <@role | roleID> `")
        ])
    })

    const mentionable = {
        false: "No.",
        true: "Sí."
    }

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Información de: ${role.name}`})
        .addField("Información General", `Nombre del rol: ${role.name}
Miembros con el rol: ${role.members.size}
Identificación del rol: ${role.id}`)

        .addField("Permisos del rol", `${role.permissions.toArray().join(" ")}`)

        .addField("Información Extra", `Numero de posición del rol: ${role.rawPosition}
Color del rol mencionado: ${role.hexColor}
Aceptación de la mención: ${mentionable[role.mentionable]}
Fecha de creación del rol: ${moment(role.createdTimestamp).format("DD-MM-YYYY, h:mm:ss A")}`)
        ]
    })
   } catch (error) {
        return console.log(`${error} || ${this.name}`)
        }
    }
}