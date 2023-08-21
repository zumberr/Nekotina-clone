const { MessageEmbed, Message } = require("discord.js")

module.exports = {
    name: "unbanall",
    usage: "unbanall | ubanl <null>",
    aliases: ["ubanl"],
    cooldown: 2,
    example: "unbanall | ubanl <null>",
    ownerOnly: false,
    UserPerms: ["BAN_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
    description: "Desbanear a todos los usuarios baneados del servidor.",
    /**
     * @param {Message} message
     */
    async run(client, message, args, prefix) {
   try {
    await message.guild.bans.fetch().then((bans) => {
        if(!bans || bans.size === 0) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4687" })
                .setDescription("No hay baneados activos actualmente en la lista de baneados del servidor.")
                ]
            })
        } else try {
            bans.forEach(async (ban) => {
                await message.guild.members.unban(ban.user.id).then(() => {
                    return message.reply({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setDescription(`Se han desbaneado todos los usuarios en la lista de baneados del servidor correctamente, ahora ya ningun usuario de la lista de baneados esta baneado.`)
                        ]
                    })
                })
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4944" })
                .setDescription("Ha ocurrido un error al intentar desbanear a todos los usuarios del servidor.")
                ]
            })
        }
    })
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}