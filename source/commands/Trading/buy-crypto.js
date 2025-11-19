const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'buy-crypto',
    category: 'Trading',
    description: '₿ Comprar criptomonedas a precio real',
    aliases: ['buycrypto', 'comprar-crypto'],
    usage: '<ticker> <monto>',
    example: 'buy-crypto BTC 1000',

    async execute(client, message, args, prefix) {
        try {
            if (args.length < 2) {
                return message.reply(`❌ Uso: \`${prefix}buy-crypto <TICKER> <monto en $>\``);
            }

            const ticker = args[0].toUpperCase();
            const monto = parseFloat(args[1]);

            if (isNaN(monto) || monto < tradingConfig.crypto.minimoCrypto) {
                return message.reply(`❌ Monto mínimo: $${tradingConfig.crypto.minimoCrypto}`);
            }

            const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker);
            if (!moneda) {
                return message.reply(`❌ Criptomoneda **${ticker}** no encontrada!`);
            }

            try {
                const resultado = await tradingUtils.comprarCrypto(
                    message.author.id,
                    ticker,
                    monto
                );

                const embed = new EmbedBuilder()
                    .setColor(tradingConfig.colores.verde)
                    .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTitle(`${moneda.emoji} COMPRA DE CRYPTO EJECUTADA`)
                    .setDescription(
                        `${tradingConfig.mensajes.compra[Math.floor(Math.random() * tradingConfig.mensajes.compra.length)]}\n\n` +
                        `Precio en vivo desde **CoinGecko** 📊`
                    )
                    .addFields(
                        {
                            name: '💎 Criptomoneda',
                            value: `${moneda.nombre} (${ticker})`,
                            inline: true
                        },
                        {
                            name: '🔢 Cantidad',
                            value: `${resultado.cantidad.toFixed(8)} ${ticker}`,
                            inline: true
                        },
                        {
                            name: '💵 Precio Unitario',
                            value: `$${resultado.precioUnitario.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`,
                            inline: true
                        },
                        {
                            name: '💸 Comisión',
                            value: `$${resultado.comision.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: '💰 Total Pagado',
                            value: `$${resultado.total.toFixed(2)}`,
                            inline: true
                        }
                    )
                    .setFooter({ text: `💡 HODL! 💎🙌` })
                    .setTimestamp();

                return message.reply({ embeds: [embed] });

            } catch (error) {
                return message.reply(`❌ ${error.message}`);
            }

        } catch (error) {
            console.error('Error en buy-crypto:', error);
            return message.reply('❌ Error procesando la compra.');
        }
    },
};
