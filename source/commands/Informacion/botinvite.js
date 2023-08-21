const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "botinvite",
    usage: "botinvite | invite <@member | memberID | ClientMessage>",
    aliases: ["invite"],
    cooldown: 2,
    example: "botinvite | invite <Vacio | @GearBot#7326 | 467298041863602186>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la invitación del BOT.",
    async run(client, message, args, prefix) {
   try {
    return message.reply({
        embeds: [
            new MessageEmbed()
            .setColor("#fbd9ff")
            .setThumbnail(client.user.displayAvatarURL({ format: "png", size: 4096 }))
            .setAuthor({ name: "Invitación de Lena" })
            .setDescription(`Nombre de usuario del cliente: ${client.user.username}
Identificación del cliente: ${client.user.id}
Link/URL de mi invitacion : [Click Aquí](https://discord.com/api/oauth2/authorize?client_id=952045576776720425&permissions=0&scope=bot)`)
        ]
    })
   } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}