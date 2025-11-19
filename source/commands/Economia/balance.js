const db = require("quick.db")
const { MessageEmbed } = require("discord.js")
const Usuarios = require("../../models/userSchema")
const economyConfig = require("../../config/economy")
const economyUtils = require("../../utils/economyUtils")
const stakingUtils = require("../../utils/stakingUtils")
const gemasUtils = require("../../utils/gemasUtils")

module.exports = {
    name: "balance",
    usage: "balance | bal [usuario]",
    aliases: ["bal", "dinero", "money"],
    cooldown: 0,
    example: "balance | bal",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información completa de tu economía: billetera, banco, gemas y stakes.",
    async run(client, message, args, prefix) {
   try {
    // Obtener el usuario objetivo
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    // Obtener datos de quick.db
    let walletAccount = await db.fetch(`balance_${message.guild.id}_${member.id}`)
    let bankAccount = await db.fetch(`bankBalance_${message.guild.id}_${member.id}`)

    if(walletAccount === null) walletAccount = 0;
    if(bankAccount === null) bankAccount = 0;

    // Obtener datos de MongoDB
    let userData = await Usuarios.findOne({ idusuario: member.id });

    if (!userData) {
        // Crear usuario si no existe
        userData = new Usuarios({
            idusuario: member.id,
            username: member.user.tag,
            dinero: 0,
            banco: 0,
            total: 0,
            gemas: 0,
            capacidadBanco: economyConfig.banco.capacidadInicial,
            stakes: []
        });
        await userData.save();
    }

    const gemas = userData.gemas || 0;
    const capacidadBanco = userData.capacidadBanco || economyConfig.banco.capacidadInicial;
    const stakes = userData.stakes || [];

    // Calcular información de stakes
    const stakesActivos = stakes.filter(s => s.activo);
    let totalStaked = 0;
    let totalGananciasEstimadas = 0;

    stakesActivos.forEach(stake => {
        totalStaked += stake.cantidad;
        totalGananciasEstimadas += stakingUtils.calcularGanancias(stake.cantidad, stake.periodo);
    });

    // Calcular totales
    const dineroTotal = walletAccount + bankAccount + totalStaked;
    const porcentajeCapacidad = economyUtils.calcularPorcentajeCapacidad(bankAccount, capacidadBanco);

    // Crear embed
    const embed = new MessageEmbed()
        .setColor(economyConfig.colores.principal)
        .setAuthor({
            name: `💰 Economía de ${member.user.tag}`,
            iconURL: member.user.displayAvatarURL({ dynamic: true })
        })
        .setDescription(`**Dinero Total:** \`$${dineroTotal}\``)
        .addFields(
            {
                name: `${economyConfig.emojis.dinero} Billetera`,
                value: `\`\`\`$${walletAccount}\`\`\`\n⚠️ Se pierde al morir/robar`,
                inline: true
            },
            {
                name: `${economyConfig.emojis.banco} Banco`,
                value: `\`\`\`$${bankAccount}\`\`\`\n📊 ${porcentajeCapacidad}% de capacidad`,
                inline: true
            },
            {
                name: `${economyConfig.emojis.gemas} Gemas`,
                value: `\`\`\`${gemas}\`\`\`\nTokens Premium`,
                inline: true
            }
        )
        .addFields(
            {
                name: "🏦 Capacidad del Banco",
                value: `\`$${bankAccount}\` / \`$${capacidadBanco}\``,
                inline: true
            },
            {
                name: "📊 Stakes Activos",
                value: stakesActivos.length > 0
                    ? `${stakesActivos.length} stake(s)\n\`$${totalStaked}\` invertidos`
                    : "Sin stakes activos",
                inline: true
            },
            {
                name: "💵 Ganancias Estimadas",
                value: stakesActivos.length > 0
                    ? `\`$${totalGananciasEstimadas}\``
                    : "N/A",
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({
            text: `${prefix}deposit | ${prefix}withdraw | ${prefix}stake | ${prefix}gemas`
        });

    // Si tiene stakes listos para reclamar, agregarlo
    const stakesListos = stakesActivos.filter(s => stakingUtils.haVencido(s.fechaVencimiento));
    if (stakesListos.length > 0 && member.id === message.author.id) {
        embed.addField(
            "✅ Stakes Listos para Reclamar",
            `Tienes **${stakesListos.length}** stake(s) listo(s) para reclamar.\nUsa \`${prefix}stakes\` para ver detalles.`
        );
    }

    return message.reply({ embeds: [embed] })

    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
       return message.reply({
           embeds: [new MessageEmbed()
               .setColor(economyConfig.colores.error)
               .setAuthor({ name: "❌ Error" })
               .setDescription("Ocurrió un error al obtener el balance. Inténtalo de nuevo.")
           ]
       });
        }
    }
}