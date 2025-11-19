const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const lavalinkConfig = require("../config/lavalink.json");
const logger = require("../logger");

/**
 * Inicializa el gestor de música de Lavalink
 * @param {Client} client - Cliente de Discord.js
 * @returns {Manager} Gestor de música configurado
 */
function initMusicManager(client) {
    // Configurar plugins
    const plugins = [];

    // Plugin de Spotify (si está configurado)
    if (lavalinkConfig.spotify.clientID && lavalinkConfig.spotify.clientSecret) {
        plugins.push(
            new Spotify({
                clientID: lavalinkConfig.spotify.clientID,
                clientSecret: lavalinkConfig.spotify.clientSecret,
            })
        );
        logger.info("Plugin de Spotify cargado");
    }

    // Crear el manager
    const manager = new Manager({
        nodes: lavalinkConfig.nodes,
        plugins: plugins,
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
        autoPlay: true,
    });

    // Eventos del manager
    manager.on("nodeConnect", (node) => {
        logger.info(`Nodo de Lavalink "${node.options.host}" conectado`);
    });

    manager.on("nodeError", (node, error) => {
        logger.error(`Error en el nodo de Lavalink "${node.options.host}": ${error.message}`);
    });

    manager.on("trackStart", (player, track) => {
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) {
            channel.send({
                embeds: [{
                    color: 0x00FF00,
                    title: "🎵 Reproduciendo ahora",
                    description: `[${track.title}](${track.uri})`,
                    fields: [
                        {
                            name: "Autor",
                            value: track.author,
                            inline: true
                        },
                        {
                            name: "Duración",
                            value: formatDuration(track.duration),
                            inline: true
                        },
                        {
                            name: "Solicitado por",
                            value: `<@${track.requester.id}>`,
                            inline: true
                        }
                    ],
                    thumbnail: {
                        url: track.thumbnail || track.displayThumbnail("maxresdefault")
                    },
                    timestamp: new Date()
                }]
            });
        }
    });

    manager.on("queueEnd", (player) => {
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) {
            channel.send({
                embeds: [{
                    color: 0xFF0000,
                    title: "⏹️ Cola terminada",
                    description: "No hay más canciones en la cola. El reproductor se desconectará en 2 minutos si no se agrega más música.",
                    timestamp: new Date()
                }]
            });
        }

        // Destruir el player después de 2 minutos de inactividad
        setTimeout(() => {
            if (!player.playing && player.queue.size === 0) {
                player.destroy();
            }
        }, 120000);
    });

    manager.on("playerMove", (player, oldChannel, newChannel) => {
        if (!newChannel) {
            player.destroy();
        } else {
            player.voiceChannel = newChannel;
        }
    });

    manager.on("trackStuck", (player, track, threshold) => {
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) {
            channel.send({
                embeds: [{
                    color: 0xFFA500,
                    title: "⚠️ Canción atascada",
                    description: `La canción **${track.title}** se atascó y será omitida.`,
                    timestamp: new Date()
                }]
            });
        }
        player.stop();
    });

    manager.on("trackError", (player, track, error) => {
        const channel = client.channels.cache.get(player.textChannel);
        if (channel) {
            channel.send({
                embeds: [{
                    color: 0xFF0000,
                    title: "❌ Error al reproducir",
                    description: `Hubo un error al reproducir **${track.title}**.`,
                    timestamp: new Date()
                }]
            });
        }
        logger.error(`Error al reproducir ${track.title}: ${error.message}`);
    });

    return manager;
}

/**
 * Formatea la duración de milisegundos a formato legible
 * @param {number} ms - Duración en milisegundos
 * @returns {string} Duración formateada
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
 * Verifica si el usuario está en un canal de voz válido
 * @param {GuildMember} member - Miembro del servidor
 * @returns {Object} Objeto con estado y mensaje de error si aplica
 */
function checkVoiceChannel(member) {
    if (!member.voice.channel) {
        return {
            valid: false,
            message: "Debes estar en un canal de voz para usar este comando."
        };
    }

    if (!member.voice.channel.joinable) {
        return {
            valid: false,
            message: "No tengo permisos para unirme a tu canal de voz."
        };
    }

    if (!member.voice.channel.speakable) {
        return {
            valid: false,
            message: "No tengo permisos para hablar en tu canal de voz."
        };
    }

    return { valid: true };
}

/**
 * Verifica si el bot y el usuario están en el mismo canal de voz
 * @param {GuildMember} member - Miembro del servidor
 * @param {Player} player - Player de música
 * @returns {Object} Objeto con estado y mensaje de error si aplica
 */
function checkSameVoiceChannel(member, player) {
    if (!member.voice.channel) {
        return {
            valid: false,
            message: "Debes estar en un canal de voz para usar este comando."
        };
    }

    if (player && member.voice.channel.id !== player.voiceChannel) {
        return {
            valid: false,
            message: "Debes estar en el mismo canal de voz que yo para usar este comando."
        };
    }

    return { valid: true };
}

module.exports = {
    initMusicManager,
    formatDuration,
    checkVoiceChannel,
    checkSameVoiceChannel
};
