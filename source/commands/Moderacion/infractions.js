const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "infractions",
    usage: "infractions | inf <@member | memberID> <Opcional | InfractionID> ",
    aliases: ["inf"],
    cooldown: 0,
    example: "infractions | inf @usuario",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre las infraccionés de algun usuario.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let infraction;
    let infractionList;
    let infractionCount = 0;

    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    infraction = await database.get(`warn_${message.guild.id}_${member.id}`);
    infractionList = [];

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4541" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!infraction) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4303" })
            .setDescription(`${member} No tiene ninguna infracción actualmente.`)
            ]
        })
    } else {
        while(infractionCount < infraction.length) {
            if(infraction[infractionCount] !== null) {
            infractionList.push([`Numero de Infracción: ${infraction[infractionCount].infractionID}\nTipo de infracción: ${infraction[infractionCount].type}\nRazón de la infracción: ${infraction[infractionCount].reason}\nModerador propietario de la infracción: <@${infraction[infractionCount].moderator}>\nFecha de creación de la infracción: <t:${infraction[infractionCount].timestamp}:R>`].join(""));
            infractionCount = (infractionCount + 1)
            }
        }
    }

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Lista de infraccionés de ${member.user.tag}` })
        .setDescription([`${infractionList.join("\n\n")}`].join(""))
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}