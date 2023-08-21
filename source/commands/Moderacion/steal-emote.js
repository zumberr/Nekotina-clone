const { MessageEmbed, Util } = require("discord.js")

module.exports = {
    name: "steal-emote",
    usage: "steal-emote <emote> <new_name>",
    aliases: ["steal"],
    cooldown: 0,
    example: "",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS_AND_STICKERS"],
    description: "Robar un emote de otro servidor para agregarlos a tu servidor.",
    async run(client, message, args, prefix) {
    try {
    let custom;
    let emojiURL;
    let serverEmoji;
    let newEmojiName;

    newEmojiName = args[0] ? args[0].replace(/[^a-z0-9]/gi, "") : null;
    serverEmoji = args[1];

    custom = Util.parseEmoji(serverEmoji);

    if(!serverEmoji) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: AQN-845"})
            .setDescription("No se ha proporcionado el emote/emoji. \n\nUso correcto del comando: \n` steal-emote | steal <new_name> <emote> `")
            ])
        })
    } else if(!newEmojiName) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: AQN-462"})
            .setDescription("No se ha proporcionado el nombre del emoji/emote. \n\nUso correcto del comando: \n` steal-emote | steal <new_name> <emote> `")
            ])
        })
    } else if(newEmojiName.length < 2) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: AQN-463"})
            .setDescription("Se ha proporcionado menos de 2 caracteres, por lo tanto, no se ha podido crear el emoji/emote.")
            ])
        })
    } else if(newEmojiName.length > 32) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: AQN-464"})
            .setDescription("Se ha proporcionado mas de 32 caracteres, por lo tanto, no se ha podido crear el emoji/emote.")
            ])
        })
    } else if(custom.id) {
        emojiURL = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`

        message.guild.emojis
        .create(emojiURL, newEmojiName)
        .then((serverEmoji) => {
            return message.reply({
                embeds: ([new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`${serverEmoji} se ha asignado/agregado al servidor ${message.guild.name} correctamente.`)
                ])
            })
            .catch((err) => {

                console.log(`${err} || ${this.name} || ${message} || ${message.author}`);

                return message.reply({
                    embeds: ([new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: 4222"})
                    .setDescription(`No he podido asignar/agregar el emote porque no quedan mas espacios para agregar el emote/emoji.`)
                    ])
                })
            })
        })
    } else {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2631"})
            .setDescription("No se ha proporcionado un emoji/emote personalizado, o sea, de un servidor.")
            ])
        }).catch((err) => {
            console.log(`${err} || ${this.name} || ${message} || ${message.author}`);
            
            return message.reply({
                embeds: ([new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4222" })
                .setDescription(`No he podido asignar/agregar el emote porque no quedan mas espacios para agregar el emote/emoji.`)
                ])
            })
        })
    }
   } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}