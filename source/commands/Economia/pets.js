const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const Usuarios = require('../../models/userSchema');
const economyConfig = require('../../config/economy');
const petUtils = require('../../utils/petUtils');
const engancheUtils = require('../../utils/engancheUtils');
const economyUtils = require('../../utils/economyUtils');

const SUBCOMANDOS = ['list', 'adopt', 'info', 'feed', 'play', 'rest', 'bath', 'release', 'pay'];

module.exports = {
    name: 'pets',
    usage: 'pets <subcomando> [...args]',
    aliases: ['mascotas', 'pet'],
    cooldown: 3,
    example: 'pets adopt kitsune | pets feed <id>',
    ownerOnly: false,
    UserPerms: ['SEND_MESSAGES'],
    ClientPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    description: 'Gestiona todas tus mascotas virtuales: adopta, cuida, consulta estados y planes de enganche.',

    async run(client, message, args, prefix) {
        try {
            const subcomando = (args.shift() || '').toLowerCase();
            if (!SUBCOMANDOS.includes(subcomando)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(economyConfig.colores.error)
                            .setAuthor({ name: '❌ Subcomando inválido' })
                            .setDescription(`Subcomando no reconocido. Usa uno de: \`${SUBCOMANDOS.join(', ')}\`\nEjemplo: \`${prefix}${this.example}\``)
                    ]
                });
            }

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
            userData.economy.mascotas = userData.economy.mascotas || [];
            userData.economy.enganche = userData.economy.enganche || { activos: [], historial: [] };

            switch (subcomando) {
                case 'list':
                    return listarMascotas(userData, message, prefix);
                case 'adopt':
                    return adoptarMascota(userData, message, args, guildId);
                case 'info':
                    return infoMascota(userData, message, args);
                case 'feed':
                case 'play':
                case 'rest':
                case 'bath':
                    return interactuarMascota(subcomando, userData, message, args, guildId);
                case 'release':
                    return liberarMascota(userData, message, args);
                case 'pay':
                    return pagarCuota(userData, message, args, guildId);
            }
        } catch (error) {
            console.error(error);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: '❌ Error' })
                        .setDescription('Ocurrió un error gestionando tus mascotas. Inténtalo nuevamente.')
                ]
            });
        }
    }
};

