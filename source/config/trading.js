/**
 * Sistema de Trading - Acciones Ficticias y Criptomonedas Reales
 * Inspirado en Robinhood, WSB, y crypto exchanges
 */

module.exports = {
    // ==================== CONFIGURACIÓN GENERAL ====================
    general: {
        // Comisión por operación (0.1% = estilo Robinhood)
        comision: 0.001,

        // Mínimo para operar
        minimoOperacion: 100,

        // Máximo por operación (para evitar manipulación)
        maximoOperacion: 1000000,

        // Intervalo de actualización de precios (ms)
        intervaloActualizacion: 60000, // 1 minuto
    },

    // ==================== ACCIONES FICTICIAS ====================
    // Empresas del servidor - precios afectados por actividad
    stocks: {
        // Empresas disponibles
        empresas: [
            {
                ticker: 'DISC',
                nombre: 'Discordia Tech',
                descripcion: 'Líder en tecnología de comunicación',
                precioInicial: 150,
                sector: 'Tecnología',
                volatilidad: 0.15, // 15% de volatilidad
                emoji: '💻',
                factorActividad: 0.8, // Qué tanto afecta la actividad del servidor
            },
            {
                ticker: 'MEME',
                nombre: 'MemeCorp',
                descripcion: 'Memes de calidad premium',
                precioInicial: 420,
                sector: 'Entretenimiento',
                volatilidad: 0.35, // Alta volatilidad (meme stock)
                emoji: '😂',
                factorActividad: 1.2,
            },
            {
                ticker: 'GIGA',
                nombre: 'GigaChad Industries',
                descripcion: 'Chads profesionales',
                precioInicial: 69,
                sector: 'Fitness',
                volatilidad: 0.20,
                emoji: '💪',
                factorActividad: 0.5,
            },
            {
                ticker: 'WAIFU',
                nombre: 'Waifu Entertainment',
                descripcion: 'Waifus de alta calidad',
                precioInicial: 500,
                sector: 'Entretenimiento',
                volatilidad: 0.25,
                emoji: '🌸',
                factorActividad: 0.9,
            },
            {
                ticker: 'DEGEN',
                nombre: 'Degen Capital',
                descripcion: 'Para los que hacen YOLO',
                precioInicial: 1,
                sector: 'Finanzas',
                volatilidad: 0.50, // Súper volátil
                emoji: '🎲',
                factorActividad: 1.5,
            },
            {
                ticker: 'MOON',
                nombre: 'To The Moon Inc',
                descripcion: 'Rockets to the moon 🚀',
                precioInicial: 10,
                sector: 'Aeroespacial',
                volatilidad: 0.40,
                emoji: '🚀',
                factorActividad: 1.0,
            },
            {
                ticker: 'PEPE',
                nombre: 'Pepe Holdings',
                descripcion: 'Feels good man',
                precioInicial: 0.69,
                sector: 'Memes',
                volatilidad: 0.60, // Extremadamente volátil
                emoji: '🐸',
                factorActividad: 1.3,
            },
            {
                ticker: 'HODL',
                nombre: 'Diamond Hands Co',
                descripcion: 'We like the stock 💎🙌',
                precioInicial: 250,
                sector: 'Finanzas',
                volatilidad: 0.30,
                emoji: '💎',
                factorActividad: 0.7,
            },
        ],

        // Factores que afectan precios
        factoresActividad: {
            mensajes: 0.3,      // 30% basado en mensajes
            usuariosVoz: 0.2,   // 20% basado en usuarios en voz
            boosts: 0.1,        // 10% basado en boosts del servidor
            randomness: 0.4,    // 40% aleatorio (mercado)
        },

        // Horarios de mercado (UTC)
        horarioMercado: {
            apertura: 13, // 9 AM EST
            cierre: 20,   // 4 PM EST
            // Fuera de horario = pre-market/after-hours con más volatilidad
        },
    },

    // ==================== CRIPTOMONEDAS ====================
    crypto: {
        // Criptos disponibles para trading
        monedas: [
            {
                id: 'bitcoin',
                ticker: 'BTC',
                nombre: 'Bitcoin',
                emoji: '₿',
                descripcion: 'La OG de las crypto',
            },
            {
                id: 'ethereum',
                ticker: 'ETH',
                nombre: 'Ethereum',
                emoji: '⟠',
                descripcion: 'Smart contracts y DeFi',
            },
            {
                id: 'binancecoin',
                ticker: 'BNB',
                nombre: 'Binance Coin',
                emoji: '🔶',
                descripcion: 'Exchange token',
            },
            {
                id: 'solana',
                ticker: 'SOL',
                nombre: 'Solana',
                emoji: '◎',
                descripcion: 'Fast and cheap',
            },
            {
                id: 'cardano',
                ticker: 'ADA',
                nombre: 'Cardano',
                emoji: '₳',
                descripcion: 'Peer-reviewed blockchain',
            },
            {
                id: 'dogecoin',
                ticker: 'DOGE',
                nombre: 'Dogecoin',
                emoji: '🐕',
                descripcion: 'To the moon! 🚀',
            },
            {
                id: 'shiba-inu',
                ticker: 'SHIB',
                nombre: 'Shiba Inu',
                emoji: '🐶',
                descripcion: 'Doge killer',
            },
            {
                id: 'pepe',
                ticker: 'PEPE',
                nombre: 'Pepe',
                emoji: '🐸',
                descripcion: 'Meme coin supremo',
            },
        ],

        // API de CoinGecko (gratuita)
        api: {
            baseUrl: 'https://api.coingecko.com/api/v3',
            endpoints: {
                price: '/simple/price',
                market: '/coins/markets',
                chart: '/coins/{id}/market_chart',
            },
            // Rate limit: 50 llamadas/minuto (gratuito)
            rateLimit: 50,
            cacheDuration: 30000, // 30 segundos
        },

        // Mínimo para comprar crypto (en USD)
        minimoCrypto: 10,
    },

    // ==================== SISTEMA DE OPCIONES (CALLS/PUTS) ====================
    options: {
        // Tipos de opciones
        tipos: {
            call: {
                nombre: 'Call',
                emoji: '📈',
                descripcion: 'Apuesta a que el precio SUBE',
            },
            put: {
                nombre: 'Put',
                emoji: '📉',
                descripcion: 'Apuesta a que el precio BAJA',
            },
        },

        // Timeframes disponibles
        timeframes: [
            { duracion: 600000, nombre: '10 minutos', multiplicador: 1.5 },    // 10 min
            { duracion: 1800000, nombre: '30 minutos', multiplicador: 2.0 },   // 30 min
            { duracion: 3600000, nombre: '1 hora', multiplicador: 2.5 },       // 1 hora
            { duracion: 14400000, nombre: '4 horas', multiplicador: 3.5 },     // 4 horas
            { duracion: 86400000, nombre: '24 horas', multiplicador: 5.0 },    // 1 día
        ],

        // Porcentaje mínimo de cambio para ganar
        cambioMinimo: 0.5, // 0.5%

        // Prima de la opción (costo base)
        prima: 0.05, // 5% del monto apostado

        // Máximo de opciones activas por usuario
        maximoOpciones: 10,
    },

    // ==================== ANÁLISIS TÉCNICO ====================
    analisis: {
        // Indicadores disponibles
        indicadores: {
            rsi: {
                nombre: 'RSI (Relative Strength Index)',
                periodo: 14,
                sobrecompra: 70,
                sobreventa: 30,
            },
            macd: {
                nombre: 'MACD',
                rapido: 12,
                lento: 26,
                señal: 9,
            },
            sma: {
                nombre: 'Simple Moving Average',
                periodos: [20, 50, 200],
            },
        },

        // Patrones de velas
        patrones: [
            'Hammer',
            'Shooting Star',
            'Doji',
            'Engulfing',
            'Morning Star',
        ],
    },

    // ==================== SISTEMA DE PORTAFOLIO ====================
    portfolio: {
        // Tipos de activos
        tiposActivos: {
            stock: 'Acción',
            crypto: 'Criptomoneda',
            option: 'Opción',
        },

        // Métricas a calcular
        metricas: [
            'valor_total',
            'ganancia_perdida',
            'roi',
            'mejor_posicion',
            'peor_posicion',
            'diversificacion',
        ],
    },

    // ==================== EVENTOS DE MERCADO ====================
    eventos: {
        // Eventos aleatorios que afectan el mercado
        tipos: [
            {
                nombre: 'Bull Run',
                probabilidad: 0.05,
                impacto: 0.20, // +20% en todos los precios
                duracion: 3600000, // 1 hora
                emoji: '🐂',
                mensaje: '¡BULL RUN! 🚀 Todos los activos suben!',
            },
            {
                nombre: 'Bear Market',
                probabilidad: 0.05,
                impacto: -0.15, // -15%
                duracion: 3600000,
                emoji: '🐻',
                mensaje: '¡BEAR MARKET! 📉 Caída generalizada!',
            },
            {
                nombre: 'Pump and Dump',
                probabilidad: 0.03,
                impacto: 0.50, // +50% luego -40%
                duracion: 600000, // 10 minutos
                emoji: '🎢',
                mensaje: '¡PUMP AND DUMP DETECTADO! 🎢',
            },
            {
                nombre: 'Flash Crash',
                probabilidad: 0.02,
                impacto: -0.25,
                duracion: 300000, // 5 minutos
                emoji: '💥',
                mensaje: '¡FLASH CRASH! 💥 Caída repentina!',
            },
            {
                nombre: 'Elon Tweet',
                probabilidad: 0.04,
                impacto: 0.30, // Solo afecta DOGE, MEME, etc.
                duracion: 1800000, // 30 min
                emoji: '🐦',
                mensaje: '¡ELON TWEETEÓ! 🐦 Los memes suben!',
            },
        ],
    },

    // ==================== RANKINGS Y LEADERBOARDS ====================
    leaderboard: {
        categorias: [
            'portfolio_value', // Mayor valor de portafolio
            'total_profit',    // Mayor ganancia total
            'best_trade',      // Mejor trade individual
            'win_rate',        // Mayor % de wins
            'volume',          // Mayor volumen operado
        ],

        // Premios por posición
        premios: {
            1: { dinero: 50000, gemas: 100, titulo: '👑 Wolf of Wall Street' },
            2: { dinero: 25000, gemas: 50, titulo: '🥈 Diamond Hands' },
            3: { dinero: 10000, gemas: 25, titulo: '🥉 Paper Hands' },
        },
    },

    // ==================== NOTIFICACIONES ====================
    notificaciones: {
        // Alertas de precio
        alertas: {
            enabled: true,
            tipos: [
                'precio_alcanzado',
                'cambio_porcentual',
                'option_expiring',
                'stop_loss',
                'take_profit',
            ],
        },

        // Canales de notificación
        canales: {
            dm: true,           // Mensaje directo
            servidor: false,    // Canal del servidor
        },
    },

    // ==================== EMOJIS ====================
    emojis: {
        // General
        chart: '📊',
        up: '📈',
        down: '📉',
        rocket: '🚀',
        money: '💵',
        diamond: '💎',
        hands: '🙌',
        fire: '🔥',

        // Crypto
        bitcoin: '₿',
        ethereum: '⟠',

        // Trading
        bull: '🐂',
        bear: '🐻',
        moon: '🌙',
        lambo: '🏎️',

        // Emociones
        stonks: '📊',
        panik: '😱',
        kalm: '😌',
        wojak: '😭',
    },

    // ==================== COLORES ====================
    colores: {
        principal: '#fbd9ff',
        verde: '#00ff00',      // Ganancia
        rojo: '#ff0000',       // Pérdida
        azul: '#0099ff',       // Info
        oro: '#ffd700',        // Premium
        morado: '#9b59b6',     // Opciones
    },

    // ==================== MENSAJES WSB-STYLE ====================
    mensajes: {
        compra: [
            '🚀 TO THE MOON!',
            '💎🙌 DIAMOND HANDS!',
            '🦍 APE TOGETHER STRONG!',
            '📈 STONKS ONLY GO UP!',
            '🌙 SEE YOU ON THE MOON!',
        ],

        venta: [
            '📉 PAPER HANDS ACTIVATED',
            '🐻 GOING BEAR MODE',
            '💸 TAKING PROFITS',
            '🏃 EXIT STRATEGY',
            '😭 STOP LOSS HIT',
        ],

        ganancia: [
            '🤑 TENDIES SECURED!',
            '🏎️ LAMBO WHEN?',
            '💰 MONEY PRINTER GO BRRR!',
            '🎰 THIS IS THE WAY!',
            '🔥 LETS GOOO!',
        ],

        perdida: [
            '😭 GUH!',
            '🤡 CLOWN MARKET',
            '📉 BOUGHT THE TOP',
            '💀 RIP PORTFOLIO',
            '🤦 SHOULD HAVE BOUGHT PUTS',
        ],
    },
};
