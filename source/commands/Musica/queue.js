const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "queue",
    aliases: ["q", "cola"],
    description: "Muestra la cola de reproducción",
    category: "music",
    usage: "[página]",
    cooldown: 3,

    async execute(client, message, args) {
        const player = client.manager.get(message.guild.id);

        if (!player) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription("❌ No hay música reproduciéndose en este servidor.")
                ]
            });
        }

        if (!player.queue.current) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription("❌ No hay canciones en la cola.")
                ]
            });
        }

        const current = player.queue.current;
        const queue = player.queue;

        // Paginación
        const songsPerPage = 10;
        const page = args[0] && !isNaN(args[0]) ? parseInt(args[0]) : 1;
        const maxPages = Math.ceil(queue.size / songsPerPage) || 1;

        if (page < 1 || page > maxPages) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ Página inválida. Rango: 1-${maxPages}`)
                ]
            });
        }

        const start = (page - 1) * songsPerPage;
        const end = start + songsPerPage;
        const tracks = queue.slice(start, end);

        const embed = new MessageEmbed()
            .setColor("#4B0082")
            .setTitle(`📃 Cola de música - ${message.guild.name}`)
            .setDescription(`**Reproduciendo ahora:**\n[${current.title}](${current.uri}) - \`${formatDuration(current.duration)}\`\n\n${
                tracks.length > 0
                    ? tracks.map((track, i) => `**${start + i + 1}.** [${track.title}](${track.uri}) - \`${formatDuration(track.duration)}\``).join('\n')
                    : 'No hay más canciones en la cola.'
            }`)
            .addField("Total de canciones", queue.size.toString(), true)
            .addField("Duración total", formatDuration(queue.duration), true)
            .addField("Página", `${page}/${maxPages}`, true);

        if (current.thumbnail) {
            embed.setThumbnail(current.thumbnail);
        }

        message.reply({ embeds: [embed] });
    }
};

function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const hoursStr = hours > 0 ? `${hours}:` : '';
    const minutesStr = minutes < 10 && hours > 0 ? `0${minutes}` : minutes;
    const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

    return `${hoursStr}${minutesStr}:${secondsStr}`;
}
