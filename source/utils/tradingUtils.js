/**
 * Utilidades del Sistema de Trading
 * Manejo de stocks ficticios, crypto real, opciones, y portafolios
 */

const axios = require('axios');
const tradingConfig = require('../config/trading');
const User = require('../models/userSchema');

// Cache para precios de crypto (evitar rate limit)
const cryptoCache = new Map();
const CACHE_DURATION = tradingConfig.crypto.api.cacheDuration;

// Almacenamiento de precios de stocks (en memoria por ahora)
const stockPrices = new Map();
const stockHistory = new Map();

/**
 * ==================== CRYPTO - COINGECKO API ====================
 */

/**
 * Obtiene precios de criptomonedas desde CoinGecko
 * @param {string|string[]} coinIds - ID(s) de la moneda
 * @returns {Object} Precios en USD
 */
async function obtenerPreciosCrypto(coinIds) {
    const ids = Array.isArray(coinIds) ? coinIds.join(',') : coinIds;
    const cacheKey = `crypto_${ids}`;

    // Verificar cache
    const cached = cryptoCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        const response = await axios.get(
            `${tradingConfig.crypto.api.baseUrl}${tradingConfig.crypto.api.endpoints.price}`,
            {
                params: {
                    ids,
                    vs_currencies: 'usd',
                    include_24hr_change: true,
                    include_market_cap: true,
                },
                timeout: 5000,
            }
        );

        // Guardar en cache
        cryptoCache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
        });

        return response.data;
    } catch (error) {
        console.error('Error obteniendo precios de CoinGecko:', error.message);

        // Si falla, devolver cache antiguo si existe
        if (cached) {
            return cached.data;
        }

        throw new Error('No se pudo obtener precio de crypto');
    }
}

/**
 * Obtiene datos de mercado detallados de una crypto
 */
async function obtenerDatosMercadoCrypto(coinId) {
    const cacheKey = `market_${coinId}`;

    // Verificar cache
    const cached = cryptoCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    try {
        const response = await axios.get(
            `${tradingConfig.crypto.api.baseUrl}/coins/${coinId}`,
            {
                params: {
                    localization: false,
                    tickers: false,
                    community_data: false,
                    developer_data: false,
                },
                timeout: 5000,
            }
        );

        const data = {
            precio: response.data.market_data.current_price.usd,
            cambio24h: response.data.market_data.price_change_percentage_24h,
            alto24h: response.data.market_data.high_24h.usd,
            bajo24h: response.data.market_data.low_24h.usd,
            volumen: response.data.market_data.total_volume.usd,
            marketCap: response.data.market_data.market_cap.usd,
        };

        cryptoCache.set(cacheKey, {
            data,
            timestamp: Date.now(),
        });

        return data;
    } catch (error) {
        console.error('Error obteniendo datos de mercado:', error.message);
        throw new Error('No se pudo obtener datos de mercado');
    }
}

/**
 * ==================== STOCKS FICTICIOS ====================
 */

/**
 * Inicializa los precios de las acciones ficticias
 */
function inicializarStocks() {
    for (const empresa of tradingConfig.stocks.empresas) {
        if (!stockPrices.has(empresa.ticker)) {
            stockPrices.set(empresa.ticker, empresa.precioInicial);
            stockHistory.set(empresa.ticker, [
                {
                    precio: empresa.precioInicial,
                    timestamp: Date.now(),
                },
            ]);
        }
    }
}

/**
 * Calcula el nuevo precio de una acción basado en actividad del servidor
 * @param {string} ticker - Símbolo de la acción
 * @param {Object} actividadServidor - Métricas de actividad
 */
