const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'buy-stock',
    category: 'Trading',
    description: '💰 Comprar acciones ficticias',
    aliases: ['buystock', 'comprar-accion'],
    usage: '<ticker> <cantidad>',
    example: 'buy-stock DISC 10',

    async execute(client, message, args, prefix) {
        try {
            if (args.length < 2) {
                return message.reply(`❌ Uso: \`${prefix}buy-stock <TICKER> <cantidad>\``);
            }

            const ticker = args[0].toUpperCase();
            const cantidad = parseInt(args[1]);

            if (isNaN(cantidad) || cantidad <= 0) {
                return message.reply('❌ Cantidad inválida!');
            }

            // Verificar que la acción existe
            const stockData = tradingUtils.obtenerPrecioStock(ticker);
            if (!stockData) {
                return message.reply(`❌ Acción **${ticker}** no encontrada!`);
            }

            // Calcular costo
            const costoTotal = stockData.precio * cantidad * (1 + tradingConfig.general.comision);
            const comision = costoTotal - (stockData.precio * cantidad);

            // Ejecutar compra
            try {
                const resultado = await tradingUtils.comprarStock(
                    message.author.id,
                    ticker,
                    cantidad
                );

                const embed = new EmbedBuilder()
                    .setColor(tradingConfig.colores.verde)
                    .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTitle(`${stockData.empresa.emoji} COMPRA EJECUTADA`)
                    .setDescription(tradingConfig.mensajes.compra[Math.floor(Math.random() * tradingConfig.mensajes.compra.length)])
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
                            name: '💵 Precio Unitario',
                            value: `$${resultado.precioUnitario.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: '💸 Comisión',
                            value: `$${resultado.comision.toFixed(2)} (${(tradingConfig.general.comision * 100).toFixed(2)}%)`,
                            inline: true
                        },
                        {
                            name: '💰 Total Pagado',
                            value: `$${resultado.total.toFixed(2)}`,
                            inline: true
                        }
                    )
                    .setFooter({ text: `💡 Usa ${prefix}portfolio para ver tu portafolio` })
                    .setTimestamp();

                return message.reply({ embeds: [embed] });

            } catch (error) {
                return message.reply(`❌ ${error.message}`);
            }

        } catch (error) {
            console.error('Error en buy-stock:', error);
            return message.reply('❌ Error procesando la compra.');
        }
    },
};
