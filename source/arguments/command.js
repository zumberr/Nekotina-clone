// readdirSync Module
const { readdirSync } = require("fs")

// Propiedades del Discord.js
const { Client } = require("discord.js")

/**
 * @param {Client} client
 * @returns
 */

// Exportacion del Comando
module.exports = async (client) => {
    // Requerir los comandos
    readdirSync("./source/commands/").forEach(dir => {
        // Obtener la carpeta de los comandos
        const commands = readdirSync(`./source/commands/${dir}/`).filter(file => file.endsWith(".js"));

        // Archivos de los Comandos
        for (const file of commands) {
            // Obtener los comandos completamente
            const commander = require(`../commands/${dir}/${file}`);
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
            // Modulos de los comandos
            if(commander.name) {
                // Establecer name para los comandos
                client.commands.set(commander.name, commander);
            // Terminar "commander.name"
            }
            
            // Definir "usage" de los comandos
            if(commander.usage) {
                String;
            // Terminar "commanderusage"
            }

            // Definir "example" de los comandos
            if(commander.example) {
                String;
            // Terminar "commander.example"
            }
            //codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
            // Definir "aliases" en los comandos
            if(commander.aliases) {
                // Array Aliases
                Array.isArray(commander.aliases)
                // Aliases forEach
                commander.aliases.forEach(async (alias) => {
                    // Establecer aliases como "commander.name"
                    await client.aliases.set(alias, commander.name)
                // Finalizar "aliases"
                })
            // Registrar los comandos en la consola
            };

            // Console Logger
            console.log(`${dir} || ${file} ha iniciado correctamente.`)
        }
    })
}