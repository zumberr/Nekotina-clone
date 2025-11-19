const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'sell-stock',
    category: 'Trading',
    description: '💸 Vender acciones ficticias',
    aliases: ['sellstock', 'vender-accion'],
    usage: '<ticker> <cantidad>',
    example: 'sell-stock DISC 10',

    async execute(client, message, args, prefix) {
        try {
            if (args.length < 2) {
                return message.reply(`❌ Uso: \`${prefix}sell-stock <TICKER> <cantidad>\``);
            }

            const ticker = args[0].toUpperCase();
            const cantidad = parseInt(args[1]);

            if (isNaN(cantidad) || cantidad <= 0) {
                return message.reply('❌ Cantidad inválida!');
            }

            // Ejecutar venta
            try {
                const resultado = await tradingUtils.venderStock(
                    message.author.id,
                    ticker,
                    cantidad
                );

                const stockData = tradingUtils.obtenerPrecioStock(ticker);
                const esGanancia = resultado.ganancia >= 0;

                const embed = new EmbedBuilder()
                    .setColor(esGanancia ? tradingConfig.colores.verde : tradingConfig.colores.rojo)
                    .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTitle(`${stockData.empresa.emoji} VENTA EJECUTADA`)
                    .setDescription(
                        esGanancia ?
                            tradingConfig.mensajes.ganancia[Math.floor(Math.random() * tradingConfig.mensajes.ganancia.length)] :
                            tradingConfig.mensajes.perdida[Math.floor(Math.random() * tradingConfig.mensajes.perdida.length)]
                    )
                    .addFields(
                        {
                            name: '📊 Acción',
                            value: `${stockData.empresa.nombre} (${ticker})`,
                            inline: true
                        },
                        {
                            name: '🔢 Cantidad',
                            value: `${cantidad} acciones`,
                            inline: true
                        },
                        {
                            name: '💵 Precio Venta',
                            value: `$${resultado.precioUnitario.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: '💳 Precio Compra',
                            value: `$${resultado.precioCompra.toFixed(2)}`,
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
                    .setFooter({ text: `💡 ${esGanancia ? 'Nice trade!' : 'Better luck next time!'}` })
                    .setTimestamp();

                return message.reply({ embeds: [embed] });

            } catch (error) {
                return message.reply(`❌ ${error.message}`);
            }

        } catch (error) {
            console.error('Error en sell-stock:', error);
            return message.reply('❌ Error procesando la venta.');
        }
    },
};
