/**
 * Utilidades del Sistema de Casino
 * Incluye RNG provably fair, cálculos de multiplicadores, y lógica de juegos
 */

const crypto = require('crypto');
const casinoConfig = require('../config/casino');
const User = require('../models/userSchema');

/**
 * ==================== GENERADOR DE NÚMEROS ALEATORIOS PROVABLY FAIR ====================
 */

/**
 * Genera un seed aleatorio para provably fair
 */
function generarServerSeed() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Genera un hash del server seed
 */
function hashServerSeed(serverSeed) {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
}

/**
 * Genera un número aleatorio provably fair entre 0 y 1
 * @param {string} serverSeed - Seed del servidor
 * @param {string} clientSeed - Seed del cliente (userId)
 * @param {number} nonce - Contador de apuestas
 */
function generarNumeroAleatorio(serverSeed, clientSeed, nonce) {
    const hash = crypto
        .createHmac('sha256', serverSeed)
        .update(`${clientSeed}:${nonce}`)
        .digest('hex');

    // Convertir los primeros 8 caracteres del hash a número entre 0 y 1
    const numeroHex = hash.substring(0, 8);
    const numeroDecimal = parseInt(numeroHex, 16);
    return numeroDecimal / 0xffffffff;
}

/**
 * ==================== CRASH GAME ====================
 */

/**
 * Calcula el punto de crash basado en RNG provably fair
 * Usa distribución exponencial inversa
 */
function calcularCrashPoint(serverSeed, clientSeed, nonce) {
    const config = casinoConfig.crash;
    const random = generarNumeroAleatorio(serverSeed, clientSeed, nonce);

    // Aplicar house edge
    const houseEdge = config.houseEdge;
    const adjustedRandom = random * (1 - houseEdge);

    // Usar distribución exponencial: crash = 99 / (100 - random)
    // Esto crea crashes frecuentes en valores bajos y raros en valores altos
    let crashPoint = 99 / (100 * adjustedRandom);

    // Limitar entre mínimo y máximo
    crashPoint = Math.max(config.multiplicadorMinimo, crashPoint);
    crashPoint = Math.min(config.multiplicadorMaximo, crashPoint);

    // Redondear a 2 decimales
    return Math.round(crashPoint * 100) / 100;
}

/**
 * Simula la animación del crash y retorna multiplicadores intermedios
 */
function simularCrashAnimacion(crashPoint) {
    const config = casinoConfig.crash;
    const multiplicadores = [];
    let current = 1.00;

    while (current < crashPoint) {
        multiplicadores.push(current.toFixed(2));
        current += config.incrementoPorTick;
    }

    multiplicadores.push(crashPoint.toFixed(2));
    return multiplicadores;
}

/**
 * ==================== DICE GAME ====================
 */

/**
 * Tira el dado y calcula si gana
 * @param {number} chance - Probabilidad de ganar (5-95)
 */
function tirarDado(serverSeed, clientSeed, nonce, chance) {
    const config = casinoConfig.dice;

    // Validar chance
    if (chance < config.chanceMinimo || chance > config.chanceMaximo) {
        throw new Error(`El chance debe estar entre ${config.chanceMinimo}% y ${config.chanceMaximo}%`);
    }

    // Generar número aleatorio entre 0 y 100
    const random = generarNumeroAleatorio(serverSeed, clientSeed, nonce);
    const resultado = Math.floor(random * 10000) / 100; // 2 decimales

    // Calcular multiplicador teórico
    const multiplicadorTeorico = 100 / chance;

    // Aplicar house edge
    const multiplicador = multiplicadorTeorico * (1 - config.houseEdge);

    // Determinar si gana
    const gano = resultado < chance;

    return {
        resultado: resultado.toFixed(2),
        objetivo: chance,
        gano,
        multiplicador: gano ? multiplicador.toFixed(2) : 0,
    };
}

/**
 * ==================== SLOTS GAME ====================
 */

/**
 * Gira el slot y calcula resultado
 */