function calcularPrecioStock(ticker, actividadServidor = {}) {
    const empresa = tradingConfig.stocks.empresas.find(e => e.ticker === ticker);
    if (!empresa) return null;

    const precioActual = stockPrices.get(ticker) || empresa.precioInicial;

    // Factores que afectan el precio
    const factores = tradingConfig.stocks.factoresActividad;

    // Calcular cambio basado en actividad
    let cambioActividad = 0;

    // Factor de mensajes (más mensajes = más precio)
    if (actividadServidor.mensajes) {
        const mensajesNormalizados = Math.min(actividadServidor.mensajes / 100, 1);
        cambioActividad += mensajesNormalizados * factores.mensajes * empresa.factorActividad;
    }

    // Factor de usuarios en voz
    if (actividadServidor.usuariosVoz) {
        const vozNormalizada = Math.min(actividadServidor.usuariosVoz / 20, 1);
        cambioActividad += vozNormalizada * factores.usuariosVoz * empresa.factorActividad;
    }

    // Factor de boosts
    if (actividadServidor.boosts) {
        const boostsNormalizados = Math.min(actividadServidor.boosts / 10, 1);
        cambioActividad += boostsNormalizados * factores.boosts * empresa.factorActividad;
    }

    // Factor aleatorio (simula mercado)
    const randomChange = (Math.random() - 0.5) * 2; // -1 a 1
    cambioActividad += randomChange * factores.randomness;

    // Aplicar volatilidad de la empresa
    const cambioPorcentual = cambioActividad * empresa.volatilidad;

    // Calcular nuevo precio
    let nuevoPrecio = precioActual * (1 + cambioPorcentual);

    // Evitar precios negativos o demasiado bajos
    nuevoPrecio = Math.max(nuevoPrecio, empresa.precioInicial * 0.1);

    // Actualizar precio y historial
    stockPrices.set(ticker, nuevoPrecio);

    // Guardar en historial
    const history = stockHistory.get(ticker) || [];
    history.push({
        precio: nuevoPrecio,
        timestamp: Date.now(),
        cambio: cambioPorcentual,
    });

    // Mantener solo últimas 1000 entradas
    if (history.length > 1000) {
        history.shift();
    }

    stockHistory.set(ticker, history);

    return {
        precio: nuevoPrecio,
        cambio: cambioPorcentual,
        precioAnterior: precioActual,
    };
}

/**
 * Obtiene el precio actual de una acción
 */
function obtenerPrecioStock(ticker) {
    const empresa = tradingConfig.stocks.empresas.find(e => e.ticker === ticker);
    if (!empresa) return null;

    const precio = stockPrices.get(ticker) || empresa.precioInicial;
    const history = stockHistory.get(ticker) || [];

    // Calcular cambio desde hace 24h (o desde inicio si no hay suficiente historial)
    let cambio24h = 0;
    if (history.length >= 2) {
        const hace24h = Date.now() - 86400000;
        const precioHistorico = history.find(h => h.timestamp <= hace24h);

        if (precioHistorico) {
            cambio24h = ((precio - precioHistorico.precio) / precioHistorico.precio) * 100;
        } else {
            // Usar el precio más antiguo disponible
            cambio24h = ((precio - history[0].precio) / history[0].precio) * 100;
        }
    }

    return {
        precio,
        cambio24h,
        alto24h: Math.max(...history.slice(-288).map(h => h.precio)), // Últimas 24h (cada 5min)
        bajo24h: Math.min(...history.slice(-288).map(h => h.precio)),
        empresa,
    };
}

/**
 * Obtiene historial de precios para crear gráficas
 */
function obtenerHistorialStock(ticker, periodo = '24h') {
    const history = stockHistory.get(ticker) || [];

    let filteredHistory = history;

    // Filtrar por período
    switch (periodo) {
        case '1h':
            filteredHistory = history.filter(h => h.timestamp > Date.now() - 3600000);
            break;
        case '24h':
            filteredHistory = history.filter(h => h.timestamp > Date.now() - 86400000);
            break;
        case '7d':
            filteredHistory = history.filter(h => h.timestamp > Date.now() - 604800000);
            break;
        case '30d':
            filteredHistory = history.filter(h => h.timestamp > Date.now() - 2592000000);
            break;
    }

    return filteredHistory;
}

