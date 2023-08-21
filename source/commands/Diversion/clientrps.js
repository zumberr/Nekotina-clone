let rps = ['tijeras', 'piedra', 'papel']
const { MessageEmbed } = require("discord.js")
let res = [`Tijeras`, `Piedra`, `Papel`]

module.exports = {
    name: "clientrps",
    usage: "clientrps | botrps <piedra | papel | tijera>",
    aliases: ["botrps"],
    cooldown: 4,
    example: "clientrps | botrps tijera",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Un duelo de piedra, papel o tijeras contra el cliente.",
    async run(client, message, args, prefix) {
   try {
    let result;
    let userChoice;
    let clientChoice;
    if(args.length) {
        userChoice = args[0].toLowerCase();
    } else if(!rps.includes(userChoice)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3551" })
            .setDescription(`No se ha proporcionado un termino válido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    }
    
    userChoice = rps.indexOf(userChoice);
    clientChoice = Math.floor(Math.random() * 3);

    if(userChoice === clientChoice) {
        result = "El duelo ha quedado en un empate.";
    } else if (clientChoice > userChoice || clientChoice === 0 && userChoice === 2) {
        result = `${client.user} ha ganado el duelo.`;
    } else {
        result = `${message.member} ha ganado el duelo.`;
    }

    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`${message.member} ha elegido: ${res[userChoice]}
${client.user} ha elegido: ${res[clientChoice]}            
        
Resultados: ${result}`)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}