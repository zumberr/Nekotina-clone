const path = require("path")
const { readdirSync } = require("fs")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "reload",
    usage: "reload | rd <command_name>",
    aliases: ["rd"],
    cooldown: 0,
    example: "reload | rd functions",
    ownerOnly: true,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Reiniciar el cliente (bot).",
    async run(client, message, args, prefix) {
   try {
    const commandname = args[0]
    const commands = client.commands.get(commandname)
    const aliases = client.commands.get(client.aliases.get(commandname))
    const commandfetch = commands || aliases;
    
    if(!commandname) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5512" })
            .setDescription(`No se ha proporcionado el nombre del comando.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } if(!commandfetch) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5481" })
            .setDescription("No se ha encontrado el comando proporcionado en la lista de comandos del cliente.")
            ]
        })
    } else try {
        readdirSync(path.join(__dirname, "..")).forEach(async (dirs) => {
            const files = readdirSync(path.join(__dirname, "..", dirs));

            if(files.includes(commandname + ".js")) {
                const file = "../" + dirs + "/" + commandname + ".js";

                delete require.cache[require.resolve(file)];
                client.commands.delete(commandname);

                const pull = require(file)
                client.commands.set(commandname, pull)
                
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setDescription(`${commandname} ha sido reiniciado correctamente de la lista de comandos del cliente.`)
                    ]
                })
            }
        })
    } catch(error) {
        console.error(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5348" })
            .setDescription("Ha ocurrido un error al reiniciar el comando.")
            ]
        })
    }
   } catch(error) {
      console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
       }
    }
}