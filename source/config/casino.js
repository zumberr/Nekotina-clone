/**
 * Sistema de Configuración de Casino
 * Inspirado en plataformas modernas como Stake
 * Diseñado para máxima adicción y engagement
 */

module.exports = {
    // ==================== CONFIGURACIÓN GENERAL ====================
    general: {
        // Apuesta mínima global
        apuestaMinima: 100,

        // Apuesta máxima global
        apuestaMaxima: 100000,

        // House edge (ventaja de la casa) - 2% es competitivo
        houseEdge: 0.02,

        // Multiplicador máximo teórico
        multiplicadorMaximo: 1000,
    },

    // ==================== CRASH GAME ====================
    // El juego más adictivo - un multiplicador que sube hasta crashear
    crash: {
        apuestaMinima: 100,
        apuestaMaxima: 50000,

        // Configuración del multiplicador
        multiplicadorMinimo: 1.00,
        multiplicadorMaximo: 1000.00,

        // Punto promedio de crash (más bajo = más difícil)
        crashPromedio: 2.0,

        // House edge específico
        houseEdge: 0.02,

        // Tiempo entre ticks (ms) - visual
        tickRate: 100,

        // Incremento del multiplicador por tick
        incrementoPorTick: 0.01,

        emojis: {
            rocket: "🚀",
            explosion: "💥",
            money: "💰",
            chart: "📈",
        },
    },

    // ==================== DICE ====================
    // Juego simple de dados con probabilidad ajustable
    dice: {
        apuestaMinima: 100,
        apuestaMaxima: 25000,

        // Rango del dado (0-100)
        numeroMinimo: 0,
        numeroMaximo: 100,

        // Chance default (50% = 2x multiplicador)
        chanceDefault: 50,

        // Limites de chance (5% - 95%)
        chanceMinimo: 5,
        chanceMaximo: 95,

        // House edge
        houseEdge: 0.02,

        emojis: {
            dice: "🎲",
            win: "✅",
            lose: "❌",
            fire: "🔥",
        },
    },

    // ==================== SLOTS ====================
    // Tragamonedas clásico con símbolos y combinaciones
    slots: {
        apuestaMinima: 50,
        apuestaMaxima: 10000,

        // Símbolos y sus multiplicadores (3 iguales)
        simbolos: [
            { emoji: "🍒", nombre: "Cereza", multiplicador: 2, peso: 30 },
            { emoji: "🍋", nombre: "Limón", multiplicador: 3, peso: 25 },
            { emoji: "🍊", nombre: "Naranja", multiplicador: 4, peso: 20 },
            { emoji: "🍇", nombre: "Uvas", multiplicador: 5, peso: 15 },
            { emoji: "💎", nombre: "Diamante", multiplicador: 10, peso: 8 },
            { emoji: "7️⃣", nombre: "Siete", multiplicador: 15, peso: 5 },
            { emoji: "👑", nombre: "Corona", multiplicador: 25, peso: 3 },
            { emoji: "💰", nombre: "Jackpot", multiplicador: 100, peso: 1 },
        ],

        // Bonus por 2 símbolos iguales
        multiplicadorDoble: 0.5,

        // House edge
        houseEdge: 0.05, // Slots tiene más edge tradicionalmente

        emojis: {
            slot: "🎰",
            spin: "🔄",
            win: "🎉",
        },
    },

    // ==================== PLINKO ====================
    // Juego visual donde una bola cae por pines
    plinko: {
        apuestaMinima: 100,
        apuestaMaxima: 20000,

        // Filas de pines (más filas = más variabilidad)
        filas: 12,

        // Riesgos disponibles
        riesgos: {
            bajo: {
                nombre: "Bajo Riesgo",
                emoji: "🟢",
                multiplicadores: [0.5, 0.7, 1.0, 1.3, 1.5, 1.3, 1.0, 0.7, 0.5],
            },
            medio: {
                nombre: "Medio Riesgo",
                emoji: "🟡",
                multiplicadores: [0.3, 0.5, 1.0, 2.0, 3.0, 2.0, 1.0, 0.5, 0.3],
            },
            alto: {
                nombre: "Alto Riesgo",
                emoji: "🔴",
                multiplicadores: [0.2, 0.3, 0.5, 1.0, 5.0, 10.0, 5.0, 1.0, 0.5, 0.3, 0.2],
            },
        },

        // House edge
        houseEdge: 0.02,

        emojis: {
            ball: "⚪",
            pin: "⚫",
            bucket: "🎯",
        },
    },

    // ==================== MINES ====================
    // Buscaminas estratégico - más casillas = más multiplicador
    mines: {
        apuestaMinima: 100,
        apuestaMaxima: 30000,

        // Configuración del tablero
        casillasTotal: 25, // 5x5

        // Cantidad de minas disponibles
        minasDisponibles: [1, 3, 5, 10, 15, 20],

        // Multiplicador aumenta con cada casilla segura revelada
        // Se calcula dinámicamente basado en probabilidad

        // House edge
        houseEdge: 0.02,

        emojis: {
            mine: "💣",
            gem: "💎",
            hidden: "❓",
            safe: "✅",
            explosion: "💥",
        },
    },

    // ==================== ROULETTE ====================
    // Ruleta clásica con apuestas múltiples
    roulette: {
        apuestaMinima: 50,
        apuestaMaxima: 15000,

        // Tipos de apuesta y sus multiplicadores
        tiposApuesta: {
            numero: { multiplicador: 35, nombre: "Número Directo" },
            rojo: { multiplicador: 2, nombre: "Rojo" },
            negro: { multiplicador: 2, nombre: "Negro" },
            par: { multiplicador: 2, nombre: "Par" },
            impar: { multiplicador: 2, nombre: "Impar" },
            bajo: { multiplicador: 2, nombre: "1-18" },
            alto: { multiplicador: 2, nombre: "19-36" },
            docena1: { multiplicador: 3, nombre: "1ra Docena" },
            docena2: { multiplicador: 3, nombre: "2da Docena" },
            docena3: { multiplicador: 3, nombre: "3ra Docena" },
        },

        // Números rojos (los demás son negros, excepto 0)
        numerosRojos: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],

        // House edge (por el 0)
        houseEdge: 0.027, // 1/37

        emojis: {
            wheel: "🎡",
            ball: "⚪",
            red: "🔴",
            black: "⚫",
            green: "🟢",
        },
    },

    // ==================== SISTEMA DE RAKEBACK ====================
    // Devolución de dinero basado en volumen apostado
    rakeback: {
        // Porcentaje de rakeback (devuelve el 5% de las pérdidas)
        porcentaje: 0.05,

        // Mínimo para reclamar rakeback
        minimoReclamar: 1000,

        // Se acumula automáticamente
        automatico: true,

        // Niveles VIP con rakeback mejorado
        niveles: [
            { nivel: 0, nombre: "Bronce", volumenRequerido: 0, rakeback: 0.05 },
            { nivel: 1, nombre: "Plata", volumenRequerido: 100000, rakeback: 0.07 },
            { nivel: 2, nombre: "Oro", volumenRequerido: 500000, rakeback: 0.10 },
            { nivel: 3, nombre: "Platino", volumenRequerido: 2000000, rakeback: 0.12 },
            { nivel: 4, nombre: "Diamante", volumenRequerido: 10000000, rakeback: 0.15 },
            { nivel: 5, nombre: "Élite", volumenRequerido: 50000000, rakeback: 0.20 },
        ],
    },

    // ==================== SISTEMA DE ESTADÍSTICAS ====================
    estadisticas: {
        // Trackear estas métricas por usuario
        metricas: [
            'totalApostado',
            'totalGanado',
            'totalPerdido',
            'mejorRacha',
            'rachaActual',
            'apuestasMayores',
            'volumenPorJuego',
        ],

        // Leaderboards
        leaderboards: {
            mejoresGanancias24h: 10,
            mejoresGananciasSemana: 10,
            mayorVolumen: 10,
            mayorMultiplicador: 10,
        },
    },

    // ==================== ANIMACIONES Y EFECTOS ====================
    animaciones: {
        // Barras de progreso para Crash
        barrasCrash: ["▱", "▰"],

        // Spinning para slots
        spinningFrames: ["🎰", "🔄", "⏳", "🎯"],

        // Duración de animaciones (ms)
        duracionSpin: 2000,
        duracionCrash: 3000,
        duracionPlinko: 2500,
    },

    // ==================== MENSAJES PSICOLÓGICOS ====================
    // Mensajes para crear adicción y FOMO
    mensajes: {
        casiGanas: [
            "¡Casi! Prueba otra vez 🔥",
            "¡Por poco! La próxima es tuya 💪",
            "¡Estuviste cerca! No te rindas 🎯",
        ],

        rachaPerdidas: [
            "La suerte está por cambiar 🍀",
            "Las probabilidades están de tu lado ahora 📊",
            "¡Esta es tu oportunidad! 💎",
        ],

        gananciaGrande: [
            "🔥 ¡GANANCIA ÉPICA! 🔥",
            "💰 ¡JACKPOT MASIVO! 💰",
            "🚀 ¡AL INFINITO Y MÁS ALLÁ! 🚀",
        ],
    },

    // ==================== EMOJIS GENERALES ====================
    emojis: {
        casino: "🎰",
        dinero: "💵",
        ganancia: "💰",
        perdida: "📉",
        fuego: "🔥",
        cohete: "🚀",
        grafica: "📊",
        corona: "👑",
        trofeo: "🏆",
        estrella: "⭐",
        diamante: "💎",
        explosion: "💥",
    },

    // ==================== COLORES ====================
    colores: {
        principal: "#fbd9ff",
        ganancia: "#00ff00",
        perdida: "#ff0000",
        jackpot: "#ffd700",
        info: "#00aaff",
        crash: "#ff6b6b",
        plinko: "#4ecdc4",
        slots: "#ffe66d",
        dice: "#a8dadc",
        mines: "#f1c40f",
    },
};
