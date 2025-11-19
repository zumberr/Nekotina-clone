const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoUtils = require('../../utils/casinoUtils');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'slots',
    category: 'Casino',
    description: '🎰 Tragamonedas - Gira y consigue 3 símbolos iguales!',
    aliases: ['slot', 's'],
    usage: '<apuesta>',
    example: 'slots 500',

    async execute(client, message, args, prefix) {
        const userId = message.author.id;
        const config = casinoConfig.slots;

        try {
            // Validar argumentos
            if (args.length < 1) {
                // Mostrar tabla de símbolos y multiplicadores
                let tablaSimbolos = '';
                for (const simbolo of config.simbolos) {
                    tablaSimbolos += `${simbolo.emoji} **${simbolo.nombre}** - ${simbolo.multiplicador}x\n`;
                }

                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.slots)
                        .setTitle(`${config.emojis.slot} SLOTS GAME`)
                        .setDescription(
                            `**¿Cómo jugar?**\n` +
                            `Gira los rodillos y consigue símbolos iguales!\n\n` +
                            `**Uso:** \`${prefix}slots <apuesta>\`\n` +
                            `**Ejemplo:** \`${prefix}slots 500\`\n\n` +
                            `**Límites:**\n` +
                            `└ Mínimo: $${config.apuestaMinima.toLocaleString()}\n` +
                            `└ Máximo: $${config.apuestaMaxima.toLocaleString()}\n`
                        )
                        .addFields(
                            {
                                name: '💎 Símbolos y Multiplicadores',
                                value: tablaSimbolos,
                                inline: true
                            },
                            {
                                name: '🎯 Premios',
                                value:
                                    `**3 Iguales:** Multiplicador completo\n` +
                                    `**2 Iguales:** ${config.multiplicadorDoble}x\n` +
                                    `**0 Iguales:** Pierdes la apuesta`,
                                inline: true
                            }
                        )
                        .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                    ]
                });
            }

            const apuesta = parseInt(args[0]);

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

            // Mostrar mensaje de spinning
            const spinningEmbed = new EmbedBuilder()
                .setColor(casinoConfig.colores.slots)
                .setTitle(`${config.emojis.spin} Girando...`)
                .setDescription(
                    `${config.emojis.slot} | ${config.emojis.slot} | ${config.emojis.slot}\n\n` +
                    `⏳ Los rodillos están girando...`
                );

            const spinningMsg = await message.reply({ embeds: [spinningEmbed] });

            // Esperar un poco para el efecto de suspense
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Girar slots
            const resultado = casinoUtils.girarSlots(
                usuario.serverSeed,
                userId,
                usuario.nonce
            );

            // Incrementar nonce
            usuario.nonce++;

            // Descontar apuesta
            usuario.dinero -= apuesta;

            // Calcular ganancia
            const multiplicador = parseFloat(resultado.multiplicador);
            const ganancia = Math.floor(apuesta * multiplicador);
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
                'slots',
                apuesta,
                ganancia,
                multiplicador
            );

            // Crear embed de resultado
            const embed = new EmbedBuilder()
                .setColor(resultado.gano ? casinoConfig.colores.ganancia : casinoConfig.colores.perdida)
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTitle(`${config.emojis.slot} SLOTS GAME`)
                .setFooter({ text: '🎰 Casino Virtual • Provably Fair' })
                .setTimestamp();

            // Mostrar rodillos
            const rodillosDisplay = `╔═══════════════╗
║  ${resultado.rodillos[0]}  ║  ${resultado.rodillos[1]}  ║  ${resultado.rodillos[2]}  ║
╚═══════════════╝`;

            embed.addFields({
                name: '🎰 Resultado',
                value: `\`\`\`${rodillosDisplay}\`\`\``,
                inline: false
            });

            // Verificar tipo de combo
            let tipoCombo = '';
            if (resultado.rodillos[0] === resultado.rodillos[1] && resultado.rodillos[1] === resultado.rodillos[2]) {
                tipoCombo = `${config.emojis.win} **¡JACKPOT! 3x ${resultado.nombres[0]}!**`;
            } else if (resultado.rodillos[0] === resultado.rodillos[1] ||
                       resultado.rodillos[1] === resultado.rodillos[2] ||
                       resultado.rodillos[0] === resultado.rodillos[2]) {
                tipoCombo = `${economyConfig.emojis.info} 2 símbolos iguales`;
            } else {
                tipoCombo = `${economyConfig.emojis.error} Sin combo`;
            }

            // Resultado
            if (resultado.gano) {
                embed.addFields(
                    {
                        name: tipoCombo,
                        value:
                            `**Multiplicador:** ${multiplicador}x\n` +
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

                // Mensaje especial para jackpots grandes
                if (multiplicador >= 20) {
                    embed.setDescription(
                        `${casinoUtils.obtenerMensajePsicologico('gananciaGrande')}\n\n` +
                        `¡Conseguiste el símbolo más raro! ${resultado.rodillos[0]}`
                    );
                } else if (multiplicador >= 10) {
                    embed.setDescription(`${config.emojis.fire} ¡Excelente combinación! ${config.emojis.fire}`);
                }

            } else {
                embed.addFields(
                    {
                        name: tipoCombo,
                        value:
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

                // Mensaje psicológico si hay 2 iguales (casi gana)
                if (resultado.rodillos[0] === resultado.rodillos[1] ||
                    resultado.rodillos[1] === resultado.rodillos[2]) {
                    embed.setDescription(casinoUtils.obtenerMensajePsicologico('casiGanas'));
                }
            }

            // Editar mensaje anterior
            await spinningMsg.edit({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando slots:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al procesar el juego. Intenta de nuevo.`)
                ]
            });
        }
    },
};
