const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "enlearn",
    usage: "enlearn <info | test> <No Args>",
    aliases: [""],
    cooldown: 2,
    example: "enlearn info <No Args> | enlearn test <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre el curso de ingles de Lenita.",
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
            .setAuthor({ name: "Aprende ingles conmigo!" })
            .setDescription("\n**CURSOS GRATUITOS**\n <a:pointlena:1053074864036139038> Los cursos están separados por niveles y lecciones; \nActualmente cuento con el nivel A (A1 y A2) disponibles sin paga para el publico, este nivel tiene 20 lecciones. \n <a:pointlena:1053074864036139038> El para aprender este nivel es *enlearna <lección>. Las primeras 10 lecciones son A1 y las siguientes a esta, corresponden al nivel A2.\n <a:pointlena:1053074864036139038> En cada lección podrás encontrar un link para repasar el contenido.\n <a:pointlena:1053074864036139038> Recuerda que aprender un idioma es todo un proceso de constancia y dedicación, aquí solo aprenderás el vocabulario y la gramática. Poco a poco verás mejoría con la práctica!")
            ]
        })
    } else if(format === "test") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff") 
            .setDescription(`Haz click en el boton para hacer un test y confirmar tu nivel de ingles`)
            ], components: [new MessageActionRow().addComponents(new MessageButton().setURL('https://www.cambridgeenglish.org/es/test-your-english/').setStyle("LINK").setLabel("Test"))]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}