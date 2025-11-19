const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'stocks',
    category: 'Trading',
    description: '📊 Ver todas las acciones ficticias disponibles',
    aliases: ['stock', 'market', 'acciones'],
    usage: '[ticker]',
    example: 'stocks DISC',

    async execute(client, message, args, prefix) {
        try {
            // Si especificó un ticker, mostrar detalles
            if (args[0]) {
                const ticker = args[0].toUpperCase();
                const stockData = tradingUtils.obtenerPrecioStock(ticker);

                if (!stockData) {
                    return message.reply('❌ Acción no encontrada!');
                }

                const { precio, cambio24h, alto24h, bajo24h, empresa } = stockData;
                const esPositivo = cambio24h >= 0;

                const embed = new EmbedBuilder()
                    .setColor(esPositivo ? tradingConfig.colores.verde : tradingConfig.colores.rojo)
                    .setTitle(`${empresa.emoji} ${empresa.nombre} (${ticker})`)
                    .setDescription(empresa.descripcion)
                    .addFields(
                        {
                            name: '💵 Precio Actual',
                            value: `$${precio.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: `${esPositivo ? '📈' : '📉'} Cambio 24h`,
                            value: `${esPositivo ? '+' : ''}${cambio24h.toFixed(2)}%`,
                            inline: true
                        },
                        {
                            name: '📊 Sector',
                            value: empresa.sector,
                            inline: true
                        },
                        {
                            name: '📈 Alto 24h',
                            value: `$${alto24h.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: '📉 Bajo 24h',
                            value: `$${bajo24h.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: '🎲 Volatilidad',
                            value: `${(empresa.volatilidad * 100).toFixed(0)}%`,
                            inline: true
                        }
                    )
                    .setFooter({ text: `💡 Usa ${prefix}buy-stock ${ticker} <cantidad> para comprar` });

                return message.reply({ embeds: [embed] });
            }

            // Mostrar todas las acciones
            const embed = new EmbedBuilder()
                .setColor(tradingConfig.colores.principal)
                .setTitle('📊 MERCADO DE ACCIONES')
                .setDescription('Empresas ficticias del servidor - Precios afectados por actividad')
                .setTimestamp();

            let stocksList = '';

            for (const empresa of tradingConfig.stocks.empresas) {
                const stockData = tradingUtils.obtenerPrecioStock(empresa.ticker);
                const cambioEmoji = stockData.cambio24h >= 0 ? '📈' : '📉';
                const cambioColor = stockData.cambio24h >= 0 ? '+' : '';

                stocksList += `${empresa.emoji} **${empresa.ticker}** - $${stockData.precio.toFixed(2)} `;
                stocksList += `${cambioEmoji} ${cambioColor}${stockData.cambio24h.toFixed(2)}%\n`;
            }

            embed.addFields({
                name: '💼 Acciones Disponibles',
                value: stocksList,
                inline: false
            });

            embed.addFields({
                name: '📝 Cómo Operar',
                value:
                    `\`${prefix}stocks <TICKER>\` - Ver detalles\n` +
                    `\`${prefix}buy-stock <TICKER> <cantidad>\` - Comprar\n` +
                    `\`${prefix}sell-stock <TICKER> <cantidad>\` - Vender\n` +
                    `\`${prefix}portfolio\` - Ver tu portafolio`,
                inline: false
            });

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando stocks:', error);
            return message.reply('❌ Error obteniendo información de acciones.');
        }
    },
};
