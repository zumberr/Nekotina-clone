const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoUtils = require('../../utils/casinoUtils');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'mines',
    category: 'Casino',
    description: '💣 Mines - Buscaminas estratégico con multiplicadores!',
    aliases: ['mine', 'm'],
    usage: '<start|reveal|cashout> [opciones]',
    example: 'mines start 1000 5',

    async execute(client, message, args, prefix) {
        const userId = message.author.id;
        const config = casinoConfig.mines;

        try {
            const subcomando = args[0]?.toLowerCase();

            // Sin argumentos - mostrar ayuda
            if (!subcomando) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.mines)
                        .setTitle(`${config.emojis.mine} MINES GAME`)
                        .setDescription(
                            `**¿Cómo jugar?**\n` +
                            `Tablero de 5x5 (25 casillas) con minas escondidas.\n` +
                            `Revela casillas seguras para aumentar tu multiplicador!\n` +
                            `Encuentra una mina = pierdes todo ${config.emojis.explosion}\n\n` +
                            `**Comandos:**\n` +
                            `\`${prefix}mines start <apuesta> <minas>\` - Iniciar juego\n` +
                            `\`${prefix}mines reveal <posición>\` - Revelar casilla (1-25)\n` +
                            `\`${prefix}mines cashout\` - Cobrar ganancia actual\n\n` +
                            `**Ejemplo:**\n` +
                            `1. \`${prefix}mines start 1000 5\` (empezar con $1000 y 5 minas)\n` +
                            `2. \`${prefix}mines reveal 13\` (revelar casilla 13)\n` +
                            `3. \`${prefix}mines cashout\` (cobrar cuando quieras)\n\n` +
                            `**Límites:**\n` +
                            `└ Apuesta: $${config.apuestaMinima.toLocaleString()} - $${config.apuestaMaxima.toLocaleString()}\n` +
                            `└ Minas: ${config.minasDisponibles.join(', ')}`
                        )
                        .addFields({
                            name: '💡 Estrategia',
                            value:
                                `**Más minas = Mayor multiplicador**\n` +
                                `Pero también más riesgo!\n\n` +
                                `Cobra cuando quieras. El multiplicador\n` +
                                `aumenta con cada casilla segura revelada.`,
                            inline: false
                        })
                        .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
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

            // ==================== START ====================
            if (subcomando === 'start' || subcomando === 'iniciar') {
                // Verificar si ya tiene juego activo
                if (usuario.minesGame?.activo) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.warning)
                            .setDescription(
                                `${economyConfig.emojis.warning} Ya tienes un juego activo!\n\n` +
                                `Usa \`${prefix}mines reveal <posición>\` para revelar casillas\n` +
                                `O \`${prefix}mines cashout\` para cobrar`
                            )
                        ]
                    });
                }

                const apuesta = parseInt(args[1]);
                const cantidadMinas = parseInt(args[2]);

                // Validar apuesta
                if (isNaN(apuesta) || apuesta < config.apuestaMinima || apuesta > config.apuestaMaxima) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.error)
                            .setDescription(
                                `${economyConfig.emojis.error} Apuesta inválida!\n\n` +
                                `**Límites:** $${config.apuestaMinima.toLocaleString()} - $${config.apuestaMaxima.toLocaleString()}`
                            )
                        ]
                    });
                }

                // Validar minas
                if (!config.minasDisponibles.includes(cantidadMinas)) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.error)
                            .setDescription(
                                `${economyConfig.emojis.error} Cantidad de minas inválida!\n\n` +
                                `**Opciones:** ${config.minasDisponibles.join(', ')}`
                            )
                        ]
                    });
                }

                // Verificar fondos
                if (usuario.dinero < apuesta) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.error)
                            .setDescription(
                                `${economyConfig.emojis.error} No tienes suficiente dinero!\n\n` +
                                `**Necesitas:** $${apuesta.toLocaleString()}\n` +
                                `**Tienes:** $${usuario.dinero.toLocaleString()}`
                            )
                        ]
                    });
                }

                // Inicializar server seed si no existe
                if (!usuario.serverSeed) {
                    usuario.serverSeed = casinoUtils.generarServerSeed();
                    usuario.nonce = 0;
                }

                // Crear tablero
                const tablero = casinoUtils.crearTableroMines(
                    usuario.serverSeed,
                    userId,
                    usuario.nonce,
                    cantidadMinas
                );

                // Incrementar nonce
                usuario.nonce++;

                // Descontar apuesta
                usuario.dinero -= apuesta;

                // Guardar juego
                usuario.minesGame = {
                    activo: true,
                    apuesta,
                    cantidadMinas,
                    tablero,
                    reveladas: [],
                    multiplicadorActual: 1.0,
                    serverSeed: usuario.serverSeed,
                    nonce: usuario.nonce - 1,
                };

                await usuario.save();

                // Mostrar tablero inicial
                const tableroDisplay = crearTableroVisual([], [], cantidadMinas);

                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.mines)
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setTitle(`${config.emojis.mine} MINES GAME - Iniciado`)
                        .setDescription(
                            `Tablero creado con **${cantidadMinas} minas** ${config.emojis.mine}\n` +
                            `Apuesta bloqueada: $${apuesta.toLocaleString()}\n\n` +
                            `Usa \`${prefix}mines reveal <pos>\` para revelar casillas!`
                        )
                        .addFields(
                            {
                                name: '🎯 Tablero (5x5)',
                                value: tableroDisplay,
                                inline: false
                            },
                            {
                                name: '📊 Estado',
                                value:
                                    `**Multiplicador:** 1.00x\n` +
                                    `**Casillas reveladas:** 0/${config.casillasTotal - cantidadMinas}\n` +
                                    `**Ganancia potencial:** $${apuesta.toLocaleString()}`,
                                inline: true
                            }
                        )
                        .setFooter({ text: '💣 Evita las minas para ganar!' })
                    ]
                });
            }

            // ==================== REVEAL ====================
            else if (subcomando === 'reveal' || subcomando === 'revelar' || subcomando === 'r') {
                // Verificar juego activo
                if (!usuario.minesGame?.activo) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.error)
                            .setDescription(
                                `${economyConfig.emojis.error} No tienes un juego activo!\n\n` +
                                `Usa \`${prefix}mines start <apuesta> <minas>\` para empezar`
                            )
                        ]
                    });
                }

                const posicion = parseInt(args[1]) - 1; // Convertir de 1-25 a 0-24

                // Validar posición
                if (isNaN(posicion) || posicion < 0 || posicion >= config.casillasTotal) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.error)
                            .setDescription(`${economyConfig.emojis.error} Posición inválida! Usa un número del 1 al 25.`)
                        ]
                    });
                }

                // Verificar si ya fue revelada
                if (usuario.minesGame.reveladas.includes(posicion)) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.warning)
                            .setDescription(`${economyConfig.emojis.warning} Esa casilla ya fue revelada!`)
                        ]
                    });
                }

                // Revelar casilla
                const esMina = usuario.minesGame.tablero.includes(posicion);

                if (esMina) {
                    // ¡PERDIÓ! Encontró una mina
                    usuario.minesGame.activo = false;
                    await usuario.save();

                    // Actualizar estadísticas
                    await casinoUtils.actualizarEstadisticas(
                        userId,
                        'mines',
                        usuario.minesGame.apuesta,
                        0,
                        0
                    );

                    // Mostrar tablero completo
                    const tableroDisplay = crearTableroVisual(
                        usuario.minesGame.reveladas,
                        usuario.minesGame.tablero,
                        usuario.minesGame.cantidadMinas,
                        posicion
                    );

                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.perdida)
                            .setAuthor({
                                name: message.author.username,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setTitle(`${config.emojis.explosion} ¡BOOM! Encontraste una mina`)
                            .setDescription(`Perdiste toda tu apuesta ${economyConfig.emojis.perdida}`)
                            .addFields(
                                {
                                    name: '💣 Tablero Final',
                                    value: tableroDisplay,
                                    inline: false
                                },
                                {
                                    name: `${economyConfig.emojis.perdida} Resultado`,
                                    value:
                                        `**Apuesta:** $${usuario.minesGame.apuesta.toLocaleString()}\n` +
                                        `**Pérdida:** $${usuario.minesGame.apuesta.toLocaleString()}\n` +
                                        `**Casillas reveladas:** ${usuario.minesGame.reveladas.length}`,
                                    inline: true
                                },
                                {
                                    name: `${economyConfig.emojis.dinero} Balance`,
                                    value: `**Actual:** $${usuario.dinero.toLocaleString()}`,
                                    inline: true
                                }
                            )
                            .setFooter({ text: '¡Mejor suerte la próxima vez!' })
                        ]
                    });

                } else {
                    // ¡CASILLA SEGURA!
                    usuario.minesGame.reveladas.push(posicion);

                    // Calcular nuevo multiplicador
                    const multiplicador = parseFloat(casinoUtils.calcularMultiplicadorMines(
                        usuario.minesGame.cantidadMinas,
                        usuario.minesGame.reveladas.length
                    ));

                    usuario.minesGame.multiplicadorActual = multiplicador;
                    await usuario.save();

                    // Calcular ganancia potencial
                    const gananciaPotencial = Math.floor(usuario.minesGame.apuesta * multiplicador);

                    // Mostrar tablero
                    const tableroDisplay = crearTableroVisual(
                        usuario.minesGame.reveladas,
                        [],
                        usuario.minesGame.cantidadMinas
                    );

                    const casillasRestantes = config.casillasTotal - usuario.minesGame.cantidadMinas - usuario.minesGame.reveladas.length;

                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.ganancia)
                            .setAuthor({
                                name: message.author.username,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setTitle(`${config.emojis.safe} ¡Casilla Segura!`)
                            .setDescription(
                                `${config.emojis.gem} Multiplicador: **${multiplicador}x**\n` +
                                `${economyConfig.emojis.ganancia} Ganancia potencial: **$${gananciaPotencial.toLocaleString()}**\n\n` +
                                `Continúa revelando o cobra con \`${prefix}mines cashout\``
                            )
                            .addFields(
                                {
                                    name: '🎯 Tablero',
                                    value: tableroDisplay,
                                    inline: false
                                },
                                {
                                    name: '📊 Progreso',
                                    value:
                                        `**Reveladas:** ${usuario.minesGame.reveladas.length}/${config.casillasTotal - usuario.minesGame.cantidadMinas}\n` +
                                        `**Restantes:** ${casillasRestantes}\n` +
                                        `**Minas:** ${usuario.minesGame.cantidadMinas}`,
                                    inline: true
                                }
                            )
                            .setFooter({ text: casillasRestantes > 0 ? '💎 ¡Sigue revelando para más ganancias!' : '🏆 ¡Todas las casillas reveladas!' })
                        ]
                    });
                }
            }

            // ==================== CASHOUT ====================
            else if (subcomando === 'cashout' || subcomando === 'cobrar' || subcomando === 'c') {
                // Verificar juego activo
                if (!usuario.minesGame?.activo) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.error)
                            .setDescription(
                                `${economyConfig.emojis.error} No tienes un juego activo para cobrar!`
                            )
                        ]
                    });
                }

                // Verificar que haya revelado al menos una casilla
                if (usuario.minesGame.reveladas.length === 0) {
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(casinoConfig.colores.warning)
                            .setDescription(
                                `${economyConfig.emojis.warning} Debes revelar al menos una casilla antes de cobrar!`
                            )
                        ]
                    });
                }

                // Calcular ganancia
                const ganancia = Math.floor(usuario.minesGame.apuesta * usuario.minesGame.multiplicadorActual);
                const gananciaNeta = ganancia - usuario.minesGame.apuesta;

                // Agregar dinero
                usuario.dinero += ganancia;

                // Actualizar estadísticas
                await casinoUtils.actualizarEstadisticas(
                    userId,
                    'mines',
                    usuario.minesGame.apuesta,
                    ganancia,
                    usuario.minesGame.multiplicadorActual
                );

                // Guardar datos del juego antes de cerrarlo
                const apuesta = usuario.minesGame.apuesta;
                const multiplicador = usuario.minesGame.multiplicadorActual;
                const reveladas = usuario.minesGame.reveladas.length;

                // Cerrar juego
                usuario.minesGame.activo = false;
                await usuario.save();

                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.ganancia)
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.displayAvatarURL()
                        })
                        .setTitle(`${config.emojis.gem} ¡Cashout Exitoso!`)
                        .setDescription(casinoUtils.obtenerMensajePsicologico('gananciaGrande'))
                        .addFields(
                            {
                                name: `${economyConfig.emojis.success} Ganancia`,
                                value:
                                    `**Apuesta:** $${apuesta.toLocaleString()}\n` +
                                    `**Multiplicador:** ${multiplicador}x\n` +
                                    `**Ganancia total:** $${ganancia.toLocaleString()}\n` +
                                    `**Profit:** ${economyConfig.emojis.ganancia} $${gananciaNeta.toLocaleString()}`,
                                inline: true
                            },
                            {
                                name: `${economyConfig.emojis.dinero} Balance`,
                                value:
                                    `**Anterior:** $${(usuario.dinero - ganancia).toLocaleString()}\n` +
                                    `**Actual:** $${usuario.dinero.toLocaleString()}`,
                                inline: true
                            },
                            {
                                name: '📊 Estadísticas',
                                value:
                                    `**Casillas reveladas:** ${reveladas}\n` +
                                    `**Racha de suerte:** ${config.emojis.fire}`,
                                inline: false
                            }
                        )
                        .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                        .setTimestamp()
                    ]
                });
            }

            // Subcomando inválido
            else {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.error)
                        .setDescription(
                            `${economyConfig.emojis.error} Subcomando inválido!\n\n` +
                            `**Usa:** start, reveal, o cashout`
                        )
                    ]
                });
            }

        } catch (error) {
            console.error('Error en comando mines:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al procesar el juego. Intenta de nuevo.`)
                ]
            });
        }
    },
};

/**
 * Crea la visualización del tablero 5x5
 */
function crearTableroVisual(reveladas, minas, cantidadMinas, minaEncontrada = -1) {
    const config = casinoConfig.mines;
    let display = '```\n';

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const pos = i * 5 + j;

            if (pos === minaEncontrada) {
                display += '💥 '; // Mina encontrada (perdió)
            } else if (reveladas.includes(pos)) {
                display += '💎 '; // Casilla segura revelada
            } else if (minas.includes(pos)) {
                display += '💣 '; // Mostrar minas (solo al final)
            } else {
                // Mostrar número de posición (1-25)
                const num = (pos + 1).toString().padStart(2, '0');
                display += num + ' ';
            }
        }
        display += '\n';
    }

    display += '```';
    return display;
}
