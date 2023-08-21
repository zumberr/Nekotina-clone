const { MessageEmbed } = require("discord.js")
const answer = require("../../inhibitors/filter.json")["Respuestas de 8ball"]

module.exports = {
    name: "8ball",
    usage: "8ball | 8b <pregunta>",
    aliases: ["8b"],
    cooldown: 5,
    example: "8ball | 8b ¿Tendre novia algun día?",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: " respondo a tus dudas y preguntas.",
    async run(client, message, args, prefix) {
   try {
    let response;
    let answers1;
    response = args.slice(0).join(" ");
    answers1 = answer[~~(Math.random() * answer.length)]
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    if(!response) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1627" })
            .setDescription(`No se ha proporcionado la pregunta. \n\nUso correcto del comando: \n\` ${this.usage} \``)
            ])
        })
    } else {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Preguntas a la bola magica." })
            .setDescription(`**Pregunta**\n${response}\n\n**Respuesta**\n${answers1}`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}