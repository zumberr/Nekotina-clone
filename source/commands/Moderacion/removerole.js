const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removerole",
    usage: "removerole | ar <@member | memberID> <@role | roleID> <Opcional | Razón>",
    aliases: ["rr"],
    cooldown: 0,
    example: "removerole | ar @usuario#1212 @Owner XDD",
    ownerOnly: false,
    UserPerms: ["MANAGE_ROLES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Quitarle un rol a un usuario en especifico.",
    async run(client, message, args, prefix) {
    try {
    let role;
    let member;
    let roleReason;
    let clientPosition;

    member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])

    roleReason = args[2];
    clientPosition = message.guild.me.roles.highest.position;

    if(!member) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else if(!role) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3663" })
            .setDescription(`No se ha proporcionado la mención/ID del rol\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else if(!member.roles.cache.get(role.id)) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4679" })
            .setDescription("No puedo quitarle el rol ya que no tiene el rol.")
            ])
        })
    } else if(clientPosition > role) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3985" })
            .setDescription("No puedo quitarle el rol al miembro porque el rol es mal alto que el mio.")
            ])
        })
    }

    await member.roles.remove(role) 
    
    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Se le ha removido el rol ${role} al usuario ${member}\nRazón del remove: ${roleReason || "No se ha proporcionado la razón."}`)
        ])
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}