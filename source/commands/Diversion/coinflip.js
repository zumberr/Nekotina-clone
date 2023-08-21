const ms = require("ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "coinflip",
    usage: "coinflip | cflip <No Args>",
    aliases: ["cflip"],
    cooldown: 2,
    example: "coinflip | cflip <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Lanza una moneda y te dará un resultado aleatorio sobre Cara o Cruz.",
    async run(client, message, args, prefix) {
   try {
    let params, answer;
    params = ["Cara", "Cruz"];
    answer = params[Math.floor(Math.random() * params.length)]

    let fetch = await message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription("Por favor, espere mientras cae la moneda...")
        ]
    })

    let time = "5s";
    setTimeout(async function() {
        await fetch.edit({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`¡Ha caido ${answer}!`)
            ]
        })
    }, ms(time))
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}