function girarSlots(serverSeed, clientSeed, nonce) {
    const config = casinoConfig.slots;
    const simbolos = config.simbolos;

    // Calcular peso total
    const pesoTotal = simbolos.reduce((sum, s) => sum + s.peso, 0);

    // Generar 3 rodillos
    const rodillos = [];
    for (let i = 0; i < 3; i++) {
        const random = generarNumeroAleatorio(serverSeed, clientSeed, nonce + i);
        const valorPeso = random * pesoTotal;

        let pesoAcumulado = 0;
        for (const simbolo of simbolos) {
            pesoAcumulado += simbolo.peso;
            if (valorPeso <= pesoAcumulado) {
                rodillos.push(simbolo);
                break;
            }
        }
    }

    // Calcular ganancia
    let multiplicador = 0;

    // Verificar 3 iguales
    if (rodillos[0].emoji === rodillos[1].emoji && rodillos[1].emoji === rodillos[2].emoji) {
        multiplicador = rodillos[0].multiplicador;
    }
    // Verificar 2 iguales
    else if (rodillos[0].emoji === rodillos[1].emoji ||
             rodillos[1].emoji === rodillos[2].emoji ||
             rodillos[0].emoji === rodillos[2].emoji) {
        multiplicador = config.multiplicadorDoble;
    }

    // Aplicar house edge
    if (multiplicador > 0) {
        multiplicador *= (1 - config.houseEdge);
    }

    return {
        rodillos: rodillos.map(r => r.emoji),
        nombres: rodillos.map(r => r.nombre),
        multiplicador: multiplicador.toFixed(2),
        gano: multiplicador > 0,
    };
}

/**
 * ==================== PLINKO GAME ====================
 */

/**
 * Simula la caída de la bola en Plinko
 */
function jugarPlinko(serverSeed, clientSeed, nonce, riesgo) {
    const config = casinoConfig.plinko;

    // Validar riesgo
    if (!config.riesgos[riesgo]) {
        throw new Error('Nivel de riesgo inválido');
    }

    const riesgoConfig = config.riesgos[riesgo];
    const filas = config.filas;

    // Simular caídas (izquierda o derecha en cada fila)
    let posicion = 0;
    const camino = [];

    for (let i = 0; i < filas; i++) {
        const random = generarNumeroAleatorio(serverSeed, clientSeed, nonce + i);
        const direccion = random < 0.5 ? 'L' : 'R';

        if (direccion === 'R') {
            posicion++;
        }

        camino.push(direccion);
    }

    // La posición final determina el multiplicador
    const multiplicadores = riesgoConfig.multiplicadores;
    const index = Math.min(posicion, multiplicadores.length - 1);
    const multiplicador = multiplicadores[index];

    return {
        camino,
        posicionFinal: posicion,
        multiplicador: multiplicador.toFixed(2),
        riesgo: riesgoConfig.nombre,
        emoji: riesgoConfig.emoji,
    };
}

/**
 * ==================== MINES GAME ====================
 */

/**
 * Crea un tablero de mines
 */
function crearTableroMines(serverSeed, clientSeed, nonce, cantidadMinas) {
    const config = casinoConfig.mines;

    // Validar cantidad de minas
    if (!config.minasDisponibles.includes(cantidadMinas)) {
        throw new Error('Cantidad de minas inválida');
    }

    // Crear array de posiciones (0-24)
    const posiciones = Array.from({ length: config.casillasTotal }, (_, i) => i);

    // Seleccionar posiciones de minas usando RNG
    const minas = new Set();
    let intentos = 0;

    while (minas.size < cantidadMinas && intentos < 100) {
        const random = generarNumeroAleatorio(serverSeed, clientSeed, nonce + intentos);
        const posicion = Math.floor(random * config.casillasTotal);
        minas.add(posicion);
        intentos++;
    }

    return Array.from(minas);
}

/**
 * Calcula el multiplicador actual en Mines basado en casillas reveladas
 */
function calcularMultiplicadorMines(cantidadMinas, casillasReveladas) {
    const config = casinoConfig.mines;
    const casillasSeguras = config.casillasTotal - cantidadMinas;

    // Multiplicador aumenta con cada casilla segura revelada
    // Formula: (casillasTotal / casillasSeguras) ^ casillasReveladas * (1 - houseEdge)
    const base = config.casillasTotal / casillasSeguras;
    const multiplicador = Math.pow(base, casillasReveladas) * (1 - config.houseEdge);

    return Math.max(1, multiplicador).toFixed(2);
}

