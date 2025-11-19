/**
 * Sistema de Anti-Inflación y Balanceo Económico
 */

const db = require("quick.db");
const Usuarios = require("../models/userSchema");
const economyConfig = require("../config/economy");
const economyUtils = require("./economyUtils");

/**
 * Aplica el impuesto de riqueza a un usuario
 * @param {String} userId - ID del usuario
 * @param {String} guildId - ID del servidor
 * @returns {Object} - { aplicado: Boolean, impuesto: Number, nuevoTotal: Number }
 */
async function aplicarImpuestoRiqueza(userId, guildId) {
    try {
        // Obtener dinero del usuario
        const walletBalance = await db.fetch(`balance_${guildId}_${userId}`) || 0;
        const bankBalance = await db.fetch(`bankBalance_${guildId}_${userId}`) || 0;

        // Obtener stakes activos
        const userData = await Usuarios.findOne({ idusuario: userId });
        let totalStaked = 0;

        if (userData && userData.stakes) {
            const stakesActivos = userData.stakes.filter(s => s.activo);
            totalStaked = stakesActivos.reduce((sum, stake) => sum + stake.cantidad, 0);
        }

        const dineroTotal = walletBalance + bankBalance + totalStaked;

        // Calcular impuesto
        const { impuesto, tasa } = economyUtils.calcularImpuestoRiqueza(dineroTotal);

        if (impuesto <= 0) {
            return {
                aplicado: false,
                impuesto: 0,
                nuevoTotal: dineroTotal,
                tasa: 0
            };
        }

        // Aplicar impuesto (se resta del banco primero, luego de la billetera si es necesario)
        let impuestoRestante = impuesto;

        if (bankBalance > 0) {
            const restaDelBanco = Math.min(bankBalance, impuestoRestante);
            await db.subtract(`bankBalance_${guildId}_${userId}`, restaDelBanco);
            impuestoRestante -= restaDelBanco;
        }

        if (impuestoRestante > 0 && walletBalance > 0) {
            const restaDeBilletera = Math.min(walletBalance, impuestoRestante);
            await db.subtract(`balance_${guildId}_${userId}`, restaDeBilletera);
        }

        return {
            aplicado: true,
            impuesto,
            nuevoTotal: dineroTotal - impuesto,
            tasa: tasa * 100
        };

    } catch (error) {
        console.error(`Error aplicando impuesto de riqueza: ${error}`);
        return {
            aplicado: false,
            impuesto: 0,
            nuevoTotal: 0,
            error: error.message
        };
    }
}

/**
 * Aplica decaimiento al dinero en billetera
 * @param {String} userId - ID del usuario
 * @param {String} guildId - ID del servidor
 * @returns {Object} - { aplicado: Boolean, decaimiento: Number, nuevoBalance: Number }
 */
async function aplicarDecaimiento(userId, guildId) {
    try {
        const walletBalance = await db.fetch(`balance_${guildId}_${userId}`) || 0;

        if (walletBalance <= 0) {
            return {
                aplicado: false,
                decaimiento: 0,
                nuevoBalance: 0
            };
        }

        const decaimiento = economyUtils.calcularDecaimiento(walletBalance);

        if (decaimiento <= 0) {
            return {
                aplicado: false,
                decaimiento: 0,
                nuevoBalance: walletBalance
            };
        }

        // Aplicar decaimiento
        await db.subtract(`balance_${guildId}_${userId}`, decaimiento);

        return {
            aplicado: true,
            decaimiento,
            nuevoBalance: walletBalance - decaimiento
        };

    } catch (error) {
        console.error(`Error aplicando decaimiento: ${error}`);
        return {
            aplicado: false,
            decaimiento: 0,
            nuevoBalance: 0,
            error: error.message
        };
    }
}

/**
 * Verifica y aplica sistemas anti-inflación a un usuario
 * @param {String} userId - ID del usuario
 * @param {String} guildId - ID del servidor
 * @returns {Object} - Resumen de acciones aplicadas
 */
async function aplicarSistemasAntiInflacion(userId, guildId) {
    const resultadoDecaimiento = await aplicarDecaimiento(userId, guildId);
    const resultadoImpuesto = await aplicarImpuestoRiqueza(userId, guildId);

    return {
        decaimiento: resultadoDecaimiento,
        impuestoRiqueza: resultadoImpuesto,
        totalReducido: resultadoDecaimiento.decaimiento + resultadoImpuesto.impuesto
    };
}

