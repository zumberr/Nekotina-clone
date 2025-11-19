const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');

module.exports = {
    name: 'trading',
    category: 'Trading',
    description: '💹 Información general del sistema de trading',
    aliases: ['trade', 'mercado', 'invertir'],
    usage: '',
    example: 'trading',

    async execute(client, message, args, prefix) {
        try {
            const embed = new EmbedBuilder()
                .setColor(tradingConfig.colores.principal)
                .setTitle('💹 SISTEMA DE TRADING')
                .setDescription(
                    `¡Bienvenido al mercado de valores y criptomonedas!\n\n` +
                    `📊 **Acciones Ficticias** - Empresas del servidor\n` +
                    `₿ **Crypto Real** - Precios en vivo de CoinGecko\n` +
                    `📈 **Opciones (Calls/Puts)** - Apuestas direccionales\n\n` +
                    `Invierte, diversifica, y conviértete en el Wolf of Wall Street! 🐺`
                )
                .setThumbnail(message.guild?.iconURL() || null);

            // Acciones
            embed.addFields({
                name: '📊 Acciones Ficticias',
                value:
                    `Empresas del servidor con precios dinámicos.\n` +
                    `Los precios cambian según actividad del servidor!\n\n` +
                    `**Comandos:**\n` +
                    `\`${prefix}stocks\` - Ver mercado\n` +
                    `\`${prefix}buy-stock <TICKER> <cantidad>\`\n` +
                    `\`${prefix}sell-stock <TICKER> <cantidad>\``,
                inline: true
            });

            // Crypto
            embed.addFields({
                name: '₿ Criptomonedas Reales',
                value:
                    `Precios en tiempo real desde CoinGecko.\n` +
                    `Compra y vende a precios del mercado real!\n\n` +
                    `**Comandos:**\n` +
                    `\`${prefix}crypto\` - Ver precios\n` +
                    `\`${prefix}buy-crypto <TICKER> <monto>\`\n` +
                    `\`${prefix}sell-crypto <TICKER> [%]\``,
                inline: true
            });

            // Opciones
            embed.addFields({
                name: '📊 Opciones (Calls/Puts)',
                value:
                    `Apuestas si el precio sube o baja.\n` +
                    `Mayor riesgo, mayor recompensa!\n\n` +
                    `**Comandos:**\n` +
                    `\`${prefix}option call <TICKER> <monto> <duración>\`\n` +
                    `\`${prefix}option put <TICKER> <monto> <duración>\``,
                inline: false
            });

            // Portafolio
            embed.addFields({
                name: '💼 Tu Portafolio',
                value:
                    `**Ver inversiones:**\n` +
                    `\`${prefix}portfolio\` - Tu portafolio completo\n` +
                    `\`${prefix}portfolio @usuario\` - Ver portafolio de otro usuario`,
                inline: false
            });

            // Comisiones
            embed.addFields({
                name: '💸 Comisiones',
                value:
                    `**Operaciones:** ${(tradingConfig.general.comision * 100).toFixed(2)}% por trade\n` +
                    `**Prima de opciones:** ${(tradingConfig.options.prima * 100).toFixed(0)}% del monto`,
                inline: true
            });

            // Límites
            embed.addFields({
                name: '📋 Límites',
                value:
                    `**Mínimo:** $${tradingConfig.general.minimoOperacion.toLocaleString()}\n` +
                    `**Máximo:** $${tradingConfig.general.maximoOperacion.toLocaleString()}\n` +
                    `**Opciones activas:** ${tradingConfig.options.maximoOpciones}`,
                inline: true
            });

            // Empresas disponibles
            const empresasEmojis = tradingConfig.stocks.empresas.map(e => e.emoji).join(' ');
            const cryptoEmojis = tradingConfig.crypto.monedas.slice(0, 8).map(c => c.emoji).join(' ');

            embed.addFields({
                name: '🏢 Activos Disponibles',
                value:
                    `**Acciones:** ${empresasEmojis}\n` +
                    `**Crypto:** ${cryptoEmojis}`,
                inline: false
            });

            embed.setFooter({ text: '⚠️ Los mercados pueden ser volátiles - Invierte con responsabilidad' })
                .setTimestamp();

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando trading:', error);
            return message.reply('❌ Error mostrando información de trading.');
        }
    },
};
