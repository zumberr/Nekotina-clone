const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "roledelete",
    usage: "roledelete | roled <@role | roleID> <Opcional | Razón>",
    aliases: ["roled"],
    cooldown: 0,
    example: "roledelete | roled Moderador",
    ownerOnly: false,
    UserPerms: ["MANAGE_ROLES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    description: "Eliminar un rol desde el Cliente.",
    async run(client, message, args, prefix) {
   try {
    let rolename;       
    let rolereason;
    rolename = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    rolereason = await args.slice(1).join(" ") || "No se ha proporcionado una razón."

    if(!rolename) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3067" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
    await message.guild.roles.delete(rolename, rolereason)
        message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se ha removido el rol correctamente.`)
            .addField("Información del rol", `Razón de la eliminación: ${rolereason}`)
            ]
        })
    } catch(error) {
        console.log(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3370" })
            .setDescription("Ha ocurrido un error al eliminar el rol.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}