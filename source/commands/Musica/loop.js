const {
    Message,
    Client,
    MessageEmbed,
    Permissions
} = require("discord.js");

module.exports = {
    name: "repeatqueue",
    aliases: ["loop"],
    description: "Repite la cola",
    usage: "<prefix>loop",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
     async run (client, message, args)  {
        client.player.getQueue(message.guild.id).setRepeatMode(RepeatMode.QUEUE)
        
        let queue = await client.player.getQueue(message.guild.id);
        // obtiene la cancion actual
        let song = await queue.play()
        message.channel.send("La lista se reproducirá indefinidamente! <:emoji_19:1045823671350087791>");
    },
};