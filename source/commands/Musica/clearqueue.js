const {
    Message,
    Client,
    MessageEmbed,
    Permissions
} = require("discord.js");

module.exports = {
    name: "clearqueue",
    aliases: [],
    description: "Limpia la lista de reproduccion.",
    usage: "<prefix>clearqueue",

     async run (client, message, args) {
        client.player.getQueue(message.guild.id).shuffle();
        message.channel.send('Toda la lista de musica ha sido limpiada')
    },
};