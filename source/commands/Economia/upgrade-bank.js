const db = require("quick.db");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Usuarios = require("../../models/userSchema");
const economyConfig = require("../../config/economy");
const economyUtils = require("../../utils/economyUtils");

module.exports = {
    name: "upgrade-bank",
    usage: "upgrade-bank",
    aliases: ["upbank", "mejorar-banco"],
    cooldown: 0,
    example: "upgrade-bank",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Aumentar la capacidad de tu banco comprando mejoras.",

    async run(client, message, args, prefix) {
        try {
            // Obtener datos del usuario desde MongoDB
            let userData = await Usuarios.findOne({ idusuario: message.author.id });

            if (!userData) {
                userData = new Usuarios({
                    idusuario: message.author.id,
                    username: message.author.tag,
                    dinero: 0,
                    banco: 0,
                    total: 0,
                    gemas: 0,
                    capacidadBanco: economyConfig.banco.capacidadInicial
                });
                await userData.save();
            }

            const capacidadActual = userData.capacidadBanco || economyConfig.banco.capacidadInicial;

            // Obtener siguiente mejora
            const siguienteMejora = economyUtils.obtenerSiguienteMejoraBanco(capacidadActual);

            if (!siguienteMejora) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.success)
                        .setAuthor({ name: "✅ Capacidad Máxima Alcanzada" })
                        .setDescription(`¡Felicidades! Ya tienes la capacidad máxima del banco.\n\n**Capacidad Actual:** \`$${capacidadActual}\``)
                    ]
                });
            }

            // Obtener dinero en banco
            let bankBalance = await db.fetch(`bankBalance_${message.guild.id}_${message.author.id}`) || 0;

            // Calcular aumento
            const aumento = siguienteMejora.capacidad - capacidadActual;

            // Crear embed de información
            const infoEmbed = new MessageEmbed()
                .setColor(economyConfig.colores.info)
                .setAuthor({ name: "🏦 Mejorar Capacidad del Banco" })
                .setDescription(`¿Quieres aumentar la capacidad de tu banco?`)
                .addFields(
                    {
                        name: "🏦 Capacidad Actual",
                        value: `\`$${capacidadActual}\``,
                        inline: true
                    },
                    {
                        name: "⬆️ Nueva Capacidad",
                        value: `\`$${siguienteMejora.capacidad}\``,
                        inline: true
                    },
                    {
                        name: "📈 Aumento",
                        value: `\`+$${aumento}\``,
                        inline: true
                    },
                    {
                        name: "💰 Costo",
                        value: `\`$${siguienteMejora.costo}\``,
                        inline: true
                    },
                    {
                        name: "🏦 Dinero en Banco",
                        value: `\`$${bankBalance}\``,
                        inline: true
                    },
                    {
                        name: "✅ Estado",
                        value: bankBalance >= siguienteMejora.costo ? "✅ Puedes comprar" : "❌ Fondos insuficientes",
                        inline: true
                    }
                );

            // Verificar si tiene suficiente dinero
            if (bankBalance < siguienteMejora.costo) {
                infoEmbed.setFooter({ text: `Necesitas $${siguienteMejora.costo - bankBalance} más en el banco para comprar esta mejora.` });
                return message.reply({ embeds: [infoEmbed] });
            }

            // Crear botones de confirmación
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('confirm_upgrade')
                        .setLabel('✅ Comprar Mejora')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('cancel_upgrade')
                        .setLabel('❌ Cancelar')
                        .setStyle('DANGER')
                );

            infoEmbed.setFooter({ text: "Confirma tu compra usando los botones de abajo" });

            const confirmMsg = await message.reply({
                embeds: [infoEmbed],
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
                if (interaction.customId === 'confirm_upgrade') {
                    // Verificar nuevamente que tenga suficiente dinero
                    const currentBankBalance = await db.fetch(`bankBalance_${message.guild.id}_${message.author.id}`) || 0;

                    if (currentBankBalance < siguienteMejora.costo) {
                        const errorEmbed = new MessageEmbed()
                            .setColor(economyConfig.colores.error)
                            .setAuthor({ name: "❌ Error - Fondos Insuficientes" })
                            .setDescription(`No tienes suficiente dinero en el banco.\n\n**Necesitas:** \`$${siguienteMejora.costo}\`\n**Tienes:** \`$${currentBankBalance}\``);

                        return interaction.update({
                            embeds: [errorEmbed],
                            components: []
                        });
                    }

                    // Restar dinero del banco
                    await db.subtract(`bankBalance_${message.guild.id}_${message.author.id}`, siguienteMejora.costo);

                    // Actualizar capacidad del banco en MongoDB
                    userData.capacidadBanco = siguienteMejora.capacidad;
                    await userData.save();

                    // Crear embed de éxito
                    const successEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.success)
                        .setAuthor({ name: "✅ Mejora Comprada Exitosamente" })
                        .setDescription(`¡Has aumentado la capacidad de tu banco!`)
                        .addFields(
                            {
                                name: "🏦 Capacidad Anterior",
                                value: `\`$${capacidadActual}\``,
                                inline: true
                            },
                            {
                                name: "⬆️ Nueva Capacidad",
                                value: `\`$${siguienteMejora.capacidad}\``,
                                inline: true
                            },
                            {
                                name: "📈 Aumento",
                                value: `\`+$${aumento}\``,
                                inline: true
                            },
                            {
                                name: "💸 Costo Pagado",
                                value: `\`$${siguienteMejora.costo}\``,
                                inline: true
                            },
                            {
                                name: "🏦 Nuevo Saldo",
                                value: `\`$${currentBankBalance - siguienteMejora.costo}\``,
                                inline: true
                            }
                        )
                        .setFooter({ text: `¡Ahora puedes guardar más dinero de forma segura!` });

                    await interaction.update({
                        embeds: [successEmbed],
                        components: []
                    });

                } else if (interaction.customId === 'cancel_upgrade') {
                    const cancelEmbed = new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Compra Cancelada" })
                        .setDescription("Has cancelado la compra de la mejora del banco.");

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
                        .setDescription("Se ha agotado el tiempo para confirmar la compra.");

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
                    .setDescription("Ocurrió un error al procesar la mejora. Inténtalo de nuevo.")
                ]
            });
        }
    }
};
