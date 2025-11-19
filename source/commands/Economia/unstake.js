const db = require("quick.db");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Usuarios = require("../../models/userSchema");
const stakingUtils = require("../../utils/stakingUtils");
const economyConfig = require("../../config/economy");

module.exports = {
    name: "unstake",
    usage: "unstake <número>",
    aliases: ["retirar-stake", "claim-stake"],
    cooldown: 0,
    example: "unstake 1",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Retira un stake activo. Si no ha vencido, perderás el 50% de tu inversión.",

    async run(client, message, args, prefix) {
        try {
            // Validar argumento
            const stakeIndex = parseInt(args[0]);

            if (!stakeIndex || isNaN(stakeIndex) || stakeIndex < 1) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Número inválido" })
                        .setDescription(`Debes especificar el número del stake a retirar.\n\n**Uso:** \`${prefix}${this.usage}\`\n**Ejemplo:** \`${prefix}${this.example}\`\n\nUsa \`${prefix}stakes\` para ver tus stakes activos.`)
                    ]
                });
            }

            // Obtener datos del usuario desde MongoDB
            let userData = await Usuarios.findOne({ idusuario: message.author.id });

            if (!userData || !userData.stakes || userData.stakes.length === 0) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Sin stakes" })
                        .setDescription(`No tienes stakes activos.\n\nUsa \`${prefix}stake <cantidad> <periodo>\` para crear uno.`)
                    ]
                });
            }

            // Obtener stakes activos
            const stakesActivos = userData.stakes.filter(s => s.activo);

            if (stakesActivos.length === 0) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Sin stakes activos" })
                        .setDescription(`No tienes stakes activos.\n\nUsa \`${prefix}stake <cantidad> <periodo>\` para crear uno.`)
                    ]
                });
            }

            // Validar índice
            if (stakeIndex > stakesActivos.length) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Stake no encontrado" })
                        .setDescription(`Solo tienes **${stakesActivos.length}** stake(s) activo(s).\n\nUsa \`${prefix}stakes\` para ver tus stakes.`)
                    ]
                });
            }

            // Obtener el stake seleccionado
            const stakeSeleccionado = stakesActivos[stakeIndex - 1];
            const vencido = stakingUtils.haVencido(stakeSeleccionado.fechaVencimiento);
            const infoPeriodo = stakingUtils.obtenerInfoPeriodo(stakeSeleccionado.periodo);

            let embed;
            let row;

            if (vencido) {
                // Stake vencido - reclamar ganancias
                const ganancias = stakingUtils.calcularGanancias(stakeSeleccionado.cantidad, stakeSeleccionado.periodo);
                const total = stakeSeleccionado.cantidad + ganancias;

                embed = new MessageEmbed()
                    .setColor(economyConfig.colores.success)
                    .setAuthor({ name: "💎 Reclamar Stake Completado" })
                    .setDescription(`Tu stake ha vencido. ¡Felicidades por tu inversión exitosa!`)
                    .addFields(
                        {
                            name: "💰 Inversión Inicial",
                            value: `\`$${stakeSeleccionado.cantidad}\``,
                            inline: true
                        },
                        {
                            name: `${infoPeriodo.emoji} Período`,
                            value: `**${stakeSeleccionado.periodo} día(s)**`,
                            inline: true
                        },
                        {
                            name: "📈 APY",
                            value: `**${stakeSeleccionado.apy}%**`,
                            inline: true
                        },
                        {
                            name: "💵 Ganancias",
                            value: `\`$${ganancias}\``,
                            inline: true
                        },
                        {
                            name: "💎 Total a Recibir",
                            value: `\`$${total}\``,
                            inline: true
                        },
                        {
                            name: "⏰ Completado",
                            value: `<t:${Math.floor(stakeSeleccionado.fechaVencimiento.getTime() / 1000)}:R>`,
                            inline: true
                        }
                    );

                row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('claim_stake')
                            .setLabel('💎 Reclamar')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('cancel_unstake')
                            .setLabel('❌ Cancelar')
                            .setStyle('SECONDARY')
                    );

            } else {
                // Stake no vencido - retiro anticipado con penalización
                const tiempoRestante = stakingUtils.calcularTiempoRestante(stakeSeleccionado.fechaVencimiento);
                const tiempoFormateado = stakingUtils.formatearTiempoRestante(tiempoRestante);
                const penalizacion = stakingUtils.calcularPenalizacion(stakeSeleccionado.cantidad);

                embed = new MessageEmbed()
                    .setColor(economyConfig.colores.warning)
                    .setAuthor({ name: "⚠️ Retiro Anticipado - PENALIZACIÓN" })
                    .setDescription(`**¡ADVERTENCIA!** Este stake aún no ha vencido.\n\nSi lo retiras ahora, **perderás el 50%** de tu inversión inicial y **todas las ganancias**.`)
                    .addFields(
                        {
                            name: "💰 Inversión Inicial",
                            value: `\`$${stakeSeleccionado.cantidad}\``,
                            inline: true
                        },
                        {
                            name: `${infoPeriodo.emoji} Período`,
                            value: `**${stakeSeleccionado.periodo} día(s)**`,
                            inline: true
                        },
                        {
                            name: "⏳ Tiempo Restante",
                            value: `**${tiempoFormateado}**`,
                            inline: true
                        },
                        {
                            name: "📉 Cantidad Perdida",
                            value: `\`-$${penalizacion.cantidadPerdida}\``,
                            inline: true
                        },
                        {
                            name: "💵 Cantidad Recuperada",
                            value: `\`$${penalizacion.cantidadRecuperada}\``,
                            inline: true
                        },
                        {
                            name: "⚠️ Recomendación",
                            value: `Espera **${tiempoFormateado}** para recibir el **${stakeSeleccionado.apy}%** de ganancias.`,
                            inline: false
                        }
                    )
                    .setFooter({ text: "⚠️ Esta acción no se puede deshacer" });

                row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('force_unstake')
                            .setLabel('⚠️ Retirar Ahora (Con Penalización)')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('cancel_unstake')
                            .setLabel('❌ Cancelar')
                            .setStyle('SECONDARY')
                    );
            }

            const confirmMsg = await message.reply({
                embeds: [embed],
                components: [row]
            });

            // Crear collector para los botones
            const filter = (interaction) => interaction.user.id === message.author.id;

            const collector = confirmMsg.createMessageComponentCollector({
                filter,
                time: 30000,
                max: 1
            });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'claim_stake') {
                    // Reclamar stake completado
                    const ganancias = stakingUtils.calcularGanancias(stakeSeleccionado.cantidad, stakeSeleccionado.periodo);
                    const total = stakeSeleccionado.cantidad + ganancias;

                    // Agregar dinero al banco
                    await db.add(`bankBalance_${message.guild.id}_${message.author.id}`, total);

                    // Marcar stake como inactivo
                    const stakeIndexInArray = userData.stakes.findIndex(s =>
                        s.cantidad === stakeSeleccionado.cantidad &&
                        s.fechaInicio.getTime() === stakeSeleccionado.fechaInicio.getTime()
                    );
                    userData.stakes[stakeIndexInArray].activo = false;
                    await userData.save();

                    const successEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.success)
                        .setAuthor({ name: "✅ Stake Reclamado Exitosamente" })
                        .setDescription(`¡Felicidades! Has reclamado tu stake completado.`)
                        .addFields(
                            {
                                name: "💰 Inversión",
                                value: `\`$${stakeSeleccionado.cantidad}\``,
                                inline: true
                            },
                            {
                                name: "💵 Ganancias",
                                value: `\`+$${ganancias}\``,
                                inline: true
                            },
                            {
                                name: "💎 Total Recibido",
                                value: `\`$${total}\``,
                                inline: true
                            }
                        )
                        .setFooter({ text: `El dinero ha sido depositado en tu cuenta bancaria.` });

                    await interaction.update({
                        embeds: [successEmbed],
                        components: []
                    });

                } else if (interaction.customId === 'force_unstake') {
                    // Retiro anticipado con penalización
                    const penalizacion = stakingUtils.calcularPenalizacion(stakeSeleccionado.cantidad);

                    // Agregar dinero recuperado al banco
                    await db.add(`bankBalance_${message.guild.id}_${message.author.id}`, penalizacion.cantidadRecuperada);

                    // Marcar stake como inactivo
                    const stakeIndexInArray = userData.stakes.findIndex(s =>
                        s.cantidad === stakeSeleccionado.cantidad &&
                        s.fechaInicio.getTime() === stakeSeleccionado.fechaInicio.getTime()
                    );
                    userData.stakes[stakeIndexInArray].activo = false;
                    await userData.save();

                    const penaltyEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.warning)
                        .setAuthor({ name: "⚠️ Stake Retirado Anticipadamente" })
                        .setDescription(`Has retirado tu stake antes de tiempo.`)
                        .addFields(
                            {
                                name: "💰 Inversión Original",
                                value: `\`$${stakeSeleccionado.cantidad}\``,
                                inline: true
                            },
                            {
                                name: "📉 Penalización",
                                value: `\`-$${penalizacion.cantidadPerdida}\``,
                                inline: true
                            },
                            {
                                name: "💵 Cantidad Recuperada",
                                value: `\`$${penalizacion.cantidadRecuperada}\``,
                                inline: true
                            }
                        )
                        .setFooter({ text: "El dinero ha sido depositado en tu cuenta bancaria." });

                    await interaction.update({
                        embeds: [penaltyEmbed],
                        components: []
                    });

                } else if (interaction.customId === 'cancel_unstake') {
                    const cancelEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.info)
                        .setAuthor({ name: "❌ Retiro Cancelado" })
                        .setDescription("Has cancelado el retiro del stake.");

                    await interaction.update({
                        embeds: [cancelEmbed],
                        components: []
                    });
                }
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    const timeoutEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "⏰ Tiempo Agotado" })
                        .setDescription("Se ha agotado el tiempo para confirmar el retiro.");

                    await confirmMsg.edit({
                        embeds: [timeoutEmbed],
                        components: []
                    });
                }
            });

        } catch (error) {
            console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`);
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(economyConfig.colores.error)
                    .setAuthor({ name: "❌ Error" })
                    .setDescription("Ocurrió un error al procesar el retiro. Inténtalo de nuevo.")
                ]
            });
        }
    }
};
