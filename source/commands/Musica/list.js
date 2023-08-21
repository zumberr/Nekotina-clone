const {
    Message,
    Client,
    MessageEmbed,
    Permissions
} = require("discord.js");

module.exports = {
    name: "list",
  aliases: ["cola"],
  category: 'Musica',
  description: '¡Muestra la lista de musica!',
  usage: 'list | cola <no args>',
// bot
  async run(client, message, args) {
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
        let queue = await client.player.getQueue(message.guild.id);
        let embed = new MessageEmbed()
            .setColor('#f5beba')
            .setDescription(
                'Pistas musicales :\n' + (queue.songs.map((song, i) => {
                    return `${i === 0 ? 'En curso de la cola' : `#${i+1}`} - **${song.name}** | *${song.author}*`
                }).join('\n'))
            )
        message.channel.send({
            embeds: [embed]
        });
    },
};