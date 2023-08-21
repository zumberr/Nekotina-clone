const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "remindlist",
    usage: "remindlist | remindl <@member | memberID | MessageMember>",
    aliases: ["remindl"],
    cooldown: 3,
    example: "remindlist | remindl <@Discord#0000 | 1234567890>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la lista de recordatorios activos.",
    async run(client, message, args, prefix) {
   try {
    let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let fetch = await database.get(`remind_${message.guild.id}_${member.id}`)
    let remindArray = []
    let remindCount = 0;

    if(!fetch) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6612" })
            .setDescription(`${member} no tiene recordatorios activos.`)
            ]
        })
    } else try {
        while(remindCount < fetch.length) {
            if(fetch[remindCount] !== null) {
                remindArray.push([`Numero de recordatorio: ${fetch[remindCount].remindId}\nTiempo del recordatorio: ${fetch[remindCount].remindTime}\nRazón del recordatorio: ${fetch[remindCount].remindReason}\nFecha de creación del recordatorio: <t:${fetch[remindCount].timestamp}:R>`].join(""))
                remindCount = (remindCount + 1);
            }
        }

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Lista de recordatorios de: ${member.user.tag}` })
            .setDescription(`${remindArray.join("\n\n")}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3712" })
            .setDescription("Ha ocurrido un error al intentar buscar la lista de recordatorios activos del usuario.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}