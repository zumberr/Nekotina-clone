const { ObjectId } = require('mongodb');
const mongoose = require ('mongoose');

const usersSchema = new mongoose.Schema({

    idusuario: { type: String, required: true, unique: true },
    username: { type: String, required: true, default: null },
    vip: { type: Boolean, requiered: true, default: false },
    nivel: { type: Number, required: true, default: 0 },
    exp: { type: Number, required: true, default: 0 },
    marry: { type: String, required: true, default: 'Soltero(a)' },
    rep: { type: Number, required: true, default: 0 },
    pat: { type: Number, required: true, default: 0 },
    hug: { type: Number, required: true, default: 0 },
    sape: { type: Number, required: true, default: 0 },
    color: { type: String, required: true, default: '#607D8B' },
    frase: { type: String, required: true, default: 'No hay frase agregada' },
    foto: { type: String, required: true, default: 'https://c.tenor.com/FLR3dFSlH1sAAAAC/bully-tierno.gif' },
    dinero: { type: Number, required: true, default: 0 },
    banco: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },

    // Sistema de Tokens Premium (Gemas)
    gemas: { type: Number, required: true, default: 0 },

    // Sistema de Staking (Inversiones)
    stakes: [{
        cantidad: { type: Number, required: true },
        periodo: { type: Number, required: true }, // 1, 3, 7 días
        apy: { type: Number, required: true }, // Porcentaje de retorno
        fechaInicio: { type: Date, required: true },
        fechaVencimiento: { type: Date, required: true },
        activo: { type: Boolean, required: true, default: true }
    }],

    // Configuración de Banco
    capacidadBanco: { type: Number, required: true, default: 10000 }, // Límite inicial del banco

    // Cooldowns
    work: { type: Date, required: true, default: Date.now },
    crime: { type: Date, required: true, default: Date.now },
    rob: { type: Date, required: true, default: Date.now },
    daily: { type: Date, required: true, default: Date.now },
    crep: { type: Date, required: true, default: Date.now },
    ck: { type: Number, required: true, default: 0 },

    // ==================== SISTEMA DE CASINO ====================
    // Estadísticas generales de casino
    casinoStats: {
        totalApostado: { type: Number, default: 0 },
        totalGanado: { type: Number, default: 0 },
        totalPerdido: { type: Number, default: 0 },
        mejorRacha: { type: Number, default: 0 },
        rachaActual: { type: Number, default: 0 },
        mayorMultiplicador: { type: Number, default: 0 },
        mayorGanancia: { type: Number, default: 0 },
        volumenTotal: { type: Number, default: 0 },
        volumenPorJuego: { type: Map, of: Number, default: {} },
        apuestasPorJuego: { type: Map, of: Number, default: {} },
        rakeback: { type: Number, default: 0 },
        nivelVIP: { type: Number, default: 0 },
    },

    // Server seed para provably fair (se hashea y muestra al usuario)
    serverSeed: { type: String, default: null },
    nonce: { type: Number, default: 0 },

    // Juego activo de Mines (permite continuar partidas)
    minesGame: {
        activo: { type: Boolean, default: false },
        apuesta: { type: Number, default: 0 },
        cantidadMinas: { type: Number, default: 0 },
        tablero: [{ type: Number }], // Posiciones de las minas
        reveladas: [{ type: Number }], // Casillas reveladas
        multiplicadorActual: { type: Number, default: 1 },
        serverSeed: { type: String, default: null },
        nonce: { type: Number, default: 0 },
    },

    // ==================== SISTEMA DE TRADING ====================
    tradingData: {
        // Acciones (stocks ficticios)
        stocks: {
            type: Map,
            of: {
                cantidad: { type: Number },
                precioPromedio: { type: Number },
            },
            default: {},
        },

        // Criptomonedas
        crypto: {
            type: Map,
            of: {
                cantidad: { type: Number },
                precioPromedio: { type: Number },
            },
            default: {},
        },

        // Opciones activas (calls/puts)
        opciones: [{
            tipo: { type: String }, // 'call' o 'put'
            activo: { type: String }, // ticker
            tipoActivo: { type: String }, // 'stock' o 'crypto'
            monto: { type: Number },
            prima: { type: Number },
            precioInicial: { type: Number },
            multiplicador: { type: Number },
            duracion: { type: Number },
            fechaCreacion: { type: Date },
            fechaExpiracion: { type: Date },
            activa: { type: Boolean },
            resultado: {
                gano: { type: Boolean },
                precioFinal: { type: Number },
                cambioPorcentual: { type: Number },
                ganancia: { type: Number },
                timestamp: { type: Date },
            },
        }],

        // Historial de trades
        historial: [{
            tipo: { type: String }, // 'compra' o 'venta'
            activo: { type: String },
            tipoActivo: { type: String },
            cantidad: { type: Number },
            precio: { type: Number },
            total: { type: Number },
            ganancia: { type: Number },
            timestamp: { type: Date },
        }],

        // Estadísticas
        stats: {
            tradesTotal: { type: Number, default: 0 },
            tradesGanadores: { type: Number, default: 0 },
            gananciaTotal: { type: Number, default: 0 },
            perdidaTotal: { type: Number, default: 0 },
            mejorTrade: { type: Number, default: 0 },
            peorTrade: { type: Number, default: 0 },
            volumenTotal: { type: Number, default: 0 },
        },
    },

})

const model = mongoose.model('Usuarios', usersSchema);

module.exports = model;

//type: string, number, boolean, buffer, date, array, Schema.Types.ObjectId
//default: fv
