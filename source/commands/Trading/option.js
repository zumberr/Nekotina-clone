const { EmbedBuilder } = require('discord.js');
const tradingConfig = require('../../config/trading');
const tradingUtils = require('../../utils/tradingUtils');

module.exports = {
    name: 'option',
    category: 'Trading',
    description: '📊 Crear opción (call/put) - Apuesta si sube o baja',
    aliases: ['opcion', 'call', 'put'],
    usage: '<call|put> <ticker> <monto> <duración>',
    example: 'option call BTC 1000 0',

    async execute(client, message, args, prefix) {
        try {
            if (args.length < 3) {
                const timeframesInfo = tradingConfig.options.timeframes.map((tf, i) =>
                    `**${i}.** ${tf.nombre} - ${tf.multiplicador}x`
                ).join('\n');

                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(tradingConfig.colores.morado)
                        .setTitle('📊 OPCIONES (CALLS/PUTS)')
                        .setDescription(
                            `**¿Qué son las opciones?**\n` +
                            `Apuestas direccionales sobre el precio de un activo.\n\n` +
                            `📈 **CALL** = Apuesta a que el precio SUBE\n` +
                            `📉 **PUT** = Apuesta a que el precio BAJA\n\n` +
                            `**Uso:**\n\`${prefix}option <call|put> <TICKER> <monto> <duración>\`\n\n` +
                            `**Ejemplo:**\n\`${prefix}option call BTC 1000 2\`\n` +
                            `(Apuesta $1,000 a que BTC sube en 1 hora)\n`
                        )
                        .addFields(
                            {
                                name: '⏰ Duraciones Disponibles',
                                value: timeframesInfo,
                                inline: false
                            },
                            {
                                name: '💡 Información',
                                value:
                                    `**Prima:** ${(tradingConfig.options.prima * 100).toFixed(0)}% del monto\n` +
                                    `**Cambio mínimo:** ${tradingConfig.options.cambioMinimo}%\n` +
                                    `**Máximo opciones:** ${tradingConfig.options.maximoOpciones}`,
                                inline: false
                            }
                        )
                        .setFooter({ text: 'Altamente especulativo - Mayor riesgo, mayor recompensa' })
                    ]
                });
            }

            const tipo = args[0].toLowerCase();
            const ticker = args[1].toUpperCase();
            const monto = parseFloat(args[2]);
            const duracionIndex = parseInt(args[3] || '0');

            // Validar tipo
            if (!['call', 'put'].includes(tipo)) {
                return message.reply('❌ Tipo debe ser `call` o `put`');
            }

            // Validar monto
            if (isNaN(monto) || monto < tradingConfig.general.minimoOperacion) {
                return message.reply(`❌ Monto mínimo: $${tradingConfig.general.minimoOperacion}`);
            }

            try {
                const opcion = await tradingUtils.crearOpcion(
                    message.author.id,
                    tipo,
                    ticker,
                    monto,
                    duracionIndex
                );

                const timeframe = tradingConfig.options.timeframes[duracionIndex];
                const fechaExpiracion = new Date(opcion.fechaExpiracion);

                const embed = new EmbedBuilder()
                    .setColor(tradingConfig.colores.morado)
                    .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTitle(`${opcion.tipo === 'call' ? '📈' : '📉'} OPCIÓN CREADA`)
                    .setDescription(
                        `${opcion.tipo === 'call' ? '📈 **CALL**' : '📉 **PUT**'} en **${ticker}**\n` +
                        `Apuestas a que el precio ${opcion.tipo === 'call' ? 'SUBE ⬆️' : 'BAJA ⬇️'}`
                    )
                    .addFields(
                        {
                            name: '💵 Monto Apostado',
                            value: `$${opcion.monto.toLocaleString()}`,
                            inline: true
                        },
                        {
                            name: '💸 Prima (costo)',
                            value: `$${opcion.prima.toFixed(2)}`,
                            inline: true
                        },
                        {
                            name: '📊 Precio Inicial',
                            value: `$${opcion.precioInicial.toFixed(8)}`,
                            inline: true
                        },
                        {
                            name: '⏰ Duración',
                            value: timeframe.nombre,
                            inline: true
                        },
                        {
                            name: '🎯 Multiplicador',
                            value: `${timeframe.multiplicador}x`,
                            inline: true
                        },
                        {
                            name: '💰 Ganancia Potencial',
                            value: `$${(opcion.monto * timeframe.multiplicador).toLocaleString()}`,
                            inline: true
                        }
                    )
                    .addFields({
                        name: '📅 Expira',
                        value: `<t:${Math.floor(opcion.fechaExpiracion / 1000)}:R>`,
                        inline: false
                    })
                    .setFooter({ text: 'Las opciones se resuelven automáticamente al expirar' })
                    .setTimestamp();

                return message.reply({ embeds: [embed] });

            } catch (error) {
                return message.reply(`❌ ${error.message}`);
            }

        } catch (error) {
            console.error('Error en comando option:', error);
            return message.reply('❌ Error creando la opción.');
        }
    },
};
