const economyConfig = require('../config/economy');
const petUtils = require('./petUtils');

/**
 * Calcula los términos de enganche para una mascota.
 */
function calcularPlanEnganche(petBase, opciones = {}) {
    if (!petBase?.engancheDisponible) {
        throw new Error('La mascota seleccionada no permite enganche.');
    }

    const porcentajeMin = opciones.porcentaje || petBase.minimoEnganche || economyConfig.enganche.pagoInicialMinimo;
    const porcentajeMax = petBase.maximoEnganche || economyConfig.enganche.pagoInicialMaximo;

    const porcentajeAplicado = Math.max(Math.min(porcentajeMin, porcentajeMax), economyConfig.enganche.pagoInicialMinimo);
    const pagoInicial = Math.floor(petBase.precio * porcentajeAplicado);
    const saldo = petBase.precio - pagoInicial;

    const cuotasDeseadas = opciones.cuotas || economyConfig.enganche.cuotasMaximas;
    const cuotas = Math.min(Math.max(2, cuotasDeseadas), economyConfig.enganche.cuotasMaximas);

    const interes = Math.max(economyConfig.enganche.interesBase, opciones.interes || 0);
    const saldoConInteres = Math.floor(saldo * (1 + interes));
    const cuota = Math.max(Math.floor(saldoConInteres / cuotas), economyConfig.enganche.cuotaMinima);

    return {
        pagoInicial,
        saldoPendiente: saldoConInteres,
        cuota,
        cuotasRestantes: Math.ceil(saldoConInteres / cuota),
        interesTotal: interes,
        proximaCuota: new Date(Date.now() + economyConfig.enganche.cuotaIntervaloMs),
        ultimaCuotaPagada: null,
        atrasos: 0,
    };
}

function procesarCuota(plan) {
    const ahora = Date.now();
    const proxima = new Date(plan.proximaCuota).getTime();
    const tolerancia = economyConfig.enganche.toleranciaRetrasoMs || 0;

    let retraso = false;
    if (ahora > proxima + tolerancia) {
        retraso = true;
    }

    let saldoPendiente = plan.saldoPendiente - plan.cuota;
    let cuotasRestantes = plan.cuotasRestantes - 1;

    if (saldoPendiente < 0) {
        plan.cuota += saldoPendiente;
        saldoPendiente = 0;
    }

    const actualizado = {
        ...plan,
        saldoPendiente: Math.max(saldoPendiente, 0),
        cuotasRestantes: Math.max(cuotasRestantes, 0),
        ultimaCuotaPagada: new Date(),
        proximaCuota: new Date(Date.now() + economyConfig.enganche.cuotaIntervaloMs),
    };

    if (retraso) {
        actualizado.atrasos = (plan.atrasos || 0) + 1;
        const penalizacion = Math.floor(plan.saldoPendiente * economyConfig.enganche.penalizacionRetraso);
        actualizado.saldoPendiente += penalizacion;
    } else {
        actualizado.atrasos = plan.atrasos || 0;
    }

    return { actualizado, retraso };
}

function verificarIncumplimiento(plan) {
    const limite = economyConfig.enganche.incumplimientosParaReposesion || 2;
    return (plan.atrasos || 0) >= limite;
}

function generarEngancheParaMascota(petId, plan) {
    return {
        petId,
        saldoPendiente: plan.saldoPendiente,
        cuota: plan.cuota,
        cuotasRestantes: plan.cuotasRestantes,
        interesTotal: plan.interesTotal,
        ultimaCuotaPagada: plan.ultimaCuotaPagada,
        atrasos: plan.atrasos,
        proximaCuota: plan.proximaCuota,
    };
}

function calcularBonosPorPlan(mascotasUsuario, planesEnganche) {
    const activos = Array.isArray(planesEnganche) ? planesEnganche : [];
    const mascotas = Array.isArray(mascotasUsuario) ? mascotasUsuario : [];

    return activos.reduce((ac, plan) => {
        const mascota = mascotas.find(p => p.petId === plan.petId);
        if (!mascota) return ac;
        const base = petUtils.buscarMascotaPorId(mascota.tipo);
        if (!base?.bonificadores) return ac;
        if (typeof base.bonificadores.daily === 'number') {
            ac.daily += base.bonificadores.daily / 2;
        }
        if (typeof base.bonificadores.work === 'number') {
            ac.work += base.bonificadores.work / 2;
        }
        return ac;
    }, { daily: 0, work: 0 });
}

module.exports = {
    calcularPlanEnganche,
    procesarCuota,
    verificarIncumplimiento,
    generarEngancheParaMascota,
    calcularBonosPorPlan,
};