/**
 * Verifica si un usuario puede ganar más dinero hoy
 * @param {String} userId - ID del usuario
 * @returns {Object} - { puedeGanar: Boolean, gananciasDiarias: Number, restante: Number }
 */
async function verificarLimiteDiario(userId) {
    try {
        const userData = await Usuarios.findOne({ idusuario: userId });

        if (!userData) {
            return {
                puedeGanar: true,
                gananciasDiarias: 0,
                restante: economyConfig.antiInflacion.limiteGananciaDiaria
            };
        }

        // Verificar si ya existe un sistema de tracking de ganancias diarias
        // Por ahora, asumimos que no hay límite implementado en el modelo
        // Esto se puede expandir agregando campos al userSchema

        return {
            puedeGanar: true,
            gananciasDiarias: 0,
            restante: economyConfig.antiInflacion.limiteGananciaDiaria
        };

    } catch (error) {
        console.error(`Error verificando límite diario: ${error}`);
        return {
            puedeGanar: true,
            gananciasDiarias: 0,
            restante: economyConfig.antiInflacion.limiteGananciaDiaria
        };
    }
}

/**
 * Obtiene estadísticas de economía del servidor
 * @param {String} guildId - ID del servidor
 * @returns {Object} - Estadísticas económicas
 */
async function obtenerEstadisticasEconomia(guildId) {
    try {
        // Esta función puede ser expandida para obtener estadísticas
        // de todos los usuarios del servidor
        // Por ahora, retorna una estructura básica

        return {
            totalUsuarios: 0,
            dineroCirculante: 0,
            dineroEnBancos: 0,
            dineroStaked: 0,
            totalGemas: 0
        };

    } catch (error) {
        console.error(`Error obteniendo estadísticas: ${error}`);
        return null;
    }
}

/**
 * Calcula la inflación basada en la cantidad de dinero en circulación
 * @param {Number} dineroCirculante - Dinero total en circulación
 * @param {Number} numeroUsuarios - Número de usuarios activos
 * @returns {Object} - { tasa: Number, nivel: String }
 */
function calcularInflacion(dineroCirculante, numeroUsuarios) {
    if (numeroUsuarios === 0) {
        return { tasa: 0, nivel: "Normal" };
    }

    const promedioPerCapita = dineroCirculante / numeroUsuarios;

    // Niveles de inflación basados en promedio per cápita
    let nivel = "Normal";
    let tasa = 0;

    if (promedioPerCapita > 1000000) {
        nivel = "Hiperinflación";
        tasa = 0.20; // 20%
    } else if (promedioPerCapita > 500000) {
        nivel = "Alta";
        tasa = 0.10; // 10%
    } else if (promedioPerCapita > 100000) {
        nivel = "Moderada";
        tasa = 0.05; // 5%
    } else if (promedioPerCapita > 50000) {
        nivel = "Baja";
        tasa = 0.02; // 2%
    }

    return { tasa, nivel, promedioPerCapita };
}

/**
 * Recomienda acciones para balancear la economía
 * @param {Object} estadisticas - Estadísticas económicas del servidor
 * @returns {Array} - Lista de recomendaciones
 */
function recomendarAcciones(estadisticas) {
    const recomendaciones = [];

    // Analizar y recomendar acciones basadas en las estadísticas
    // Esta función puede ser expandida con lógica más compleja

    if (estadisticas.dineroCirculante > 10000000) {
        recomendaciones.push({
            tipo: "warning",
            mensaje: "Hay demasiado dinero en circulación. Considera aumentar impuestos o reducir recompensas.",
            accion: "Aumentar tasa de impuestos"
        });
    }

    if (estadisticas.dineroStaked < estadisticas.dineroCirculante * 0.1) {
        recomendaciones.push({
            tipo: "info",
            mensaje: "Pocos usuarios están usando el sistema de staking. Considera promocionarlo.",
            accion: "Promocionar staking"
        });
    }

    return recomendaciones;
}

module.exports = {
    aplicarImpuestoRiqueza,
    aplicarDecaimiento,
    aplicarSistemasAntiInflacion,
    verificarLimiteDiario,
    obtenerEstadisticasEconomia,
    calcularInflacion,
    recomendarAcciones
};
