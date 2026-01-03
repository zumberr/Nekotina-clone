const { v4: uuidv4 } = require('uuid');
const economyConfig = require('../config/economy');

/**
 * Define catálogo de mascotas básicas.
 * Para escalabilidad, se podría extraer a config dedicada.
 */
const CATALOGO_DEFAULT = [
    {
        id: 'kitsune',
        nombre: 'Kitsune Mística',
        rareza: 'legendaria',
        emoji: '🦊',
        precio: 75000,
        engancheDisponible: true,
        minimoEnganche: 0.25,
        maximoEnganche: 0.4,
        estadisticas: {
            hambre: { base: 10 },
            felicidad: { base: 85 },
            energia: { base: 80 },
        },
        bonificadores: {
            daily: 0.08,
            work: 0.1,
        },
    },
    {
        id: 'axolotl',
        nombre: 'Axolotl Chill',
        rareza: 'epica',
        emoji: '🐡',
        precio: 42000,
        engancheDisponible: true,
        minimoEnganche: 0.2,
        maximoEnganche: 0.35,
        estadisticas: {
            hambre: { base: 20 },
            felicidad: { base: 75 },
            energia: { base: 85 },
        },
        bonificadores: {
            daily: 0.05,
            work: 0.04,
        },
    },
    {
        id: 'penguin',
        nombre: 'Pingüino Gamer',
        rareza: 'rara',
        emoji: '🐧',
        precio: 31000,
        engancheDisponible: true,
        minimoEnganche: 0.18,
        maximoEnganche: 0.3,
        estadisticas: {
            hambre: { base: 18 },
            felicidad: { base: 85 },
            energia: { base: 70 },
        },
        bonificadores: {
            daily: 0.03,
            work: 0.02,
        },
    },
    {
        id: 'cat',
        nombre: 'Gatito Ciberpunk',
        rareza: 'comun',
        emoji: '🐱',
        precio: 15000,
        engancheDisponible: false,
        estadisticas: {
            hambre: { base: 25 },
            felicidad: { base: 75 },
            energia: { base: 75 },
        },
        bonificadores: {
            daily: 0.02,
            work: 0,
        },
    },
    {
        id: 'slime',
        nombre: 'Slime Luminoso',
        rareza: 'comun',
        emoji: '🟢',
        precio: 9000,
        engancheDisponible: false,
        estadisticas: {
            hambre: { base: 30 },
            felicidad: { base: 65 },
            energia: { base: 90 },
        },
        bonificadores: {
            daily: 0.01,
            work: 0.01,
        },
    },
];

function obtenerCatalogo() {
    return CATALOGO_DEFAULT;
}

function buscarMascotaPorId(id) {
    return obtenerCatalogo().find(p => p.id === id);
}

function crearMascotaInstancia(petBase) {
    const mascota = {
        petId: uuidv4(),
        tipo: petBase.id,
        rareza: petBase.rareza,
        nombre: petBase.nombre,
        emoji: petBase.emoji,
        hambre: petBase.estadisticas?.hambre?.base ?? 20,
        felicidad: petBase.estadisticas?.felicidad?.base ?? 70,
        energia: petBase.estadisticas?.energia?.base ?? 70,
        nivel: 1,
        experiencia: 0,
        buffActivo: {
            tipo: null,
            valor: 0,
            expira: null,
        },
        historial: [],
    };
    return mascota;
}

function clamp(valor, min, max) {
    if (typeof valor !== 'number') return min;
    return Math.max(min, Math.min(max, valor));
}

