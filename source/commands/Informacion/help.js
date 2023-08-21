const { readdirSync } = require("fs");
const { findCommand } = require("../../monitors/command");
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    usage: "help | h <No Args>",
    aliases: ["h"],
    cooldown: 2,
    example: "help | h <No Args>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la lista de comandos.",
    async run(client, message, args, prefix) {
   try {
    const config = readdirSync("./source/commands/Configuracion/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../Configuracion/${command}`)
        return `\`${request.name}\``
    }).join(" ")
    
    const fun = readdirSync("./source/commands/Diversion/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../Diversion/${command}`)
        return `\`${request.name}\``
    }).join(" ")
    
    const eco = readdirSync("./source/commands/Economia/").filter((file) => file.endsWith(".js")).map((command) => {
        let request = require(`../Economia/${command}`)
        return `\`${request.name}\``
    }).join(" ")
    
        const est = readdirSync("./source/commands/Estudios/").filter((file) => file.endsWith(".js")).map((command) => {
        let request = require(`../Estudios/${command}`)
        return `\`${request.name}\``
    }).join(" ")
        
    const info = readdirSync("./source/commands/Informacion/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../Informacion/${command}`)
        return `\`${request.name}\``
    }).join(" ")
    
    const inte = readdirSync("./source/commands/Interaccion/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../Interaccion/${command}`)
        return `\`${request.name}\``
    }).join(" ")
    
    const mod = readdirSync("./source/commands/Moderacion/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../Moderacion/${command}`)
        return `\`${request.name}\``
    }).join(" ")
    
    const music = readdirSync("./source/commands/Musica/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../Musica/${command}`)
        return `\`${request.name}\``
    }).join(" ")
    
    const utility = readdirSync("./source/commands/Utilidades/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../Utilidades/${command}`)
        return `\`${request.name}\``
    }).join(" ")

    const xp = readdirSync("./source/commands/XP/").filter((file) => file.endsWith(".js")).map((command) => {
        const request = require(`../XP/${command}`)
        return `\`${request.name}\``
    }).join(" ")

    if(!args[0]) {    
        const row = new MessageActionRow()
        .addComponents(new MessageSelectMenu()
        .setCustomId("TheMenu")
        .setPlaceholder('Seleccione una categoría.')
        .addOptions({
                label: "Configuración",
                description: "Configura mi uso en tu servidor.",
                emoji: "<:configuracion:1058449746387271741>",
                value: "confighelp"
            },
            {
                label: "Diversión",
                description: "Minijuegos y comandos divertidos.",
                emoji: "<:diversion:1058449514949787748>",
                value: "funhelp"
            },
            {
                label: "Economía",
                description: "Sistema de Economía Global.",
                emoji: "<:economia:1058447554460799037>",
                value: "economyhelp"
            },
                                {
                label: "Estudios",
                description: "Te ayudo a estudiar.",
                emoji: "<:estudios:1058447682542239804>",
                value: "esthelp"
            },
            {
                label: "Información",
                description: "Comandos de Información.",
            emoji: "<:sus:1058446947675017307>",
                value: "infohelp"
            },
            {
                label: "Interacción",
                description: "Interactúa con miembros del servidor.",
            emoji: "<:pat:1058447923190452316>",
                value: "intehelp"
            },
            {
                label: "Moderación",
                description: "Te ayudo a moderar tu servidor.",
            emoji: "<:moderacion:1058446616937369611>",
                value: "modhelp"
            },
                                {
                label: "Música",
                description: "Escucha música junto a mí.",
            emoji: "<:musica:1058446855299661844>",
                value: "musichelp"
            },
            {
                label: "Utilidades",
                description: "Comandos variados que te pueden servir.",
            emoji: "<:utilidades:1058447032970379364>",
                value: "utilyhelp"
            },
            {
                label: "Sistema XP",
                description: "Sistema de XP (en construcción)",
            emoji: "<:sistemxp:1058447225589596261>",
                value: "xphelp"
            }
        )
    )
    
        let fetch = await message.reply({
            embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "MI LISTA DE COMANDOS" })
                .setDescription(`⪩⪨ • Actualmente cuento con \` ${client.commands.size - 4} \` comandos prefix y Slash Commands.\nPara ver mis comandos por categoría, utiliza el selector.\nEn caso de querer información específica sobre algún comando, puede utilizar:\n ${prefix}help <comando> `)
                .addField("Categorías", "<:configuracion:1058449746387271741> Configuración ♡ \n<:diversion:1058449514949787748> Diversión ♡\n<:economia:1058447554460799037> Economía ♡\n<:estudios:1058447682542239804> Estudios ♡\n<:sus:1058446947675017307> Información ♡\n<:pat:1058447923190452316> Interacción ♡\n<:moderacion:1058446616937369611> Moderación ♡\n<:musica:1058446855299661844> Música ♡\n<:utilidades:1058447032970379364> Utilidades ♡\n<:sistemxp:1058447225589596261> Sistema XP ♡")
                     .setFooter("© Lenita Help") 
            ], components: [row]
        })

        let ifilter = i => i.user.id === message.author.id;
        let collector = fetch.createMessageComponentCollector({ filter: ifilter, time: 70000, componentType: "SELECT_MENU" })
    
            collector.on("collect", async (i) => {
                if(i.values[0] === "confighelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Configuración" })
                    .setDescription(`En esta categoría podrás personalizar mi uso en tu servidor.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:configuracion:1058449746387271741> Comandos", `${config}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })

                
            collector.on("collect", async (i) => {
                if(i.values[0] === "funhelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Diversión" })
                    .setDescription(`Diviértete jugando a minijuegos conmigo o con miembros del servidor.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:diversion:1058449514949787748> Comandos", `${fun}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })

                
            collector.on("collect", async (i) => {
                if(i.values[0] === "economyhelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Economía" })
                    .setDescription(`Sistema global de EcoLenita.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:economia:1058447554460799037> Comandos", `${eco}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })
    
                    collector.on("collect", async (i) => {
                if(i.values[0] === "esthelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Estudios" })
                    .setDescription(`Te ayudo a estudiar y automatizo tus búsquedas, incluso puedes aprender inglés junto a mí!\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:estudios:1058447682542239804> Comandos", `${est}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })
    
            collector.on("collect", async (i) => {
                if(i.values[0] === "infohelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Información" })
                    .setDescription(`Investigo la información que requieras para fácil acceso.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:sus:1058446947675017307> Comandos", `${info}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })

            collector.on("collect", async (i) => {
                if(i.values[0] === "intehelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Interacción" })
                    .setDescription(`Vuelve tus conversaciones más entretenidas reaccionando con gifs de anime e interactuando con miembros del servidor.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:pat:1058447923190452316> Comandos", `${inte}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })
                
            collector.on("collect", async (i) => {
                if(i.values[0] === "modhelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Moderación" })
                    .setDescription(`Puedo ayudarte a moderar tu servidor realizando funciones básicas.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:moderacion:1058446616937369611> Comandos", `${mod}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })
        
                    collector.on("collect", async (i) => {
                if(i.values[0] === "musichelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Música" })
                    .setDescription(`Únete a un canal de voz y reproduzco lo que quieras escuchar!\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:musica:1058446855299661844> Comandos", `${music}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })
    
            collector.on("collect", async (i) => {
                if(i.values[0] === "utilyhelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Utilidades" })
                    .setDescription(`Algunas herramientas extras que te pueden servir.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:utilidades:1058447032970379364> Comandos", `${utility}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })

            collector.on("collect", async (i) => {
                if(i.values[0] === "xphelp") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Categoría: Sistema XP" })
                    .setDescription(`Configura y personaliza el sistema de XP de tu servidor.\nEn caso de querer obtener información sobre algun comando, puede utilizar:\n\` ${prefix}help <comando> \``)
                    .addField("<:sistemxp:1058447225589596261> Comandos", `${xp}`)
                             .setFooter("© Lenita Help") 
                    ], components: [row]
                })
            }
        })
    } else {
        const command = args[0];
        const helpcommand = findCommand(client, command, prefix)
        return message.reply({ embeds: [helpcommand] });
    }
   } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}