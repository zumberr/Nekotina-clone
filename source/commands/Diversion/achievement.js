const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "achievement",
    usage: "achievement | at <contenido>",
    aliases: ["at"],
    cooldown: 0,
    example: "achievement | at Hello",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear un logro de Minecraft personalizado.",
    async run(client, message, args, prefix) {
    try {
    let word;
    word = args.slice(0).join(" ");

    if(!word) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5260" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else if(word) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Has conseguido un nuevo logro!")
            .setImage(`https://minecraftskinstealer.com/achievement/20/Logro%20Obtenido!/${encodeURIComponent(word)}`)
            ])
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}