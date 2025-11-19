const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'sell-crypto',
    category: 'Trading',
    description: '💸 Vender criptomonedas a precio real',
    aliases: ['sellcrypto', 'vender-crypto'],
    usage: '<ticker> [porcentaje]',
    example: 'sell-crypto BTC 50',

    async execute(client, message, args, prefix) {
        try {
            if (args.length < 1) {
                return message.reply(`❌ Uso: \`${prefix}sell-crypto <TICKER> [% a vender]\`\nEjemplo: \`${prefix}sell-crypto BTC 50\` (vende 50%)`);
            }

            const ticker = args[0].toUpperCase();
            const porcentaje = args[1] ? parseFloat(args[1]) : 100;

            if (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
                return message.reply('❌ Porcentaje debe estar entre 1 y 100');
            }

            const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker);
            if (!moneda) {
                return message.reply(`❌ Criptomoneda **${ticker}** no encontrada!`);
            }

            try {
                const resultado = await tradingUtils.venderCrypto(
                    message.author.id,
                    ticker,
                    porcentaje
                );

                const esGanancia = resultado.ganancia >= 0;

                const embed = new EmbedBuilder()
                    .setColor(esGanancia ? tradingConfig.colores.verde : tradingConfig.colores.rojo)
                    .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTitle(`${moneda.emoji} VENTA DE CRYPTO EJECUTADA`)
                    .setDescription(
                        esGanancia ?
                            tradingConfig.mensajes.ganancia[Math.floor(Math.random() * tradingConfig.mensajes.ganancia.length)] :
                            tradingConfig.mensajes.perdida[Math.floor(Math.random() * tradingConfig.mensajes.perdida.length)]
                    )
                    .addFields(
                        {
                            name: '💎 Criptomoneda',
                            value: `${moneda.nombre} (${ticker})`,
                            inline: true
                        },
                        {
                            name: '🔢 Cantidad Vendida',
                            value: `${resultado.cantidad.toFixed(8)} ${ticker} (${porcentaje}%)`,
                            inline: true
                        },
                        {
                            name: '💵 Precio Venta',
                            value: `$${resultado.precioUnitario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`,
                            inline: true
                        },
                        {
                            name: '💳 Precio Compra',
                            value: `$${resultado.precioCompra.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`,
                            inline: true
                        },
                        {
                            name: `${esGanancia ? '💰' : '📉'} Ganancia/Pérdida`,
                            value: `${esGanancia ? '+' : ''}$${resultado.ganancia.toFixed(2)} (${esGanancia ? '+' : ''}${resultado.porcentajeGanancia.toFixed(2)}%)`,
                            inline: true
                        },
                        {
                            name: '💸 Total Recibido',
                            value: `$${resultado.total.toFixed(2)}`,
                            inline: true
                        }
                    )
                    .setFooter({ text: esGanancia ? '🚀 TO THE MOON!' : '📉 PAPER HANDS!' })
                    .setTimestamp();

                return message.reply({ embeds: [embed] });

            } catch (error) {
                return message.reply(`❌ ${error.message}`);
            }

        } catch (error) {
            console.error('Error en sell-crypto:', error);
            return message.reply('❌ Error procesando la venta.');
        }
    },
};
