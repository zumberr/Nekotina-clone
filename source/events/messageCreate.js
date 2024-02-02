// Cliente General
const client = require("../main");

// Base de datos interna
const database = require("quick.db");

// Configuracion General
const config = require("../inhibitors/filter.json");

// Propiedades y clases de discord.js
const { MessageEmbed, MessageActionRow, MessageButton, Collection } = require("discord.js");

// Creación del mensaje
client.on("messageCreate", async (message) => {
    // Opciones (Message OPS Extras)
    let prefix, command, args, format;
    let cmd = command;

    // En caso de que, el mensaje no sea proveniente de algun servidor, no envies nada
    if(!message.guild) return;

    // En caso de que, el autor del mensaje sea un bot, no evies nada
    if(message.author.bot) return;

    // En caso de que, se utilice el prefix en los mensajes directos, reacciona con una "X"
    if(message.channel.type === "DM") return;

    // Base de datos interna de los prefixs
    prefix = await database.get(`prefix_${message.guild.id}`);

    // Sistema de Prefixes | En caso de que no existe un "prefix" personalizado utiliza el predeterminado
    if(prefix === null || prefix === undefined) {
        prefix = config["Configuracion General"].prefix;
    
    // En caso de que si exista utiliza el prefix personalizado
    } else {
        prefix = prefix;
    }

    // Argumentos generales de los comandos
    args = message.content.slice(prefix.length).trim().split(/ +/g);

    // Formato de argumentos de los comandos
    format = args.shift().toLowerCase();

    // En caso de que se proporcione correctamente un argumento, busca lo proporcionado en los comandos
    command = client.commands.get(format);

    // Comandos personalizados (Sección especial)
    let customCommands = await database.get(`customcommands_${message.guild.id}`);

    if(customCommands) {
        let customCommandsName = customCommands.find(x => x.name === cmd)
        if(customCommandsName) return message.reply(customCommandsName.response)
    }

    // Sistema de comandos deshabilitados (Sección especial)
    let disablecommand = await database.get(`command_${message.guild.id}`);

    if(disablecommand) {
        let commandname = disablecommand.find(x => x.name === format);
        if(commandname) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription("El comando que intentaste ejecutar actualmente esta deshabilitado/desactivado del servidor, por lo tanto, no se puede ejecutar.")
                ]
            })
        }
    }

    // Sistema de Clasificacion
    let xpranker = await client.database.get(`xprank_${message.guild.id}`);

    // En caso de que tenga "true" en la opciones del xp ranker
    if(xpranker === true) {
        xp(message)

        async function xp(message) {
            if(message.author.bot) return;
            const randomNumber = Math.floor(Math.random() * 10) + 15;
            client.database.add(`xp_${message.guild.id}_${message.author.id}`, randomNumber)
            client.database.add(`xptotal_${message.guild.id}_${message.author.id}`, randomNumber)
            var level = await client.database.get(`level_${message.guild.id}_${message.author.id}`) || 1;
            var current = await client.database.get(`xp_${message.guild.id}_${message.author.id}`);
            var xpNeeded = level * 500;
            if(xpNeeded < current) {
                var newLevel = await client.database.add(`level_${message.guild.id}_${message.author.id}`, 1)
                await client.database.subtract(`xp_${message.guild.id}_${message.author.id}`, xpNeeded);
                return message.reply(`Felicidades ${message.author}, ahora eres nivel ${newLevel}! <3 q pro`)
            }
        }
    }


    // En caso de que el usuario tenga el sistema AFK eliminado y envia un MessageEmbed
    if(database.has(`afk_${message.guild.id}_${message.author.id}`)) {
        database.delete(`afk_${message.guild.id}_${message.author.id}`)

        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Tu estado \"AFK\" ha sido deshabilitado ya que has vuelto al servidor.")
            ]
        })
    }

    // Sistema "AntiLinks"
    let antilinks = await database.get(`antilinks_${message.guild.id}`);

    // En caso de que el AntiLinks este activado, establece una funcion para el antilinks
    if(antilinks === "true") {
        function isURL(str) {
            let regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

            // Prueba si la propiedades coinciden
            if(regex.test(str)) {
                return true;
            } else {
                return false;
            }
        }

        // Ya establecida la funcion, busca gracias el regex si el contenido es una URL
        if(isURL(message.content) === true) {
            await message.delete()
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${message.author} no puedes enviar Links/URLs en el servidor.`)
                ]
            })
        }
    }

    // Sistema de "Blacklist Word's"
    let blacklist = await database.get(`blacklistword_${message.guild.id}`)

    // En caso de que el blacklist word tenga palabras, y el usuario no tenga el permiso requerido, elimina el mensaje y envia un error
    if(!message.member.permissions.has("MANAGE_MESSAGES")) {
        if(message.content.toLowerCase().includes(blacklist)) {
            await message.delete()
            return message.channel.send({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${message.author} esa palabra actualmente esta prohibida en el servidor >:c`)
                ]
            })
        }
    }

    // En caso de que se mencione al bot, responde con el siguiente MessageEmbed
    if(message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fdb4bf")
            .setDescription("Holi <3 Mi nombre es Sally. \nSoy una bot sfw multifuncional en español, fui creada para ayudar, moderar e interactuar con tu comunidad! <:emoji_5:1045809011246780427> \n\nPuedes utilizar *help para obtener toda mi lista de comandos!")
            ], components: [new MessageActionRow()
            .addComponents(new MessageButton()
            .setURL("https://discord.com/oauth2/authorize?client_id=989304688136560682&permissions=1644972474359&scope=bot%20applications.commands")
            .setLabel("Invitame <3")
            .setStyle("LINK"))
                .addComponents(new MessageButton()
            .setURL("http://discord.gg/seelyrandom")
            .setLabel("Soporte <3")
            .setStyle("LINK"))
                .addComponents(new MessageButton()
            .setURL("http://seelyrandom.xyz")
            .setLabel("Sobre mí <3")
            .setStyle("LINK"))]
        })
    }



    // En caso de que el formato tenga una longitud de "0", no envies nada
    if(format.length === 0) return;
    
    // En caso de que el contenido del mensaje solo sea el prefix (Reply Error), no envies nada
    if(message.content === prefix) return;

    // En caso de que el contenido del mensaje no empiece con el prefix, no envies nada
    if(!message.content.startsWith(prefix)) return;

    // En caso de que no se encuentren comandos con el nombre proporcionado, busca las "aliases"
    if(!command) {
        command = client.commands.get(client.aliases.get(format));
    }

    // En caso de que si exista el comando, verificaquemos los parametros antes de ejecutar el comando
    if(command) {
        // Sistema de Seguridad (OwnerOnly)
        if(command.ownerOnly) {
            // En caso de que la ID no coincida con la ID proporcionada en la configuración, envia un error
            if(!client.config.OWNERID.includes(message.author.id)) {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 1732" })
                    .setDescription(`El comando actualmente no esta disponible para el publico, las razones pueden ser las siguientes: El comando es solo para el desarollador o el comando esta en mantenimiento.`)
                    ]
                })
            }
        }

        // Sistema de espera (Cooldown)
        if(command.cooldown) {
            // En caso de que el comando no tenga cooldown, establece uno
            if(!client.cooldown.has(command.name)) {
                client.cooldown.set(command.name, new Collection());
            }

            // Obten el tiempo actual
            let current_time = Date.now();

            // Obten el cooldown establecido en el comando
            let timestamp = client.cooldown.get(command.name);

            // En caso de que tenga un cooldown
            let cooldown = (command.cooldown) * 1000;

            // En caso de que tenga un cooldown, busca si el usuario lo tiene
            if(timestamp.has(message.author.id)) {
                let expiration = timestamp.get(message.author.id) + cooldown;

                if(current_time < expiration) {
                    let timeleft = (expiration - current_time) / 1000;

                    return message.reply({
                        embeds: [new MessageEmbed()
                        .setColor("#fbd9ff")
                        .setAuthor({ name: "Error Code: 1644" })
                        .setDescription(`Por favor, espere ${timeleft.toFixed(1)} segundos para poder ejecutar el comando.`)
                        ]
                    })
                }
            }

            timestamp.set(message.author.id, current_time)
            setTimeout(() => timestamp.delete(message.author.id), cooldown)
        }
        
        // Permisos del usuario
        if(command.UserPerms) {
            if(!message.member.permissions.has(command.UserPerms || [])) {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 2000" })
                    .setDescription(`Usted actualmente no tiene los permisos suficientes para ejecutar este comando en el servidor, el comando requiere los siguientes permisos: \` ${command.UserPerms} \``)
                    ]
                })
            }
        } else if(command.ClientPerms) {
            if(!message.guild.me.permissions.has(command.ClientPerms || [])) {
                return message.reply({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 2000" })
                    .setDescription(`No tengo los permisos suficientes para ejecutar este comando en el servidor, el comando requiere los siguientes permisos: \` ${command.ClientPerms} \``)
                    ]
                })
            }
        }
    // Ya defino de que en caso de que no encuentren nombres ni aliases, no envies nada
    } else if(!command) return;

    // En caso de que el cliente no tenga el permiso de enviar mensajes, envia el siguiente embed
    if(!message.guild.me.permissions.has("SEND_MESSAGES")) {
        return message.member.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2150" })
            .setDescription(`Actualmente no tengo el permiso \` SEND_MESSAGES \`, por lo tanto no puedo enviar absolutamente nada :c`)
            ]
        }).catch(() => {
            return;
        })
    } else if(!message.guild.me.permissions.has("EMBED_LINKS")) {
        return message.member.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2150" })
            .setDescription(`Actualmente no tengo el permiso \` EMBED_LINKS \`, por lo tanto no puedo enviar absolutamente nada :c`)
            ]
        }).catch(() => {
            return;
        })
    } else if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
        return message.member.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2150" })
            .setDescription(`Actualmente no tengo el permiso \` SEND_MESSAGES \` en el canal, por lo tanto no puedo enviar absolutamente nada.`)
            ]
        }).catch(() => {
            return;
        })
    } else if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
        return message.member.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2150" })
            .setDescription(`Actualmente no tengo el permiso \` EMBED_LINKS \` en el canal, por lo tanto no puedo enviar absolutamente nada.`)
            ]
        }).catch(() => {
            return;
        })
    }

    // En caso de que absolutamente todo funcione correctamente, intenta ejecuta los comandos
    if(command) command.run(client, message, args, prefix)
})