/**
 * ==================== ROULETTE GAME ====================
 */

/**
 * Gira la ruleta
 */
function girarRuleta(serverSeed, clientSeed, nonce) {
    const config = casinoConfig.roulette;

    // Generar número entre 0 y 36
    const random = generarNumeroAleatorio(serverSeed, clientSeed, nonce);
    const numero = Math.floor(random * 37); // 0-36

    // Determinar color
    let color = 'verde';
    if (numero !== 0) {
        color = config.numerosRojos.includes(numero) ? 'rojo' : 'negro';
    }

    return {
        numero,
        color,
        emoji: numero === 0 ? config.emojis.green :
               color === 'rojo' ? config.emojis.red :
               config.emojis.black,
    };
}

/**
 * Verifica si una apuesta de ruleta ganó
 */
function verificarApuestaRuleta(resultado, tipoApuesta, valor) {
    const config = casinoConfig.roulette;
    const { numero, color } = resultado;

    let gano = false;
    let multiplicador = 0;

    switch (tipoApuesta) {
        case 'numero':
            gano = numero === parseInt(valor);
            multiplicador = config.tiposApuesta.numero.multiplicador;
            break;
        case 'rojo':
            gano = color === 'rojo';
            multiplicador = config.tiposApuesta.rojo.multiplicador;
            break;
        case 'negro':
            gano = color === 'negro';
            multiplicador = config.tiposApuesta.negro.multiplicador;
            break;
        case 'par':
            gano = numero !== 0 && numero % 2 === 0;
            multiplicador = config.tiposApuesta.par.multiplicador;
            break;
        case 'impar':
            gano = numero % 2 !== 0;
            multiplicador = config.tiposApuesta.impar.multiplicador;
            break;
        case 'bajo':
            gano = numero >= 1 && numero <= 18;
            multiplicador = config.tiposApuesta.bajo.multiplicador;
            break;
        case 'alto':
            gano = numero >= 19 && numero <= 36;
            multiplicador = config.tiposApuesta.alto.multiplicador;
            break;
        case 'docena1':
            gano = numero >= 1 && numero <= 12;
            multiplicador = config.tiposApuesta.docena1.multiplicador;
            break;
        case 'docena2':
            gano = numero >= 13 && numero <= 24;
            multiplicador = config.tiposApuesta.docena2.multiplicador;
            break;
        case 'docena3':
            gano = numero >= 25 && numero <= 36;
            multiplicador = config.tiposApuesta.docena3.multiplicador;
            break;
    }

    return {
        gano,
        multiplicador: gano ? multiplicador : 0,
    };
}

/**
 * ==================== SISTEMA DE RAKEBACK ====================
 */

/**
 * Calcula el nivel VIP basado en volumen apostado
 */
function calcularNivelVIP(volumenTotal) {
    const niveles = casinoConfig.rakeback.niveles;

    for (let i = niveles.length - 1; i >= 0; i--) {
        if (volumenTotal >= niveles[i].volumenRequerido) {
            return niveles[i];
        }
    }

    return niveles[0];
}

/**
 * Calcula rakeback acumulado
 */
function calcularRakeback(usuario, perdidaNeta) {
    const nivelVIP = calcularNivelVIP(usuario.casinoStats?.volumenTotal || 0);
    const rakebackPorcentaje = nivelVIP.rakeback;

    // Solo se aplica a pérdidas
    if (perdidaNeta <= 0) return 0;

    return Math.floor(perdidaNeta * rakebackPorcentaje);
}

/**
 * ==================== ESTADÍSTICAS ====================
 */

/**
 * Actualiza las estadísticas del usuario después de una apuesta
 */
