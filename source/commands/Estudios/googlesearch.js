const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "googlesearch",
    usage: "googlesearch | google <search>",
    aliases: ["google"],
    cooldown: 0,
    example: "googlesearch | google Discord Documentation",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de alguna búsqueda de Google",
    async run(client, message, args, prefix) {
    try {
    let filter;
    let response;

    filter = [
        "porno", "porn", "xxx", "pornhub", "xvideos", "xnxx", "livesex", "nsfw", "sexo", "sex", "blowjob",
        "hentaila", "nhentai"
    ]

    for(let i = 0; i < filter.length; i += 1) {
        if(args.includes(filter[i])) return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3130" })
            .setDescription("No se pueden buscar esas cosas...")
            ])
        })
    }

    response = `https://www.google.com/search?q=${encodeURI(args.slice(0).join(" "))}`
    
    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Búsqueda de Google: ${args.slice(0).join(" ")}` })
        .setDescription(`URL/Link de la búsqueda: [Click Aquí.](${response})`)
        ])
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}