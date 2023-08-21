const ms = require("ms")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "botinfo",
    usage: "botinfo | bot <No ARGS>",
    aliases: ["bot"],
    cooldown: 5,
    example: "botinfo | bot <No ARGS>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre el BOT.",
    async run(client, message, args, prefix) {
   try {
    return message.reply({
        embeds: [
            new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Informacion del sistema y el cliente.`)
            .addField("Sistema", `\`\`\`Sistema Operativo: Windows x64\nUso del CPU del Sistema: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%\nUso de la Memoria del Sistema: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``)
            .addField("Programación", `\`\`\`Lenguaje de programación: JavaScript\nLibrería del cliente: ${require("discord.js").version}\nVersion del cliente: ${require("../../../package.json").version}\`\`\``)
            .addField("Actividad y Comandos", `\`\`\`Actividad del cliente: ${ms(client.uptime)}\nComandos disponibles: ${client.commands.size - 4} comandos.\nCantidad de Servidores: ${client.guilds.cache.size} servidores.\`\`\``)
             .setFooter("Creada y administrada por !  Eri#2323 y Zumber#1610")
        ]
    })
   } catch(error) {
        console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}