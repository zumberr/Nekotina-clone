const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "pause",
    aliases: ["pausar"],
    description: "Pausa la música actual",
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

        if (player.paused) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("ORANGE")
                    .setDescription("⏸️ La música ya está pausada.")
                ]
            });
        }

        player.pause(true);

        message.reply({
            embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription("⏸️ Música pausada.")
            ]
        });
    }
};
