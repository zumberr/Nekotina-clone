const { EmbedBuilder } = require("discord.js");
const { checkVC } = require("../../util/checkVC");

module.exports = {
    name: "play",
    aliases: ["p", "reproducir"],
    description: "Reproduce música en tu canal de voz",
    category: "music",
    usage: "<canción o URL>",
    cooldown: 3,

    /**
     * @param {import("../../types").ClientExt} Este es el cliente
     * @param {import("discord.js").Message} importamos de la libreria
     * @param {string[]} args
     */
    async execute(client, message, args) {
        // Verificar conexión a canal de voz
        const vcCheck = await checkVC(message);
        if (!vcCheck.status) return;
        
        // Validar argumentos
        if (!args.length) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`❌ Especifica una canción o URL\nEjemplo: \`${client.prefix}play yo tengo cuatro peines\``)
                ]
            });
        }

        /// esta es opcional pero no falta el usuario que menciona a otro y ocasiona un error a proposito
        if (message.mentions.has()) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription("⚠️ No puedes mencionar usuarios/roles como nombre de canción")
                ]
            });
        }

        const query = args.join(" ");
        const queue = client.distube.getQueue(message);
        
        try {
   
            const song = await client.distube.play(message.member.voice.channel, query, {
                member: message.member,
                textChannel: message.channel,
                message
            });


            await message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("#4B0082")
                    .setTitle("🎶 Canción añadida")
                    .setDescription(`[${song.name}](${song.url})`)
                    .addFields(
                        { name: "Duración", value: song.formattedDuration, inline: true },
                        { name: "Solicitada por", value: song.user.toString(), inline: true }
                    )
                    .setThumbnail(song.thumbnail)
                ]
            });
            
        } catch (error) {
            console.error(error);
            
            const errorMessage = {
                "NO_QUEUE": "❌ No hay canciones en reproducción",
                "NO_VOICE": "🔊 Únete a un canal de voz primero",
                "INVALID_URL": "⚠️ Enlace no válido",
                "SEARCH_NULL": "🔍 No encontré resultados"
            }[error.message] || "❌ Error desconocido";

            message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(errorMessage)
                ]
            });
        }
    }
};
