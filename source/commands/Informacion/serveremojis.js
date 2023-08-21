const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "serveremojis",
    usage: "serveremojis | emojis <No ARGS>",
    aliases: ["emojis"],
    cooldown: 2,
    example: "serveremojis | emojis <No ARGS>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "",
    async run(client, message, args, prefix) {
   try {
    let normal;
    let animated;
    let collector;

    if(!message.guild.emojis.cache.size) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5492" })
            .setDescription(`${message.guild.name} no tiene emotes personalizados.`)
            ]
        })
    } else {
        collector = await message.guild.emojis.cache.map((emo) => `\`\`\`${emo.name} | ${emo.id} | ${emo.available ? "Disponible." : "No Disponible."} | ${emo.animated ? "Animado." : "No Animado."}\`\`\``).join("\n")

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Lista de emotes/emojis de ${message.guild.name}` })
            .setDescription(`${collector}`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}