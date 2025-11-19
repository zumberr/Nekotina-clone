// readdirSync Module
const { Client } = require("discord.js")
const { readdirSync } = require("fs")

/**
 * @param {Client} client
 */

// Exportacion del Eventer
module.exports = (client) => {
    // Obtener la carpeta de los eventos
    const eventFiles = readdirSync("./source/events/").filter(file => file.endsWith(".js"));

    // Cargar cada archivo de evento
    for (const file of eventFiles) {
        // Obtener el evento completamente
        // Los eventos ahora se cargan simplemente requiriéndolos
        // Cada evento debe usar client.on() internamente
        require(`../events/${file}`);

        // Console Logger
        console.log(`Evento ${file} ha sido cargado correctamente.`);
    }
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
}