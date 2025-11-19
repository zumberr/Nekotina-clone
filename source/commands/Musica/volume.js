const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "volume",
    aliases: ["vol", "v", "volumen"],
    description: "Ajusta el volumen de la música",
    category: "music",
    usage: "<1-100>",
    cooldown: 3,

    async execute(client, message, args) {
        const player = client.manager.get(message.guild.id);

        if (!player) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription("❌ No hay música reproduciéndose en este servidor.")
                ]
            });
        }

        const vcCheck = checkSameVoiceChannel(message.member, player);
        if (!vcCheck.valid) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`❌ ${vcCheck.message}`)
                ]
            });
        }

        if (!args[0]) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("#4B0082")
                    .setDescription(`🔊 Volumen actual: **${player.volume}%**\n\nUso: \`${client.config.prefix}volume <1-100>\``)
                ]
            });
        }

        const volume = parseInt(args[0]);

        if (isNaN(volume) || volume < 1 || volume > 100) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription("❌ El volumen debe ser un número entre 1 y 100.")
                ]
            });
        }

        player.setVolume(volume);

        const volumeEmoji = volume < 33 ? "🔉" : volume < 66 ? "🔊" : "📢";

        message.reply({
            embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`${volumeEmoji} Volumen ajustado a **${volume}%**`)
            ]
        });
    }
};
