const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "resume",
    aliases: ["reanudar", "continuar"],
    description: "Reanuda la música pausada",
    category: "music",
    usage: "",
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

        if (!player.paused) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("ORANGE")
                    .setDescription("▶️ La música no está pausada.")
                ]
            });
        }

        player.pause(false);

        message.reply({
            embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription("▶️ Música reanudada.")
            ]
        });
    }
};
