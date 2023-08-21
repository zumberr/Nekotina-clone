const ms = require("ms")
const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "remind",
    usage: "remind <server | dm> <tiempo> <contenido>",
    aliases: [""],
    cooldown: 3,
    example: "remind server 1h Crear un canal para las confesiones.",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear un recordatorio personalizado propio.",
    async run(client, message, args, prefix) {
   try {
    let format = args[0];
    let member = await message.member;
    let database = await db.get(`remind_${message.guild.id}_${member.id}`)
    let remindTime = args[1];
    let remindReason = args.slice(2).join(" ");

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2637" })
            .setDescription(`No se ha proporcionado el formato de selección.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "server") {
        if(!remindTime) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3245" })
                .setDescription(`No se ha proporcionado el tiempo del recordatorio.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(!remindReason) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4589" })
                .setDescription(`No se ha proporcionado el razón del recordatorio.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(remindReason.length > 300) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4447" })
                .setDescription("Se ha proporcionado en la razón del recordatorio una cantidad de mas de 1500 caracteres, por lo tanto, no se puede crear el recordatorio correctamente.")
                ]
            })
        } else if(remindTime === ms(8.28e+7)) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4813" })
                .setDescription("El limite de tiempo es de 23 horas y el tiempo proporcioando supera las 23 horas por lo tanto no se puede crear el recordatorio.")
                ]
            })
        } else try {
            if(!database) {
                database = []
            }

            database = db.push(`remind_${message.guild.id}_${member.id}`, {
                remindId: database.length + 1, 
                remindTime: remindTime,
                remindReason: remindReason, 
                timestamp: Math.ceil(new Date() / 1000)
            })

            await db.set((`remind_${message.guild.id}_${member.id}`), database)

            await message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${message.author} tu recordatorio se ha creado correctamente.`)
                .addField("Información del Recordatorio", `Formato del Recordatorio: Servidor
Tiempo del Recordatorio: ${remindTime}
Razón del Recordatorio: ${remindReason}`)
                ]
            })
            
            setTimeout(async function() {
                db.delete(`remind_${message.guild.id}_${member.id}`)
                return message.reply({
                    content: `${message.author}`,
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setDescription(`${message.author} ya se ha acabado el tiempo del recordatorio.`)
                    .addField("Información del Recordatorio", `Formato del Recordatorio: Servidor
Tiempo del Recordatorio: ${remindTime}
Razón del Recordatorio: ${remindReason}`)
                    ]
                })
            }, ms(remindTime))
        } catch(error) {
            console.error(error)
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5623" })
                .setDescription("Ha ocurrido al realizar el recordatorio correctamente.")
                ]
            })
        }
    } else if(format === "dm") {
        if(!remindTime) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3245" })
                .setDescription(`No se ha proporcionado el tiempo del recordatorio.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(!remindReason) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4589" })
                .setDescription(`No se ha proporcionado el razón del recordatorio.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(remindReason.length > 1500) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4447" })
                .setDescription("Se ha proporcionado en la razón del recordatorio una cantidad de mas de 1500 caracteres, por lo tanto, no se puede crear el recordatorio correctamente.")
                ]
            })
        } else if(remindTime === ms(8.28e+7)) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4813" })
                .setDescription("El limite de tiempo es de 23 horas y el tiempo proporcioando supera las 23 horas por lo tanto no se puede crear el recordatorio.")
                ]
            })
        } else try {
            if(!database) {
                database = []
            }

            database = db.push(`remind_${message.guild.id}_${member.id}`, {
                remindId: database.length + 1, 
                remindTime: remindTime,
                remindReason: remindReason, 
                timestamp: Math.ceil(new Date() / 1000)
            })

            await db.set((`remind_${message.guild.id}_${member.id}`), database)

            await message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${message.author} tu recordatorio se ha creado correctamente.`)
                .addField("Información del Recordatorio", `Formato del Recordatorio: Mensaje Directo
Tiempo del Recordatorio: ${remindTime}
Razón del Recordatorio: ${remindReason}`)
                ]
            })
            
            setTimeout(async function() {
                db.delete(`remind_${message.guild.id}_${member.id}`)
                return message.member.send({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setDescription(`${message.author} ya se ha acabado el tiempo del recordatorio.`)
                    .addField("Información del Recordatorio", `Formato del Recordatorio: Mensaje Directo
Tiempo del Recordatorio: ${remindTime}
Razón del Recordatorio: ${remindReason}`)
                    ]
                })
            }, ms(remindTime))
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 5623" })
                .setDescription("Ha ocurrido al realizar el recordatorio correctamente.")
                ]
            })
        }
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}