async function actualizarEstadisticas(userId, juego, apuesta, ganancia, multiplicador) {
    try {
        const usuario = await User.findOne({ idusuario: userId });
        if (!usuario) return;

        // Inicializar estadísticas si no existen
        if (!usuario.casinoStats) {
            usuario.casinoStats = {
                totalApostado: 0,
                totalGanado: 0,
                totalPerdido: 0,
                mejorRacha: 0,
                rachaActual: 0,
                mayorMultiplicador: 0,
                mayorGanancia: 0,
                volumenTotal: 0,
                volumenPorJuego: {},
                apuestasPorJuego: {},
                rakeback: 0,
                nivelVIP: 0,
            };
        }

        const stats = usuario.casinoStats;
        const ganoApuesta = ganancia > apuesta;

        // Actualizar estadísticas generales
        stats.totalApostado += apuesta;
        stats.volumenTotal += apuesta;

        if (ganoApuesta) {
            const gananciaNeta = ganancia - apuesta;
            stats.totalGanado += gananciaNeta;
            stats.rachaActual++;
            stats.mejorRacha = Math.max(stats.mejorRacha, stats.rachaActual);
            stats.mayorGanancia = Math.max(stats.mayorGanancia, gananciaNeta);
        } else {
            const perdidaNeta = apuesta - ganancia;
            stats.totalPerdido += perdidaNeta;
            stats.rachaActual = 0;

            // Acumular rakeback
            const rakeback = calcularRakeback(usuario, perdidaNeta);
            stats.rakeback += rakeback;
        }

        // Actualizar mayor multiplicador
        if (multiplicador) {
            stats.mayorMultiplicador = Math.max(stats.mayorMultiplicador, parseFloat(multiplicador));
        }

        // Actualizar estadísticas por juego
        if (!stats.volumenPorJuego[juego]) {
            stats.volumenPorJuego[juego] = 0;
            stats.apuestasPorJuego[juego] = 0;
        }
        stats.volumenPorJuego[juego] += apuesta;
        stats.apuestasPorJuego[juego]++;

        // Actualizar nivel VIP
        stats.nivelVIP = calcularNivelVIP(stats.volumenTotal).nivel;

        await usuario.save();

        return stats;
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
        return null;
    }
}

/**
 * Obtiene el mensaje psicológico apropiado
 */
function obtenerMensajePsicologico(tipo, contexto = {}) {
    const mensajes = casinoConfig.mensajes;

    switch (tipo) {
        case 'casiGanas':
            return mensajes.casiGanas[Math.floor(Math.random() * mensajes.casiGanas.length)];
        case 'rachaPerdidas':
            return mensajes.rachaPerdidas[Math.floor(Math.random() * mensajes.rachaPerdidas.length)];
        case 'gananciaGrande':
            return mensajes.gananciaGrande[Math.floor(Math.random() * mensajes.gananciaGrande.length)];
        default:
            return '';
    }
}

/**
 * Verifica si fue "casi ganancia" para mensajes psicológicos
 */
function verificarCasiGanancia(juego, resultado) {
    switch (juego) {
        case 'crash':
            // Si cashout fue dentro del 10% del crash
            return resultado.cashoutMultiplicador &&
                   (resultado.crashPoint - resultado.cashoutMultiplicador) / resultado.crashPoint < 0.1;

        case 'dice':
            // Si el número estuvo dentro del 5% del objetivo
            return Math.abs(resultado.resultado - resultado.objetivo) < 5;

        case 'slots':
            // Si hay 2 símbolos iguales
            return resultado.rodillos[0] === resultado.rodillos[1] ||
                   resultado.rodillos[1] === resultado.rodillos[2];

        default:
            return false;
    }
}

module.exports = {
    // RNG
    generarServerSeed,
    hashServerSeed,
    generarNumeroAleatorio,

    // Crash
    calcularCrashPoint,
    simularCrashAnimacion,

    // Dice
    tirarDado,

    // Slots
    girarSlots,

    // Plinko
    jugarPlinko,

    // Mines
    crearTableroMines,
    calcularMultiplicadorMines,

    // Roulette
    girarRuleta,
    verificarApuestaRuleta,

    // Rakeback
    calcularNivelVIP,
    calcularRakeback,

    // Estadísticas
    actualizarEstadisticas,
    obtenerMensajePsicologico,
    verificarCasiGanancia,
};
