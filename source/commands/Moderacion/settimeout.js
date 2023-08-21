const ms = require("ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "settimeout",
    usage: "settimeout | stt <@member | memberID> <tiempo> <razón>",
    aliases: ["stt"],
    cooldown: 0,
    example: "settimeout | stt @usuario 2h Spam",
    ownerOnly: false,
    UserPerms: ["MUTE_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MUTE_MEMBERS"],
    description: "\"Silenciar\" a un usuario en especificó.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let timeoutTime;
    let timeoutReason;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    timeoutTime = ms(args[1]);
    timeoutReason = await args.slice(2).join(" ") || "No se ha proporcionado la razón.";

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID del miembro.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!timeoutTime) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5218" })
            .setDescription(`No se ha proporcionado el tiempo del timeout.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(message.member.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3251" })
            .setDescription(`No puedes realizar el timeout de ${member} ya que tiene un rol mayor que tu o igual.`)
            ]
        })
    } else if(message.guild.me.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4105" })
            .setDescription(`No puedo realizar el timeout ya que tiene un rol mayor al mio o igual.`)
            ]
        })
    } else try {
        await member.timeout(timeoutTime, timeoutReason)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Se ha hecho el timeout al miembro correctamente" })
            .setDescription(`Miembro Timeout: ${member}
Tiempo del Timeout: ${ms(timeoutTime, { long: true })}
Razon del Timeout: ${timeoutReason}
Moderador propietario: ${message.author}
Fecha de Ejecución del Timeout: <t:${Math.floor(Date.now() / 1000)}:R>`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7713" })
            .setDescription("No se ha podido realizar el timeout correctamente.")
            ]
        })
    }
   } catch (error) {
        console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}