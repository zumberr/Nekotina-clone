const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "fetch-alts",
    usage: "fetch-alts | falts <días>",
    aliases: ["falts"],
    cooldown: 0,
    example: "fetch-alts | falts 30",
    ownerOnly: false,
    UserPerms: ["VIEW_AUDIT_LOG"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información de \"Alts\" del Servidor.",
    async run(client, message, args, prefix) {
   try {
    let Array;
    let altDays;
    let formatDays;
    Array = [];
    altDays = args[0];
    formatDays = Number(altDays);

    if(!altDays) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1192" })
            .setDescription(`No se ha proporcionado los días.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(isNaN(altDays)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2535" })
            .setDescription(`Se ha proporcionado una cantidad inválida.`)
            ]
        })
    } else if(formatDays > 120) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2448" })
            .setDescription(`Se ha proporcionado una cantidad que supera los 120 días.`)
            ]
        })
    } else {
        await message.guild.members.cache.forEach(async(user) => {
            const x = Date.now() - user.user.createdTimestamp;
            const created = Math.floor(x / 86400000);
    
            if(formatDays >= created) {
                Array.push(`${user} | ${user.user.id} | <t:${Math.floor(user.user.createdTimestamp / 1000)}:R>`)
            };
        });
    
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Buscador de Cuentas Secundarias de ${formatDays} días` })
            .setDescription(`${Array.join("\n") || "No se han encontrado alts creadas recientemente."}`)  
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}