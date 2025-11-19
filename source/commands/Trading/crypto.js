const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'crypto',
    category: 'Trading',
    description: '₿ Ver precios de criptomonedas reales',
    aliases: ['cripto', 'bitcoin', 'btc'],
    usage: '[ticker]',
    example: 'crypto BTC',

    async execute(client, message, args, prefix) {
        try {
            // Si especificó un ticker
            if (args[0]) {
                const ticker = args[0].toUpperCase();
                const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker);

                if (!moneda) {
                    return message.reply('❌ Criptomoneda no encontrada!');
                }

                const datos = await tradingUtils.obtenerDatosMercadoCrypto(moneda.id);
                const esPositivo = datos.cambio24h >= 0;

                const embed = new EmbedBuilder()
                    .setColor(esPositivo ? tradingConfig.colores.verde : tradingConfig.colores.rojo)
                    .setTitle(`${moneda.emoji} ${moneda.nombre} (${ticker})`)
                    .setDescription(`${moneda.descripcion}\n\n**Precio en vivo desde CoinGecko** 📊`)
                    .addFields(
                        {
                            name: '💵 Precio Actual',
                            value: `$${datos.precio.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`,
                            inline: true
                        },
                        {
                            name: `${esPositivo ? '📈' : '📉'} Cambio 24h`,
                            value: `${esPositivo ? '+' : ''}${datos.cambio24h.toFixed(2)}%`,
                            inline: true
                        },
                        {
                            name: '📊 Market Cap',
                            value: `$${(datos.marketCap / 1e9).toFixed(2)}B`,
                            inline: true
                        },
                        {
                            name: '📈 Alto 24h',
                            value: `$${datos.alto24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`,
                            inline: true
                        },
                        {
                            name: '📉 Bajo 24h',
                            value: `$${datos.bajo24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`,
                            inline: true
                        },
                        {
                            name: '💹 Volumen 24h',
                            value: `$${(datos.volumen / 1e6).toFixed(2)}M`,
                            inline: true
                        }
                    )
                    .setFooter({ text: `💡 Usa ${prefix}buy-crypto ${ticker} <monto> para comprar` })
                    .setTimestamp();

                return message.reply({ embeds: [embed] });
            }

            // Mostrar todas las criptos
            const cryptoIds = tradingConfig.crypto.monedas.map(c => c.id);
            const precios = await tradingUtils.obtenerPreciosCrypto(cryptoIds);

            const embed = new EmbedBuilder()
                .setColor(tradingConfig.colores.principal)
                .setTitle('₿ MERCADO DE CRIPTOMONEDAS')
                .setDescription('Precios en tiempo real desde CoinGecko API 🌐')
                .setTimestamp();

            let cryptoList = '';

            for (const moneda of tradingConfig.crypto.monedas) {
                const datos = precios[moneda.id];
                if (!datos) continue;

                const cambio = datos.usd_24h_change || 0;
                const cambioEmoji = cambio >= 0 ? '📈' : '📉';
                const cambioColor = cambio >= 0 ? '+' : '';

                cryptoList += `${moneda.emoji} **${moneda.ticker}** - $${datos.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `;
                cryptoList += `${cambioEmoji} ${cambioColor}${cambio.toFixed(2)}%\n`;
            }

            embed.addFields({
                name: '💎 Criptomonedas Disponibles',
                value: cryptoList || 'Cargando...',
                inline: false
            });

            embed.addFields({
                name: '📝 Cómo Operar',
                value:
                    `\`${prefix}crypto <TICKER>\` - Ver detalles\n` +
                    `\`${prefix}buy-crypto <TICKER> <monto>\` - Comprar\n` +
                    `\`${prefix}sell-crypto <TICKER> [%]\` - Vender\n` +
                    `\`${prefix}portfolio\` - Ver tu portafolio`,
                inline: false
            });

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando crypto:', error);
            return message.reply('❌ Error obteniendo precios de criptomonedas. Intenta de nuevo.');
        }
    },
};
