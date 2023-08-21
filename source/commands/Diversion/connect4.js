const { ConnectFour } = require("../../monitors/connect4")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "connect4",
    usage: "connect4 <@member | memberID>",
    aliases: [""],
    cooldown: 2,
    example: "connect4 <@Discord#0000 | 1234567890>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Conecta 4 puntos y ganas.",
    async run(client, message, args, prefix) {
   try {
    let member;
    member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(member.id === message.author.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7514" })
            .setDescription("No puedes jugar Connect4 contigo.")
            ]
        })
    } else if(member.user.bot) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7531" })
            .setDescription("No puedes jugar contra un bot de Discord.")
            ]
        })
    } else try {
        new ConnectFour({
            message: message,
            player1: message.author,
            player2: member,
        }).start()
    } catch(error) {
        console.error(error.stack)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6724" })
            .setDescription("Ha ocurrido un error al intetar crear la partida.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}