const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "confession",
    usage: "confession <public | private> <contenido>",
    aliases: [""],
    example: "",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Simplemente confesiones.",
    async run(client, message, args, prefix) {
    try {
    let channel;
    let confession;
    let confessiontype;
    channel = await database.get(`confessions_${message.guild.id}`);
    confession = args.slice(1).join(" ");
    confessiontype = args[0];

    if(channel === null) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5204" })
            .setDescription(`No se ha proporcionado en la configuración del cliente, el canal de confesiones del servidor, debe de agregar el canal para poder realizar confesiones publicas.`)
            ]
        })
    } else if(!confessiontype) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4639" })
                .setDescription(`No se ha proporcionado el tipo de confesion.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
        })
    } else if(confessiontype === "public") {
        if(!confession) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4659" })
                .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else return client.channels.cache.get(channel).send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Nueva confesión de: ${message.author.tag}` })
            .setDescription(`${confession}`)
            ]
        })
    } else if(confessiontype === "private") {
        if(!confession) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4659" })
                .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else return client.channels.cache.get(channel).send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Nueva confesión de: Autor Anonimato` })
            .setDescription(`${confession}`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}