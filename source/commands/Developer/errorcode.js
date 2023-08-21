const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "errorcode",
    usage: "errorcode | error <No ARGS>",
    aliases: ["error"],
    cooldown: 0,
    example: "errorcode | error <No ARGS>",
    ownerOnly: true,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "La mano arriba, cintura sola, da media vuelta. ~_~",
    async run(client, message, args, prefix) {
   try {
    let min, max, response, response1, response2;
    min = 5000; max = 7000;
    response = ~~(Math.random() * (max-min+1)+min); response1 = ~~(Math.random() * (max-min+1)+min); response2 = ~~(Math.random() * (max-min+1)+min);

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Error Code Generator" })
        .setDescription(`Generador de identificadores de errores\n\nErrores Generados:\n\` ${response} | ${response1} | ${response2} \``)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}