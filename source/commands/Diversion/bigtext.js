const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "bigtext",
    usage: "bigtext | emfy <contenido>",
    aliases: ["text"],
    cooldown: 30,
    example: "bigtext | emfy Hello!",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Convierte tu texto en forma de emotes (Regional Indicators)",
    async run(client, message, args, prefix) {
   try {
    let content;
    let contentConvert;
    content = args.slice(0).join(" ");
    contentConvert = {
        '0': ':zero:',
        '1': ':one:',
        '2': ':two:',
        '3': ':three:',
        '4': ':four:',
        '5': ':five:',
        '6': ':six:',
        '7': ':seven:',
        '8': ':eight:',
        '9': ':nine:',
        '#': ':hash:',
        '*': ':asterisk:',
        '?': ':grey_question:',
        '!': ':grey_exclamation:',
        ' ': '   '
    }

    if(!content) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3052" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        const translater = content.toLowerCase().split("").map(letter => {
            if(/[a-z]/g.test(letter)) {
                return `:regional_indicator_${letter}:`
            } else if (contentConvert[letter]) {
                return `${contentConvert[letter]}`
            }
            
            return letter;
        }).join("");
    
        return message.reply({ content: translater })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}