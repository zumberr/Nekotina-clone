const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "clientdm",
    usage: "clientdm | direct <@member | memberID> <contenido>",
    aliases: ["direct"],
    example: "clientdm | direct @Zumber#1610 Hello",
    ownerOnly: true,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Enviar un mensaje directo a un usuario con un mensaje en especificó.",
    async run(client, message, args, prefix) {
    try {
    let member, content;
    member = await message.mentions.members.first() || message.guild.members.cache.get() || client.users.cache.get(args[0]);
    content = args.slice(1).join(" ");

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!content || content.length < 1) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4578" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(member.id === client.user.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3487" })
            .setDescription(`No puedes enviarme un mensaje directo.`)
            ]
        }) 
    } else {
        await member.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Te han enviado un mensaje directo desde ${message.guild.name}.\n\nMiembro del mensaje directo: ${message.author}\nContenido del mensaje directo: \`\`\`${content}\`\`\``)
            ]
        }).then(() => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se ha enviado tu mensaje directo al usuario correctamente.`)
                ]
            })
        }).catch(() => {            
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 1461" })
                .setDescription("No se ha podido enviar el mensaje directo correctamente.\nPosiblemente el usuario tenga los mensajes directos desactivados.")
                ]
            })
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}