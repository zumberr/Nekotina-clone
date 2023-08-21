const { Client, Message, MessageEmbed } = require("discord.js")
const status = { "GUILD_TEXT": "Canal de texto.", "GUILD_VOICE": "Canal de voz.", "false": "Desactivado.", "true": "Activado."}

module.exports = {
    name: "channelinfo",
    usage: "channelinfo | channel <#channel | channelID | Optional>",
    aliases: ["channel"],
    cooldown: 2,
    example: "channel #server-rules",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_CHANNELS"],
    description: "Obtener información de algun canal de texto/voz.",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    async run(client, message, args, prefix) {
   try {
    let channel;
    channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || client.channels.cache.get() || message.channel;
    
    await channel.fetchInvites().then(invites => {
    if(!channel.isVoice()) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Nombre del canal: ${channel.name}`})
            .setDescription(`Descripción del canal: ${channel.topic || "No se ha proporcionado una descripción."}
Identificación del canal: ${channel.id}
Fecha de creación del canal: <t:${Math.floor(channel.createdTimestamp / 1000)}:R>
Tipo de canal NSFW: ${status[channel.nsfw]}
Tipo de canal mencionado: ${status[channel.type]}
Invitaciones del canal: ${invites.size} invitacion(es).`)
            ]
        })
    } else if(channel.isVoice()) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Nombre del canal: ${channel.name}` })
            .setDescription(`Identificación del canal: ${channel.id}
            Fecha de creación del canal: <t:${Math.floor(channel.createdTimestamp / 1000)}:R>
            Tipo de canal mencionado: ${status[channel.type]}`)
            ]
            })   
        }
    })
   } catch(error) {
        return console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}