const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "channelnuke",
    usage: "channelnuke | nuke <#MessageChannel>",
    aliases: ["nuke"],
    cooldown: 0,
    example: "channelnuke | nuke <#MessageChannel>",
    ownerOnly: false,
    UserPerms: ["MANAGE_CHANNELS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"],
    description: "Eliminar el canal y dejarlo como nuevo en el mismo parentID.",
    async run(client, message, args, prefix) {
    try {
    let channel;
    channel = await message.channel;
    await channel.clone().then((cl) => {
        cl.setParent(channel.parentId);
        cl.setPosition(channel.position);
        setTimeout(() => channel.delete(), 1);

        cl.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`El canal ha sido nukeado correctamente.\n\nNuke hecho por:\n\` ${message.author.tag} \``)
            ]
        })
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}