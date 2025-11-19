const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const Usuarios = require("../../models/userSchema")
const economyConfig = require("../../config/economy")
const economyUtils = require("../../utils/economyUtils")

module.exports = {
    name: "deposit",
    usage: "deposit | dep <all | monto>",
    aliases: ["dep", "depositar"],
    cooldown: 0,
    example: "deposit 5000 | dep all",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Depositar dinero de la billetera al banco. Se aplica un impuesto del 3%.",
    async run(client, message, args, prefix) {
    try {
    const member = message.member;

    // Obtener dinero en billetera y banco
    let walletBalance = await db.fetch(`balance_${message.guild.id}_${member.id}`) || 0;
    let bankBalance = await db.fetch(`bankBalance_${message.guild.id}_${member.id}`) || 0;

    // Obtener capacidad del banco desde MongoDB
    let userData = await Usuarios.findOne({ idusuario: member.id });

    if (!userData) {
        userData = new Usuarios({
            idusuario: member.id,
            username: member.user.tag,
            dinero: 0,
            banco: 0,
            total: 0,
            gemas: 0,
            capacidadBanco: economyConfig.banco.capacidadInicial
        });
        await userData.save();
    }

    const capacidadBanco = userData.capacidadBanco || economyConfig.banco.capacidadInicial;

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
                        name: "💵 Dinero en Billetera",
                        value: `\`$${walletBalance}\``,
                        inline: true
                    },
                    {
                        name: "🏦 Espacio Disponible",
                        value: `\`$${capacidadBanco - bankBalance}\``,
                        inline: true
                    }
                )
            ]
        });
    }

    let cantidad = economyUtils.parsearCantidad(input, walletBalance);

    if (cantidad === null) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(economyConfig.colores.error)
                .setAuthor({ name: "❌ Error - Cantidad inválida" })
                .setDescription("Se ha proporcionado una cantidad inválida.\n\nUsa un número o `all` para depositar todo.")
            ]
        });
    }

    // Validar el depósito
    const validacion = economyUtils.validarDeposito(walletBalance, cantidad, bankBalance, capacidadBanco);
    if (!validacion.valido) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(economyConfig.colores.error)
                .setAuthor({ name: "❌ Error - Depósito inválido" })
                .setDescription(validacion.mensaje)
            ]
        });
    }

    // Calcular impuesto
    const { impuesto, cantidadNeta, cantidadTotal } = economyUtils.calcularImpuestoDeposito(cantidad);

    // Realizar el depósito
    await db.subtract(`balance_${message.guild.id}_${member.id}`, cantidadTotal);
    await db.add(`bankBalance_${message.guild.id}_${member.id}`, cantidadNeta);

    // Crear embed de éxito
    const successEmbed = new MessageEmbed()
        .setColor(economyConfig.colores.success)
        .setAuthor({ name: "✅ Depósito Exitoso" })
        .setDescription(`Has depositado dinero en tu cuenta bancaria.`)
        .addFields(
            {
                name: "💵 Cantidad Depositada",
                value: `\`$${cantidadTotal}\``,
                inline: true
            },
            {
                name: "💸 Impuesto (3%)",
                value: `\`-$${impuesto}\``,
                inline: true
            },
            {
                name: "💰 Depositado Neto",
                value: `\`$${cantidadNeta}\``,
                inline: true
            }
        )
        .addFields(
            {
                name: "💵 Nueva Billetera",
                value: `\`$${walletBalance - cantidadTotal}\``,
                inline: true
            },
            {
                name: "🏦 Nuevo Banco",
                value: `\`$${bankBalance + cantidadNeta}\``,
                inline: true
            },
            {
                name: "📊 Capacidad",
                value: `\`${economyUtils.calcularPorcentajeCapacidad(bankBalance + cantidadNeta, capacidadBanco)}%\``,
                inline: true
            }
        )
        .setFooter({ text: `Capacidad del banco: $${bankBalance + cantidadNeta} / $${capacidadBanco}` });

    return message.reply({ embeds: [successEmbed] });

    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
       return message.reply({
           embeds: [new MessageEmbed()
               .setColor(economyConfig.colores.error)
               .setAuthor({ name: "❌ Error" })
               .setDescription("Ocurrió un error al procesar el depósito. Inténtalo de nuevo.")
           ]
       });
        }
    }
}