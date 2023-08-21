const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "banlist",
    usage: "banlist | banl <No ARGS>",
    aliases: ["banl"],
    example: "banlist | banl <No ARGS>",
    ownerOnly: false,
    UserPerms: ["BAN_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD"],
    description: "Obtener la lista de baneados del Servidor.",
    async run(client, message, args, prefix) {
   try {
    let format;
    let fetched;
    format = message.guild.bans.fetch();
    fetched = (await format).map((member) => `${member.user.tag} | ${member.user.id} | ${member.reason}`).join("\n");

    if(!fetched) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4687" })
            .setDescription("No hay baneados activos actualmente en la lista de baneados del servidor.")
            ]
        })
    } else {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Lista de baneados de ${message.guild.name}` })
            .setDescription(`\`\`\`${fetched}\`\`\``)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}