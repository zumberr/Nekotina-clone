const {
    Message,
    Client,
    MessageEmbed,
    Permissions
} = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["nowplay"],
    description: "Muestra lo que reproduzco ahora",
    usage: "<prefix>nowplaying | nowplay",
    example: "*nowplay",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    async run (client, message, args) {
          let queue = await client.player.getQueue(message.guild.id);
        let song = await queue.play();
                let embed = new MessageEmbed()
            .setColor('#f5beba')
            .setDescription(`Canción actual: **${song.name}**`)
        message.channel.send({ embeds: [embed]
        });
    },
};