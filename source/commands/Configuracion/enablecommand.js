const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "enablecommand",
    usage: "enablecommand | enablecmd <command_name>",
    aliases: ["enablecmd"],
    cooldown: 5,
    example: "enablecommand | enablecmd bigtext",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD"],
    description: "Activar un comando el cual ya ha sido desactivado anteriormente.",
    async run(client, message, args, prefix) {
   try {
    let fetch;
    let request;
    fetch = await database.get(`command_${message.guild.id}`);
    request = await client.commands.get(args[0]);

    if(!args[0]) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7712" })
            .setDescription(`No se ha proporcionado el nombre del comando.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!request) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5481" })
            .setDescription("No se ha encontrado el comando proporcionado en la lista de comandos del cliente.")
            ]
        })
    } else try {
        let format = fetch.find(x => x.name === args[0].toLowerCase())
        
        if(!format) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5661" })
                .setDescription("El comando proporcionado actualmente no esta desactivado en el servidor.")
                ]
            })
        }
 
        let value = fetch.indexOf(format)
        delete fetch[value]

        var filter = fetch.filter(x => {
            return x != null && x != "";
        })

        database.set(`command_${message.guild.id}`, filter)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Se ha modificado la configuracion del servidor" })
            .setDescription(`El comando ${args[0]} ha sido activado nuevamente del servidor correctamente.`)
            ]
        })
    } catch(error) {
        console.log(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4768" })
            .setDescription("No se ha podido activar nuevamente el comando correctamente.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}