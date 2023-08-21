const types = {false: "No.", true: "Si."}
const types1 = {false: "No Verificada", true: "Verificada."}
const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "instagraminfo",
    usage: "instagraminfo | instagram <account_name>",
    aliases: ["instagram"],
    cooldown: 0,
    example: "instagraminfo | instagram instagram",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES",  "EMBED_LINKS"],
    description: "Obtener información de una cuenta de Instagram.",
    async run(client, message, args, prefix) {
   try {
    let request;
    let account;
    let requestJSON;

    account = args.slice(0).join(" ");
    request = await axios.get(`https://api.popcat.xyz/instagram?user=${account}`)
    requestJSON = request.data;

    if(!account) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3326" })
            .setDescription(`No se ha proporcionado el nombre de la cuenta. \n\nUso correcto del comando: \n\` ${this.usage} \``)
            ])
        })
    } else if(requestJSON.error) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3645" })
            .setDescription("No se han encontrado resultados.")
            ])
        })
    } else {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .addField("Información Principal", `Link de la cuenta: [Click Aquí.](https://instagram.com/${account})
Nombre completo: ${requestJSON.full_name}
Nombre de usuario: ${requestJSON.username}
Descripción/Bio: ${requestJSON.biography}
Cuenta privada: ${types[requestJSON.private]}
Cuenta verificada: ${types1[requestJSON.verified]}`)
            .addField("Información Extra", `Seguidores: ${requestJSON.followers}
Siguiendo: ${requestJSON.following}
Instragram Posts: ${requestJSON.posts}
Instragram Reels: ${requestJSON.reels}`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}