const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "blacklistword",
    usage: "blacklistword | blword <addword | deleteword> <palabra>",
    aliases: ["blword"],
    cooldown: 5,
    example: "blacklistword | blword addword discord.js",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Prohibir palabras en el servidor.",
    async run(client, message, args, prefix) {
   try {
    let format;
    let getdatabase;
    format = args[0];
    getdatabase = await database.get(`blacklistword_${message.guild.id}`);
    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1137" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso corecto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "addword") {
        let word = args.slice(1).join(" ");

        if(!word) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3314" })
                .setDescription(`No se ha proporcionado la palabra.\n\nUso corecto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else try {
            getdatabase = database.push(`blacklistword_${message.guild.id}`, {
                word: word,
                author: message.author.id
            })

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription("Se ha agregado la lista de palabras prohibidas del servidor.")
                .addField("Lista de nuevas palabras prohibidas", `\`\`\`js\n${word}\`\`\``)
                ]
            })
        } catch(error) {
            console.log(error)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 2251" })
                .setDescription("Ha ocurrido un error al agregar la palabra en la lista de palabras prohibidas del servidor.")
                ]
            })
        }
    } else if(format === "deleteword") {
        let word = args.slice(1).join(" ");
        let fetch = await database.get(`blacklistword_${message.guild.id}`)

        if(!word) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3314" })
                .setDescription(`No se ha proporcionado la palabra.\n\nUso corecto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(fetch !== word) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6613" })
                .setDescription("La palabra no existe en la lista de palabras prohibidas.")
                ]
            })
        } else try {
            database.delete(`blacklistword_${message.guild.id}`, word)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Se ha modificado la configuración del servidor" })
                .setDescription(`Se ha eliminado \`${word}\` de la lista de palabras prohibidas del servidor.`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7719" })
                .setDescription("Ha ocurrido un error al intentar eliminar la palabra")
                ]
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}