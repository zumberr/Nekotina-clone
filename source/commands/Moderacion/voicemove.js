const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "voicemove",
    usage: "voicemove | vcmove",
    aliases: ["vcmove"],
    cooldown: 3,
    example: "voicemove | vcmove",
    ownerOnly: false,
    UserPerms: ["MOVE_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MOVE_MEMBERS"],
    description: "Mover miembros de algun canal de voz a otro canal de voz.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let channel;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4427" })
            .setDescription(`No se ha proporcionado la mención/ID del miembro.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!channel) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4637" })
            .setDescription(`No se ha proporcionado la mención/ID del canal de voz.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        await member.voice.setChannel(channel)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`${member} ha sido movido a ${channel}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5084" })
            .setDescription(`Ha ocurrido un error al mover al miembro al canal mencionado.`)
            ]
        })
    }
    } catch (error) {
      console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}

// else if(!!channel.type == "GUILD_VOICE") {
//     return message.reply({
//         embeds: [new MessageEmbed()
//         .setColor("#fbd9ff")
//         .setAuthor({ name: "Error Code: 5339" })
//         .setDescription("El canal mencionado no es un canal de voz, por lo tanto, no se puede mover al miembro.")
//         ]
//     })
// }