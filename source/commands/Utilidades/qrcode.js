const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "qrcode",
    usage: "qrcode <create> <Web/URL>",
    aliases: [""],
    cooldown: 2,
    example: "qrcode create <https://discord.com | www.discord.com>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear un imágen con el formato de codigo QR.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5710" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "create") {
        let url = args[1];
        let filter = require("../../inhibitors/filter.json")["Paginas bloqueadas"];

        if(filter.some(fl => message.content.toLowerCase().includes(fl))) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5662" })
                .setDescription("Hmmm... Creo que no seria bueno que hagas eso, la verdad...")
                ]
            })
        } else if(!url) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7560" })
                .setDescription(`No se ha proporcionado la dirección url/web.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(!url.startsWith("http" || "https" || "www")) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6771" })
                .setDescription(`No se ha proporcionado una dirección url/web válida.`)
                ]
            })
        } else {
            await message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Por favor, espere mienrtas se recopila la información de la imágen.`)
                ]
            }).then(async m => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setImage(`https://api.qrserver.com/v1/create-qr-code/?data=${url}`)
                    ]
                })
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}