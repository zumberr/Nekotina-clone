const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const Usuarios = require('../../models/userSchema');
const economyConfig = require('../../config/economy');
const economyUtils = require('../../utils/economyUtils');
const streakUtils = require('../../utils/streakUtils');
const petUtils = require('../../utils/petUtils');
const engancheUtils = require('../../utils/engancheUtils');

module.exports = {
    name: 'daily',
    usage: 'daily',
    aliases: ['diario', 'reward'],
    cooldown: 0,
    example: 'daily',
    ownerOnly: false,
    UserPerms: ['SEND_MESSAGES'],
    ClientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    description: 'Reclama tu recompensa diaria con sistema de rachas, sorpresas y bonificaciones por mascotas.',

    async run(client, message) {
        try {
            const member = message.member;
            const userId = member.id;
            const guildId = message.guild.id;

            let userData = await Usuarios.findOne({ idusuario: userId });

            if (!userData) {
                userData = new Usuarios({
                    idusuario: userId,
                    username: member.user.tag,
                });
                await userData.save();
            }

            const { rachaConfig, recompensaConfig } = streakUtils.obtenerConfigRacha('daily');

            userData.economy = userData.economy || {};
            userData.economy.streaks = userData.economy.streaks || {};
            const estadoRacha = userData.economy.streaks.daily || {
                contador: 0,
                mejorMarca: 0,
                ultimaRecompensa: null,
                reiniciosDisponibles: rachaConfig.reiniciosPermitidos || 0,
            };

            const streakActiva = streakUtils.rachaVigente(estadoRacha.ultimaRecompensa, rachaConfig.resetHoras || 24);
            const nuevoContador = streakActiva ? estadoRacha.contador + 1 : 1;

            const base = streakUtils.generarBase(recompensaConfig.baseMin, recompensaConfig.baseMax);
            const multiplicadorRacha = streakUtils.calcularMultiplicador(nuevoContador, recompensaConfig.multiplicadoresRacha);
            const bonosMascotas = petUtils.calcularBonosMascotas(userData.economy.mascotas);
            const bonosEnganche = engancheUtils.calcularBonosPorPlan(userData.economy.mascotas, userData.economy.enganche?.activos);

            const multiplicadorMascotas = 1 + (bonosMascotas.daily || 0) + (bonosEnganche.daily || 0);
            const totalMultiplicador = multiplicadorRacha * multiplicadorMascotas;
            let recompensaTotal = streakUtils.aplicarMultiplicador(base, totalMultiplicador);

            const hitosCumplidos = streakUtils.obtenerHitos(nuevoContador, recompensaConfig.hitos);
            let bonusGemas = 0;

            hitosCumplidos.forEach(hito => {
                recompensaTotal += hito.bonusDinero || 0;
                bonusGemas += hito.bonusGemas || 0;
            });

            const sorpresa = streakUtils.sortearSorpresa(recompensaConfig.sorpresas);
            let mensajeSorpresa = null;
            if (sorpresa) {
                switch (sorpresa.tipo) {
                    case 'dinero':
                        recompensaTotal += sorpresa.cantidad || 0;
                        mensajeSorpresa = `🎁 Sorpresa: +$${sorpresa.cantidad}`;
                        break;
                    case 'gemas':
                        bonusGemas += sorpresa.cantidad || 0;
                        mensajeSorpresa = `💎 Sorpresa: +${sorpresa.cantidad} gemas`;
                        break;
                    case 'buff':
                        message.client.emit('dailyBuffGranted', {
                            userId,
                            guildId,
                            buff: sorpresa,
                        });
                        mensajeSorpresa = '⚡ Obtuviste un buff temporal especial.';
                        break;
                }
            }

            await db.add(`balance_${guildId}_${userId}`, recompensaTotal);

            if (bonusGemas > 0) {
                userData.gemas = (userData.gemas || 0) + bonusGemas;
            }

            userData.economy.enganche = userData.economy.enganche || { activos: [], historial: [] };
            const enganchesActivos = userData.economy.enganche.activos;

            const resumenCuotas = [];

            if (Array.isArray(enganchesActivos)) {
                for (let i = 0; i < enganchesActivos.length; i++) {
                    const plan = enganchesActivos[i];
                    const ahora = Date.now();
                    const proximaCuota = new Date(plan.proximaCuota).getTime();
                    if (ahora >= proximaCuota) {
                        const { actualizado, retraso } = engancheUtils.procesarCuota(plan);
                        enganchesActivos[i] = actualizado;
                        if (retraso) {
                            resumenCuotas.push(`⚠️ Retraso en cuota de ${plan.petId}. Se aplicó penalización.`);
                        } else {
                            resumenCuotas.push(`✅ Cuota pagada automáticamente para ${plan.petId}.`);
                            const restante = actualizado.cuota;
                            await db.subtract(`balance_${guildId}_${userId}`, restante);
                        }

                        if (engancheUtils.verificarIncumplimiento(actualizado)) {
                            userData.economy.enganche.historial.push({
                                petId: plan.petId,
                                estado: 'reposeida',
                                fecha: new Date(),
                                detalle: 'Mascota recuperada por incumplimiento de cuotas.',
                            });

                            userData.economy.mascotas = (userData.economy.mascotas || []).filter(p => p.petId !== plan.petId);
                            enganchesActivos.splice(i, 1);
                            i--;
                            resumenCuotas.push(`💔 Mascota ${plan.petId} fue recuperada por falta de pago.`);
                        }
                    }
                }
            }

            const estadoActualizado = streakUtils.actualizarRacha(
                estadoRacha,
                nuevoContador,
                Math.max(estadoRacha.mejorMarca || 0, nuevoContador),
                estadoRacha.reiniciosDisponibles,
                new Date()
            );

            userData.economy.streaks.daily = estadoActualizado;

            await userData.save();

            const embed = new MessageEmbed()
                .setColor(economyConfig.colores.principal)
                .setAuthor({
                    name: `${economyConfig.emojis.ganancia} Recompensa Diaria`,
                    iconURL: member.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription('¡Sigue reclamando diariamente para mantener tu racha!')
                .addFields(
                    {
                        name: '💵 Ganancia Base',
                        value: `\`$${base}\``,
                        inline: true,
                    },
                    {
                        name: '🔥 Multiplicador',
                        value: `\`x${totalMultiplicador.toFixed(2)}\``,
                        inline: true,
                    },
                    {
                        name: '💰 Total Recibido',
                        value: `\`$${recompensaTotal}\``,
                        inline: true,
                    },
                    {
                        name: '📆 Racha Actual',
                        value: `\`${estadoActualizado.contador} días\``,
                        inline: true,
                    },
                    {
                        name: '🏅 Mejor Racha',
                        value: `\`${estadoActualizado.mejorMarca}\``,
                        inline: true,
                    },
                    {
                        name: '💎 Gemas Obtenidas',
                        value: `\`${bonusGemas}\``,
                        inline: true,
                    },
                )
                .setFooter({ text: 'Reclama nuevamente en 24 horas para mantener la racha.' })
                .setTimestamp();

            if (mensajeSorpresa) {
                embed.addField('🎁 Sorpresa', mensajeSorpresa);
            }

            if (resumenCuotas.length) {
                embed.addField('📜 Planes de Enganche', resumenCuotas.join('\n'));
            }

            if (bonosMascotas.daily > 0) {
                embed.addField('🐾 Bonus de Mascotas', `Multiplicador adicional: +${(bonosMascotas.daily * 100).toFixed(1)}%`);
            }

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: '❌ Error' })
                        .setDescription('Ocurrió un error al reclamar la recompensa diaria. Intenta nuevamente más tarde.')
                ]
            });
        }
    }
};
