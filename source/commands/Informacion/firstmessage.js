const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "firstmessage",
    usage: "firstmessage | fmsg <#channel | channelID | MessageChannel>",
    aliases: ["fmsg"],
    cooldown: 5,
    example: "firstmessage | fmsg #server-rules",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información del primer mensaje de algun canal.",
    async run(client, message, args, prefix) {
   try {
    let channel;
    let messageFetched;
    let mesageFetchedResult;
    channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    messageFetched = await channel.messages.fetch({ after: 1, limit: 1 });
    mesageFetchedResult = messageFetched.first();

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Primer mensaje de: ${channel.name}`, url: `${mesageFetchedResult.url}` })
        .setDescription(`Contenido del mensaje: ${mesageFetchedResult.content || "El mensaje no es válido."}`)
        .addField("Información Extra", `Autor del mensaje: ${mesageFetchedResult.author}\nIdentificación del mensaje: ${mesageFetchedResult.id}\nFecha de envio del mensaje: ${mesageFetchedResult.createdAt.toLocaleDateString()}`)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}