const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "lockdown",
    usage: "lockdown | ldown <enable | disable>",
    aliases: ["ldown"],
    cooldown: 5,
    example: "lockdown | ldown enable",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
    description: "Bloquear todos los canales del servidor rapidamente.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.member.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5844" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "enable") {
      try {
            await message.guild.channels.cache.filter(channel => channel.name).forEach(async channel => {
                await channel.permissionOverwrites.edit(message.guild.id, {
                    SEND_MESSAGES: false
                }),

                await channel.permissionOverwrites.edit(client.user.id, {
                    SEND_MESSAGES: true,
                    EMBED_LINKS: true
                })
            })

            return message.member.send({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se han bloqueado todo los canales del Servidor correctamente.`)
                ]
            })
      } catch(error) {
        return message.member.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3614" })
            .setDescription("Ha ocurrrido un error al bloquear todos los canales del servidor.")
            ]
        })
      }
    } else if(format === "disable") {
        try {
            await message.guild.channels.cache.filter(channel => channel.name).forEach(async channel => {
                await channel.permissionOverwrites.edit(message.guild.id, {
                    SEND_MESSAGES: true
                }),
                
                await channel.permissionOverwrites.edit(client.user.id, {
                    SEND_MESSAGES: true,
                    EMBED_LINKS: true
                })
            })
    
            return message.member.send({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se han desbloqueado todo los canales del Servidor correctamente.`)
                ]
            })
        } catch(error) {
          return message.member.send({
              embeds: [new MessageEmbed()
              .setColor("#fbd9ff")
              .setAuthor({ name: "Error Code: 3614" })
              .setDescription("Ha ocurrrido un error al desbloquear todos los canales del servidor.")
              ]
          })
        }
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}