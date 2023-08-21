const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "donate",
    usage: "donate <info | paypal> <No Args>",
    aliases: [""],
    cooldown: 2,
    example: "donate info <No Args> | donate paypal <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre las donaciones y el link.",
    async run(client, message, args, prefix) {
   try {
    let format;
    format = args[0];

    if(!format) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7781" })
            .setDescription(`No se ha proporcionado el formato.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(format === "info") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Información sobre las donaciones de Lena" })
            .setDescription(`Acá se responderan algunas preguntas relacionadas a las donaciones.
\n¿Que obtengo al donar?
Unicamente un agradecimiento de parte de los creadores. El bot es totalmente publico y no se tiene planeado dar beneficios a los donantes, pero si donas realmente se te agradecera mucho por tu aporte.
            
¿Que hacen con el dinero que dono?
Primero que todo, parte de eso se usaria para mejorar la calidad del host, lo que quede puede ser utiliza para cosas no relacionadas a la creación y el soporte al bot, basicamente cosas apartes.`)
            ]
        })
    } else if(format === "paypal") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff") 
            .setDescription(`Haz click en el boton para ir a la pagina de Paypal!`)
            ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.paypal.com/paypalme/zumberYT`).setStyle("LINK").setLabel("Paypal URL"))]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}