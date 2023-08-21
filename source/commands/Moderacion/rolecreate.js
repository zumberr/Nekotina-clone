const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "rolecreate",
    usage: "rolecreate | rolec <role_name> <Opcional | Razón>",
    aliases: ["rolec"],
    cooldown: 0,
    example: "rolecreate | rolec Moderador",
    ownerOnly: false,
    UserPerms: ["MANAGE_ROLES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    description: "Crear un rol personalizado directamente desde el Cliente.",
    async run(client, message, args, prefix) {
   try {
    let rolename, rolereason, rolecreate;
    rolecreate = args.join(" ").split("||");
    rolename = rolecreate[0];
    rolereason = rolecreate.slice(1).join(" ");

    if(!rolename) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3061" })
            .setDescription(`No se ha proporcionado el nombre del rol.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        await message.guild.roles.create({
            name: rolename,
            reason: rolereason,
        }).then((role) => {
            message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se ha creado el rol en la lista de roles del servidor correctamente.`)
                .addField("Información del rol", `Nombre del rol creado: ${rolename}
Mención del rol creado: ${role}
Razón de la creación del rol: ${rolereason}
Moderador propietario creador: ${message.author}
Fecha de creación del rol: <t:${Math.ceil(new Date() / 1000)}:R>`)
                ]
            })
        }).catch(() => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4413" })
                .setDescription("No se ha podido crear el rol en el servidor.")
                ]
            })
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3369" })
            .setDescription("Ha ocurrido un error al crear el rol.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}