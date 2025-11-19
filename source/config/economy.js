/**
 * Sistema de Configuración de Economía
 * Contiene todas las constantes y reglas para el sistema económico del bot
 */

module.exports = {
    // ==================== CONFIGURACIÓN DE BILLETERA ====================
    billetera: {
        // Porcentaje que se pierde al morir/ser robado (50% por defecto)
        porcentajePerdida: 0.5,

        // Cantidad mínima que se puede tener en billetera
        minimoEfectivo: 0,

        // Cantidad máxima que se puede tener en billetera (sin límite por defecto)
        maximoEfectivo: null,
    },

    // ==================== CONFIGURACIÓN DE BANCO ====================
    banco: {
        // Capacidad inicial del banco para nuevos usuarios
        capacidadInicial: 10000,

        // Capacidad máxima del banco (se puede aumentar con mejoras)
        capacidadMaxima: 1000000,

        // Costo de mejoras de capacidad del banco
        mejoras: [
            { capacidad: 25000, costo: 5000 },
            { capacidad: 50000, costo: 15000 },
            { capacidad: 100000, costo: 35000 },
            { capacidad: 250000, costo: 75000 },
            { capacidad: 500000, costo: 150000 },
            { capacidad: 1000000, costo: 300000 }
        ],

        // Impuesto por depósito (3% por defecto)
        impuestoDeposito: 0.03,

        // Impuesto mínimo (si el 3% es muy poco, se cobra este mínimo)
        impuestoMinimo: 10,

        // Impuesto por retiro (1% por defecto)
        impuestoRetiro: 0.01,

        // Depósito mínimo permitido
        depositoMinimo: 100,

        // Retiro mínimo permitido
        retiroMinimo: 100,
    },

    // ==================== SISTEMA DE TOKENS PREMIUM (GEMAS) ====================
    gemas: {
        // Valor de conversión de gemas a dinero (1 gema = 10000 dinero)
        valorConversion: 10000,

        // Precio de gemas en dinero real (para referencia)
        // No se pueden comprar con dinero del juego
        precioPack: {
            pequeño: { gemas: 10, precio: "2.99 USD" },
            mediano: { gemas: 50, precio: "9.99 USD" },
            grande: { gemas: 150, precio: "24.99 USD" },
        },

        // Recompensas de gemas por logros
        logros: {
            primerStake: 5,
            stake7dias: 10,
            nivel50: 25,
            nivel100: 50,
            boostServidor: 20,
            invitar10: 15,
            invitar50: 50,
        },

        // Usos de las gemas
        usos: {
            // Saltar cooldown (costo en gemas)
            saltarCooldown: {
                work: 2,
                crime: 3,
                rob: 5,
                daily: 5,
            },

            // Comprar cosméticos
            cosmeticos: {
                colorPerfil: 10,
                fondoPerfil: 25,
                insignia: 50,
                titulo: 75,
            },

            // Aumentar capacidad del banco (alternativa al dinero)
            aumentarBanco: {
                pequeño: 15,   // +25000 capacidad
                mediano: 35,   // +50000 capacidad
                grande: 75,    // +100000 capacidad
            },
        },
    },

    // ==================== SISTEMA DE STAKING ====================
    staking: {
        // Cantidad mínima para hacer staking
        cantidadMinima: 1000,

        // Cantidad máxima para hacer staking
        cantidadMaxima: 500000,

        // Número máximo de stakes activos por usuario
        stakesMaximos: 5,

        // Períodos disponibles y sus APY (Annual Percentage Yield)
        periodos: {
            1: {
                dias: 1,
                apy: 5,          // 5% de retorno
                nombre: "Corto Plazo",
                emoji: "⚡",
            },
            3: {
                dias: 3,
                apy: 12,         // 12% de retorno
                nombre: "Mediano Plazo",
                emoji: "📈",
            },
            7: {
                dias: 7,
                apy: 25,         // 25% de retorno
                nombre: "Largo Plazo",
                emoji: "💎",
            },
        },

        // Penalización por retiro anticipado
        penalizacionRetiroAnticipado: {
            porcentaje: 0.5,  // Se pierde el 50% de la inversión
            mensaje: "Si retiras antes de tiempo, perderás el 50% de tu inversión inicial y todas las ganancias.",
        },
    },

    // ==================== SISTEMA ANTI-INFLACIÓN ====================
    antiInflacion: {
        // Impuesto progresivo basado en riqueza total
        impuestoRiqueza: [
            { minimo: 0, maximo: 10000, tasa: 0 },           // 0% para pobres
            { minimo: 10001, maximo: 50000, tasa: 0.02 },    // 2% para clase media
            { minimo: 50001, maximo: 100000, tasa: 0.05 },   // 5% para ricos
            { minimo: 100001, maximo: 500000, tasa: 0.08 },  // 8% para muy ricos
            { minimo: 500001, maximo: null, tasa: 0.10 },    // 10% para ultra ricos
        ],

        // Tasa de decaimiento del dinero en billetera (0.1% diario)
        decaimientoBilletera: 0.001,

        // Frecuencia de aplicación del impuesto de riqueza (días)
        frecuenciaImpuesto: 7,

        // Límite de dinero que se puede ganar por día
        limiteGananciaDiaria: 50000,
    },

    // ==================== EMOJIS DEL SISTEMA ====================
    emojis: {
        dinero: "💵",
        banco: "🏦",
        gemas: "💎",
        stake: "📊",
        impuesto: "💸",
        ganancia: "💰",
        perdida: "📉",
        warning: "⚠️",
        success: "✅",
        error: "❌",
        info: "ℹ️",
        loading: "⏳",
    },

    // ==================== COLORES DE EMBEDS ====================
    colores: {
        principal: "#fbd9ff",
        success: "#00ff00",
        error: "#ff0000",
        warning: "#ffaa00",
        info: "#00aaff",
        gemas: "#9b59b6",
        stake: "#3498db",
    },

    // ==================== CONFIGURACIÓN DE COOLDOWNS ====================
    cooldowns: {
        work: 3600000,      // 1 hora
        crime: 7200000,     // 2 horas
        rob: 21600000,      // 6 horas
        daily: 86400000,    // 24 horas
    },
};
