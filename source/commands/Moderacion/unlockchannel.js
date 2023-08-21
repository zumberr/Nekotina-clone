const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "unlockchannel",
    usage: "unlockchannel | lock <#channel | channelID> ",
    aliases: ["unlock"],
    example: "unlockchanel | unlock #server-rules",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Desbloquear un canal en especificó.",
    async run(client, message, args, prefix) {
    try {
    let time;
    let channel;
    let channelCheck;
    let channelBlockReason;
    
    time = message.createdAt;
    channel = await message.mentions.channels.first() || message.guild.channels.cache.get() || client.channels.cache.get(args[0]);
    channelCheck = channel?.permissionsFor(message.guild.roles.everyone).has("SEND_MESSAGES");
    channelBlockReason = args.slice(1).join(" ");

    if(!channel) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2976" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(channelCheck) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2328" })
            .setDescription(`El canal actualmente desbloqueado.`)
            ]
        })
    } else {
        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
            SEND_MESSAGES: true,
        }).then(() => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se ha desbloqueado ${channel} correctamente.`)
                .addField("Información Extra", `Razón del bloqueo: ${channelBlockReason || "No se ha proporcionado la razón."}
Tiempo del bloqueo: <t:${Math.floor(time / 1000)}:R>`)
                ]
            })
        }).catch(() => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 2947" })
                .setDescription(`No se ha podido encontrar el canal mencionado.`)
                ]
            })
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}