/**
 * ==================== SISTEMA DE OPCIONES (CALLS/PUTS) ====================
 */

/**
 * Crea una opción (call o put)
 */
async function crearOpcion(userId, tipo, activo, monto, duracionIndex) {
    const usuario = await User.findOne({ idusuario: userId });
    if (!usuario) throw new Error('Usuario no encontrado');

    // Validar tipo
    if (!['call', 'put'].includes(tipo)) {
        throw new Error('Tipo de opción inválido');
    }

    // Validar timeframe
    const timeframe = tradingConfig.options.timeframes[duracionIndex];
    if (!timeframe) {
        throw new Error('Duración inválida');
    }

    // Verificar fondos
    const costoTotal = monto + (monto * tradingConfig.options.prima);
    if (usuario.dinero < costoTotal) {
        throw new Error('Fondos insuficientes');
    }

    // Verificar límite de opciones activas
    if (!usuario.tradingData) {
        usuario.tradingData = {
            opciones: [],
        };
    }

    const opcionesActivas = usuario.tradingData.opciones.filter(o => o.activa);
    if (opcionesActivas.length >= tradingConfig.options.maximoOpciones) {
        throw new Error(`Máximo ${tradingConfig.options.maximoOpciones} opciones activas`);
    }

    // Obtener precio actual del activo
    let precioInicial;
    let tipoActivo;

    // Determinar si es stock o crypto
    const stock = tradingConfig.stocks.empresas.find(e => e.ticker === activo.toUpperCase());
    const crypto = tradingConfig.crypto.monedas.find(c => c.ticker === activo.toUpperCase());

    if (stock) {
        precioInicial = obtenerPrecioStock(stock.ticker).precio;
        tipoActivo = 'stock';
    } else if (crypto) {
        const precios = await obtenerPreciosCrypto(crypto.id);
        precioInicial = precios[crypto.id].usd;
        tipoActivo = 'crypto';
    } else {
        throw new Error('Activo no encontrado');
    }

    // Descontar dinero
    usuario.dinero -= costoTotal;

    // Crear opción
    const opcion = {
        tipo,
        activo,
        tipoActivo,
        monto,
        prima: monto * tradingConfig.options.prima,
        precioInicial,
        multiplicador: timeframe.multiplicador,
        duracion: timeframe.duracion,
        fechaCreacion: Date.now(),
        fechaExpiracion: Date.now() + timeframe.duracion,
        activa: true,
        resultado: null,
    };

    usuario.tradingData.opciones.push(opcion);
    await usuario.save();

    return opcion;
}

/**
 * Verifica y ejecuta opciones expiradas
 */
async function verificarOpcionesExpiradas(userId) {
    const usuario = await User.findOne({ idusuario: userId });
    if (!usuario || !usuario.tradingData?.opciones) return [];

    const opcionesResueltas = [];

    for (const opcion of usuario.tradingData.opciones) {
        if (!opcion.activa || Date.now() < opcion.fechaExpiracion) continue;

        // Obtener precio final
        let precioFinal;

        if (opcion.tipoActivo === 'stock') {
            precioFinal = obtenerPrecioStock(opcion.activo).precio;
        } else {
            const crypto = tradingConfig.crypto.monedas.find(c => c.ticker === opcion.activo);
            if (crypto) {
                const precios = await obtenerPreciosCrypto(crypto.id);
                precioFinal = precios[crypto.id].usd;
            }
        }

        // Calcular cambio porcentual
        const cambioPorcentual = ((precioFinal - opcion.precioInicial) / opcion.precioInicial) * 100;

        // Determinar si ganó
        let gano = false;

        if (opcion.tipo === 'call') {
            // Call gana si el precio subió más del mínimo
            gano = cambioPorcentual > tradingConfig.options.cambioMinimo;
        } else {
            // Put gana si el precio bajó más del mínimo
            gano = cambioPorcentual < -tradingConfig.options.cambioMinimo;
        }

        // Calcular ganancia
        let ganancia = 0;
        if (gano) {
            ganancia = Math.floor(opcion.monto * opcion.multiplicador);
            usuario.dinero += ganancia;
        }

        // Marcar opción como resuelta
        opcion.activa = false;
        opcion.resultado = {
            gano,
            precioFinal,
            cambioPorcentual,
            ganancia,
            timestamp: Date.now(),
        };

        opcionesResueltas.push(opcion);
    }

    if (opcionesResueltas.length > 0) {
        await usuario.save();
    }

    return opcionesResueltas;
}

