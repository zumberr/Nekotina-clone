const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "fakesay",
    usage: "fakesay | fsay <@member | memberID> <contenido>",
    aliases: ["fsay"],
    cooldown: 2,
    example: "fakesay | fsay <@Discord#0000 | 1234567890> Hello.",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear un \"mensaje\" con el perfil de algun usuario del servidor.",
    async run(client, message, args, prefix) {
   try {
    let member = await  message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    let avatar = member.displayAvatarURL({ dynamic: true, format: "png" })
    let content = args.slice(1).join(" ")

    if(!member)  {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!content) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6612" })
            .setDescription(`No se ha proporcionado el contenido.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Por favor, espere mientras se crea el mensaje...`)
            ]
        }).then(async(m) => {
            await message.channel.createWebhook(member.username, {
                avatar: avatar
            }).then((req) => {
                m.delete();
                req.send(content)
            }).catch(() => {
                return m.edit({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 7122" })
                    .setDescription("Ha ocurrido un error al intentar crear el mensaje.")
                    ]
                })
            })
        })
    }
    } catch (error) {
       console.error(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}