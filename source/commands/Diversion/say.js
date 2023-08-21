const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "say",
    usage: "say ] sy <#channel | channelID | MessageChannel> <contenido>",
    aliases: ["sy"],
    cooldown: 19,
    example: "say | sy <#general | 1234567890 | null> Hello.",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "El bot dice lo que tu quieras en formato Message Classic.",
    async run(client, message, args, prefix) {
    try {
    let channel, request;
    channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
    request = args.slice(1).join(" ") || args.slice(0).join(" ");

    return channel.send({ content: `${request}`})
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}