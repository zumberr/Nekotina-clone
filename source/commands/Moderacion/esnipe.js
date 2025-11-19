const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "esnipe",
    usage: "esnipe <#channel | channelID | MessageChannel>",
    aliases: [""],
    cooldown: 2,
    example: "esnipe <#general | 1234567890 | Vacio>",
    ownerOnly: false,
    UserPerms: ["MANAGE_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"],
    description: "Obtener el contenido de algun mensaje editado.",
    async run(client, message, args, prefix) {
   try {
    let channel, edited;
    channel = message.mentions.channels.first(args[0]) || message.guild.channels.cache.get(args[0]) || message.channel;
    edited = client.esnipes.get(channel.id);

    if(!edited) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5881" })
            .setDescription(`No hay mensajes editados recientemente en este canal.`)
            ]
        })
    }  else try {
        const snipe = new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Link/URL del mensaje editado: [Click Aquí](${edited.url})
Autor del mensaje editado: ${edited.author}
Antiguo contenido del mensaje editado: ${edited.oldContent || "El formato del mensaje no es valido."}
Nuevo contenido del mensaje editado: ${edited.newContent || "El formato del mensaje no es valido."}
Mensaje editado hace: <t:${edited.timestamp}:R>`)
         .setFooter('© Sally snipe')
        if(edited.image) snipe.setImage(edited.image);
        return message.reply({ embeds: [snipe] });
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7712" })
            .setDescription("Ha ocurrido un error al intentar obtener los mensajes editados de este canal.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}