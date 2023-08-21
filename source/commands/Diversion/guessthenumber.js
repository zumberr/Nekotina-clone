const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "guessthenumber",
    usage: "guessthenumber | gtnumber <numero>",
    aliases: ["gtnumber"],
    cooldown: 3,
    example: "guessthenumber | gtnumber 14",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Adivina un numero aleatorio.",
    async run(client, message, args, prefix) {
   try {
    let number;
    number = Math.floor(Math.random() * 250);

    if(!Number(args[0])) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3367" })
            .setDescription(`Adivina un numero del 1 al 250.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(Number(args[0]) === number) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Felicidades, el numero proporcionado es correcto.`)
            ]
        })
    } else if(Number(args[0]) !== number) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`No has adivinado, el numero correcto era: ${number}`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}