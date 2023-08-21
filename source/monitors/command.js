// Definir MessageEmbed de "discord.js"
const { MessageEmbed } = require("discord.js")

// Funcion de exportacion de "Help Command"
function findCommand(client, command) {
    // Funcion de busqueda
    let inf;

    // Busqueda de ejemplos
    let exampleError;

    // Busqueda de los usos
    let usageError;
    
    // Funcion de busqueda de los comandos existentes actualmente
    if (client.commands.has(command) || client.aliases.has(command)) {
        if(client.commands.has(command)) {
            inf = client.commands.get(command);
        } else {
            inf = client.commands.get(client.aliases.get(command))
        };

        // Definicion de exampleError
        if(inf.example) {
            exampleError = `${inf.example}`;
        } else {
            exampleError = "No se ha proporcionado un ejemplo."
        };

        // Definicion de usageError
        if(inf.usage) {
            usageError = `${inf.usage}`;
        } else {
            usageError = "No se ha proporcionado un Uso."
        };

        // Help Command Embed
let helpcommand = new MessageEmbed()
.setColor("#fbd9ff")
.setAuthor({ name: `Información de: ${inf.name}` })
.setDescription(`${inf.description || "El comando no tiene una descripción."}\n
**Uso(s)**
\`${usageError}\`

**Ejemplo(s)**
\`${exampleError}\`

**Cooldown**
\`${inf.cooldown || "El comando no tiene cooldown."}\`
        
**Alias(es)**
${inf.aliases.map(element => `\`${element || "El comando no tiene un alias."}\``).join("\n")}`)        
.addField("Permisos del cliente", `${inf.ClientPerms.join("\n") || "El comando no requiere permisos para el cliente."}`, true)
.addField("Permisos del usuario", `${inf.UserPerms.join("\n") || "El comando no requiere permisos de usuario."}`, true)
// Devolver al ejecutar el comando el help command embed
return helpcommand;

      // Devolver si no se ha encontrado el comando escrito
    } else if(!inf) {
        // Error Command Embed
        const errorHelp = new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: "Error Code: 2731" })
        .setDescription("¿Qué dijiste? El comando no se ha podido encontrar en mi lista de comandos.\nVerifique si se ha escrito mal el nombre o el alias del comando.")
        // Devolver el error
        return errorHelp;
    }
} // Finalizacion de la funcion de exportacion del help command

// Exportacion
module.exports = {
    findCommand
}