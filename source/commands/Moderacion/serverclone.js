const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "serverclone",
    usage: "serverclone | svclone <No Args>",
    aliases: ["svclone"],
    cooldown: 2,
    example: "serverclone | svclone <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Clonar el servidor actual",
    async run(client, message, args, prefix) {
   try {
    try {
        (await message.guild.createTemplate(message.guild.name)).sync().then((req) => {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Template URL: \`\`\`${req.url}\`\`\`\nTemplate Code: \`\`\`${req.code}\`\`\``)
                ]
            })
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6471" })
            .setDescription("Actualmente ya existe un template en el servidor.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}