/**
 * ==================== PORTAFOLIO ====================
 */

/**
 * Calcula el valor total del portafolio de un usuario
 */
async function calcularValorPortafolio(userId) {
    const usuario = await User.findOne({ idusuario: userId });
    if (!usuario || !usuario.tradingData) {
        return {
            valorTotal: 0,
            stocks: {},
            crypto: {},
            opciones: [],
        };
    }

    let valorTotal = usuario.dinero || 0;
    const stocks = {};
    const crypto = {};

    // Calcular valor de stocks
    if (usuario.tradingData.stocks) {
        for (const [ticker, posicion] of Object.entries(usuario.tradingData.stocks)) {
            const precioActual = obtenerPrecioStock(ticker)?.precio || 0;
            const valorPosicion = posicion.cantidad * precioActual;
            const ganancia = valorPosicion - (posicion.cantidad * posicion.precioPromedio);

            stocks[ticker] = {
                cantidad: posicion.cantidad,
                precioCompra: posicion.precioPromedio,
                precioActual,
                valorPosicion,
                ganancia,
                porcentajeGanancia: (ganancia / (posicion.cantidad * posicion.precioPromedio)) * 100,
            };

            valorTotal += valorPosicion;
        }
    }

    // Calcular valor de crypto
    if (usuario.tradingData.crypto) {
        // Obtener todos los IDs de crypto que el usuario tiene
        const cryptoIds = Object.keys(usuario.tradingData.crypto).map(ticker => {
            const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker);
            return moneda?.id;
        }).filter(Boolean);

        if (cryptoIds.length > 0) {
            const precios = await obtenerPreciosCrypto(cryptoIds);

            for (const [ticker, posicion] of Object.entries(usuario.tradingData.crypto)) {
                const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker);
                if (!moneda) continue;

                const precioActual = precios[moneda.id]?.usd || 0;
                const valorPosicion = posicion.cantidad * precioActual;
                const ganancia = valorPosicion - (posicion.cantidad * posicion.precioPromedio);

                crypto[ticker] = {
                    cantidad: posicion.cantidad,
                    precioCompra: posicion.precioPromedio,
                    precioActual,
                    valorPosicion,
                    ganancia,
                    porcentajeGanancia: (ganancia / (posicion.cantidad * posicion.precioPromedio)) * 100,
                };

                valorTotal += valorPosicion;
            }
        }
    }

    return {
        valorTotal,
        efectivo: usuario.dinero,
        stocks,
        crypto,
        opciones: usuario.tradingData.opciones?.filter(o => o.activa) || [],
    };
}

/**
 * Compra un stock
 */
