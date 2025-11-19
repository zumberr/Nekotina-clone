const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'casino-leaderboard',
    category: 'Casino',
    description: '🏆 Ver el ranking del casino',
    aliases: ['casinolb', 'clb', 'topcasino'],
    usage: '[categoria]',
    example: 'casino-leaderboard volumen',

    async execute(client, message, args, prefix) {
        try {
            const categoria = args[0]?.toLowerCase() || 'volumen';

            let titulo = '';
            let sortField = '';
            let descripcion = '';

            // Determinar categoría
            switch (categoria) {
                case 'volumen':
                case 'v':
                    titulo = '💰 Top Apostadores';
                    sortField = 'casinoStats.volumenTotal';
                    descripcion = 'Jugadores con mayor volumen total apostado';
                    break;

                case 'ganancia':
                case 'ganancias':
                case 'g':
                    titulo = '💎 Top Ganadores';
                    sortField = 'casinoStats.totalGanado';
                    descripcion = 'Jugadores con mayores ganancias totales';
                    break;

                case 'racha':
                case 'r':
                    titulo = '🔥 Top Rachas';
                    sortField = 'casinoStats.mejorRacha';
                    descripcion = 'Mejores rachas de victorias consecutivas';
                    break;

                case 'multiplicador':
                case 'mult':
                case 'm':
                    titulo = '🚀 Top Multiplicadores';
                    sortField = 'casinoStats.mayorMultiplicador';
                    descripcion = 'Multiplicadores más altos conseguidos';
                    break;

                case 'vip':
                    titulo = '👑 Top Nivel VIP';
                    sortField = 'casinoStats.nivelVIP';
                    descripcion = 'Jugadores con nivel VIP más alto';
                    break;

                default:
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.info)
                            .setTitle(`${casinoConfig.emojis.trofeo} CASINO LEADERBOARD`)
                            .setDescription(
                                `**Categorías disponibles:**\n\n` +
                                `\`${prefix}casino-leaderboard volumen\` - Mayor volumen apostado\n` +
                                `\`${prefix}casino-leaderboard ganancia\` - Mayores ganancias\n` +
                                `\`${prefix}casino-leaderboard racha\` - Mejores rachas\n` +
                                `\`${prefix}casino-leaderboard multiplicador\` - Multiplicadores más altos\n` +
                                `\`${prefix}casino-leaderboard vip\` - Niveles VIP\n\n` +
                                `**Ejemplo:** \`${prefix}casino-leaderboard volumen\``
                            )
                            .setFooter({ text: '🎰 Casino Virtual' })
                        ]
                    });
            }

            // Obtener top usuarios
            const sortQuery = {};
            sortQuery[sortField] = -1;

            const topUsuarios = await User.find({ 'casinoStats': { $exists: true } })
                .sort(sortQuery)
                .limit(10)
                .lean();

            if (topUsuarios.length === 0) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.info)
                        .setDescription(`${economyConfig.emojis.info} Aún no hay jugadores en esta categoría!`)
                    ]
                });
            }

            // Crear embed
            const embed = new EmbedBuilder()
                .setColor(casinoConfig.colores.principal)
                .setTitle(`${casinoConfig.emojis.trofeo} ${titulo}`)
                .setDescription(descripcion)
                .setTimestamp()
                .setFooter({ text: '🎰 Casino Virtual' });

            // Construir leaderboard
            let leaderboardText = '';
            const userPos = topUsuarios.findIndex(u => u.idusuario === message.author.id);

            for (let i = 0; i < topUsuarios.length; i++) {
                const usuario = topUsuarios[i];
                const stats = usuario.casinoStats;

                // Emoji de posición
                let posEmoji = '';
                if (i === 0) posEmoji = '🥇';
                else if (i === 1) posEmoji = '🥈';
                else if (i === 2) posEmoji = '🥉';
                else posEmoji = `${i + 1}.`;

                // Valor a mostrar según categoría
                let valor = '';
                switch (categoria) {
                    case 'volumen':
                    case 'v':
                        valor = `$${stats.volumenTotal?.toLocaleString() || 0}`;
                        break;
                    case 'ganancia':
                    case 'ganancias':
                    case 'g':
                        valor = `$${stats.totalGanado?.toLocaleString() || 0}`;
                        break;
                    case 'racha':
                    case 'r':
                        valor = `${stats.mejorRacha || 0} victorias`;
                        break;
                    case 'multiplicador':
                    case 'mult':
                    case 'm':
                        valor = `${stats.mayorMultiplicador || 0}x`;
                        break;
                    case 'vip':
                        const niveles = casinoConfig.rakeback.niveles;
                        const nivel = niveles[stats.nivelVIP || 0];
                        valor = `${nivel.nombre} (${(nivel.rakeback * 100).toFixed(1)}%)`;
                        break;
                }

                // Destacar al usuario actual
                const destacado = usuario.idusuario === message.author.id ? ' **← TÚ**' : '';

                leaderboardText += `${posEmoji} **${usuario.username}** - ${valor}${destacado}\n`;
            }

            embed.addFields({
                name: '🏆 Ranking',
                value: leaderboardText,
                inline: false
            });

            // Mostrar posición del usuario si no está en top 10
            if (userPos === -1) {
                const usuario = await User.findOne({ idusuario: message.author.id });

                if (usuario?.casinoStats) {
                    const stats = usuario.casinoStats;

                    let tuValor = '';
                    switch (categoria) {
                        case 'volumen':
                        case 'v':
                            tuValor = `$${stats.volumenTotal?.toLocaleString() || 0}`;
                            break;
                        case 'ganancia':
                        case 'ganancias':
                        case 'g':
                            tuValor = `$${stats.totalGanado?.toLocaleString() || 0}`;
                            break;
                        case 'racha':
                        case 'r':
                            tuValor = `${stats.mejorRacha || 0} victorias`;
                            break;
                        case 'multiplicador':
                        case 'mult':
                        case 'm':
                            tuValor = `${stats.mayorMultiplicador || 0}x`;
                            break;
                        case 'vip':
                            const niveles = casinoConfig.rakeback.niveles;
                            const nivel = niveles[stats.nivelVIP || 0];
                            tuValor = `${nivel.nombre}`;
                            break;
                    }

                    embed.addFields({
                        name: '📊 Tu Posición',
                        value: `Fuera del top 10 - **${tuValor}**\n${casinoConfig.emojis.fuego} ¡Sigue jugando para subir!`,
                        inline: false
                    });
                }
            }

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando casino-leaderboard:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al obtener el leaderboard.`)
                ]
            });
        }
    },
};
