const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoUtils = require('../../utils/casinoUtils');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'casino-stats',
    category: 'Casino',
    description: '📊 Ver tus estadísticas del casino',
    aliases: ['casinostats', 'cstats', 'statsca'],
    usage: '[usuario]',
    example: 'casino-stats @usuario',

    async execute(client, message, args, prefix) {
        try {
            // Obtener usuario objetivo
            const targetUser = message.mentions.users.first() || message.author;
            const targetId = targetUser.id;

            // Buscar en base de datos
            const usuario = await User.findOne({ idusuario: targetId });

            if (!usuario || !usuario.casinoStats) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.info)
                        .setDescription(
                            `${economyConfig.emojis.info} ${targetUser.username} aún no ha jugado en el casino!`
                        )
                    ]
                });
            }

            const stats = usuario.casinoStats;

            // Calcular ganancias netas
            const gananciaNeta = stats.totalGanado - stats.totalPerdido;
            const esPositivo = gananciaNeta >= 0;

            // Calcular nivel VIP
            const nivelVIP = casinoUtils.calcularNivelVIP(stats.volumenTotal);

            // Calcular próximo nivel VIP
            const niveles = casinoConfig.rakeback.niveles;
            const siguienteNivel = niveles[nivelVIP.nivel + 1];
            const progresoNivel = siguienteNivel ?
                ((stats.volumenTotal - nivelVIP.volumenRequerido) / (siguienteNivel.volumenRequerido - nivelVIP.volumenRequerido) * 100).toFixed(1) :
                100;

            // Calcular juego favorito
            let juegoFavorito = 'Ninguno';
            let mayorVolumen = 0;

            if (stats.volumenPorJuego) {
                for (const [juego, volumen] of Object.entries(stats.volumenPorJuego)) {
                    if (volumen > mayorVolumen) {
                        mayorVolumen = volumen;
                        juegoFavorito = juego.charAt(0).toUpperCase() + juego.slice(1);
                    }
                }
            }

            // Crear embed
            const embed = new EmbedBuilder()
                .setColor(casinoConfig.colores.principal)
                .setAuthor({
                    name: `${targetUser.username} - Estadísticas del Casino`,
                    iconURL: targetUser.displayAvatarURL()
                })
                .setTitle(`${casinoConfig.emojis.casino} ESTADÍSTICAS DE CASINO`)
                .setTimestamp();

            // Stats generales
            embed.addFields(
                {
                    name: '💰 Resumen Financiero',
                    value:
                        `**Total Apostado:** $${stats.totalApostado.toLocaleString()}\n` +
                        `**Total Ganado:** $${stats.totalGanado.toLocaleString()}\n` +
                        `**Total Perdido:** $${stats.totalPerdido.toLocaleString()}\n` +
                        `**Balance Neto:** ${esPositivo ? economyConfig.emojis.ganancia : economyConfig.emojis.perdida} $${Math.abs(gananciaNeta).toLocaleString()}`,
                    inline: true
                },
                {
                    name: '🏆 Récords',
                    value:
                        `**Mejor Racha:** ${stats.mejorRacha} victorias\n` +
                        `**Racha Actual:** ${stats.rachaActual}\n` +
                        `**Mayor Multiplicador:** ${stats.mayorMultiplicador}x\n` +
                        `**Mayor Ganancia:** $${stats.mayorGanancia.toLocaleString()}`,
                    inline: true
                }
            );

            // Nivel VIP
            embed.addFields({
                name: `👑 Nivel VIP: ${nivelVIP.nombre}`,
                value:
                    `**Rakeback:** ${(nivelVIP.rakeback * 100).toFixed(1)}%\n` +
                    `**Volumen Total:** $${stats.volumenTotal.toLocaleString()}\n` +
                    `**Rakeback Acumulado:** $${stats.rakeback.toLocaleString()}\n` +
                    (siguienteNivel ?
                        `**Progreso:** ${progresoNivel}% → ${siguienteNivel.nombre}` :
                        `**Estado:** ¡Nivel Máximo! 🎉`),
                inline: false
            });

            // Juegos jugados
            if (stats.apuestasPorJuego && Object.keys(stats.apuestasPorJuego).length > 0) {
                let juegosList = '';

                for (const [juego, cantidad] of Object.entries(stats.apuestasPorJuego)) {
                    const volumen = stats.volumenPorJuego[juego] || 0;
                    const juegoNombre = juego.charAt(0).toUpperCase() + juego.slice(1);
                    juegosList += `**${juegoNombre}:** ${cantidad} apuestas ($${volumen.toLocaleString()})\n`;
                }

                embed.addFields({
                    name: '🎮 Juegos Jugados',
                    value: juegosList || 'Ninguno',
                    inline: false
                });
            }

            // Información adicional
            embed.addFields({
                name: '📊 Info Adicional',
                value:
                    `**Juego Favorito:** ${juegoFavorito}\n` +
                    `**ROI:** ${((gananciaNeta / stats.totalApostado) * 100).toFixed(2)}%`,
                inline: false
            });

            // Mensaje motivacional
            if (esPositivo) {
                embed.setDescription(
                    `${casinoConfig.emojis.fuego} ¡Vas ganando en el casino!\n` +
                    `Sigue así y alcanza el siguiente nivel VIP.`
                );
            } else if (stats.rachaActual >= 3) {
                embed.setDescription(
                    `${casinoConfig.emojis.estrella} ¡Racha de ${stats.rachaActual} victorias!\n` +
                    `${casinoUtils.obtenerMensajePsicologico('gananciaGrande')}`
                );
            } else {
                embed.setDescription(
                    `${casinoConfig.emojis.grafica} Estadísticas completas del casino\n` +
                    `Recuerda reclamar tu rakeback con \`!rakeback\``
                );
            }

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando casino-stats:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al obtener las estadísticas.`)
                ]
            });
        }
    },
};
