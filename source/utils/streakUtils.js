const economyConfig = require('../config/economy');

/**
 * Obtiene la configuración de racha y recompensas para un tipo dado.
 * @param {('daily'|'work')} tipo
 */
function obtenerConfigRacha(tipo) {
    const rachaConfig = economyConfig.rachas?.[tipo] || {};
    const recompensaConfig = economyConfig.recompensas?.[tipo] || {};
    return { rachaConfig, recompensaConfig };
}

/**
 * Determina si la racha puede continuar según el último timestamp y la ventana permitida.
 * @param {Date|null} ultimaRecompensa
 * @param {number} horasVentana
 */
function rachaVigente(ultimaRecompensa, horasVentana) {
    if (!ultimaRecompensa) return false;
    const limite = new Date(ultimaRecompensa);
    limite.setHours(limite.getHours() + horasVentana);
    return Date.now() <= limite.getTime();
}

/**
 * Calcula el multiplicador según la racha actual y tabla configurada.
 * @param {number} contador
 * @param {number[]} tablaMultiplicadores
 */
function calcularMultiplicador(contador, tablaMultiplicadores = []) {
    if (!tablaMultiplicadores.length) return 1;
    const index = Math.min(Math.max(contador - 1, 0), tablaMultiplicadores.length - 1);
    return tablaMultiplicadores[index];
}

/**
 * Genera un monto base aleatorio entre min y max inclusive.
 */
function generarBase(min, max) {
    if (typeof min !== 'number' || typeof max !== 'number') return 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Aplica multiplicador al monto base.
 */
function aplicarMultiplicador(base, multiplicador) {
    return Math.floor(base * (multiplicador || 1));
}

/**
 * Evalúa si se alcanza algún hito de racha.
 */
function obtenerHitos(contador, hitos = []) {
    if (!Array.isArray(hitos)) return [];
    return hitos.filter(h => contador === h.dias);
}

/**
 * Determina si aplica una sorpresa aleatoria y retorna la recompensa.
 */
function sortearSorpresa(config) {
    if (!config || typeof config.probabilidad !== 'number') return null;
    if (Math.random() > config.probabilidad) return null;
    const lista = Array.isArray(config.recompensas) ? config.recompensas : [];
    if (!lista.length) return null;
    return lista[Math.floor(Math.random() * lista.length)];
}

/**
 * Reinicia la racha diaria usando reinicios disponibles.
 */
function puedeReiniciar(estadoRacha, maxReinicios = 0) {
    return (estadoRacha?.reiniciosDisponibles || 0) > 0 && maxReinicios > 0;
}

/**
 * Actualiza el estado de racha después de reclamar recompensa.
 */
function actualizarRacha(estadoRacha, contador, maximaRacha, reiniciosDisponibles, timestamp) {
    return {
        contador,
        mejorMarca: Math.max(maximaRacha, contador),
        ultimaRecompensa: timestamp,
        reiniciosDisponibles,
    };
}

/**
 * Reduce reinicios disponibles en caso de consumir reenganche.
 */
function consumirReinicio(estadoRacha) {
    if (!estadoRacha) return estadoRacha;
    const restantes = Math.max((estadoRacha.reiniciosDisponibles || 0) - 1, 0);
    return { ...estadoRacha, reiniciosDisponibles: restantes };
}

module.exports = {
    obtenerConfigRacha,
    rachaVigente,
    calcularMultiplicador,
    generarBase,
    aplicarMultiplicador,
    obtenerHitos,
    sortearSorpresa,
    puedeReiniciar,
    actualizarRacha,
    consumirReinicio,
};
