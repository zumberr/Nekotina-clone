const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoUtils = require('../../utils/casinoUtils');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'dice',
    category: 'Casino',
    description: '🎲 Juego de Dados - Ajusta tu probabilidad de ganar!',
    aliases: ['dados', 'd'],
    usage: '<apuesta> [chance]',
    example: 'dice 1000 50',

    async execute(client, message, args, prefix) {
        const userId = message.author.id;
        const config = casinoConfig.dice;

        try {
            // Validar argumentos
            if (args.length < 1) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.dice)
                        .setTitle(`${config.emojis.dice} DICE GAME`)
                        .setDescription(
                            `**¿Cómo jugar?**\n` +
                            `Se tira un número del 0 al 100.\n` +
                            `Si es menor que tu chance, ¡GANAS!\n\n` +
                            `**Uso:** \`${prefix}dice <apuesta> [chance]\`\n` +
                            `**Ejemplos:**\n` +
                            `└ \`${prefix}dice 1000\` (50% chance = 2x)\n` +
                            `└ \`${prefix}dice 1000 25\` (25% chance = 4x)\n` +
                            `└ \`${prefix}dice 1000 90\` (90% chance = 1.1x)\n\n` +
                            `**Límites:**\n` +
                            `└ Apuesta: $${config.apuestaMinima.toLocaleString()} - $${config.apuestaMaxima.toLocaleString()}\n` +
                            `└ Chance: ${config.chanceMinimo}% - ${config.chanceMaximo}%\n\n` +
                            `${economyConfig.emojis.info} Menos chance = Más multiplicador!`
                        )
                        .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                    ]
                });
            }

            const apuesta = parseInt(args[0]);
            const chance = args[1] ? parseFloat(args[1]) : config.chanceDefault;

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

            // Validar chance
            if (isNaN(chance) || chance < config.chanceMinimo || chance > config.chanceMaximo) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.error)
                        .setDescription(
                            `${economyConfig.emojis.error} Chance inválido!\n\n` +
                            `**Debe estar entre ${config.chanceMinimo}% y ${config.chanceMaximo}%**`
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

            // Tirar el dado
            const resultado = casinoUtils.tirarDado(
                usuario.serverSeed,
                userId,
                usuario.nonce,
                chance
            );

            // Incrementar nonce
            usuario.nonce++;

            // Descontar apuesta
            usuario.dinero -= apuesta;

            // Calcular ganancia
            const ganancia = resultado.gano ? Math.floor(apuesta * parseFloat(resultado.multiplicador)) : 0;
            const gananciaNeta = ganancia - apuesta;

            // Agregar ganancia si ganó
            if (resultado.gano) {
                usuario.dinero += ganancia;
            }

            // Guardar usuario
            await usuario.save();

            // Actualizar estadísticas
            await casinoUtils.actualizarEstadisticas(
                userId,
                'dice',
                apuesta,
                ganancia,
                resultado.gano ? resultado.multiplicador : 0
            );

            // Crear embed de resultado
            const embed = new EmbedBuilder()
                .setColor(resultado.gano ? casinoConfig.colores.ganancia : casinoConfig.colores.perdida)
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTitle(`${config.emojis.dice} DICE GAME`)
                .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                .setTimestamp();

            // Crear barra visual del resultado
            const resultadoNum = parseFloat(resultado.resultado);
            const barLength = 20;
            const position = Math.floor((resultadoNum / 100) * barLength);
            const targetPos = Math.floor((chance / 100) * barLength);

            let barra = '';
            for (let i = 0; i < barLength; i++) {
                if (i === position && i === targetPos) {
                    barra += resultado.gano ? '🟢' : '🔴';
                } else if (i === position) {
                    barra += '⚪';
                } else if (i === targetPos) {
                    barra += '🎯';
                } else if (i < targetPos) {
                    barra += resultado.gano ? '🟩' : '⬜';
                } else {
                    barra += '⬜';
                }
            }

            embed.addFields({
                name: '🎲 Resultado del Dado',
                value:
                    `${barra}\n` +
                    `**Número:** ${resultado.resultado}\n` +
                    `**Objetivo:** < ${chance}`,
                inline: false
            });

            // Resultado
            if (resultado.gano) {
                embed.addFields(
                    {
                        name: `${config.emojis.win} ¡GANASTE!`,
                        value:
                            `**Chance:** ${chance}%\n` +
                            `**Multiplicador:** ${resultado.multiplicador}x\n` +
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

                // Mensaje para multiplicadores altos
                if (parseFloat(resultado.multiplicador) >= 10) {
                    embed.setDescription(`${config.emojis.fire} ${casinoUtils.obtenerMensajePsicologico('gananciaGrande')}`);
                }

            } else {
                embed.addFields(
                    {
                        name: `${config.emojis.lose} ¡PERDISTE!`,
                        value:
                            `**Chance:** ${chance}%\n` +
                            `**Multiplicador:** ${resultado.multiplicador}x\n` +
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

                // Mensaje psicológico si estuvo cerca
                const diferencia = Math.abs(resultadoNum - chance);
                if (diferencia < 5) {
                    embed.setDescription(casinoUtils.obtenerMensajePsicologico('casiGanas'));
                }
            }

            // Tips para mejorar
            if (!resultado.gano) {
                let tip = '';
                if (chance < 50) {
                    tip = `💡 **Tip:** Con ${chance}% de chance, el multiplicador es más alto pero más difícil de ganar. ¡Prueba aumentar el chance!`;
                } else {
                    tip = `💡 **Tip:** Con ${chance}% de chance tienes buena probabilidad. ¡Sigue intentando!`;
                }
                embed.addFields({
                    name: '💭 Estrategia',
                    value: tip,
                    inline: false
                });
            }

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando dice:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al procesar el juego. Intenta de nuevo.`)
                ]
            });
        }
    },
};
