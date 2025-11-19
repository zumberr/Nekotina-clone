/**
 * Utilidades Generales para el Sistema de Economía
 */

const economyConfig = require('../config/economy');

/**
 * Calcula el impuesto por depósito
 * @param {Number} cantidad - Cantidad a depositar
 * @returns {Object} - { impuesto, cantidadNeta, cantidadTotal }
 */
function calcularImpuestoDeposito(cantidad) {
    let impuesto = Math.floor(cantidad * economyConfig.banco.impuestoDeposito);

    // Aplicar impuesto mínimo
    if (impuesto < economyConfig.banco.impuestoMinimo) {
        impuesto = economyConfig.banco.impuestoMinimo;
    }

    // Asegurar que el impuesto no sea mayor que la cantidad
    if (impuesto > cantidad) {
        impuesto = cantidad;
    }

    const cantidadNeta = cantidad - impuesto;

    return {
        impuesto,
        cantidadNeta,
        cantidadTotal: cantidad
    };
}

/**
 * Calcula el impuesto por retiro
 * @param {Number} cantidad - Cantidad a retirar
 * @returns {Object} - { impuesto, cantidadNeta, cantidadTotal }
 */
function calcularImpuestoRetiro(cantidad) {
    const impuesto = Math.floor(cantidad * economyConfig.banco.impuestoRetiro);
    const cantidadNeta = cantidad - impuesto;

    return {
        impuesto,
        cantidadNeta,
        cantidadTotal: cantidad
    };
}

/**
 * Valida un depósito bancario
 * @param {Number} cantidadBilletera - Dinero en la billetera
 * @param {Number} cantidadDeposito - Cantidad a depositar
 * @param {Number} dineroEnBanco - Dinero actual en el banco
 * @param {Number} capacidadBanco - Capacidad del banco
 * @returns {Object} - { valido: Boolean, mensaje: String }
 */
function validarDeposito(cantidadBilletera, cantidadDeposito, dineroEnBanco, capacidadBanco) {
    // Verificar cantidad mínima
    if (cantidadDeposito < economyConfig.banco.depositoMinimo) {
        return {
            valido: false,
            mensaje: `El depósito mínimo es de **$${economyConfig.banco.depositoMinimo}**.`
        };
    }

    // Verificar que tenga suficiente dinero en la billetera
    if (cantidadBilletera < cantidadDeposito) {
        return {
            valido: false,
            mensaje: `No tienes suficiente dinero en la billetera.\n**En billetera:** \`$${cantidadBilletera}\`\n**Intentas depositar:** \`$${cantidadDeposito}\``
        };
    }

    // Calcular cuánto se depositará realmente (después de impuestos)
    const { cantidadNeta } = calcularImpuestoDeposito(cantidadDeposito);

    // Verificar capacidad del banco
    const nuevoSaldo = dineroEnBanco + cantidadNeta;
    if (nuevoSaldo > capacidadBanco) {
        const espacioDisponible = capacidadBanco - dineroEnBanco;
        return {
            valido: false,
            mensaje: `Tu banco no tiene suficiente capacidad.\n**Capacidad:** \`$${capacidadBanco}\`\n**En banco:** \`$${dineroEnBanco}\`\n**Espacio disponible:** \`$${espacioDisponible}\`\n\nUsa el comando para aumentar la capacidad del banco.`
        };
    }

    return { valido: true, mensaje: 'OK' };
}

/**
 * Valida un retiro bancario
 * @param {Number} dineroEnBanco - Dinero actual en el banco
 * @param {Number} cantidadRetiro - Cantidad a retirar
 * @returns {Object} - { valido: Boolean, mensaje: String }
 */
function validarRetiro(dineroEnBanco, cantidadRetiro) {
    // Verificar cantidad mínima
    if (cantidadRetiro < economyConfig.banco.retiroMinimo) {
        return {
            valido: false,
            mensaje: `El retiro mínimo es de **$${economyConfig.banco.retiroMinimo}**.`
        };
    }

    // Verificar que tenga suficiente dinero en el banco
    if (dineroEnBanco < cantidadRetiro) {
        return {
            valido: false,
            mensaje: `No tienes suficiente dinero en el banco.\n**En banco:** \`$${dineroEnBanco}\`\n**Intentas retirar:** \`$${cantidadRetiro}\``
        };
    }

    return { valido: true, mensaje: 'OK' };
}

