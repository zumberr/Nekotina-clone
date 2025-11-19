const { MessageEmbed } = require("discord.js");
const { checkVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "play",
    aliases: ["p", "reproducir"],
    description: "Reproduce música en tu canal de voz",
    category: "music",
    usage: "<canción o URL>",
    cooldown: 3,

    /**
     * @param {import("../../types").ClientExt} client - Cliente de Discord
     * @param {import("discord.js").Message} message - Mensaje de Discord
     * @param {string[]} args - Argumentos del comando
     */
    async execute(client, message, args) {
        // Verificar conexión a canal de voz
        const vcCheck = checkVoiceChannel(message.member);
        if (!vcCheck.valid) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ ${vcCheck.message}`)
                ]
            });
        }

        // Validar argumentos
        if (!args.length) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ Especifica una canción o URL\nEjemplo: \`${client.config.prefix}play despacito\``)
                ]
            });
        }

        // Evitar menciones
        if (message.mentions.users.size > 0 || message.mentions.roles.size > 0) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("ORANGE")
                    .setDescription("⚠️ No puedes mencionar usuarios/roles como nombre de canción")
                ]
            });
        }

        const query = args.join(" ");

        try {
            // Crear o obtener el player
            let player = client.manager.get(message.guild.id);

            if (!player) {
                player = client.manager.create({
                    guild: message.guild.id,
                    voiceChannel: message.member.voice.channel.id,
                    textChannel: message.channel.id,
                    selfDeafen: true,
                });
            }

            // Conectar al canal de voz si no está conectado
            if (player.state !== "CONNECTED") {
                player.connect();
            }

            // Buscar la canción
            const res = await client.manager.search(query, message.author);

            // Verificar si se encontraron resultados
            if (res.loadType === "NO_MATCHES" || !res.tracks.length) {
                if (!player.queue.current) player.destroy();
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setDescription("🔍 No se encontraron resultados para tu búsqueda.")
                    ]
                });
            }

            // Agregar canciones a la cola
            if (res.loadType === "PLAYLIST_LOADED") {
                player.queue.add(res.tracks);

                await message.reply({
                    embeds: [new MessageEmbed()
                        .setColor("#4B0082")
                        .setTitle("📃 Playlist añadida")
                        .setDescription(`**${res.playlist.name}**`)
                        .addField("Canciones", res.tracks.length.toString(), true)
                        .addField("Duración", formatPlaylistDuration(res.tracks), true)
                        .addField("Solicitado por", message.author.toString(), true)
                    ]
                });
            } else {
                const track = res.tracks[0];
                player.queue.add(track);

                // Si no hay una canción reproduciéndose, no enviar mensaje (el evento trackStart lo hará)
                if (player.playing || player.queue.size > 1) {
                    await message.reply({
                        embeds: [new MessageEmbed()
                            .setColor("#4B0082")
                            .setTitle("🎶 Canción añadida a la cola")
                            .setDescription(`[${track.title}](${track.uri})`)
                            .addField("Autor", track.author, true)
                            .addField("Duración", formatDuration(track.duration), true)
                            .addField("Posición en cola", player.queue.size.toString(), true)
                            .setThumbnail(track.thumbnail || track.displayThumbnail("maxresdefault"))
                        ]
                    });
                }
            }

            // Reproducir si no está reproduciendo
            if (!player.playing && !player.paused && !player.queue.size) {
                player.play();
            }

        } catch (error) {
            console.error(error);
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ Ocurrió un error al procesar tu solicitud: ${error.message}`)
                ]
            });
        }
    }
};

/**
 * Formatea la duración en milisegundos a formato legible
 */
function formatDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const hoursStr = hours > 0 ? `${hours}:` : '';
    const minutesStr = minutes < 10 && hours > 0 ? `0${minutes}` : minutes;
    const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

    return `${hoursStr}${minutesStr}:${secondsStr}`;
}

/**
 * Calcula la duración total de una playlist
 */
function formatPlaylistDuration(tracks) {
    const totalMs = tracks.reduce((acc, track) => acc + track.duration, 0);
    return formatDuration(totalMs);
}