async function listarMascotas(userData, message, prefix) {
    const catalogo = petUtils.obtenerCatalogo();
    const mascotas = userData.economy.mascotas || [];
    const embed = new MessageEmbed()
        .setColor(economyConfig.colores.info)
        .setAuthor({
            name: `${message.author.username} | Mascotas`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setDescription('Gestiona tus compañeros. Cuida su hambre, energía y felicidad para obtener bonificaciones.');

    if (mascotas.length === 0) {
        embed.addField('🐾 No tienes mascotas', `Usa \`${prefix}pets adopt <id>\` para adoptar una.`);
    } else {
        mascotas.forEach(pet => {
            const base = petUtils.buscarMascotaPorId(pet.tipo) || {};
            embed.addField(
                `${base.emoji || '🐾'} ${pet.nombrePersonalizado || base.nombre || pet.tipo} (Lvl ${pet.nivel || 1})`,
                `ID: \`${pet.petId}\`\n❤️ Felicidad: ${pet.felicidad}/100\n🍖 Hambre: ${pet.hambre}/100\n⚡ Energía: ${pet.energia}/100`
            );
        });
    }

    const activos = userData.economy.enganche.activos || [];
    if (activos.length) {
        const detalle = activos.map(plan => `• ${plan.petId} | Cuota: $${plan.cuota} | Restantes: ${plan.cuotasRestantes}`).join('\n');
        embed.addField('📜 Planes de Enganche Activos', detalle);
    }

    const tienda = catalogo.map(item => `**${item.id}** (${item.emoji}) - $${item.precio} ${item.engancheDisponible ? ' | Enganche disponible' : ''}`).join('\n');
    embed.addField('🛒 Catálogo', tienda);

    await message.reply({ embeds: [embed] });
}

async function adoptarMascota(userData, message, args, guildId) {
    const idMascota = (args[0] || '').toLowerCase();
    const catalogo = petUtils.obtenerCatalogo();
    const base = catalogo.find(p => p.id === idMascota);

    if (!base) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(economyConfig.colores.error)
                .setAuthor({ name: '❌ Mascota no encontrada' })
                .setDescription('Verifica el catálogo con `pets list`.')
            ]
        });
    }

    const mascotasUsuario = userData.economy.mascotas || [];
    if (mascotasUsuario.length >= (economyConfig.mascotas?.maxMascotas || 3)) {
        return message.reply({
            embeds: [new MessageEmbed()
                .setColor(economyConfig.colores.warning)
                .setAuthor({ name: '⚠️ Límite alcanzado' })
                .setDescription('Has alcanzado el máximo de mascotas permitidas. Libera alguna con `pets release <id>`.')
            ]
        });
    }

    const saldo = await db.fetch(`balance_${guildId}_${message.author.id}`) || 0;

    const enganche = (args[1] || '').toLowerCase() === 'enganche';
    let costo = base.precio;
    let planEnganche = null;

    if (enganche) {
        if (!base.engancheDisponible) {
            return message.reply('Esta mascota no admite enganche, debes pagarla completa.');
        }
        planEnganche = engancheUtils.calcularPlanEnganche(base, {});
        costo = planEnganche.pagoInicial;
    }

    if (saldo < costo) {
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(economyConfig.colores.error)
                    .setAuthor({ name: '❌ Fondos insuficientes' })
                    .setDescription(`Necesitas \`$${costo}\` pero solo tienes \`$${saldo}\`.`)
            ]
        });
    }

    await db.subtract(`balance_${guildId}_${message.author.id}`, costo);

    const mascota = petUtils.crearMascotaInstancia(base);
    mascota.nombrePersonalizado = args.slice(enganche ? 2 : 1).join(' ') || null;
    userData.economy.mascotas.push(mascota);

    if (planEnganche) {
        const plan = engancheUtils.generarEngancheParaMascota(mascota.petId, planEnganche);
        userData.economy.enganche.activos.push(plan);
        userData.economy.enganche.historial.push({
            petId: mascota.petId,
            estado: 'activo',
            fecha: new Date(),
            detalle: 'Plan de enganche iniciado al adoptar.',
        });
    }

    await userData.save();

    return message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(economyConfig.colores.success)
                .setAuthor({ name: '✅ Mascota adoptada' })
                .setDescription(`¡${base.emoji} ${base.nombre} ahora es parte de tu familia!`)
                .addField('Costo', `\`$${costo}\``)
                .addField('Plan de Enganche', planEnganche ? 'Sí (cuotas diarias automáticas)' : 'No')
        ]
    });
}

async function infoMascota(userData, message, args) {
    const petId = args[0];
    const mascota = (userData.economy.mascotas || []).find(p => p.petId === petId);
    if (!mascota) {
        return message.reply('No se encontró una mascota con ese ID.');
    }

    const base = petUtils.buscarMascotaPorId(mascota.tipo) || {};
    const estados = petUtils.evaluarEstado(mascota);

    const embed = new MessageEmbed()
        .setColor(economyConfig.colores.info)
        .setAuthor({
            name: `${base.emoji || '🐾'} ${mascota.nombrePersonalizado || base.nombre}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .addFields(
            { name: 'ID', value: `\`${mascota.petId}\``, inline: true },
            { name: 'Rareza', value: base.rareza || 'Desconocida', inline: true },
            { name: 'Nivel', value: `${mascota.nivel || 1}`, inline: true },
            { name: 'Experiencia', value: `${mascota.experiencia || 0}`, inline: true },
            { name: 'Hambre', value: `${mascota.hambre}/100`, inline: true },
            { name: 'Felicidad', value: `${mascota.felicidad}/100`, inline: true },
            { name: 'Energía', value: `${mascota.energia}/100`, inline: true },
        );

    if (estados.length) {
        embed.addField('Estados', estados.map(e => e.clave).join(', '));
    }

    const plan = (userData.economy.enganche.activos || []).find(p => p.petId === mascota.petId);
    if (plan) {
        embed.addField('Plan de Enganche', `Cuota: $${plan.cuota}\nRestantes: ${plan.cuotasRestantes}\nPróxima cuota: <t:${Math.floor(new Date(plan.proximaCuota).getTime() / 1000)}:R>`);
    }

    await message.reply({ embeds: [embed] });
}

