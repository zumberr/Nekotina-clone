const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "customembed",
    usage: "customembed | customed <título> || <descripción>",
    aliases: ["customed"],
    cooldown: 0,
    example: "customembed | customed <Hello || Soy un Embed.>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Crear un embed personalizado.",
    async run(client, message, args, prefix) {
   try {
    let type;
    let title;
    let description;

    type = args.join(" ").split("||")
    title = type[0];
    description = type.slice(1).join(" ");

    if(!title) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3184" })
            .setDescription(`No se ha proporcionado el título.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!description) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4068" })
            .setDescription(`No se ha proporcionado la descripción.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        await message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setTitle(`${title}`)
            .setDescription(`${description}`)
            ]
        })
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3735" })
            .setDescription("Ha ocurrido un error al crear el embed.")
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}