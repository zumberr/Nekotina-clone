const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoUtils = require('../../utils/casinoUtils');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'plinko',
    category: 'Casino',
    description: '⚪ Plinko - La bola cae por los pines!',
    aliases: ['plk'],
    usage: '<apuesta> [riesgo]',
    example: 'plinko 1000 alto',

    async execute(client, message, args, prefix) {
        const userId = message.author.id;
        const config = casinoConfig.plinko;

        try {
            // Validar argumentos
            if (args.length < 1) {
                // Mostrar info de los riesgos
                let riesgosInfo = '';
                for (const [key, value] of Object.entries(config.riesgos)) {
                    riesgosInfo += `**${value.emoji} ${value.nombre}**\n`;
                    riesgosInfo += `Multiplicadores: ${value.multiplicadores.join('x, ')}x\n\n`;
                }

                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.plinko)
                        .setTitle(`${config.emojis.ball} PLINKO GAME`)
                        .setDescription(
                            `**¿Cómo jugar?**\n` +
                            `Una bola cae por ${config.filas} filas de pines.\n` +
                            `La posición final determina tu multiplicador!\n\n` +
                            `**Uso:** \`${prefix}plinko <apuesta> [riesgo]\`\n` +
                            `**Ejemplos:**\n` +
                            `└ \`${prefix}plinko 1000\` (riesgo medio)\n` +
                            `└ \`${prefix}plinko 1000 bajo\`\n` +
                            `└ \`${prefix}plinko 1000 alto\`\n\n` +
                            `**Límites:**\n` +
                            `└ Mínimo: $${config.apuestaMinima.toLocaleString()}\n` +
                            `└ Máximo: $${config.apuestaMaxima.toLocaleString()}\n`
                        )
                        .addFields({
                            name: '🎯 Niveles de Riesgo',
                            value: riesgosInfo,
                            inline: false
                        })
                        .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                    ]
                });
            }

            const apuesta = parseInt(args[0]);
            const riesgoInput = args[1] ? args[1].toLowerCase() : 'medio';

            // Validar apuesta
            if (isNaN(apuesta) || apuesta < config.apuestaMinima || apuesta > config.apuestaMaxima) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.error)
                        .setDescription(
                            `${economyConfig.emojis.error} Apuesta inválida!\n\n` +
                            `**Límites:**\n` +
                            `└ Mínimo: $${config.apuestaMinima.toLocaleString()}\n` +
                            `└ Máximo: $${config.apuestaMaxima.toLocaleString()}`
                        )
                    ]
                });
            }

            // Validar riesgo
            if (!config.riesgos[riesgoInput]) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.error)
                        .setDescription(
                            `${economyConfig.emojis.error} Riesgo inválido!\n\n` +
                            `**Opciones:** bajo, medio, alto`
                        )
                    ]
                });
            }

            // Obtener usuario
            let usuario = await User.findOne({ idusuario: userId });
            if (!usuario) {
                usuario = new User({
                    idusuario: userId,
                    username: message.author.username,
                });
                await usuario.save();
            }

            // Verificar fondos
            if (usuario.dinero < apuesta) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.error)
                        .setDescription(
                            `${economyConfig.emojis.error} No tienes suficiente dinero!\n\n` +
                            `**Tu billetera:** $${usuario.dinero.toLocaleString()}\n` +
                            `**Necesitas:** $${apuesta.toLocaleString()}\n` +
                            `**Te faltan:** $${(apuesta - usuario.dinero).toLocaleString()}`
                        )
                    ]
                });
            }

            // Inicializar server seed si no existe
            if (!usuario.serverSeed) {
                usuario.serverSeed = casinoUtils.generarServerSeed();
                usuario.nonce = 0;
            }

            // Mostrar animación de caída
            const loadingEmbed = new EmbedBuilder()
                .setColor(casinoConfig.colores.plinko)
                .setTitle(`${config.emojis.ball} PLINKO GAME`)
                .setDescription(
                    `${config.emojis.ball} La bola está cayendo...\n\n` +
                    `⏳ Atravesando ${config.filas} filas de pines...`
                );

            const loadingMsg = await message.reply({ embeds: [loadingEmbed] });

            // Esperar para efecto de suspense
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Jugar Plinko
            const resultado = casinoUtils.jugarPlinko(
                usuario.serverSeed,
                userId,
                usuario.nonce,
                riesgoInput
            );

            // Incrementar nonce
            usuario.nonce++;

            // Descontar apuesta
            usuario.dinero -= apuesta;

            // Calcular ganancia
            const multiplicador = parseFloat(resultado.multiplicador);
            const ganancia = Math.floor(apuesta * multiplicador);
            const gananciaNeta = ganancia - apuesta;

            // Agregar ganancia
            usuario.dinero += ganancia;

            // Guardar usuario
            await usuario.save();

            // Actualizar estadísticas
            await casinoUtils.actualizarEstadisticas(
                userId,
                'plinko',
                apuesta,
                ganancia,
                multiplicador
            );

            // Crear visualización del camino
            const riesgoConfig = config.riesgos[riesgoInput];
            const multiplicadores = riesgoConfig.multiplicadores;

            // Crear tablero visual simplificado
            let tablero = '';
            const filas = Math.min(config.filas, 8); // Limitar para visualización

            for (let i = 0; i < filas; i++) {
                const espacios = ' '.repeat(filas - i);
                let fila = espacios;

                for (let j = 0; j <= i; j++) {
                    if (i < resultado.camino.length && j === resultado.posicionFinal - (resultado.camino.length - i - 1)) {
                        fila += config.emojis.ball + ' ';
                    } else {
                        fila += config.emojis.pin + ' ';
                    }
                }

                tablero += fila + '\n';
            }

            // Crear fila de multiplicadores
            let multiplicadoresDisplay = '';
            for (let i = 0; i < multiplicadores.length; i++) {
                const mult = multiplicadores[i];
                if (i === resultado.posicionFinal) {
                    multiplicadoresDisplay += `[${mult}x] `;
                } else {
                    multiplicadoresDisplay += `${mult}x `;
                }
            }

            // Crear embed de resultado
            const embed = new EmbedBuilder()
                .setColor(multiplicador >= 1 ? casinoConfig.colores.ganancia : casinoConfig.colores.perdida)
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTitle(`${config.emojis.ball} PLINKO GAME`)
                .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                .setTimestamp();

            embed.addFields(
                {
                    name: `${resultado.emoji} ${resultado.riesgo}`,
                    value: `\`\`\`${tablero}\`\`\``,
                    inline: false
                },
                {
                    name: `${config.emojis.bucket} Multiplicadores`,
                    value: `\`${multiplicadoresDisplay}\``,
                    inline: false
                }
            );

            // Resultado
            const esGanancia = gananciaNeta > 0;

            embed.addFields(
                {
                    name: esGanancia ? `${economyConfig.emojis.success} ¡GANANCIA!` : `${economyConfig.emojis.error} PÉRDIDA`,
                    value:
                        `**Multiplicador:** ${multiplicador}x\n` +
                        `**Posición:** ${resultado.posicionFinal + 1}\n` +
                        `**Apuesta:** $${apuesta.toLocaleString()}\n` +
                        `**Ganancia:** $${ganancia.toLocaleString()}\n` +
                        `**Profit:** ${esGanancia ? economyConfig.emojis.ganancia : economyConfig.emojis.perdida} $${Math.abs(gananciaNeta).toLocaleString()}`,
                    inline: true
                },
                {
                    name: `${economyConfig.emojis.dinero} Balance`,
                    value:
                        `**Anterior:** $${(usuario.dinero - gananciaNeta).toLocaleString()}\n` +
                        `**Actual:** $${usuario.dinero.toLocaleString()}`,
                    inline: true
                }
            );

            // Mensajes especiales
            if (multiplicador >= 5) {
                embed.setDescription(`${casinoUtils.obtenerMensajePsicologico('gananciaGrande')}`);
            } else if (multiplicador < 1) {
                embed.setDescription(casinoUtils.obtenerMensajePsicologico('casiGanas'));
            }

            // Camino completo
            const caminoDisplay = resultado.camino.join(' → ');
            embed.addFields({
                name: '🛤️ Camino de la Bola',
                value: `\`${caminoDisplay}\` → Posición ${resultado.posicionFinal + 1}`,
                inline: false
            });

            // Editar mensaje
            await loadingMsg.edit({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando plinko:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al procesar el juego. Intenta de nuevo.`)
                ]
            });
        }
    },
};
