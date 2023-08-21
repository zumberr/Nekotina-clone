const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "setnickname",
    usage: "setnickname | setnick <@member | memberID> <newNickname>",
    aliases: ["setnick"],
    cooldown: 0,
    example: "setnickname | setnick @usuario Random",
    ownerOnly: false,
    UserPerms: ["MANAGE_NICKNAMES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_NICKNAMES"],
    description: "Cambiar el nickname de algun miembro en especifico.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let nickname;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    nickname = args.slice(1).join(" ");

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!nickname) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 1637" })
            .setDescription(`No se ha proporcionado el nickname.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(nickname.length > 32) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3850" })
            .setDescription(`Se ha proporcionado un nickname de mas de 32 caracteres, por lo tanto, no se puede crear el nickname.`)
            ]
        })
    } else if(nickname.length < 2) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5292" })
            .setDescription(`Se ha proporcionado un nickname de menos de 2 caracteres, por lo tanto, no se puede crear el nickname.`)
            ]
        })
    } else if(member.id === message.guild.ownerId) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4888" })
            .setDescription(`No puedes establecerle/editarle un nickname al dueño del servidor.`)
            ]
        })
    } else if(message.member.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3201" })
            .setDescription(`No puedes establecerle/editarle el nickname de ${member} ya que tiene un rol mayor que tu o igual.`)
            ]
        })
    } else if(message.guild.me.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4691" })
            .setDescription(`No puedo establecerle/editarle el nickname ya que tiene un rol mayor al mio o igual.`)
            ]
        })
    } else try {
        await member.setNickname(nickname);

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Se ha establecido el nickname/apodo a ${member} correctamente.`)
            .addField("Información del Apodo", `Nickname Establecido: ${nickname}
Fecha de creación del apodo: <t:${Math.floor(Date.now() / 1000)}:R>`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5623" })
            .setDescription("Ha ocurrido al realizar el crear el apodo correctamente.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}