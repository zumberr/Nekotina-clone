const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoUtils = require('../../utils/casinoUtils');
const economyUtils = require('../../utils/economyUtils');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'crash',
    category: 'Casino',
    description: '🚀 Juego Crash - El multiplicador sube hasta que crashea!',
    aliases: ['crsh'],
    usage: '<apuesta> <multiplicador_objetivo>',
    example: 'crash 1000 2.5',

    async execute(client, message, args, prefix) {
        const userId = message.author.id;
        const config = casinoConfig.crash;

        try {
            // Validar argumentos
            if (args.length < 2) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.crash)
                        .setTitle(`${config.emojis.rocket} CRASH GAME ${config.emojis.rocket}`)
                        .setDescription(
                            `**¿Cómo jugar?**\n` +
                            `El multiplicador empieza en 1.00x y sube...\n` +
                            `Pero puede CRASHEAR en cualquier momento! ${config.emojis.explosion}\n\n` +
                            `**Uso:** \`${prefix}crash <apuesta> <objetivo>\`\n` +
                            `**Ejemplo:** \`${prefix}crash 1000 2.5\`\n\n` +
                            `**Límites:**\n` +
                            `└ Mínimo: $${config.apuestaMinima.toLocaleString()}\n` +
                            `└ Máximo: $${config.apuestaMaxima.toLocaleString()}\n` +
                            `└ Objetivo: ${config.multiplicadorMinimo}x - ${config.multiplicadorMaximo}x`
                        )
                        .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                    ]
                });
            }

            const apuesta = parseInt(args[0]);
            const objetivoMultiplicador = parseFloat(args[1]);

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

            // Validar multiplicador objetivo
            if (isNaN(objetivoMultiplicador) || objetivoMultiplicador < config.multiplicadorMinimo || objetivoMultiplicador > config.multiplicadorMaximo) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.error)
                        .setDescription(
                            `${economyConfig.emojis.error} Multiplicador objetivo inválido!\n\n` +
                            `**Debe estar entre ${config.multiplicadorMinimo}x y ${config.multiplicadorMaximo}x**`
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

            // Calcular crash point
            const crashPoint = casinoUtils.calcularCrashPoint(
                usuario.serverSeed,
                userId,
                usuario.nonce
            );

            // Incrementar nonce
            usuario.nonce++;

            // Descontar apuesta
            usuario.dinero -= apuesta;

            // Determinar si ganó
            const gano = objetivoMultiplicador <= crashPoint;
            const ganancia = gano ? Math.floor(apuesta * objetivoMultiplicador) : 0;
            const gananciaNeta = ganancia - apuesta;

            // Agregar ganancia si ganó
            if (gano) {
                usuario.dinero += ganancia;
            }

            // Guardar usuario
            await usuario.save();

            // Actualizar estadísticas
            await casinoUtils.actualizarEstadisticas(
                userId,
                'crash',
                apuesta,
                ganancia,
                gano ? objetivoMultiplicador : 0
            );

            // Crear embed de resultado
            const embed = new EmbedBuilder()
                .setColor(gano ? casinoConfig.colores.ganancia : casinoConfig.colores.perdida)
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTitle(`${config.emojis.rocket} CRASH GAME`)
                .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                .setTimestamp();

            // Simular animación del crash
            const animacion = casinoUtils.simularCrashAnimacion(crashPoint);
            let animacionTexto = '';

            // Mostrar los últimos 10 multiplicadores antes del crash
            const multiplicadoresParaMostrar = animacion.slice(-10);
            for (let i = 0; i < multiplicadoresParaMostrar.length; i++) {
                const mult = multiplicadoresParaMostrar[i];
                const esCrash = parseFloat(mult) === crashPoint;
                const esObjetivo = parseFloat(mult) === objetivoMultiplicador;

                if (esCrash) {
                    animacionTexto += `${config.emojis.explosion} **${mult}x** ${config.emojis.explosion}\n`;
                } else if (esObjetivo && gano) {
                    animacionTexto += `${config.emojis.money} **${mult}x** ← Tu cashout\n`;
                } else {
                    animacionTexto += `${config.emojis.chart} ${mult}x\n`;
                }
            }

            embed.addFields({
                name: `${config.emojis.rocket} Secuencia del Vuelo`,
                value: animacionTexto || '...',
                inline: false
            });

            // Resultado
            if (gano) {
                embed.addFields(
                    {
                        name: `${economyConfig.emojis.success} ¡GANASTE!`,
                        value:
                            `**Crash Point:** ${crashPoint}x ${config.emojis.explosion}\n` +
                            `**Tu Cashout:** ${objetivoMultiplicador}x ${config.emojis.rocket}\n` +
                            `**Apuesta:** $${apuesta.toLocaleString()}\n` +
                            `**Ganancia:** $${ganancia.toLocaleString()}\n` +
                            `**Profit:** ${economyConfig.emojis.ganancia} $${gananciaNeta.toLocaleString()}`,
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

                // Mensaje psicológico para grandes ganancias
                if (objetivoMultiplicador >= 10) {
                    embed.setDescription(casinoUtils.obtenerMensajePsicologico('gananciaGrande'));
                }

            } else {
                embed.addFields(
                    {
                        name: `${economyConfig.emojis.error} ¡CRASHEÓ!`,
                        value:
                            `**Crash Point:** ${crashPoint}x ${config.emojis.explosion}\n` +
                            `**Tu Objetivo:** ${objetivoMultiplicador}x ${config.emojis.rocket}\n` +
                            `**Apuesta:** $${apuesta.toLocaleString()}\n` +
                            `**Pérdida:** ${economyConfig.emojis.perdida} $${apuesta.toLocaleString()}`,
                        inline: true
                    },
                    {
                        name: `${economyConfig.emojis.dinero} Balance`,
                        value:
                            `**Anterior:** $${(usuario.dinero + apuesta).toLocaleString()}\n` +
                            `**Actual:** $${usuario.dinero.toLocaleString()}`,
                        inline: true
                    }
                );

                // Mensaje psicológico para "casi gané"
                const diferencia = objetivoMultiplicador - crashPoint;
                if (diferencia > 0 && diferencia < objetivoMultiplicador * 0.2) {
                    embed.setDescription(casinoUtils.obtenerMensajePsicologico('casiGanas'));
                }

                // Obtener estadísticas para racha de pérdidas
                const statsActualizadas = await User.findOne({ idusuario: userId });
                if (statsActualizadas?.casinoStats?.rachaActual === 0 &&
                    statsActualizadas?.casinoStats?.mejorRacha >= 3) {
                    embed.addFields({
                        name: '💫 Siguiente Jugada',
                        value: casinoUtils.obtenerMensajePsicologico('rachaPerdidas'),
                        inline: false
                    });
                }
            }

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando crash:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al procesar el juego. Intenta de nuevo.`)
                ]
            });
        }
    },
};
