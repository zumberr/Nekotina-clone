const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "bugreport",
    usage: "bugreport | report <cotenido>",
    aliases: ["report"],
    cooldown: 0,
    example: "bugreport | report Say no manda el mensaje correctamente.",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Reportar un bug/error encontrado, este comando es unica y exclusivamente para este proposito.",
    async run(client, message, args, prefix) {
   try {
    let channel;
    let content;

    if(!args[0]) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2618" })
            .setDescription("No se ha proporcionado el contenido del reporte.\n\nUso correcto del comando: \n` bugreport | report <contenido> `")
            ])
        })
    } else {
            channel = client.channels.cache.get("953098023259471907");
            content = args.slice(0).join(" ");

            const report = new MessageEmbed()
            .setColor("#fbd9ff")
            .addFields(
                { name: "Autor del Reporte", value: `\`\`\`${message.member.user.tag.toString()}\`\`\``, inline: true},
                { name: "Servidor proveniente", value: `\`\`\`${message.guild.name}\`\`\``, inline: true },
                { name: "Contenido del Reporte", value: `\`\`\`${content}\`\`\``},
            )
            return channel.send({ embeds: [report] })
        }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}