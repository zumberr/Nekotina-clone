const database = require("quick.db");
const client = require("../main");
const { MessageEmbed } = require("discord.js")
/// sistema de logs
client.on("guildMemberRemove", async (member) => {
    let subchannel = await database.get(`clientlogs_${member.guild.id}`)
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
    if(subchannel === null) return;
    else try {
        client.channels.cache.get(subchannel).send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
            .setAuthor({ name: "Un usuario se ha salido del servidor" })
            .setDescription(`${member} ha salido del servidor.\n**Información del Usuario**\nIdentificación/ID del usuario: ${member.id}\nFecha de creación de la cuenta: <t:${Math.floor(member.user.createdAt / 1000)}:R>`)
            ]
        })
    } catch(error) {
        console.log(error)
        return;
    }
})

//// sistema de salidas

