const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "removeinfraction",
    usage: "removeinfraction | removeinf <@member | memberID>",
    aliases: ["removeinf"],
    cooldown: 1,
    example: "removeinfraction | removeinf @usuario",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Eliminar/remover todas infracciones de algun miembro en especificó.",
    async run(client, message, args, prefix) {
   try {
    let member, infraction;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    infraction = await database.get(`warn_${message.guild.id}_${member.id}`);
    
    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(infraction === null) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5357" })
            .setDescription(`${member} No tiene infracciones.`)
            ]
        })
    } else try {
        database.delete(`warn_${message.guild.id}_${member.id}`)
        
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se han eliminado todas las infracciones de ${member} correctamente.`)
            ]
        })
    } catch(error) {
        console.log(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3878" })
            .setDescription("Ha ocurrido un error al encontrar la infracción.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}
