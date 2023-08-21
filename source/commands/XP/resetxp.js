const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "resetxp",
    usage: "resetxp | rxp <@member | memberID>",
    aliases: ["rxp"],
    cooldown: 2,
    example: "resetxp | rxp <@Discord#0000 | 1234567890>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Resetear el XP de usuario mencionado.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let xpranker = await client.database.get(`xprank_${message.guild.id}`);

    if(xpranker === true) {
        member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!member) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3662" })
                .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else try {
            client.database.delete(`xp_${message.guild.id}_${member.id}`)
    
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `El perfil de ${member.user.tag} ha recibido cambios` })
                .setDescription(`${message.member} le ha restablecido el XP al usuario ${member}`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4614" })
                .setDescription("Ha ocurrido un error al intentar restablecer el XP del usuario mencionado.")
                ]
            })
        }
    } else {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3914" })
            .setDescription("El sistema de XP esta desactivado actualmente en el servidor.")
            ]
        })
    }
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}