const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "birthday",
    usage: "birthday | bday <set | get | delete> <...>",
    aliases: ["bday"],
    cooldown: 2,
    example: "birthday | bday <set | 8/20 / get | <@Discord#0000 | 1234567890> / delete | null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener y establecer tu fecha de cumpleaños.",
    async run(client, message, args, prefix) {
   try {
    let format, months, joined, split;
    format = args[0];
    months = { "1": "Enero", "2": "Febrero", "3": "Marzo", "4": "Abril", "5": "Mayo", "6": "Junio", "7": "Julio", "8": "Agosto", "9": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre" }
    joined = args.slice(1).join(" ");
    split = joined.trim().split("/");

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5834" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso corecto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "set") {
        let [month, day] = split;

        if(!month) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6777" })
                .setDescription(`No se ha proporcionado el mes.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(!day) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7291" })
                .setDescription(`No se ha proporcionado el día.\n\nUso correcto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(day > 31) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7881" })
                .setDescription("Se ha proporcionado un día invalido.")
                ]
            })
        } else if(month > 12) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7882" })
                .setDescription("Se ha proporcionado un mes invalido.")
                ]
            })
        } else if(isNaN(day) || isNaN(month)) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6833" })
                .setDescription("Se ha proporcionado un formato invalido.")
                ]
            })
        } else try {
            await client.database.set(`birthday_${message.guild.id}_${message.author.id}`, {
                birthday: `${day} de ${months[month]}`,
            })

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription("Se ha establecido tu cumpleaños en la base de datos del servidor correctamente.")
                ]
            })
        } catch(error) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 6897" })
                .setDescription("Ha ocurrido un error al intentar establecer la fecha del cumpleaños.")
                ]
            })
        }
    } else if(format === "get") {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let birthday = await client.database.get(`birthday_${message.guild.id}_${member.id}`)
        let res;

        if(birthday === undefined || birthday === null || !birthday) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 7251" })
                .setDescription("El usuario mencionado actualmente no ha establecido su fecha de cumpleaños en la base de datos del servidor.")
                ]
            })
        } else if(birthday.birthday.includes(undefined)) {
            res = "No se ha proporcionado una fecha valida al establecer la fecha de cumpleaños.\n\nLa razón de esto puede ser que al intentar establecer la fecha de cunpleaños lo puso de esa forma: `20/8`, lo cual esta mal, es de esta forma: `8/20`";
        } else {
            res = `${member} cumple años el ${birthday.birthday}`;
        }
    
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(res)
            ]
        })
    } else if(format === "delete") {
        client.database.delete(`birthday_${message.guild.id}_${message.author.id}`)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Se ha removido tu cumpleaños de la base de datos del servidor correctamente.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}