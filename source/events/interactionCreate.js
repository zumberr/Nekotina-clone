// Cliente General
const client = require("../main");
const logger = require("../logger");

// MessageEmbed "discord.js"
const { MessageEmbed } = require("discord.js");

// Inicio del interactionCreate.js
client.on("interactionCreate", async (interaction) => {
    // Si el propietario del eject es un bot no responder
    if(interaction.user.bot) return;
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
    // Buscar la interaccion
    if(interaction.isCommand()) {
        // En caso de que ocurra un error mandar un error
        await interaction.deferReply({ ephemeral: false }).catch(() => {})

        // Encontrar los comandos creados
        let command = await client.scommands.get(interaction.commandName);

        // Interaction Args
        let args = [];

        // Buscar si el comando esta mal escrito en el codigo o algun error generado por el usuario
        if(!command) {
            // Embed Error
            return interaction.followUp({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: Slash017" })
                .setDescription("Ha ocurrido un error al ejecutar el comando.")
                ]
            })
        }

        // En caso de que el comando tenga opciones se creara lo siguiente
        for (let options of interaction.options.data) {
            // En caso de que se cree un subcomando el cliente debe hacer esto
            if(options.type === "SUB_COMMAND") {
                // Buscar el nombre
                if(options.name) {
                    // Enviar al args las opciones
                    args.push(options);
                }

                // Buscar las opciones existentes
                options.options?.forEach((x) => {
                    // Buscar el valor de las opciones
                    if(x.value) {
                        // Enviar al args los valores de las opciones
                        args.push(x.value);
                    }
                })
            // En cambio si no busque el valor de la opcion si es que existe
            } else if(options.value) {
                // Enviar al args los valores
                args.push(options.value);
            }
        }
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
        // Buscar el miembro el cual realizo la interacion
        interaction.member = interaction.guild.members.cache.get(interaction.user.id)

        // Buscar si existe el comando
        if(command) {
            // Buscar si el miembro no tiene los permisos suficientes
            if(!interaction.member.permissions.has(command.permissions || [])) {
                // Error Embed
                return interaction.followUp({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: Slash337" })
                    .setDescription(`No tienes los permisos suficientes para ejecutar este comando.\n\nPermisos requeridos:\n\` ${command.permissions}\``)
                    ]
                })
            }

            // Intentar ejecutar el comando
            try {
                // Command Runner
                command.run(client, interaction, args);
            // En caso de que ocurra un error devolver lo siguiente
            } catch(error) {
                // Error Embed
                await interaction.followUp({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: Slash000" })
                    .setDescription("Ha ocurrido un error al ejecutar el comando.")
                    ]
                })

                // Devolver el error en la consola
                return logger.error(error)
            }
        }
    }
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
    // Buscar la interacion 2
    if(interaction.isContextMenu()) {
        // Buscar el mensaje
        await interaction.deferReply({ ephemeral: false })

        // Obtener los comandos
        let command = await client.scommands.get(interaction.commandName)

        // Intentar ejecutar el comando
        try {
            // Command Runner
            command.run(client, interaction);
        // En caso de que ocurra un error devolver lo siguiente
        } catch(error) {
            // Error Embed
            await interaction.followUp({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: Slash000" })
                .setDescription("Ha ocurrido un error al ejecutar el comando.")
                ]
            })
        
            // Devolver el error en la consola
            return logger.error(error)
        }
    }
})