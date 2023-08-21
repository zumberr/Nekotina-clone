const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "listcommands",
    usage: "listcommands | listcmds <customcmds | disablecmds>",
    aliases: ["listcmds"],
    example: "listcommands | listcmds <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la lista de comandos de comandos personalizados y desactivados del servidor.",
    async run(client, message, args, prefix) {
   try {
    let command;
    let commands;
    command = await database.get(`customcommands_${message.guild.id}`).map((cmd, i) => `\`\`\`${i + 1} | ${cmd.name} | ${cmd.response}\`\`\``).join("\n") || "Este servidor actualmente no tiene comandos personalizados.";
    commands = await  database.get(`command_${message.guild.id}`).map((name, i) => `\`\`\`${i + 1} | ${name.name}\`\`\``).join("\n") || "Este servidor actualmente no tiene comandos desactivados.";
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    if(!args[0]) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7261" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(args[0] === "customcmds") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Lista de comandos personalizados de: ${message.guild.name}` })
            .setDescription(`${command}`)
            ]
        })
    } else if(args[0] === "disablecmds") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Lista de comandos desactivados de: ${message.guild.name}` })
            .setDescription(`${commands}`)
            ]
        })
    } else return;
    } catch (error) {
       console.error(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}