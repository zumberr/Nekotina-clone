const axios = require("axios").default;
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "translate",
    usage: "translate | ts <idioma> <contenido>",
    aliases: ["ts"],
    cooldown: 2,
    example: "translate | ts ja Hola!",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Traducir un mensaje a otro idioma.",
    async run(client, message, args, prefix) {
   try {
    let lang;
    let content;
    let request;
    let requestData;

    lang = args[0];
    content = args.slice(1).join(" ");
    request = await axios.get(`https://api.popcat.xyz/translate?to=${lang}&text=${content}`);
    requestData = request.data;

    if(!lang) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5395" })
            .setDescription(`No se ha proporcionado el idioma.\n\nUso correcto del comando: \n\` ${this.usage} \``)
            ])
        })
    } else if(!content) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5537" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando: \n\` ${this.usage} \``)
            ])
        })
    }

    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .addField("Mensaje no traducido", `\`\`\`js\n${content}\`\`\``)
        .addField("Idioma para traducir", `\`\`\`js\n${lang}\`\`\``)
        .addField("Mensaje traducido", `\`\`\`js\n${requestData.translated || "No se ha podido traducir el contenido proporcionado."}\`\`\``)
        ])
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}