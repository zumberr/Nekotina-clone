const db = require("quick.db");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Usuarios = require("../../models/userSchema");
const stakingUtils = require("../../utils/stakingUtils");
const economyConfig = require("../../config/economy");

module.exports = {
    name: "stake",
    usage: "stake <cantidad> <periodo>",
    aliases: ["invertir", "inv"],
    cooldown: 0,
    example: "stake 5000 7",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Bloquea dinero por un período de tiempo para obtener ganancias. Períodos: 1, 3 o 7 días.",

    async run(client, message, args, prefix) {
        try {
            // Obtener cantidad y período
            const cantidad = parseInt(args[0]);
            const periodo = parseInt(args[1]);

            // Validar argumentos
            if (!cantidad || isNaN(cantidad)) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Cantidad inválida" })
                        .setDescription(`Debes especificar una cantidad válida.\n\n**Uso:** \`${prefix}${this.usage}\`\n**Ejemplo:** \`${prefix}${this.example}\``)
                    ]
                });
            }

            if (!periodo || isNaN(periodo) || ![1, 3, 7].includes(periodo)) {
                const embed = new MessageEmbed()
                    .setColor(economyConfig.colores.error)
                    .setAuthor({ name: "❌ Error - Período inválido" })
                    .setDescription(`Debes especificar un período válido: **1**, **3** o **7** días.\n\n**Uso:** \`${prefix}${this.usage}\``)
                    .addFields(
                        {
                            name: `⚡ Corto Plazo (1 día)`,
                            value: `APY: **${economyConfig.staking.periodos[1].apy}%**`,
                            inline: true
                        },
                        {
                            name: `📈 Mediano Plazo (3 días)`,
                            value: `APY: **${economyConfig.staking.periodos[3].apy}%**`,
                            inline: true
                        },
                        {
                            name: `💎 Largo Plazo (7 días)`,
                            value: `APY: **${economyConfig.staking.periodos[7].apy}%**`,
                            inline: true
                        }
                    );

                return message.reply({ embeds: [embed] });
            }

            // Obtener datos del usuario desde MongoDB
            let userData = await Usuarios.findOne({ idusuario: message.author.id });

            if (!userData) {
                // Crear usuario si no existe
                userData = new Usuarios({
                    idusuario: message.author.id,
                    username: message.author.tag,
                    dinero: 0,
                    banco: 0,
                    total: 0,
                    stakes: []
                });
                await userData.save();
            }

            // Obtener dinero en banco desde quick.db
            let bankBalance = await db.fetch(`bankBalance_${message.guild.id}_${message.author.id}`) || 0;

            // Verificar que tenga suficiente dinero en el banco
            if (bankBalance < cantidad) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Fondos insuficientes" })
                        .setDescription(`No tienes suficiente dinero en el banco.\n\n**En banco:** \`$${bankBalance}\`\n**Necesitas:** \`$${cantidad}\``)
                    ]
                });
            }

            // Validar el nuevo stake
            const validacion = stakingUtils.validarNuevoStake(userData, cantidad, periodo);
            if (!validacion.valido) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Stake inválido" })
                        .setDescription(validacion.mensaje)
                    ]
                });
            }

            // Calcular ganancias estimadas
            const gananciasEstimadas = stakingUtils.calcularGanancias(cantidad, periodo);
            const totalEstimado = cantidad + gananciasEstimadas;
            const infoPeriodo = stakingUtils.obtenerInfoPeriodo(periodo);

            // Crear embed de confirmación
            const confirmEmbed = new MessageEmbed()
                .setColor(economyConfig.colores.stake)
                .setAuthor({ name: `📊 Confirmar Staking` })
                .setDescription(`¿Estás seguro de que quieres bloquear **$${cantidad}** por **${periodo} día(s)**?`)
                .addFields(
                    {
                        name: "💰 Inversión",
                        value: `\`$${cantidad}\``,
                        inline: true
                    },
                    {
                        name: `${infoPeriodo.emoji} Período`,
                        value: `**${periodo} día(s)**\n${infoPeriodo.nombre}`,
                        inline: true
                    },
                    {
                        name: "📈 APY",
                        value: `**${infoPeriodo.apy}%**`,
                        inline: true
                    },
                    {
                        name: "💵 Ganancias Estimadas",
                        value: `\`$${gananciasEstimadas}\``,
                        inline: true
                    },
                    {
                        name: "💎 Total Estimado",
                        value: `\`$${totalEstimado}\``,
                        inline: true
                    },
                    {
                        name: "⏳ Vencimiento",
                        value: `<t:${Math.floor(stakingUtils.calcularFechaVencimiento(periodo).getTime() / 1000)}:R>`,
                        inline: true
                    }
                )
                .setFooter({ text: "⚠️ Si retiras antes de tiempo, perderás el 50% de tu inversión y todas las ganancias." });

            // Crear botones de confirmación
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('confirm_stake')
                        .setLabel('✅ Confirmar')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('cancel_stake')
                        .setLabel('❌ Cancelar')
                        .setStyle('DANGER')
                );

            const confirmMsg = await message.reply({
                embeds: [confirmEmbed],
                components: [row]
            });

            // Crear collector para los botones
            const filter = (interaction) => {
                return interaction.user.id === message.author.id;
            };

            const collector = confirmMsg.createMessageComponentCollector({
                filter,
                time: 30000,
                max: 1
            });

            collector.on('collect', async (interaction) => {
                if (interaction.customId === 'confirm_stake') {
                    // Retirar dinero del banco
                    await db.subtract(`bankBalance_${message.guild.id}_${message.author.id}`, cantidad);

                    // Crear el stake
                    const nuevoStake = stakingUtils.crearStake(cantidad, periodo);

                    // Agregar el stake al usuario
                    if (!userData.stakes) userData.stakes = [];
                    userData.stakes.push(nuevoStake);
                    await userData.save();

                    // Crear embed de éxito
                    const successEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.success)
                        .setAuthor({ name: "✅ Staking Exitoso" })
                        .setDescription(`Has bloqueado **$${cantidad}** exitosamente.`)
                        .addFields(
                            {
                                name: "💰 Inversión",
                                value: `\`$${cantidad}\``,
                                inline: true
                            },
                            {
                                name: `${infoPeriodo.emoji} Período`,
                                value: `**${periodo} día(s)**`,
                                inline: true
                            },
                            {
                                name: "📈 APY",
                                value: `**${infoPeriodo.apy}%**`,
                                inline: true
                            },
                            {
                                name: "💵 Ganancias Estimadas",
                                value: `\`$${gananciasEstimadas}\``,
                                inline: true
                            },
                            {
                                name: "💎 Total Estimado",
                                value: `\`$${totalEstimado}\``,
                                inline: true
                            },
                            {
                                name: "⏳ Vencimiento",
                                value: `<t:${Math.floor(nuevoStake.fechaVencimiento.getTime() / 1000)}:F>`,
                                inline: false
                            }
                        )
                        .setFooter({ text: `Usa ${prefix}stakes para ver todos tus stakes activos.` });

                    await interaction.update({
                        embeds: [successEmbed],
                        components: []
                    });

                } else if (interaction.customId === 'cancel_stake') {
                    const cancelEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Staking Cancelado" })
                        .setDescription("Has cancelado el staking.");

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
                        .setDescription("Se ha agotado el tiempo para confirmar el staking.");

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
                    .setDescription("Ocurrió un error al procesar el staking. Inténtalo de nuevo.")
                ]
            });
        }
    }
};
