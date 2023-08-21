// readdirSync Module
const { Client, Message } = require("discord.js")
const { readdirSync } = require("fs")

/**
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */

// Exportacion del Eventer
module.exports = (client) => {
    // Requerir los eventos
    readdirSync("./source/events/").forEach((file) => {
        // Obtener la carpeta de los eventos
        const events = readdirSync(`./source/events/`).filter(file => file.endsWith(".js"));

        // Archivos de los eventos
        for (const file of events) {
            // Obtener los eventos completamente
            const events = require(`../events/${file}`);
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
            // Modulos de los eventos
            if(events.name) {
                // Establecer name para los eventos
               client.events.set(events.name, events);
            // Terminar "events.name"
            }
        }
    })
}