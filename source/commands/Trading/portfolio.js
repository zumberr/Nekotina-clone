const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'portfolio',
    category: 'Trading',
    description: '💼 Ver tu portafolio completo de inversiones',
    aliases: ['portafolio', 'pf', 'holdings'],
    usage: '[@usuario]',
    example: 'portfolio',

    async execute(client, message, args, prefix) {
        try {
            const targetUser = message.mentions.users.first() || message.author;
            const userId = targetUser.id;

            // Obtener valor del portafolio
            const portfolio = await tradingUtils.calcularValorPortafolio(userId);

            if (portfolio.valorTotal === 0 && Object.keys(portfolio.stocks).length === 0 && Object.keys(portfolio.crypto).length === 0) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(tradingConfig.colores.azul)
                        .setDescription(
                            `💼 ${targetUser.username} no tiene inversiones aún.\n\n` +
                            `**Comienza a invertir:**\n` +
                            `\`${prefix}stocks\` - Ver acciones\n` +
                            `\`${prefix}crypto\` - Ver criptomonedas`
                        )
                    ]
                });
            }

            const embed = new EmbedBuilder()
                .setColor(tradingConfig.colores.oro)
                .setAuthor({
                    name: `${targetUser.username} - Portafolio`,
                    iconURL: targetUser.displayAvatarURL()
                })
                .setTitle('💼 PORTAFOLIO DE INVERSIONES')
                .setTimestamp();

            // Efectivo
            embed.addFields({
                name: '💵 Efectivo Disponible',
                value: `$${portfolio.efectivo.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                inline: false
            });

            // Acciones
            if (Object.keys(portfolio.stocks).length > 0) {
                let stocksList = '';
                let totalStocks = 0;

                for (const [ticker, pos] of Object.entries(portfolio.stocks)) {
                    const stockData = tradingUtils.obtenerPrecioStock(ticker);
                    const emoji = pos.ganancia >= 0 ? '📈' : '📉';

                    stocksList += `${stockData.empresa.emoji} **${ticker}** - ${pos.cantidad} acciones\n`;
                    stocksList += `└ $${pos.valorPosicion.toFixed(2)} ${emoji} ${pos.ganancia >= 0 ? '+' : ''}$${pos.ganancia.toFixed(2)} (${pos.ganancia >= 0 ? '+' : ''}${pos.porcentajeGanancia.toFixed(2)}%)\n`;

                    totalStocks += pos.valorPosicion;
                }

                embed.addFields({
                    name: `📊 Acciones ($${totalStocks.toFixed(2)})`,
                    value: stocksList,
                    inline: false
                });
            }

            // Crypto
            if (Object.keys(portfolio.crypto).length > 0) {
                let cryptoList = '';
                let totalCrypto = 0;

                for (const [ticker, pos] of Object.entries(portfolio.crypto)) {
                    const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker);
                    const emoji = pos.ganancia >= 0 ? '📈' : '📉';

                    cryptoList += `${moneda.emoji} **${ticker}** - ${pos.cantidad.toFixed(8)}\n`;
                    cryptoList += `└ $${pos.valorPosicion.toFixed(2)} ${emoji} ${pos.ganancia >= 0 ? '+' : ''}$${pos.ganancia.toFixed(2)} (${pos.ganancia >= 0 ? '+' : ''}${pos.porcentajeGanancia.toFixed(2)}%)\n`;

                    totalCrypto += pos.valorPosicion;
                }

                embed.addFields({
                    name: `₿ Criptomonedas ($${totalCrypto.toFixed(2)})`,
                    value: cryptoList,
                    inline: false
                });
            }

            // Opciones activas
            if (portfolio.opciones.length > 0) {
                let opcionesList = '';

                for (const opcion of portfolio.opciones) {
                    const tiempoRestante = opcion.fechaExpiracion - Date.now();
                    const minutosRestantes = Math.floor(tiempoRestante / 60000);
                    const emoji = opcion.tipo === 'call' ? '📈' : '📉';

                    opcionesList += `${emoji} **${opcion.tipo.toUpperCase()}** ${opcion.activo} - $${opcion.monto}\n`;
                    opcionesList += `└ Expira en ${minutosRestantes} min | ${opcion.multiplicador}x\n`;
                }

                embed.addFields({
                    name: `📊 Opciones Activas (${portfolio.opciones.length})`,
                    value: opcionesList,
                    inline: false
                });
            }

            // Resumen
            const valorInvertido = portfolio.valorTotal - portfolio.efectivo;
            embed.addFields({
                name: '💰 Resumen',
                value:
                    `**Valor Total:** $${portfolio.valorTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n` +
                    `**Invertido:** $${valorInvertido.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n` +
                    `**Efectivo:** $${portfolio.efectivo.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                inline: false
            });

            embed.setFooter({ text: '💡 Usa los comandos de buy/sell para operar' });

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando portfolio:', error);
            return message.reply('❌ Error obteniendo el portafolio.');
        }
    },
};
