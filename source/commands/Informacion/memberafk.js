const database = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "memberafk",
    usage: "memberafk | afk <set | info> <...>",
    aliases: ["afk"],
    cooldown: 5,
    example: "memberafk | afk set Estudiando...",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Establecer y obtener de algun usuario AFK.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3315" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "set") {
        let reason = args.slice(1).join(" ") || "No se ha proporcionado una razón.";
        await database.set(`afk_${message.guild.id}_${message.author.id}`, {
            member: message.author.id,
            reason: reason,
            timestamp: Math.ceil(new Date() / 1000)
        })

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Se ha establecido tu estado AFK correctamente" })
            .setDescription(`${message.author} se ha establecido el estado AFK correctamente.`)
            .addField("Información del estado AFK", `Razón del AFK: ${reason}\nFecha: <t:${Math.ceil(new Date() / 1000)}:R>`)
            ]
        })
    } else if(format === "info") {
        let member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let getinfo = await database.get(`afk_${message.guild.id}_${member.id}`)

        if(!member) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3662" })
                .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(database.has(`afk_${message.guild.id}_${member.id}`)) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `Información del estado AFK de ${member.user.tag}` })
                .setDescription(`Miembro del AFK: ${member}\nRazón del AFK: ${getinfo.reason}\nFecha: <t:${getinfo.timestamp}:R>`)
                ]
            })
        } else {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${member} actualmente no tiene un estado AFK en el servidor.`)
                ]
            })
        }
    } else return;
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}