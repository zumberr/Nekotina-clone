const { MessageEmbed, MessageAttachment } = require("discord.js");

module.exports = {
    name: "screenshot",
    usage: "screenshot | ss <URL>",
    aliases: ["ss"],
    cooldown: 2,
    example: "screenshot | ss <https://discord.com/>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Tomarle una \"screenshot\" a una pagina web.",
    async run(client, message, args, prefix) {
   try {
    let direction = args[0];
    let request = new MessageAttachment(`https://api.popcat.xyz/screenshot?url=${direction}`, "screenshot.png")

    if(!direction) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5341" })
            .setDescription(`No se ha proporcionado la dirección web.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se recopila la información sobre la pagina web.`)
            ]
        }).then((m) => {
            return m.edit({ files: [request], embeds: [] }) 
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6712" })
            .setDescription(`Ha ocurrido un error al intentar recopilar la información o la dirección web proporcionado no es válida.`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}