/**
 * Obtiene la siguiente mejora disponible del banco
 * @param {Number} capacidadActual - Capacidad actual del banco
 * @returns {Object|null} - { capacidad, costo } o null si ya tiene la máxima
 */
function obtenerSiguienteMejoraBanco(capacidadActual) {
    const mejoras = economyConfig.banco.mejoras;

    for (const mejora of mejoras) {
        if (mejora.capacidad > capacidadActual) {
            return mejora;
        }
    }

    return null; // Ya tiene la capacidad máxima
}

/**
 * Calcula el impuesto de riqueza basado en el total de dinero
 * @param {Number} dineroTotal - Dinero total del usuario
 * @returns {Object} - { impuesto, tasa, rango }
 */
function calcularImpuestoRiqueza(dineroTotal) {
    const rangos = economyConfig.antiInflacion.impuestoRiqueza;

    for (const rango of rangos) {
        const dentroDelMinimo = dineroTotal >= rango.minimo;
        const dentroDelMaximo = rango.maximo === null || dineroTotal <= rango.maximo;

        if (dentroDelMinimo && dentroDelMaximo) {
            const impuesto = Math.floor(dineroTotal * rango.tasa);
            return {
                impuesto,
                tasa: rango.tasa,
                rango: `$${rango.minimo} - ${rango.maximo ? '$' + rango.maximo : 'Sin límite'}`
            };
        }
    }

    return { impuesto: 0, tasa: 0, rango: 'Desconocido' };
}

/**
 * Formatea una cantidad de dinero con el emoji
 * @param {Number} cantidad - Cantidad de dinero
 * @returns {String} - Dinero formateado
 */
function formatearDinero(cantidad) {
    return `${economyConfig.emojis.dinero} $${cantidad.toLocaleString()}`;
}

/**
 * Calcula el decaimiento de dinero en billetera
 * @param {Number} dinero - Dinero en billetera
 * @returns {Number} - Cantidad perdida por decaimiento
 */
function calcularDecaimiento(dinero) {
    return Math.floor(dinero * economyConfig.antiInflacion.decaimientoBilletera);
}

/**
 * Obtiene información sobre todas las mejoras del banco
 * @returns {Array} - Lista de mejoras
 */
function obtenerTodasMejorasBanco() {
    return economyConfig.banco.mejoras;
}

/**
 * Valida una cantidad como "all" (todo)
 * @param {String} input - Input del usuario
 * @param {Number} cantidadDisponible - Cantidad disponible
 * @returns {Number} - Cantidad a usar
 */
function parsearCantidad(input, cantidadDisponible) {
    if (input === "all" || input === "todo") {
        return cantidadDisponible;
    }

    const cantidad = parseInt(input);
    return isNaN(cantidad) ? null : cantidad;
}

/**
 * Verifica si un usuario ha alcanzado el límite de ganancias diarias
 * @param {Number} gananciasDiarias - Ganancias del día actual
 * @returns {Object} - { limitado: Boolean, limite: Number, restante: Number }
 */
function verificarLimiteGanancias(gananciasDiarias) {
    const limite = economyConfig.antiInflacion.limiteGananciaDiaria;
    const restante = limite - gananciasDiarias;

    return {
        limitado: gananciasDiarias >= limite,
        limite,
        restante: restante > 0 ? restante : 0
    };
}

/**
 * Calcula el porcentaje de capacidad del banco utilizado
 * @param {Number} dineroEnBanco - Dinero actual en el banco
 * @param {Number} capacidadBanco - Capacidad del banco
 * @returns {Number} - Porcentaje (0-100)
 */
function calcularPorcentajeCapacidad(dineroEnBanco, capacidadBanco) {
    if (capacidadBanco === 0) return 0;
    return Math.floor((dineroEnBanco / capacidadBanco) * 100);
}

module.exports = {
    calcularImpuestoDeposito,
    calcularImpuestoRetiro,
    validarDeposito,
    validarRetiro,
    obtenerSiguienteMejoraBanco,
    calcularImpuestoRiqueza,
    formatearDinero,
    calcularDecaimiento,
    obtenerTodasMejorasBanco,
    parsearCantidad,
    verificarLimiteGanancias,
    calcularPorcentajeCapacidad
};