function aplicarAccionMascota(mascota, accion, opciones = {}) {
    const accionesConfig = economyConfig.mascotas?.acciones || {};
    const data = accionesConfig[accion];
    if (!data) return mascota;

    const updated = { ...mascota };

    if (typeof data.costo === 'number') {
        if (opciones.descuento) {
            updated.costoAplicado = Math.max(Math.floor(data.costo * (1 - opciones.descuento)), 0);
        } else {
            updated.costoAplicado = data.costo;
        }
    }

    if (typeof data.efectoHambre === 'number') {
        updated.hambre = clamp(updated.hambre + data.efectoHambre, 0, economyConfig.mascotas.hambreMax);
    }

    if (typeof data.efectoFelicidad === 'number') {
        updated.felicidad = clamp(updated.felicidad + data.efectoFelicidad, 0, economyConfig.mascotas.felicidadMax);
    }

    if (typeof data.efectoEnergia === 'number') {
        updated.energia = clamp(updated.energia + data.efectoEnergia, 0, economyConfig.mascotas.energiaMax);
    }

    if (accion === 'jugar') {
        updated.experiencia = (updated.experiencia || 0) + 8;
    }

    if (accion === 'alimentar') {
        updated.experiencia = (updated.experiencia || 0) + 5;
    }

    updated.ultimaInteraccion = new Date();
    updated.historial = Array.isArray(updated.historial) ? [...updated.historial] : [];
    updated.historial.push({
        fecha: new Date(),
        accion,
        cambio: JSON.stringify({ hambre: updated.hambre, felicidad: updated.felicidad, energia: updated.energia }),
    });

    return updated;
}

function aplicarDecaimiento(mascota) {
    const config = economyConfig.mascotas;
    if (!config) return mascota;

    const actualizado = { ...mascota };
    actualizado.hambre = clamp((actualizado.hambre || 0) + (config.decayValores?.hambre ?? 0), 0, config.hambreMax);
    actualizado.felicidad = clamp((actualizado.felicidad || 0) - (config.decayValores?.felicidad ?? 0), 0, config.felicidadMax);
    actualizado.energia = clamp((actualizado.energia || 0) - (config.decayValores?.energia ?? 0), 0, config.energiaMax);

    actualizado.historial = Array.isArray(actualizado.historial) ? [...actualizado.historial] : [];
    actualizado.historial.push({
        fecha: new Date(),
        accion: 'decaimiento',
        cambio: JSON.stringify({ hambre: actualizado.hambre, felicidad: actualizado.felicidad, energia: actualizado.energia }),
    });

    return actualizado;
}

function evaluarEstado(mascota) {
    const estados = economyConfig.mascotas?.estados || {};
    const resultado = [];
    if (estados.feliz && (mascota.felicidad || 0) >= estados.feliz.minimoFelicidad) {
        resultado.push({ clave: 'feliz', ...estados.feliz });
    }
    if (estados.hambriento && (mascota.hambre || 0) >= estados.hambriento.minimoHambre) {
        resultado.push({ clave: 'hambriento', ...estados.hambriento });
    }
    if (estados.cansado && (mascota.energia || 0) <= estados.cansado.minimoEnergia) {
        resultado.push({ clave: 'cansado', ...estados.cansado });
    }
    return resultado;
}

function calcularBonosMascotas(mascotas = []) {
    return mascotas.reduce((ac, pet) => {
        const base = buscarMascotaPorId(pet.tipo);
        if (!base || !base.bonificadores) return ac;
        if (typeof base.bonificadores.daily === 'number') {
            ac.daily += base.bonificadores.daily;
        }
        if (typeof base.bonificadores.work === 'number') {
            ac.work += base.bonificadores.work;
        }
        return ac;
    }, { daily: 0, work: 0 });
}

function siguienteNivel(mascota) {
    const nivel = mascota.nivel || 1;
    return 50 + nivel * 25;
}

function procesarExperiencia(mascota, expGanada) {
    const actualizado = { ...mascota };
    actualizado.experiencia = (actualizado.experiencia || 0) + expGanada;
    let xpNecesaria = siguienteNivel(actualizado);
    while (actualizado.experiencia >= xpNecesaria) {
        actualizado.experiencia -= xpNecesaria;
        actualizado.nivel = (actualizado.nivel || 1) + 1;
        xpNecesaria = siguienteNivel(actualizado);
    }
    return actualizado;
}

module.exports = {
    obtenerCatalogo,
    buscarMascotaPorId,
    crearMascotaInstancia,
    aplicarAccionMascota,
    aplicarDecaimiento,
    evaluarEstado,
    calcularBonosMascotas,
    procesarExperiencia,
};
