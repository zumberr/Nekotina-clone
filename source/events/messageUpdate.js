const database = require("quick.db");
const client = require("../main");
const { MessageEmbed } = require("discord.js")

client.on("messageUpdate", async (oldMessage, newMessage, message, user) => {
    const channel = oldMessage.mentions.channels.first() || oldMessage.guild.channels.cache.get() || oldMessage.channel;
    client.esnipes.set(channel.id, {
        url: oldMessage.url,
        oldContent: oldMessage.content,
        newContent: newMessage.content,
      //  author: newMessage.member.user.tag,
        image: oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null,
        timestamp: Math.floor(newMessage.editedTimestamp / 100000)
    })
    let subchannel = await database.get(`clientlogs_${oldMessage.guild.id}`)

    //if(newMessage.member.id === client.user.id) return;
    if(client.user.id) return;
    else if(subchannel === null || subchannel === undefined) return;
    else try {
        await client.channels.cache.get(subchannel).send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Se ha editado un mensaje en ${oldMessage.channel.name}`, url: `${oldMessage.url}` })
            .setDescription(`Antiguo contenido del mensaje: ${oldMessage.content || "El formato del contenido no es válido"}\nNuevo contenido del mensaje: ${newMessage.content || "El formato del contenido no es válido"}`)
            .addField("Información Extra", `Autor del mensaje: ${oldMessage.member}\nIdentificación del mensaje: ${oldMessage.id} | ${newMessage.id}\nFecha de envio del mensaje: ${oldMessage.createdAt} || <t:${Math.floor(oldMessage.createdAt / 10000)}:R>`)
                     .setFooter('© Lenita logs')
            ]
        })
    } catch(error) {
        return;
    }
})