const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "snipe",
    usage: "snipe <#channel | channelID | MessageChannel>",
    aliases: [""],
    example: "snipe <#general> | 1234567890 | MessageChannel>",
    ownerOnly: false,
    UserPerms: ["MANAGE_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"],
    description: "Obtener una imágen o un mensaje borrado de algun canal.",
    async run(client, message, args, prefix) {
    try {
    let channel, deleted;
    channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    deleted = client.snipes.get(channel.id);
    
    if(!deleted) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5881" })
            .setDescription(`No hay mensajes eliminados eliminados recientemente en este canal.`)
            ]
        })
    } else try {
        const snipe = new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`Autor del mensaje eliminado: ${deleted.author}
Contenido del mensaje eliminado: ${deleted.content || "El mensaje eliminado no tiene contenido."}
Mensaje eliminado hace: <t:${deleted.timestamp}:R>`)
        .setFooter('© Sally snipe')
        if(deleted.image) snipe.setImage(deleted.image);
        return message.reply({ embeds: [snipe] });
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7712" })
            .setDescription("Ha ocurrido un error al intentar obtener los mensajes eliminados.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}