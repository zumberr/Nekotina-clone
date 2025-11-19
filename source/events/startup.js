// Exportar "Client & Logging" de main.js
const client = require("../main");
const logger = require("../logger");
const chalk = require("chalk");
// Realizar al iniciar
client.on("ready", () => {
    // Console Logger
    logger.info(`Sally se ha iniciado correctamente`);

    client.user.setActivity({ name: `discord.gg/seelyrandom! | !help`, type: "LISTENING" });

    // Inicializar el manager de música de Lavalink
    if (client.manager) {
        client.manager.init(client.user.id);
        logger.info("Sistema de música Lavalink inicializado correctamente");
    }

    ///
    //codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
    // ———————————————[Ready MSG]———————————————

});