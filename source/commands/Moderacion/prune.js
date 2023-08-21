const { MessageEmbed, Message } = require("discord.js");

module.exports = {
    name: "prune",
    usage: "prune <roleID> <días> <razón>",
    aliases: [""],
    cooldown: 2,
    example: "prune <@Moderador | 1234567890> <30d | 7d> <Inactivity>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Kickear a todos los usuario inactivos por el rol.",
    /**
     * @param {Message} message
     */
    async run(client, message, args, prefix) {
   try {
    let mention, days, reason;
    mention = message.guild.roles .cache.get(args[0]);
    days = Number(args[1]);
    reason = args.slice(2).join(" ") || "No se ha propocionado una razón.";

    if(!mention) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado una mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!days) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6513" })
            .setDescription(`No se ha proporcioando la cantidad de días.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(days > 120) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7134" })
            .setDescription("No se pueden kickear a usuarios con roles con mas de 120 días.")
            ]
        })
    } else if(days <= 7) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7134" })
            .setDescription("No se pueden kickear a usuarios con ese rol con menos de 7 días.")
            ]
        })
    } else {
        await message.guild.members.prune({ days: days, roles: [mention], reason: reason, dry: true }).then((pruned) => {
            console.log(pruned)
        }).catch((err) => {
            console.error(err.stack)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7131" })
                .setDescription("Ha ocurrido un error al intentar kickear a los usuarios con los roles,")
                ]
            })
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}