const { EmbedBuilder } = require('discord.js');
const User = require('../../models/userSchema');
const casinoUtils = require('../../utils/casinoUtils');
const casinoConfig = require('../../config/casino');
const economyConfig = require('../../config/economy');

module.exports = {
    name: 'rakeback',
    category: 'Casino',
    description: '💎 Reclamar tu rakeback acumulado',
    aliases: ['rake', 'cashback', 'rb'],
    usage: '',
    example: 'rakeback',

    async execute(client, message, args, prefix) {
        const userId = message.author.id;

        try {
            // Obtener usuario
            const usuario = await User.findOne({ idusuario: userId });

            if (!usuario || !usuario.casinoStats) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.info)
                        .setTitle(`${casinoConfig.emojis.diamante} RAKEBACK`)
                        .setDescription(
                            `**¿Qué es Rakeback?**\n` +
                            `Es un cashback que recibes por jugar en el casino!\n\n` +
                            `**¿Cómo funciona?**\n` +
                            `└ Por cada apuesta que pierdas, acumulas rakeback\n` +
                            `└ El porcentaje depende de tu nivel VIP\n` +
                            `└ Reclámalo cuando quieras!\n\n` +
                            `**Niveles VIP y Rakeback:**\n`
                        )
                        .addFields(
                            ...casinoConfig.rakeback.niveles.map(nivel => ({
                                name: `${nivel.nivel === 0 ? '🥉' : nivel.nivel === 1 ? '🥈' : nivel.nivel === 2 ? '🥇' : nivel.nivel === 3 ? '💎' : nivel.nivel === 4 ? '👑' : '⭐'} ${nivel.nombre}`,
                                value:
                                    `**Rakeback:** ${(nivel.rakeback * 100).toFixed(1)}%\n` +
                                    `**Volumen:** $${nivel.volumenRequerido.toLocaleString()}+`,
                                inline: true
                            }))
                        )
                        .setFooter({ text: '💡 Juega en el casino para empezar a acumular rakeback!' })
                    ]
                });
            }

            const stats = usuario.casinoStats;
            const rakebackDisponible = stats.rakeback || 0;

            // Verificar si tiene rakeback para reclamar
            if (rakebackDisponible < casinoConfig.rakeback.minimoReclamar) {
                const nivelVIP = casinoUtils.calcularNivelVIP(stats.volumenTotal);

                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(casinoConfig.colores.info)
                        .setTitle(`${casinoConfig.emojis.diamante} RAKEBACK`)
                        .setDescription(
                            `**Rakeback Disponible:** $${rakebackDisponible.toLocaleString()}\n\n` +
                            `${economyConfig.emojis.warning} Necesitas al menos $${casinoConfig.rakeback.minimoReclamar.toLocaleString()} para reclamar.\n\n` +
                            `**Tu Nivel VIP:** ${nivelVIP.nombre}\n` +
                            `**Tu Rakeback:** ${(nivelVIP.rakeback * 100).toFixed(1)}%\n` +
                            `**Volumen Total:** $${stats.volumenTotal.toLocaleString()}`
                        )
                        .addFields({
                            name: '💡 Cómo ganar más Rakeback',
                            value:
                                `1. Juega más en el casino (acumulas rakeback por pérdidas)\n` +
                                `2. Sube de nivel VIP para mayor porcentaje\n` +
                                `3. Reclama cuando llegues al mínimo`,
                            inline: false
                        })
                        .setFooter({ text: '🎰 Sigue jugando para acumular más rakeback!' })
                    ]
                });
            }

            // Reclamar rakeback
            usuario.dinero += rakebackDisponible;
            usuario.casinoStats.rakeback = 0;
            await usuario.save();

            // Calcular info del nivel VIP
            const nivelVIP = casinoUtils.calcularNivelVIP(stats.volumenTotal);

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.ganancia)
                    .setAuthor({
                        name: message.author.username,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTitle(`${casinoConfig.emojis.diamante} ¡RAKEBACK RECLAMADO!`)
                    .setDescription(
                        `${economyConfig.emojis.success} Has reclamado tu rakeback exitosamente!`
                    )
                    .addFields(
                        {
                            name: `${economyConfig.emojis.ganancia} Rakeback Reclamado`,
                            value:
                                `**Cantidad:** $${rakebackDisponible.toLocaleString()}\n` +
                                `**Nivel VIP:** ${nivelVIP.nombre}\n` +
                                `**Porcentaje:** ${(nivelVIP.rakeback * 100).toFixed(1)}%`,
                            inline: true
                        },
                        {
                            name: `${economyConfig.emojis.dinero} Nuevo Balance`,
                            value:
                                `**Anterior:** $${(usuario.dinero - rakebackDisponible).toLocaleString()}\n` +
                                `**Actual:** $${usuario.dinero.toLocaleString()}`,
                            inline: true
                        }
                    )
                    .addFields({
                        name: '📊 Estadísticas',
                        value:
                            `**Volumen Total:** $${stats.volumenTotal.toLocaleString()}\n` +
                            `**Total Apostado:** $${stats.totalApostado.toLocaleString()}\n` +
                            `**Total Rakeback Reclamado:** $${(stats.rakebackTotal || 0) + rakebackDisponible.toLocaleString()}`,
                        inline: false
                    })
                    .setFooter({ text: '💎 Sigue jugando para acumular más rakeback!' })
                    .setTimestamp()
                ]
            });

        } catch (error) {
            console.error('Error en comando rakeback:', error);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor(casinoConfig.colores.error)
                    .setDescription(`${economyConfig.emojis.error} Ocurrió un error al procesar el rakeback.`)
                ]
            });
        }
    },
};
