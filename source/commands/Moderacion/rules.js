const database = require("quick.db");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "rules",
    usage: "rules <read | set | delete> <...>",
    aliases: [""],
    cooldown: 2,
    example: "",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear y obtener las reglas del servidor",
    async run(client, message, args, prefix) {
   try {
    let format, text, replacer, serverrules;
    format = args[0];
    text = args.slice(1).join(" ");
    replacer = text.replace(`<space>`, "\n");
    serverrules = await database.get(`rules_${message.guild.id}`);

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6549" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "read") {
        try {
            let replace1 = serverrules[0].text.replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n").replace("<space>", "\n");
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `Reglas de: ${message.guild.name}` })
                .setDescription(`${replace1}`)
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6781" })
                .setDescription("Ha ocurrido un error al intentar recolectar las reglas o este servidor actualmente no ha establecido las reglas.")
                ]
            })
        }
    } else if(format === "set") {
        if(!text) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6799" })
                .setDescription(`No se ha proporcionado el contenido de las reglas.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(text.length > 1024) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5271" })
                .setDescription(`Se ha proporcioado mas de 1024 caracteres, por lo tanto, no se pueden establecer las reglas.`)
                ]
            })
        } else {
            serverrules = database.push(`rules_${message.guild.id}`, {
                text: text
            })
    
            await database.set((`rules_${message.guild.id}`), serverrules)
    
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se han establecido las reglas correctamente, para verlas tienes que colocar el siguiente comando: \` ${prefix}rules read \``)
                ]
            })
        }
    } else if(format === "delete") {
        database.delete(`rules_${message.guild.id}`)
        
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se han removido las reglas del servidor correctamente, para establecer nuevas reglas tienes que colocar el siguiente comando: \` ${prefix}rules set <nuevas reglas> \``)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}