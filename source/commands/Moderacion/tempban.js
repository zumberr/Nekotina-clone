const ms = require("ms")
const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "tempban",
    usage: "tempban <@member | memberID> <duración> <Opcional | Razón>",
    aliases: [""],
    cooldown: 0,
    example: "tempban @zumber 3d Existir",
    ownerOnly: false,
    UserPerms: ["BAN_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
    description: "Banear a un usuario por un tiempo especifico.",
    async run(client, message, args, prefix) {
    try {
    let member;
    let checkerBan;
    let durationBan;
    let reasonBan;

    member = message.mentions.members.first() || message.guild.members.cache.get() || await client.users.cache.get(args[0])
    checkerBan = await message.guild.bans.fetch()
    durationBan = args[1];
    reasonBan = args.slice(2).join(" ");

        if(!member) {
            return message.reply({
                embeds: ([new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3662" })
                .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ])
            })
        } else if(!durationBan) {
            return message.reply({
                embeds: ([new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4761" })            
                .setDescription(`No se ha proporcionado la duración.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ])
            })
        } else if(member.id === message.author.id) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5881" })
                .setDescription(`No puedes banearte a ti mismo.`)
                ]
            })
        } else if(member.id === message.guild.ownerId) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4691" })
                .setDescription(`No puedes banear al dueño del servidor.`)
                ]
            })
        } else if(member.id === client.user.id) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3867" })
                .setDescription(`No puedes banearme...`)
                ]
            })            
        } else if(member.id === "517729180054716416") {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5521" })
                .setDescription(`¿Por que razón quieres banear al dueño del bot?`)
                ]
            })
        } else if(checkerBan.get(member.id)) {
            return message.reply({
                embeds: ([new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4210" })
                .setDescription(`El usuario mencionado actualmente esta baneado.`)
                ])
            })
        }

        member.ban({
            reason: [reasonBan]
        });

        member.send({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Información de tu baneo" })
            .setDescription(`Has sido baneado de: ${message.guild.name} por: ${reasonBan || "No se ha proporcionado la razón."}`)
            ])
        })

        message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se ha tempbaneado al usuario correctamente.`)
            .addField("Información del baneo", `Usuario baneado: ${member}
Razón del baneo: ${reasonBan || "No se ha proporcionado una razón."}
Duración del baneo: ${ms(durationBan)}
Moderador propietario: ${message.author}`)
            ])
        })
        
        setTimeout(() => {
            message.guild.members.unban(member);

            return message.reply({
                embeds: ([new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se ha expirado el tiempo del baneo de ${member}.`)
                .addField("Información del baneo", `
                Usuario baneado: ${member}
                Razón del baneo: ${reasonBan}
                Duración del baneo: ${ms(durationBan)}
                Moderador propietario: ${message.author}`)
                ])
            })
        }, ms(durationBan))
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}