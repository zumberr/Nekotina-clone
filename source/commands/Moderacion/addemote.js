const { MessageEmbed, Util } = require("discord.js")

module.exports = {
    name: "addemote",
    usage: "addemote | adde <emote> <newEmote_name>",
    aliases: ["adde"],
    cooldown: 4,
    example: "",
    ownerOnly: false,
    UserPerms: ["MANAGE_EMOJIS_AND_STICKERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_EMOJIS_AND_STICKERS"],
    description: "Agregar un emote personalizado de otros servidores. (Se requiere nitro)",
    async run(client, message, args, prefix) {
   try {
    let emote, newemote, newEmoteName;
    emote = args[0];
    newEmoteName = args.slice(1).join(" ");
    
    if(!emote) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 6611" })
            .setDescription(`No se ha proporcionado el emote/emoji.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!newEmoteName) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7741" })
            .setDescription(`No se ha proporcionado el nuevo nombre del emote/emoji.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else try {
        newemote = Util.parseEmoji(emote)
        
        if(newemote.id) {
            let recovery = `https://cdn.discordapp.com/emojis/${newemote.id}.${newemote.animated ? "gif" : "png"}`;
            await message.guild.emojis.create(recovery, newEmoteName || newemote.name);

            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription(`Se ha añadido el emote/emoji al servidor correctamente.`)
                .addField("Información del emote/emoji", `Identificación del emote: ${newemote.id}
Nombre del emote: ${newEmoteName || newemote.name}
Previsualización del emote: [Click Aquí](${recovery})`)
                ]
            })
        }
    } catch(error) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4451" })
            .setDescription(`No se ha podido añadir el emote/emoji al servidor.`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}