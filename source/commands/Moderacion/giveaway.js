const ms = require("ms")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "giveaway",
    usage: "giveaway | gy <duración> <channelID> <contenido>",
    aliases: ["gy"],
    cooldown: 0,
    example: "giveaway | gy 1h 1234568890 1 Mes de Discord Nitro",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Crear un Giveaway/Sorteo en el servidor.",
    async run(client, message, args, prefix) {
   try {
    let timeGiveaway;
    let channelGiveaway;
    let contentPrizeGiveaway;
    timeGiveaway = args[0];
    channelGiveaway = await message.guild.channels.cache.get(args[1]);
    contentPrizeGiveaway = args.slice(2).join(" ");
    
    if(!timeGiveaway) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5698" })
            .setDescription(`No se ha proporcionado el tiempo.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!channelGiveaway) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3489" })
            .setDescription(`No se ha proporcionado la ID del canal.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!contentPrizeGiveaway) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2921" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(timeGiveaway > ms(60)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5624" })
            .setDescription("Se ha proporcionado un tiempo demasiado corto para el sorteo.")
            ]
        })
    } else if(timeGiveaway > ms(3240000000)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6614" })
            .setDescription("Se ha proporcionado un tiempo demasiado largo para el sorteo.")
            ]
        })
    } else try {
        let giveaway = await channelGiveaway.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `${contentPrizeGiveaway}` })
            .setTimestamp(Date.now() + ms(args[0]))
            .setDescription(`Reacciona con 🎉 para entrar al sorteo.
Tiempo del sorteo: ${timeGiveaway} 
Propietario del Sorteo: ${message.author}`)
            ]
        })
        
        await giveaway.react("🎉")
        
        setTimeout(async () => {
            await giveaway.reactions.cache.get("🎉").users.remove();
            setTimeout(async () => {
                const winner = giveaway.reactions.cache.get("🎉").users.cache.random();

                if(giveaway.reactions.cache.get("🎉").users.cache.size < 1) {
                    await giveaway.edit({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: `${contentPrizeGiveaway}` })
                        .setDescription(`Nadie ha entrado al sorteo.
Tiempo del sorteo: ${timeGiveaway}
Propietario del Sorteo: ${message.author}`)
                        ]
                    })
                } else if(!giveaway.reactions.cache.get("🎉").users.cache.size < 1) {
                    await giveaway.edit({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: `${contentPrizeGiveaway}` })
                        .setDescription(`Ganador(es): ${winner}.
Tiempo del sorteo: ${timeGiveaway}   
Propietario del Sorteo: ${message.author}`)
                        ]
                    })
                }
            })
        }, ms(timeGiveaway))
    } catch(error) {
        console.log(error)
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1012" })
            .setDescription("Ha ocurrido un error al crear el sorteo en el servidor.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}