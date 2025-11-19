/**
 * Utilidades para el Sistema de Staking
 */

const economyConfig = require('../config/economy');

/**
 * Calcula las ganancias de un stake
 * @param {Number} cantidad - Cantidad invertida
 * @param {Number} periodo - Período en días (1, 3, 7)
 * @returns {Number} - Ganancias totales
 */
function calcularGanancias(cantidad, periodo) {
    const config = economyConfig.staking.periodos[periodo];
    if (!config) return 0;

    const ganancia = cantidad * (config.apy / 100);
    return Math.floor(ganancia);
}

/**
 * Calcula la fecha de vencimiento de un stake
 * @param {Number} periodo - Período en días (1, 3, 7)
 * @returns {Date} - Fecha de vencimiento
 */
function calcularFechaVencimiento(periodo) {
    const config = economyConfig.staking.periodos[periodo];
    if (!config) return null;

    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + config.dias);
    return fechaVencimiento;
}

/**
 * Verifica si un stake ha vencido
 * @param {Date} fechaVencimiento - Fecha de vencimiento del stake
 * @returns {Boolean} - true si ha vencido, false si no
 */
function haVencido(fechaVencimiento) {
    return new Date() >= new Date(fechaVencimiento);
}

/**
 * Calcula el tiempo restante para que venza un stake
 * @param {Date} fechaVencimiento - Fecha de vencimiento del stake
 * @returns {Object} - { dias, horas, minutos, segundos }
 */
function calcularTiempoRestante(fechaVencimiento) {
    const ahora = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento - ahora;

    if (diferencia <= 0) {
        return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return { dias, horas, minutos, segundos };
}

/**
 * Formatea el tiempo restante en un string legible
 * @param {Object} tiempo - { dias, horas, minutos, segundos }
 * @returns {String} - Tiempo formateado
 */
function formatearTiempoRestante(tiempo) {
    const partes = [];

    if (tiempo.dias > 0) partes.push(`${tiempo.dias}d`);
    if (tiempo.horas > 0) partes.push(`${tiempo.horas}h`);
    if (tiempo.minutos > 0) partes.push(`${tiempo.minutos}m`);
    if (tiempo.segundos > 0 && tiempo.dias === 0) partes.push(`${tiempo.segundos}s`);

    return partes.length > 0 ? partes.join(' ') : '0s';
}

/**
 * Calcula la penalización por retiro anticipado
 * @param {Number} cantidad - Cantidad invertida
 * @returns {Object} - { cantidadPerdida, cantidadRecuperada }
 */
function calcularPenalizacion(cantidad) {
    const porcentajePerdida = economyConfig.staking.penalizacionRetiroAnticipado.porcentaje;
    const cantidadPerdida = Math.floor(cantidad * porcentajePerdida);
    const cantidadRecuperada = cantidad - cantidadPerdida;

    return { cantidadPerdida, cantidadRecuperada };
}

/**
 * Valida si se puede crear un nuevo stake
 * @param {Object} userData - Datos del usuario
 * @param {Number} cantidad - Cantidad a invertir
 * @param {Number} periodo - Período del stake
 * @returns {Object} - { valido: Boolean, mensaje: String }
 */
function validarNuevoStake(userData, cantidad, periodo) {
    const config = economyConfig.staking;

    // Verificar que el período sea válido
    if (!config.periodos[periodo]) {
        return {
            valido: false,
            mensaje: `Período inválido. Los períodos disponibles son: 1, 3, 7 días.`
        };
    }

    // Verificar cantidad mínima
    if (cantidad < config.cantidadMinima) {
        return {
            valido: false,
            mensaje: `La cantidad mínima para hacer staking es de $${config.cantidadMinima}.`
        };
    }

    // Verificar cantidad máxima
    if (cantidad > config.cantidadMaxima) {
        return {
            valido: false,
            mensaje: `La cantidad máxima para hacer staking es de $${config.cantidadMaxima}.`
        };
    }

    // Verificar número máximo de stakes activos
    const stakesActivos = userData.stakes ? userData.stakes.filter(s => s.activo).length : 0;
    if (stakesActivos >= config.stakesMaximos) {
        return {
            valido: false,
            mensaje: `Ya tienes el número máximo de stakes activos (${config.stakesMaximos}). Retira uno antes de crear otro.`
        };
    }

    return { valido: true, mensaje: 'OK' };
}

/**
 * Crea un objeto de stake
 * @param {Number} cantidad - Cantidad a invertir
 * @param {Number} periodo - Período en días
 * @returns {Object} - Objeto de stake
 */
function crearStake(cantidad, periodo) {
    const config = economyConfig.staking.periodos[periodo];
    const fechaInicio = new Date();
    const fechaVencimiento = calcularFechaVencimiento(periodo);

    return {
        cantidad: cantidad,
        periodo: periodo,
        apy: config.apy,
        fechaInicio: fechaInicio,
        fechaVencimiento: fechaVencimiento,
        activo: true
    };
}

/**
 * Obtiene información de un período de staking
 * @param {Number} periodo - Período en días
 * @returns {Object} - Información del período
 */
function obtenerInfoPeriodo(periodo) {
    return economyConfig.staking.periodos[periodo];
}

/**
 * Procesa todos los stakes vencidos de un usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Object} - { stakesVencidos: Array, totalGanancias: Number }
 */
function procesarStakesVencidos(userData) {
    if (!userData.stakes || userData.stakes.length === 0) {
        return { stakesVencidos: [], totalGanancias: 0 };
    }

    const stakesVencidos = [];
    let totalGanancias = 0;

    for (const stake of userData.stakes) {
        if (stake.activo && haVencido(stake.fechaVencimiento)) {
            const ganancias = calcularGanancias(stake.cantidad, stake.periodo);
            stakesVencidos.push({
                stake: stake,
                ganancias: ganancias,
                total: stake.cantidad + ganancias
            });
            totalGanancias += stake.cantidad + ganancias;
        }
    }

    return { stakesVencidos, totalGanancias };
}

module.exports = {
    calcularGanancias,
    calcularFechaVencimiento,
    haVencido,
    calcularTiempoRestante,
    formatearTiempoRestante,
    calcularPenalizacion,
    validarNuevoStake,
    crearStake,
    obtenerInfoPeriodo,
    procesarStakesVencidos
};
