const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "suggestion",
    usage: "suggestion | suggest <contenido>",
    aliases: ["suggest"],
    cooldown: 0,
    example: "suggestion | suggest Agregar mas canales de Diversión.",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL"],
    description: "Hacer una sugerencia para el servidor.",
    async run(client, message, args, prefix) {
   try {
    let channel;
    channel = await db.get(`suggestion_${message.guild.id}`)

    if(channel === null) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5678" })
            .setDescription(`No se ha proporcionado en la configuración del cliente, el canal de sugerencias del servidor, debe de agregar el canal para poder realizar sugerencias publicas.`)
            ])
        })
    }

    if(!args[0]) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4654" })
            .setDescription(`No se ha proporcionado el contenido de la sugerencia.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else {
        message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Se ha enviado tu sugerencia correctamente.")
            ])
        })
        const result = new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `${message.author.tag} ha hecho una nueva sugerencia.`})
        .setDescription(`${args.slice(0).join(" ")}`)

        client.channels.cache.get(channel).send({ embeds: [result] })
    }
   } catch(error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}