async function comprarStock(userId, ticker, cantidad) {
    const usuario = await User.findOne({ idusuario: userId });
    if (!usuario) throw new Error('Usuario no encontrado');

    // Obtener precio actual
    const stockData = obtenerPrecioStock(ticker);
    if (!stockData) throw new Error('Stock no encontrado');

    // Calcular costo total
    const costoTotal = stockData.precio * cantidad * (1 + tradingConfig.general.comision);

    // Verificar fondos
    if (usuario.dinero < costoTotal) {
        throw new Error('Fondos insuficientes');
    }

    // Inicializar tradingData si no existe
    if (!usuario.tradingData) {
        usuario.tradingData = {
            stocks: {},
            crypto: {},
            opciones: [],
            historial: [],
        };
    }

    if (!usuario.tradingData.stocks) {
        usuario.tradingData.stocks = {};
    }

    // Actualizar posición
    if (!usuario.tradingData.stocks[ticker]) {
        usuario.tradingData.stocks[ticker] = {
            cantidad: 0,
            precioPromedio: 0,
        };
    }

    const posicion = usuario.tradingData.stocks[ticker];
    const nuevaCantidadTotal = posicion.cantidad + cantidad;
    const nuevoPromedio = ((posicion.cantidad * posicion.precioPromedio) + (cantidad * stockData.precio)) / nuevaCantidadTotal;

    posicion.cantidad = nuevaCantidadTotal;
    posicion.precioPromedio = nuevoPromedio;

    // Descontar dinero
    usuario.dinero -= costoTotal;

    // Guardar en historial
    if (!usuario.tradingData.historial) {
        usuario.tradingData.historial = [];
    }

    usuario.tradingData.historial.push({
        tipo: 'compra',
        activo: ticker,
        tipoActivo: 'stock',
        cantidad,
        precio: stockData.precio,
        total: costoTotal,
        timestamp: Date.now(),
    });

    await usuario.save();

    return {
        ticker,
        cantidad,
        precioUnitario: stockData.precio,
        comision: costoTotal - (stockData.precio * cantidad),
        total: costoTotal,
    };
}

/**
 * Vende un stock
 */
async function venderStock(userId, ticker, cantidad) {
    const usuario = await User.findOne({ idusuario: userId });
    if (!usuario || !usuario.tradingData?.stocks?.[ticker]) {
        throw new Error('No tienes esa acción');
    }

    const posicion = usuario.tradingData.stocks[ticker];

    // Verificar que tenga suficientes acciones
    if (posicion.cantidad < cantidad) {
        throw new Error(`Solo tienes ${posicion.cantidad} acciones de ${ticker}`);
    }

    // Obtener precio actual
    const stockData = obtenerPrecioStock(ticker);
    if (!stockData) throw new Error('Stock no encontrado');

    // Calcular ganancia
    const precioVentaTotal = stockData.precio * cantidad * (1 - tradingConfig.general.comision);
    const costoCompra = posicion.precioPromedio * cantidad;
    const ganancia = precioVentaTotal - costoCompra;

    // Actualizar posición
    posicion.cantidad -= cantidad;

    // Si vendió todo, eliminar posición
    if (posicion.cantidad === 0) {
        delete usuario.tradingData.stocks[ticker];
    }

    // Agregar dinero
    usuario.dinero += precioVentaTotal;

    // Guardar en historial
    usuario.tradingData.historial.push({
        tipo: 'venta',
        activo: ticker,
        tipoActivo: 'stock',
        cantidad,
        precio: stockData.precio,
        total: precioVentaTotal,
        ganancia,
        timestamp: Date.now(),
    });

    await usuario.save();

    return {
        ticker,
        cantidad,
        precioUnitario: stockData.precio,
        precioCompra: posicion.precioPromedio,
        ganancia,
        porcentajeGanancia: (ganancia / costoCompra) * 100,
        total: precioVentaTotal,
    };
}

/**
 * Compra crypto
 */
