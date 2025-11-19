const { MessageEmbed } = require("discord.js");
const Usuarios = require("../../models/userSchema");
const stakingUtils = require("../../utils/stakingUtils");
const economyConfig = require("../../config/economy");

module.exports = {
    name: "stakes",
    usage: "stakes [usuario]",
    aliases: ["mystakes", "inversiones"],
    cooldown: 0,
    example: "stakes",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Ver todos tus stakes activos y completados.",

    async run(client, message, args, prefix) {
        try {
            // Obtener el usuario objetivo
            const targetMember = message.mentions.members.first() ||
                                message.guild.members.cache.get(args[0]) ||
                                message.member;

            // Obtener datos del usuario desde MongoDB
            let userData = await Usuarios.findOne({ idusuario: targetMember.id });

            if (!userData || !userData.stakes || userData.stakes.length === 0) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.info)
                        .setAuthor({ name: `📊 Stakes de ${targetMember.user.tag}` })
                        .setDescription(`${targetMember.id === message.author.id ? 'No tienes' : targetMember.user.username + ' no tiene'} stakes activos.\n\n**¿Quieres empezar a invertir?**\nUsa \`${prefix}stake <cantidad> <periodo>\` para crear un stake.\n\nEjemplo: \`${prefix}stake 5000 7\``)
                        .addFields(
                            {
                                name: "⚡ Corto Plazo (1 día)",
                                value: `APY: **${economyConfig.staking.periodos[1].apy}%**`,
                                inline: true
                            },
                            {
                                name: "📈 Mediano Plazo (3 días)",
                                value: `APY: **${economyConfig.staking.periodos[3].apy}%**`,
                                inline: true
                            },
                            {
                                name: "💎 Largo Plazo (7 días)",
                                value: `APY: **${economyConfig.staking.periodos[7].apy}%**`,
                                inline: true
                            }
                        )
                    ]
                });
            }

            // Separar stakes activos y completados
            const stakesActivos = userData.stakes.filter(s => s.activo);
            const stakesCompletados = userData.stakes.filter(s => !s.activo);

            // Crear embed principal
            const embed = new MessageEmbed()
                .setColor(economyConfig.colores.stake)
                .setAuthor({ name: `📊 Stakes de ${targetMember.user.tag}`, iconURL: targetMember.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**Stakes Activos:** ${stakesActivos.length}/${economyConfig.staking.stakesMaximos}\n**Stakes Completados:** ${stakesCompletados.length}`)
                .setTimestamp();

            // Agregar stakes activos
            if (stakesActivos.length > 0) {
                let stakesText = "";
                let totalInvertido = 0;
                let totalGananciasEstimadas = 0;

                stakesActivos.forEach((stake, index) => {
                    const infoPeriodo = stakingUtils.obtenerInfoPeriodo(stake.periodo);
                    const ganancias = stakingUtils.calcularGanancias(stake.cantidad, stake.periodo);
                    const tiempoRestante = stakingUtils.calcularTiempoRestante(stake.fechaVencimiento);
                    const tiempoFormateado = stakingUtils.formatearTiempoRestante(tiempoRestante);
                    const vencido = stakingUtils.haVencido(stake.fechaVencimiento);

                    totalInvertido += stake.cantidad;
                    totalGananciasEstimadas += ganancias;

                    stakesText += `\n**${index + 1}.** ${infoPeriodo.emoji} ${infoPeriodo.nombre}\n`;
                    stakesText += `├ 💰 Inversión: \`$${stake.cantidad}\`\n`;
                    stakesText += `├ 📈 APY: **${stake.apy}%**\n`;
                    stakesText += `├ 💵 Ganancias: \`$${ganancias}\`\n`;
                    stakesText += `├ 💎 Total: \`$${stake.cantidad + ganancias}\`\n`;

                    if (vencido) {
                        stakesText += `└ ✅ **¡Listo para reclamar!** - Usa \`${prefix}unstake ${index + 1}\`\n`;
                    } else {
                        stakesText += `└ ⏳ Tiempo restante: **${tiempoFormateado}**\n`;
                    }
                });

                embed.addField("📊 Stakes Activos", stakesText);
                embed.addField("📈 Resumen",
                    `💰 Total Invertido: \`$${totalInvertido}\`\n` +
                    `💵 Ganancias Estimadas: \`$${totalGananciasEstimadas}\`\n` +
                    `💎 Total Estimado: \`$${totalInvertido + totalGananciasEstimadas}\``
                );
            }

            // Agregar stakes completados (últimos 5)
            if (stakesCompletados.length > 0) {
                let completadosText = "";
                const ultimosCompletados = stakesCompletados.slice(-5).reverse();

                ultimosCompletados.forEach((stake, index) => {
                    const infoPeriodo = stakingUtils.obtenerInfoPeriodo(stake.periodo);
                    const ganancias = stakingUtils.calcularGanancias(stake.cantidad, stake.periodo);

                    completadosText += `${infoPeriodo.emoji} **${infoPeriodo.nombre}** - Inversión: \`$${stake.cantidad}\` | Ganancias: \`$${ganancias}\`\n`;
                });

                embed.addField(`✅ Últimos Stakes Completados (${stakesCompletados.length})`, completadosText);
            }

            embed.setFooter({ text: `Usa ${prefix}stake para crear un nuevo stake | ${prefix}unstake <número> para retirar` });

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`);
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(economyConfig.colores.error)
                    .setAuthor({ name: "❌ Error" })
                    .setDescription("Ocurrió un error al obtener los stakes. Inténtalo de nuevo.")
                ]
            });
        }
    }
};
