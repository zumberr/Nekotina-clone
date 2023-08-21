const {
    Message,
    Client,
    MessageEmbed,
    Permissions
} = require("discord.js");

module.exports = {
    name: "remove",
    description: "Remueve una cancion de la cola",
    usage: "<prefix>remove <number>",
    example: "*remove 2",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
     async run (client, message, args)  {
        client.player.getQueue(message.guild.id).remove(parseInt(args[0])-1)
        message.channel.send("<:emoji_19:1045823671350087791>", `La canción **${args[0]}** ha sido eliminada de la lista!`);
    },
};