async function interactuarMascota(accion, userData, message, args, guildId) {
    const petId = args[0];
    const mascotaIndex = (userData.economy.mascotas || []).findIndex(p => p.petId === petId);
    if (mascotaIndex === -1) {
        return message.reply('Mascota no encontrada.');
    }

    const mascota = userData.economy.mascotas[mascotaIndex];
    let accionInterna = accion;
    if (accion === 'rest') accionInterna = 'descansar';
    if (accion === 'bath') accionInterna = 'bañar';

    const configuracionAccion = economyConfig.mascotas?.acciones?.[accionInterna];
    if (!configuracionAccion) {
        return message.reply('Acción no disponible en este momento.');
    }

    const costo = configuracionAccion.costo || 0;
    if (costo > 0) {
        const saldo = await db.fetch(`balance_${guildId}_${message.author.id}`) || 0;
        if (saldo < costo) {
            return message.reply('No tienes suficiente dinero para realizar esta acción.');
        }
        await db.subtract(`balance_${guildId}_${message.author.id}`, costo);
    }

    const mascotaActualizada = petUtils.aplicarAccionMascota(mascota, accionInterna);
    userData.economy.mascotas[mascotaIndex] = mascotaActualizada;
    await userData.save();

    return message.reply({
        embeds: [
            new MessageEmbed()
                .setColor(economyConfig.colores.success)
                .setAuthor({ name: '🐾 Interacción exitosa' })
                .setDescription(`Tu mascota ahora tiene:\n🍖 Hambre: ${mascotaActualizada.hambre}\n❤️ Felicidad: ${mascotaActualizada.felicidad}\n⚡ Energía: ${mascotaActualizada.energia}`)
        ]
    });
}

async function liberarMascota(userData, message, args) {
    const petId = args[0];
    const mascotas = userData.economy.mascotas || [];
    const index = mascotas.findIndex(p => p.petId === petId);
    if (index === -1) {
        return message.reply('No tienes una mascota con ese ID.');
    }

    userData.economy.mascotas.splice(index, 1);
    userData.economy.enganche.activos = (userData.economy.enganche.activos || []).filter(p => p.petId !== petId);
    userData.economy.enganche.historial.push({
        petId,
        estado: 'liberada',
        fecha: new Date(),
        detalle: 'Mascota liberada voluntariamente.',
    });

    await userData.save();

    return message.reply('Has liberado a tu mascota. ¡Esperamos que vuelva pronto!');
}

async function pagarCuota(userData, message, args, guildId) {
    const petId = args[0];
    const plan = (userData.economy.enganche.activos || []).find(p => p.petId === petId);
    if (!plan) {
        return message.reply('No hay un plan de enganche activo para esa mascota.');
    }

    const saldo = await db.fetch(`balance_${guildId}_${message.author.id}`) || 0;
    if (saldo < plan.cuota) {
        return message.reply('No tienes suficiente dinero para pagar la cuota.');
    }

    await db.subtract(`balance_${guildId}_${message.author.id}`, plan.cuota);
    plan.saldoPendiente = Math.max(plan.saldoPendiente - plan.cuota, 0);
    plan.cuotasRestantes = Math.max(plan.cuotasRestantes - 1, 0);
    plan.ultimaCuotaPagada = new Date();
    plan.proximaCuota = new Date(Date.now() + (economyConfig.enganche.cuotaIntervaloMs || 86400000));
    plan.atrasos = 0;

    if (plan.cuotasRestantes === 0) {
        userData.economy.enganche.historial.push({
            petId,
            estado: 'completado',
            fecha: new Date(),
            detalle: 'Plan pagado en su totalidad.',
        });
        userData.economy.enganche.activos = userData.economy.enganche.activos.filter(p => p.petId !== petId);
    }

    await userData.save();

    return message.reply('Has pagado la cuota correctamente.');
}
