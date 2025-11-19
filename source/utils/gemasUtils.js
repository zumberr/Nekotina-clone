/**
 * Utilidades para el Sistema de Gemas (Tokens Premium)
 */

const economyConfig = require('../config/economy');

/**
 * Verifica si un usuario tiene suficientes gemas
 * @param {Number} gemasActuales - Gemas actuales del usuario
 * @param {Number} gemasCosto - Gemas necesarias
 * @returns {Boolean} - true si tiene suficientes, false si no
 */
function tieneSuficientesGemas(gemasActuales, gemasCosto) {
    return gemasActuales >= gemasCosto;
}

/**
 * Calcula el costo en gemas para saltar un cooldown
 * @param {String} tipoCooldown - Tipo de cooldown (work, crime, rob, daily)
 * @returns {Number} - Costo en gemas
 */
function calcularCostoCooldown(tipoCooldown) {
    return economyConfig.gemas.usos.saltarCooldown[tipoCooldown] || 0;
}

/**
 * Obtiene información sobre un pack de gemas
 * @param {String} tamaño - Tamaño del pack (pequeño, mediano, grande)
 * @returns {Object} - Información del pack
 */
function obtenerInfoPack(tamaño) {
    return economyConfig.gemas.precioPack[tamaño];
}

/**
 * Calcula las gemas por logro
 * @param {String} tipoLogro - Tipo de logro
 * @returns {Number} - Cantidad de gemas
 */
function calcularGemasLogro(tipoLogro) {
    return economyConfig.gemas.logros[tipoLogro] || 0;
}

/**
 * Obtiene el costo en gemas de un cosmético
 * @param {String} tipoCosmetico - Tipo de cosmético
 * @returns {Number} - Costo en gemas
 */
function obtenerCostoCosmetico(tipoCosmetico) {
    return economyConfig.gemas.usos.cosmeticos[tipoCosmetico] || 0;
}

/**
 * Obtiene el costo en gemas para aumentar capacidad del banco
 * @param {String} tamaño - Tamaño del aumento (pequeño, mediano, grande)
 * @returns {Object} - { costoGemas, aumentoCapacidad }
 */
function obtenerCostoAumentoBanco(tamaño) {
    const costoGemas = economyConfig.gemas.usos.aumentarBanco[tamaño] || 0;

    let aumentoCapacidad = 0;
    if (tamaño === 'pequeño') aumentoCapacidad = 25000;
    if (tamaño === 'mediano') aumentoCapacidad = 50000;
    if (tamaño === 'grande') aumentoCapacidad = 100000;

    return { costoGemas, aumentoCapacidad };
}

/**
 * Convierte gemas a dinero
 * @param {Number} gemas - Cantidad de gemas
 * @returns {Number} - Cantidad de dinero equivalente
 */
function convertirGemasADinero(gemas) {
    return gemas * economyConfig.gemas.valorConversion;
}

/**
 * Convierte dinero a gemas
 * @param {Number} dinero - Cantidad de dinero
 * @returns {Number} - Cantidad de gemas equivalentes
 */
function convertirDineroAGemas(dinero) {
    return Math.floor(dinero / economyConfig.gemas.valorConversion);
}

/**
 * Valida una compra con gemas
 * @param {Number} gemasActuales - Gemas actuales del usuario
 * @param {Number} gemasCosto - Gemas necesarias para la compra
 * @returns {Object} - { valido: Boolean, mensaje: String }
 */
function validarCompraGemas(gemasActuales, gemasCosto) {
    if (gemasCosto <= 0) {
        return {
            valido: false,
            mensaje: "El costo debe ser mayor a 0 gemas."
        };
    }

    if (!tieneSuficientesGemas(gemasActuales, gemasCosto)) {
        return {
            valido: false,
            mensaje: `No tienes suficientes gemas. Necesitas **${gemasCosto}** gemas pero solo tienes **${gemasActuales}**.`
        };
    }

    return { valido: true, mensaje: 'OK' };
}

/**
 * Formatea la cantidad de gemas con emoji
 * @param {Number} cantidad - Cantidad de gemas
 * @returns {String} - Gemas formateadas
 */
function formatearGemas(cantidad) {
    return `${economyConfig.emojis.gemas} ${cantidad}`;
}

/**
 * Obtiene todas las formas de obtener gemas
 * @returns {Array} - Lista de formas de obtener gemas
 */
function obtenerFormasObtenerGemas() {
    return [
        { nombre: "Primer Stake", descripcion: "Crea tu primer stake", gemas: economyConfig.gemas.logros.primerStake },
        { nombre: "Stake de 7 días", descripcion: "Completa un stake de 7 días", gemas: economyConfig.gemas.logros.stake7dias },
        { nombre: "Nivel 50", descripcion: "Alcanza el nivel 50", gemas: economyConfig.gemas.logros.nivel50 },
        { nombre: "Nivel 100", descripcion: "Alcanza el nivel 100", gemas: economyConfig.gemas.logros.nivel100 },
        { nombre: "Boost del Servidor", descripcion: "Boostea el servidor", gemas: economyConfig.gemas.logros.boostServidor },
        { nombre: "Invitar 10 personas", descripcion: "Invita 10 personas al servidor", gemas: economyConfig.gemas.logros.invitar10 },
        { nombre: "Invitar 50 personas", descripcion: "Invita 50 personas al servidor", gemas: economyConfig.gemas.logros.invitar50 }
    ];
}

/**
 * Obtiene todos los usos de las gemas
 * @returns {Object} - Categorías de usos con sus items
 */
function obtenerUsosGemas() {
    return {
        cooldowns: [
            { nombre: "Saltar Cooldown Work", costo: economyConfig.gemas.usos.saltarCooldown.work },
            { nombre: "Saltar Cooldown Crime", costo: economyConfig.gemas.usos.saltarCooldown.crime },
            { nombre: "Saltar Cooldown Rob", costo: economyConfig.gemas.usos.saltarCooldown.rob },
            { nombre: "Saltar Cooldown Daily", costo: economyConfig.gemas.usos.saltarCooldown.daily }
        ],
        cosmeticos: [
            { nombre: "Color de Perfil", costo: economyConfig.gemas.usos.cosmeticos.colorPerfil },
            { nombre: "Fondo de Perfil", costo: economyConfig.gemas.usos.cosmeticos.fondoPerfil },
            { nombre: "Insignia", costo: economyConfig.gemas.usos.cosmeticos.insignia },
            { nombre: "Título", costo: economyConfig.gemas.usos.cosmeticos.titulo }
        ],
        banco: [
            { nombre: "Aumento Pequeño (+25,000)", costo: economyConfig.gemas.usos.aumentarBanco.pequeño },
            { nombre: "Aumento Mediano (+50,000)", costo: economyConfig.gemas.usos.aumentarBanco.mediano },
            { nombre: "Aumento Grande (+100,000)", costo: economyConfig.gemas.usos.aumentarBanco.grande }
        ]
    };
}

module.exports = {
    tieneSuficientesGemas,
    calcularCostoCooldown,
    obtenerInfoPack,
    calcularGemasLogro,
    obtenerCostoCosmetico,
    obtenerCostoAumentoBanco,
    convertirGemasADinero,
    convertirDineroAGemas,
    validarCompraGemas,
    formatearGemas,
    obtenerFormasObtenerGemas,
    obtenerUsosGemas
};
