const axios = require("axios").default;
const { MessageEmbed } = require("discord.js");
const filter = require("../../inhibitors/filter.json");

module.exports = {
    name: "googleimage",
    usage: "googleimage | image <búsqueda> <pagina>",
    aliases: ["img"],
    cooldown: 2,
    example: "googleimage | image <búsqueda> <pagina>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener imágenes que se encuentren en Google.",
    async run(client, message, args, prefix) {
   try {
    let image;
    let request;
    let pagenumber;
    image = args.slice(0).join("+");
    request = await axios.get(`https://customsearch.googleapis.com/customsearch/v1?q=${image}&cx=${client.config.GOOGLE_CX}&key=${client.config.GOOGLE_KEY}&searchType=image`).then((res) => res.data);
    pagenumber = Number(args[1]);

    if(!image) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2272" })
            .setDescription(`No se ha proporcionado la búsqueda.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Resultados a la búsqueda de: ${args.slice(0).join(" ")}` })
            .setDescription(`Nombre de la imágen: ${request.items[pagenumber || Number(0)].title}
Ancho de la imágen: ${request.items[pagenumber || Number(0)].image.width}
Altura de la imágen: ${request.items[pagenumber || Number(0)].image.height}
Tamaño de la imágen: ${request.items[pagenumber || Number(0)].image.byteSize}`)
            .setImage(`${request.items[pagenumber || Number(0)].link}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6478" })
            .setDescription("Ha ocurrido un error al intentar obtener la información o no se han encontrado resultados a tu búsqueda.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}