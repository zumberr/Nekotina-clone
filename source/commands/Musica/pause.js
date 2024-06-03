const {
    Message,
    Client,
    MessageEmbed,
    Permissions
} = require("discord.js");

module.exports = {
    name: "pause",
    aliases: [],
    description: "Pausa la música.",
    usage: "<prefix>pause",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
     async run (client, message, args)  {
        let song = await   client.distube.pause(message.guild.id).setPaused(true);
        message.channel.send(`**${song.name}** está en pausa!`);
    },
};