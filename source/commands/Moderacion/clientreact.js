const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "clientreact",
    usage: "clientreact | react",
    aliases: ["react"],
    cooldown: 30,
    example: "clientreact | react",
    ownerOnly: false,
    UserPerms: ["ADD_REACTIONS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"],
    description: "Añadir una reacción del cliente a algun mensaje.",
    async run(client, message, args, prefix) {
   try {
    let messageID;
    let emojiName;
    messageID = args[0];
    emojiName = await message.guild.emojis.cache.find((emote) => emote.name === args[1]);

    if(!messageID) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2340" })
            .setDescription(`No se ha proporcionado la ID del mensaje.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!emojiName) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2151" })
            .setDescription(`No se ha proporcionado el nombre del emote.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(isNaN(emojiName)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4695" })
            .setDescription(`El nombre que se ha proporcionado no es válido.`)
            ]
        })
    } else try {
        let messageReact = await message.channel.messages.fetch(messageID);
        await messageReact.react(emojiName);

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Reaccion ejecutada correctamente", url: `${messageReact.url}`  })
            .setDescription("Se ha reaccionado al mensaje correctamente.")
            .addField("Información del Mensaje", `Autor del mensaje: ${messageReact.author}
Contenido del mensaje: ${messageReact.content}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7391" })
            .setDescription("No se ha podido encontrar el mensaje.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}