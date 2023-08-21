const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "hackban",
    usage: "hackban | banid <@member | memberID> <razón>",
    aliases: ["banid"],
    example: "hackban | banid 1234567890 Spam",
    ownerOnly: false,
    UserPerms: ["BAN_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
    description: "Banear un usuario por su ID.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let reason;
    let checkBan;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || args[0];
    reason = args.slice(1).join(" ") || "No se ha proporcionado la razón.";
    checkBan = await message.guild.bans.fetch();
    
    if(!member) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ])
        })
    } else if(member.id === message.author.id || member === message.author.id) {
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
            .setDescription(`No puedes banearme.`)
            ]
        })            
    } else if(checkBan.get(member.id)) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4210" })
            .setDescription(`El usuario mencionado actualmente esta baneado.`)
            ])
        })
    } else {
        await client.users.fetch(member).then(async(member) => {
            await message.guild.members.ban(member.id, {
                reason: reason
            }).then(() => {
              try {
                member.send({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setDescription(`Has sido baneado de: ${message.guild.name} por: ${reason}`)
                    ]
                })
              } catch(error) {
                  return;
              }

                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setDescription(`El usuario ha sido baneado de ${message.guild.name} correctamente`)
                    .addField("Información Extra", `Miembro baneado: ${member}\nRazón del baneo: ${reason}\nModerador propietario: ${message.author}`)
                    ]
                })
            }).catch(() => {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 6541" })
                    .setDescription("Ha ocurrido un error al banear al miembro.")
                    ]
                })
            })
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}