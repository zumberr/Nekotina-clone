const { inspect } = require("util")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "eval",
    usage: "eval <String Evaled>",
    aliases: [""],
    cooldown: 0,
    example: "eval message",
    ownerOnly: true,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "JavaScript Eval",
    async run(client, message, args, prefix) {
   try {
    let code, evaled, filter;
    code = args.slice(0).join(" ");
    filter = ["token", "destroy", "process.exit()"]

    if(!code) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3114" })
            .setDescription("No se ha proporcionado el codigo para evaluar.")
            ]
        })
    } else if(filter.some((fl) => message.content.toLowerCase().includes(fl))) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Ehh, no.")
            ]
        })
    } else try {
        evaled = eval(code);

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "JavaScript Eval" })
            .setDescription(`**Tipo**
            \`\`\`js\n${typeof(evaled)}\`\`\`
            **Input**
            \`\`\`js\n${code}\`\`\`
            **Output**
            \`\`\`js\n${inspect(evaled, { depth: 0 })}\`\`\``)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`\`\`\`js\n${error}\`\`\``)
            ]
        })
    }
   } catch(error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}