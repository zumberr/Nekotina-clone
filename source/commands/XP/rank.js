const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "rank",
    usage: "rank <@member | memberID | MessageMember>",
    aliases: [""],
    cooldown: 2,
    example: "rank <@Discord#0000 | 1234567890 | null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Mostrar el rango de clasificación de alguna usuario del servidor.",
    async run(client, message, args, prefix) {
   try {
    let member, level, current, xpNeed;
    let xpranker = await client.database.get(`xprank_${message.guild.id}`);

    if(xpranker === true) {
        member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;        
        level = await client.database.fetch(`level_${message.guild.id}_${member.id}`) || 0;
        current = await client.database.fetch(`xp_${message.guild.id}_${member.id}`) || 0;
        xpNeed = level * 500 + 500;
        
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Clasificación de: ${member.user.tag}` })
            .addField("XP de Clasificación", `${current}/${xpNeed} xp`)
            .addField("Nivel de Clasificación", `Nivel ${level}`)
            ]
        })
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
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}