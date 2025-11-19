const database = require("quick.db");
const client = require("../main");
const { MessageEmbed } = require("discord.js")

client.on("messageDelete", async (message) => {
    let subchannel = await database.get(`clientlogs_${message.guild.id}`);
   //if(message.member.id === client.user.id) return;
   // else
        if(subchannel === null || subchannel === undefined || !subchannel) return;
    else try {
        client.channels.cache.get(subchannel).send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Se ha eliminado un mensaje en ${message.channel.name}` })
            .setDescription(`Contenido del mensaje: ${message.content || "El formato del contenido no es válido"}`)
            .addField("Información Extra", `Autor del mensaje: ${message.member}\nIdentificación del mensaje: ${message.id}\nFecha de envio del mensaje: ${message.createdAt} || <t:${Math.floor(message.createdAt / 1000)}:R>`)
                     .setFooter('© Sally logs')
            ]
        })
    } catch(error) {
        return;
    }
})