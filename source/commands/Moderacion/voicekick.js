const { MessageEmbed, Message, Client } = require("discord.js")

module.exports = {
    name: "voicekick",
    usage: "voicekick | vckick <@member | memberID> <razón>",
    aliases: ["vckick"],
    cooldown: 2,
    example: "voicekick | vckick <@Discord#0000 | 1234567890> <null>",
    ownerOnly: false,
    UserPerms: ["MOVE_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MOVE_MEMBERS"],
    description: "Kickear a un usuario de alguna canal de voz.",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    async run(client, message, args, prefix) {
   try {
    let member, reason, voice;
    member = message.mentions.members.first(args[0]) || message.guild.members.cache.get(args[0]);
    reason = args.slice(1).join(" ") || "No se ha proporciondao la razón.";

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID del miembro.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        member.voice.disconnect(reason)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${member} ha sido kickeado del canal de voz coorrectamente.`)
                .addField("Información del kickeo", `Razón del kickeo: ${reason}\nFecha de kickeo: <t:${Math.floor(Date.now() / 1000)}:R>`)
                ]
            })
    } catch(error) {
        console.error(error.stack)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3915" })
            .setDescription("Ha ocurrido un error al intentar kickear al usuario del canal de voz.")
            ]
        })
    }
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}