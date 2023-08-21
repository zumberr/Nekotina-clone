// FS (Fetch Support)
const fetch = require("fs")

// Propiedades de Discord.js
const { Client } = require("discord.js")

/**
 * @param {Client} client 
 * @returns 
 */

// Inicio del interaction.js
module.exports = async (client) => {
    // Intentar ejecutar este codigo
    try {
        // Lista de comandos predeterminados
        let command = 0;

        // Array Interaction
        let inteArray = [];

        // Buscar los comandos
        fetch.readdirSync("./source/scommands/").forEach(dir => {
            // Obtener los comandos
            const commands = fetch.readdirSync(`./source/scommands/${dir}/`).filter(file => file.endsWith(".js"));
            
            // Archivos de los comandos
            for (const file of commands) {
                // Obtener los comandos completamente
                const commander = require(`../scommands/${dir}/${file}`);

                // Modulos de los comandos
                if(commander.name) {
                    // Establecer el nombre de los comandos
                    client.scommands.set(commander.name, commander);
                    inteArray.push(commander);
                    command++;
                }

                // Al iniciar buscar los comandos
                client.on("ready", async () => {
                    client.guilds.cache.forEach(async (scommand) => {
                        await client.guilds.cache.get(scommand.id).commands.set(inteArray);
                    })
                })

                // Console Logger
                console.log(`${dir} || ${file} ha iniciado correctamente (SlashCommands)`)
            }
        })
    // En caso de que no se pueda ejecutar mandar a la consola lo siguiente
    } catch(error) {
        // Devolver el error
        return console.error(error)
    }
}


