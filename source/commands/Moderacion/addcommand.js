const database = require("quick.db");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "addcommand",
    usage: "addcommand | addcmd <command_name> <reply>",
    aliases: ["addcmd"],
    example: "addcommand | addcmd welcome Bienvenido al servidor!",
    ownerOnly: false,
    UserPerms: [""],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear comandos personalizados.",
    async run(client, message, args, prefix) {
   try {
    let command;
    let commandname;
    let commandreply;
    command = database.get(`customcommands_${message.guild.id}`)
    commandname = args[0];
    commandreply = args.slice(1).join(" ")

    if(!commandname) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5410" })
            .setDescription(`No se ha proporcionado el nombre del comando.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!commandreply) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5379" })
            .setDescription(`No se ha proporcionado la respuesta del comando.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(command && command.find(x => x.name === commandname.toLowerCase())) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3128" })
            .setDescription(`El nombre del comando ya existe actualmente.`)
            ]
        })
    } else try {
        database.push(`customcommands_${message.guild.id}`, {
            name: commandname,
            response: commandreply
        })
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se ha agregado \`${commandname}\` como nuevo comando personalizado de ${message.guild.name}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4412" })
            .setDescription("Ha ocurrido un error al intentar crear el comando.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}