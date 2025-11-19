const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "now", "actual"],
    description: "Muestra la canción que se está reproduciendo",
    category: "music",
    usage: "",
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

        const current = player.queue.current;

        if (!current) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription("❌ No hay una canción reproduciéndose actualmente.")
                ]
            });
        }

        const position = player.position;
        const duration = current.duration;
        const bar = createProgressBar(position, duration);

        const embed = new MessageEmbed()
            .setColor("#4B0082")
            .setTitle("🎵 Reproduciendo ahora")
            .setDescription(`[${current.title}](${current.uri})`)
            .addField("Autor", current.author, true)
            .addField("Duración", formatDuration(duration), true)
            .addField("Solicitado por", `<@${current.requester.id}>`, true)
            .addField("Progreso", `${bar}\n\`${formatDuration(position)} / ${formatDuration(duration)}\``)
            .setThumbnail(current.thumbnail || current.displayThumbnail("maxresdefault"))
            .setTimestamp();

        if (player.queue.size > 0) {
            embed.addField("Siguiente", `[${player.queue[0].title}](${player.queue[0].uri})`, false);
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

function createProgressBar(current, total, barSize = 15) {
    const percentage = current / total;
    const progress = Math.round(barSize * percentage);
    const emptyProgress = barSize - progress;

    const progressText = '▇'.repeat(progress);
    const emptyProgressText = '—'.repeat(emptyProgress);

    return `${progressText}${emptyProgressText}`;
}
