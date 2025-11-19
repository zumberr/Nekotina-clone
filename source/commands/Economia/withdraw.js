const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const economyConfig = require("../../config/economy")
const economyUtils = require("../../utils/economyUtils")

module.exports = {
    name: "withdraw",
    usage: "withdraw | with <all | monto>",
    aliases: ["with", "retirar"],
    cooldown: 0,
    example: "withdraw 5000 | with all",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Retirar dinero del banco a la billetera. Se aplica un impuesto del 1%.",
    async run(client, message, args, prefix) {
    try {
    const member = message.member;

    // Obtener dinero en billetera y banco
    let walletBalance = await db.fetch(`balance_${message.guild.id}_${member.id}`) || 0;
    let bankBalance = await db.fetch(`bankBalance_${message.guild.id}_${member.id}`) || 0;

    // Parsear cantidad
    const input = args[0];
    if (!input) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(economyConfig.colores.error)
                .setAuthor({ name: "❌ Error - Cantidad no proporcionada" })
                .setDescription(`No se ha proporcionado una cantidad.\n\n**Uso:** \`${prefix}${this.usage}\`\n**Ejemplo:** \`${prefix}${this.example}\``)
                .addFields(
                    {
                        name: "🏦 Dinero en Banco",
                        value: `\`$${bankBalance}\``,
                        inline: true
                    },
                    {
                        name: "💵 Dinero en Billetera",
                        value: `\`$${walletBalance}\``,
                        inline: true
                    }
                )
            ]
        });
    }

    let cantidad = economyUtils.parsearCantidad(input, bankBalance);

    if (cantidad === null) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(economyConfig.colores.error)
                .setAuthor({ name: "❌ Error - Cantidad inválida" })
                .setDescription("La cantidad proporcionada no es válida.\n\nUsa un número o `all` para retirar todo.")
            ]
        });
    }

    // Validar el retiro
    const validacion = economyUtils.validarRetiro(bankBalance, cantidad);
    if (!validacion.valido) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(economyConfig.colores.error)
                .setAuthor({ name: "❌ Error - Retiro inválido" })
                .setDescription(validacion.mensaje)
            ]
        });
    }

    // Calcular impuesto
    const { impuesto, cantidadNeta, cantidadTotal } = economyUtils.calcularImpuestoRetiro(cantidad);

    // Realizar el retiro
    await db.subtract(`bankBalance_${message.guild.id}_${member.id}`, cantidadTotal);
    await db.add(`balance_${message.guild.id}_${member.id}`, cantidadNeta);

    // Crear embed de éxito
    const successEmbed = new MessageEmbed()
        .setColor(economyConfig.colores.success)
        .setAuthor({ name: "✅ Retiro Exitoso" })
        .setDescription(`Has retirado dinero de tu cuenta bancaria.`)
        .addFields(
            {
                name: "🏦 Cantidad Retirada",
                value: `\`$${cantidadTotal}\``,
                inline: true
            },
            {
                name: "💸 Impuesto (1%)",
                value: `\`-$${impuesto}\``,
                inline: true
            },
            {
                name: "💰 Recibido Neto",
                value: `\`$${cantidadNeta}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: "🏦 Nuevo Banco",
                value: `\`$${bankBalance - cantidadTotal}\``,
                inline: true
            },
            {
                name: "💵 Nueva Billetera",
                value: `\`$${walletBalance + cantidadNeta}\``,
                inline: true
            }
        )
        .setFooter({ text: "⚠️ El dinero en la billetera se puede perder al morir o ser robado" });

    return message.reply({ embeds: [successEmbed] });

    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
       return message.reply({
           embeds: [new MessageEmbed()
               .setColor(economyConfig.colores.error)
               .setAuthor({ name: "❌ Error" })
               .setDescription("Ocurrió un error al procesar el retiro. Inténtalo de nuevo.")
           ]
       });
        }
    }
}