const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "policy",
    usage: "policy | py <No ARGS>",
    aliases: ["py"],
    cooldown: 25,
    example: "policy | py <No ARGS>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre la politica de privacidad de Lena.",
    async run(client, message, args, prefix) {
   try {
    return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setDescription(`A continuacion, se mostrara en una lista toda la informacion proporcionada.
\n¿Que datos almacena Lena?
El cliente no almacena ninguna información personal relacionado con su cuenta, como por ejemplo: Correo Eletronico, Numero de Telefono, entre más. Los datos almacenados incluyen las identificacionés del usuario, identificaciones del servidor, identificaciones de los canales y algunas identificaciones para la funcionalidad de los comandos de información. El cliente no solicitara ninguna información personal o cualquier acto que no este permitido en la ToS de Discord.
        
¿Por qué necesitamos ese tipo de datos?
Los datos son necesarios para el funcionamiento correcto de la bot, estas ayudan al almacenamiento de los warneos, registros, entre más. Sin estos datos, el cliente no podria realizar actividades correctamente y por lo tanto las funciones creadas serian inaccesibles para el publicó.

¿Como utilizamos estos datos almacenados?
Los datos almacenados son utilizados para obtener la información y los datos de algun miembro, canal o servidor.
        
¿Cuánto tiempo se almacena los datos?
Los datos se almacenan mientras Lena este en el servidor, en caso de que este no este en el servidor, no podra almacenar ninguna información.
        
¿Los datos almacenados son compartidos?
No, los datos no se comparten con ninguna pagina web ni nada relacionado, los datos unicamente son accesibles por los dueños de la bot.`)
        ]
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}