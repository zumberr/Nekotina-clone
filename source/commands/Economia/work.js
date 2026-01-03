const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const Usuarios = require('../../models/userSchema');
const economyConfig = require('../../config/economy');
const streakUtils = require('../../utils/streakUtils');
const petUtils = require('../../utils/petUtils');
const engancheUtils = require('../../utils/engancheUtils');

const PROFESIONES = economyConfig.recompensas?.work?.profesiones || [];

module.exports = {
    name: 'work',
    usage: 'work',
    aliases: ['trabajar', 'chamba'],
    cooldown: economyConfig.cooldowns.work || 3600000,
    example: 'work',
    ownerOnly: false,
    UserPerms: ['SEND_MESSAGES'],
    ClientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    description: 'Realiza un trabajo con eventos aleatorios, rachas laborales y bonificaciones de mascotas.',

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

            userData.economy = userData.economy || {};
            userData.economy.streaks = userData.economy.streaks || {};

            const { rachaConfig, recompensaConfig } = streakUtils.obtenerConfigRacha('work');
            const estadoRacha = userData.economy.streaks.work || {
                contador: 0,
                mejorMarca: 0,
                ultimaRecompensa: null,
                multiplicadorActual: 1,
            };

            const streakActiva = streakUtils.rachaVigente(estadoRacha.ultimaRecompensa, rachaConfig.resetHoras || 24);
            const nuevoContador = streakActiva ? estadoRacha.contador + 1 : 1;

            const profesion = PROFESIONES.length
                ? PROFESIONES[Math.floor(Math.random() * PROFESIONES.length)]
                : { nombre: 'Freelancer', multiplicador: 1.1 };

            const base = streakUtils.generarBase(recompensaConfig.baseMin, recompensaConfig.baseMax);
            const multiplicadorRacha = streakUtils.calcularMultiplicador(nuevoContador, recompensaConfig.multiplicadoresRacha);
            const multiplicadorProfesion = profesion.multiplicador || 1;

            const bonosMascotas = petUtils.calcularBonosMascotas(userData.economy.mascotas);
            const bonosEnganche = engancheUtils.calcularBonosPorPlan(userData.economy.mascotas, userData.economy.enganche?.activos);

            let multiplicadorExtra = 1 + (bonosMascotas.work || 0) + (bonosEnganche.work || 0);

            const eventos = recompensaConfig.eventosAleatorios || [];
            let descripcionEvento = null;
            for (const evento of eventos) {
                if (Math.random() <= evento.probabilidad) {
                    if (evento.tipo === 'bonus') {
                        multiplicadorExtra *= evento.multiplicador || 1;
                        descripcionEvento = evento.descripcion;
                    } else if (evento.tipo === 'multa') {
                        multiplicadorExtra *= Math.max(0, 1 - (evento.penalizacion || 0));
                        descripcionEvento = evento.descripcion;
                    } else if (evento.tipo === 'loot' && evento.recompensa?.tipo === 'gemas') {
                        const gemas = evento.recompensa.cantidad || 1;
                        userData.gemas = (userData.gemas || 0) + gemas;
                        descripcionEvento = `${evento.descripcion} (+${gemas} gemas)`;
                    }
                    break;
                }
            }

            const totalMultiplicador = multiplicadorRacha * multiplicadorProfesion * multiplicadorExtra;
            let ganancia = streakUtils.aplicarMultiplicador(base, totalMultiplicador);

            const limiteDiario = economyUtils.verificarLimiteGanancias(userData.gananciasDiarias || 0);
            if (limiteDiario.limitado) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(economyConfig.colores.warning)
                            .setAuthor({ name: '⚠️ Límite Diario Alcanzado' })
                            .setDescription('Has alcanzado el límite diario de ganancias. Inténtalo mañana.')
                            .addField('Límite', `\`$${limiteDiario.limite}\``)
                    ]
                });
            }

            await db.add(`balance_${guildId}_${userId}`, ganancia);

            userData.gananciasDiarias = (userData.gananciasDiarias || 0) + ganancia;

            userData.economy.streaks.work = {
                contador: nuevoContador,
                mejorMarca: Math.max(estadoRacha.mejorMarca || 0, nuevoContador),
                ultimaRecompensa: new Date(),
                multiplicadorActual: totalMultiplicador,
            };

            await userData.save();

            const embed = new MessageEmbed()
                .setColor(economyConfig.colores.principal)
                .setAuthor({
                    name: `${economyConfig.emojis.dinero} Resultado del Trabajo`,
                    iconURL: member.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`Trabajaste como **${profesion.nombre}**`)
                .addFields(
                    {
                        name: '💵 Ganancia Base',
                        value: `\`$${base}\``,
                        inline: true,
                    },
                    {
                        name: '🎯 Multiplicador Total',
                        value: `\`x${totalMultiplicador.toFixed(2)}\``,
                        inline: true,
                    },
                    {
                        name: '💰 Pago Final',
                        value: `\`$${ganancia}\``,
                        inline: true,
                    },
                    {
                        name: '🔥 Racha Laboral',
                        value: `\`${nuevoContador} días\``,
                        inline: true,
                    },
                    {
                        name: '🏅 Mejor Racha',
                        value: `\`${userData.economy.streaks.work.mejorMarca}\``,
                        inline: true,
                    },
                )
                .setFooter({ text: 'Mantén tu racha viva regresando antes de que termine el día.' })
                .setTimestamp();

            if (descripcionEvento) {
                embed.addField('🎲 Evento', descripcionEvento);
            }

            if (bonosMascotas.work > 0) {
                embed.addField('🐾 Bonus de Mascotas', `Multiplicador adicional: +${(bonosMascotas.work * 100).toFixed(1)}%`);
            }

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: '❌ Error' })
                        .setDescription('Ocurrió un error al intentar trabajar. Intenta nuevamente más tarde.')
                ]
            });
        }
    }
};
