const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removecommand",
    usage: "removecommand | removecmd <command_name>",
    aliases: ["removecmd"],
    example: "removecommand | removecmd welcome",
    ownerOnly: false,
    UserPerms: [""],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Eliminar comandos personalizados del Servidor.",
    async run(client, message, args, prefix) {
    try {
    let data;
    let value;
    let command;
    let commandName;
    command = database.get(`customcommands_${message.guild.id}`)
    commandName = args[0].toLowerCase();

    if(!commandName) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4615" })
            .setDescription(`No se ha proporcionado el nombre del comando.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(command) {
        data = command.find(x => x.name === commandName.toLowerCase())

        if(!data) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4473" })
                .setDescription(`No se ha encontrado ${commandName} en la lista de comandos del Servidor.`)
                ]
            })
        }

        value = command.indexOf(data)
        delete command[value]

        var filter = command.filter(x => {
            return x != null && x != "";
        })

        database.set(`customcommands_${message.guild.id}`, filter)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se ha eliminado ${commandName} de la lista de comandos del Servidor.`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}