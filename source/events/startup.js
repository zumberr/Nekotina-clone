// Exportar "Client & Logging" de main.js
const client = require("../main");
const chalk = require("chalk");
// Realizar al iniciar
client.on("ready", () => {
    // Console Logger
    console.log(`Lenita se ha iniciado correctamente`);
    
    client.user.setActivity({ name: `discord.gg/seelyrandom! | !help`, type: "LISTENING" });
    ///
    //codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
    // ———————————————[Ready MSG]———————————————
   
});