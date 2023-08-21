const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "poll",
    usage: "poll <contenido>",
    aliases: [""],
    cooldown: 0,
    example: "poll ¿Deberia añadir un canal de memes?",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear encuestas personalizadas en el Servidor.",
    async run(client, message, args, prefix) {
   try {
    let channel;
    let content;
    channel = await database.get(`channelpoll_${message.guild.id}`)
    content = args.slice(0).join(" ");

    if(channel === null) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4479" })
            .setDescription(`No se ha proporcionado en la configuración del cliente, el canal de encuestas del servidor, debe de agregar el canal para poder realizar encuestas.`)
            ]
        })
    } else if(!content) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2305" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        client.channels.cache.get(channel).send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`${content}`)
            ]
        }).then(async function(message) {
            message.react("✅");
            message.react("❎");
        }).catch(() => {
            return;
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5283" })
            .setDescription("Ha ocurrido un error al crear la encuesta en el canal.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}