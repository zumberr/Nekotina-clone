const { EmbedBuilder } = require('discord.js');
const casinoConfig = require('../../config/casino');

module.exports = {
    name: 'casino',
    category: 'Casino',
    description: '🎰 Información general del casino',
    aliases: ['cas', 'juegos'],
    usage: '',
    example: 'casino',

    async execute(client, message, args, prefix) {
        try {
            const embed = new EmbedBuilder()
                .setColor(casinoConfig.colores.principal)
                .setTitle(`${casinoConfig.emojis.casino} CASINO VIRTUAL`)
                .setDescription(
                    `¡Bienvenido al casino más adictivo de Discord!\n` +
                    `Juega, gana, y sube de nivel VIP para mejores recompensas.\n\n` +
                    `${casinoConfig.emojis.diamante} **Provably Fair** - Todos los juegos son verificables\n` +
                    `${casinoConfig.emojis.corona} **Sistema VIP** - Rakeback hasta 20%\n` +
                    `${casinoConfig.emojis.grafica} **Estadísticas** - Trackea todo tu progreso`
                )
                .setThumbnail(message.guild?.iconURL() || null)
                .setTimestamp();

            // Juegos disponibles
            embed.addFields(
                {
                    name: `${casinoConfig.crash.emojis.rocket} Crash`,
                    value:
                        `El multiplicador sube... ¡Cobra antes del crash!\n` +
                        `**Comando:** \`${prefix}crash <apuesta> <objetivo>\`\n` +
                        `**Ejemplo:** \`${prefix}crash 1000 2.5\``,
                    inline: true
                },
                {
                    name: `${casinoConfig.dice.emojis.dice} Dice`,
                    value:
                        `Ajusta tu probabilidad de ganar!\n` +
                        `**Comando:** \`${prefix}dice <apuesta> [chance]\`\n` +
                        `**Ejemplo:** \`${prefix}dice 1000 50\``,
                    inline: true
                },
                {
                    name: `${casinoConfig.slots.emojis.slot} Slots`,
                    value:
                        `Gira y consigue 3 símbolos iguales!\n` +
                        `**Comando:** \`${prefix}slots <apuesta>\`\n` +
                        `**Ejemplo:** \`${prefix}slots 500\``,
                    inline: true
                },
                {
                    name: `${casinoConfig.plinko.emojis.ball} Plinko`,
                    value:
                        `La bola cae por los pines!\n` +
                        `**Comando:** \`${prefix}plinko <apuesta> [riesgo]\`\n` +
                        `**Ejemplo:** \`${prefix}plinko 1000 alto\``,
                    inline: true
                },
                {
                    name: `${casinoConfig.mines.emojis.mine} Mines`,
                    value:
                        `Buscaminas estratégico!\n` +
                        `**Comando:** \`${prefix}mines start <apuesta> <minas>\`\n` +
                        `**Ejemplo:** \`${prefix}mines start 1000 5\``,
                    inline: true
                },
                {
                    name: `${casinoConfig.emojis.trofeo} Más Juegos`,
                    value:
                        `Próximamente: Roulette, Blackjack, y más!\n` +
                        `${casinoConfig.emojis.fuego} Stay tuned!`,
                    inline: true
                }
            );

            // Sistema de Rakeback
            embed.addFields({
                name: `${casinoConfig.emojis.diamante} Sistema de Rakeback`,
                value:
                    `Recibe un porcentaje de tus pérdidas de vuelta!\n\n` +
                    `**Niveles VIP:**\n` +
                    `🥉 Bronce: 5% | 🥈 Plata: 7% | 🥇 Oro: 10%\n` +
                    `💎 Platino: 12% | 👑 Diamante: 15% | ⭐ Élite: 20%\n\n` +
                    `**Reclama:** \`${prefix}rakeback\``,
                inline: false
            });

            // Comandos útiles
            embed.addFields({
                name: `${casinoConfig.emojis.grafica} Comandos Útiles`,
                value:
                    `\`${prefix}casino-stats\` - Ver tus estadísticas\n` +
                    `\`${prefix}casino-leaderboard\` - Ver ranking\n` +
                    `\`${prefix}rakeback\` - Reclamar rakeback\n` +
                    `\`${prefix}balance\` - Ver tu dinero`,
                inline: false
            });

            // Footer con límites
            embed.setFooter({
                text: `💰 Apuesta mínima: $${casinoConfig.general.apuestaMinima.toLocaleString()} | House Edge: ${(casinoConfig.general.houseEdge * 100).toFixed(1)}%`
            });

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando casino:', error);
            return message.reply('Ocurrió un error al mostrar la información del casino.');
        }
    },
};