async function comprarCrypto(userId, ticker, monto) {
    const usuario = await User.findOne({ idusuario: userId });
    if (!usuario) throw new Error('Usuario no encontrado');

    // Encontrar moneda
    const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker.toUpperCase());
    if (!moneda) throw new Error('Criptomoneda no encontrada');

    // Obtener precio
    const precios = await obtenerPreciosCrypto(moneda.id);
    const precio = precios[moneda.id].usd;

    // Calcular cantidad de crypto a comprar
    const cantidad = monto / precio;

    // Calcular costo total con comisión
    const costoTotal = monto * (1 + tradingConfig.general.comision);

    // Verificar fondos
    if (usuario.dinero < costoTotal) {
        throw new Error('Fondos insuficientes');
    }

    // Inicializar tradingData si no existe
    if (!usuario.tradingData) {
        usuario.tradingData = {
            stocks: {},
            crypto: {},
            opciones: [],
            historial: [],
        };
    }

    if (!usuario.tradingData.crypto) {
        usuario.tradingData.crypto = {};
    }

    // Actualizar posición
    if (!usuario.tradingData.crypto[ticker]) {
        usuario.tradingData.crypto[ticker] = {
            cantidad: 0,
            precioPromedio: 0,
        };
    }

    const posicion = usuario.tradingData.crypto[ticker];
    const nuevaCantidadTotal = posicion.cantidad + cantidad;
    const nuevoPromedio = ((posicion.cantidad * posicion.precioPromedio) + (cantidad * precio)) / nuevaCantidadTotal;

    posicion.cantidad = nuevaCantidadTotal;
    posicion.precioPromedio = nuevoPromedio;

    // Descontar dinero
    usuario.dinero -= costoTotal;

    // Guardar en historial
    if (!usuario.tradingData.historial) {
        usuario.tradingData.historial = [];
    }

    usuario.tradingData.historial.push({
        tipo: 'compra',
        activo: ticker,
        tipoActivo: 'crypto',
        cantidad,
        precio,
        total: costoTotal,
        timestamp: Date.now(),
    });

    await usuario.save();

    return {
        ticker,
        cantidad,
        precioUnitario: precio,
        comision: costoTotal - monto,
        total: costoTotal,
    };
}

/**
 * Vende crypto
 */
async function venderCrypto(userId, ticker, porcentaje = 100) {
    const usuario = await User.findOne({ idusuario: userId });
    if (!usuario || !usuario.tradingData?.crypto?.[ticker]) {
        throw new Error('No tienes esa criptomoneda');
    }

    const posicion = usuario.tradingData.crypto[ticker];

    // Calcular cantidad a vender
    const cantidadVender = (posicion.cantidad * porcentaje) / 100;

    if (cantidadVender <= 0) {
        throw new Error('Cantidad inválida');
    }

    // Encontrar moneda
    const moneda = tradingConfig.crypto.monedas.find(c => c.ticker === ticker.toUpperCase());
    if (!moneda) throw new Error('Criptomoneda no encontrada');

    // Obtener precio actual
    const precios = await obtenerPreciosCrypto(moneda.id);
    const precioActual = precios[moneda.id].usd;

    // Calcular ganancia
    const precioVentaTotal = (cantidadVender * precioActual) * (1 - tradingConfig.general.comision);
    const costoCompra = cantidadVender * posicion.precioPromedio;
    const ganancia = precioVentaTotal - costoCompra;

    // Actualizar posición
    posicion.cantidad -= cantidadVender;

    // Si vendió todo, eliminar posición
    if (posicion.cantidad < 0.00000001) {
        delete usuario.tradingData.crypto[ticker];
    }

    // Agregar dinero
    usuario.dinero += precioVentaTotal;

    // Guardar en historial
    usuario.tradingData.historial.push({
        tipo: 'venta',
        activo: ticker,
        tipoActivo: 'crypto',
        cantidad: cantidadVender,
        precio: precioActual,
        total: precioVentaTotal,
        ganancia,
        timestamp: Date.now(),
    });

    await usuario.save();

    return {
        ticker,
        cantidad: cantidadVender,
        precioUnitario: precioActual,
        precioCompra: posicion.precioPromedio,
        ganancia,
        porcentajeGanancia: (ganancia / costoCompra) * 100,
        total: precioVentaTotal,
    };
}

/**
 * Inicializar sistema
 */
inicializarStocks();

module.exports = {
    // Crypto
    obtenerPreciosCrypto,
    obtenerDatosMercadoCrypto,

    // Stocks
    inicializarStocks,
    calcularPrecioStock,
    obtenerPrecioStock,
    obtenerHistorialStock,

    // Opciones
    crearOpcion,
    verificarOpcionesExpiradas,

    // Portafolio
    calcularValorPortafolio,
    comprarStock,
    venderStock,
    comprarCrypto,
    venderCrypto,
};
