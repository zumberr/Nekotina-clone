const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "spotifyinfo",
    usage: "spotifyinfo | spotify <@member | memberID | MessageMember>",
    aliases: ["spotify"],
    cooldown: 2,
    example: "spotifyinfo | spotify @usuario#1010",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de alguna canción de Spotify.",
    async run(client, message, args, prefix) {
   try {
    let member;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    
    try {
        if(member.presence.activities[0].type === "LISTENING" && member.presence.activities[0].name === "Spotify" && member.presence.activities[0].assets !== null) {
            let trackIMG = `https://i.scdn.co/image/${member.presence.activities[0].assets.largeImage.slice(8)}`;
            let trackURL = `https://open.spotify.com/track/${member.presence.activities[0].syncID}`;
            let trackName = member.presence.activities[0].details;
            let trackAuthor = member.presence.activities[0].state;
            let trackAlbum = member.presence.activities[0].assets.largeText;
            trackAuthor = trackAuthor.replace(/;/g, ",");
    
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setThumbnail(trackIMG)
                .setAuthor({ name: `${trackName}`, url: `${trackURL}` })
                .addField("Albúm de la canción", `${trackAlbum}`)
                .addField("Autor de la canción", `${trackAuthor}`)
                .addField("Escuchar la canción en Spotify", `[Click Aquí.](${trackURL})`)
                ]
            })
        }
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7223" })
            .setDescription(`Ha ocurrido un error al intentar obtener la información o el usuario no esta escuchando ninguna canción en Spotify.`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}
// const axios = require("axios").default;
// const { MessageEmbed } = require("discord.js");

// module.exports = {
//     name: "spotifyinfo",
//     usage: "spotifyinfo | spotify <nombre de la canción>",
//     aliases: ["spotify"],
//     cooldown: 2,
//     example: "spotifyinfo | spotify Mi Gente",
//     ownerOnly: false,
//     UserPerms: ["SEND_MESSAGES"],
//     ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
//     description: "Obtener información de alguna canción subida a Spotify.",
//     async run(client, message, args, prefix) {
//    try {
//     let songname;
//     songname = args.join(" ");

//     if(!songname) {
//         return message.reply({
//             embeds: [new MessageEmbed()
//             .setColor("#fbd9ff")
//             .setAuthor({ name: "Error Code: 7513" })
//             .setDescription(`No se ha proporcionado el nombre de la canción.\n\nUso correcto del comando:\n\` ${this.usage} \``)
//             ]
//         })
//     } else {
//         await message.reply({
//             embeds: [new MessageEmbed()
//             .setColor("#fbd9ff")
//             .setDescription("Por favor, espere mientras se recolecta la información de la canción.")
//             ]
//         }).then(async (m) => {
//             await axios.get(`https://api.spotify.com/v1/search?type=track&q=${songname}`, {
//                 headers: {
//                     Authorization: "Bearer 090b1c9eea73425d8e00b2e75cb9d321"
//                 }
//             }).then((response) => {
//                 console.log(response.data)
//             }).catch((r) => {
//                 console.log(r)
//             })
//         })
//     }
//     } catch (error) {
//        console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
//         }
//     }
// }