const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "loop",
    aliases: ["repeat", "repetir"],
    description: "Activa/desactiva el modo de repetición",
    category: "music",
    usage: "[track/queue/off]",
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

        const mode = args[0] ? args[0].toLowerCase() : null;
        let loopMode;
        let description;

        switch (mode) {
            case 'track':
            case 'cancion':
            case 'song':
                player.setTrackRepeat(true);
                player.setQueueRepeat(false);
                description = "🔂 Repetición de canción **activada**";
                break;

            case 'queue':
            case 'cola':
                player.setQueueRepeat(true);
                player.setTrackRepeat(false);
                description = "🔁 Repetición de cola **activada**";
                break;

            case 'off':
            case 'desactivar':
                player.setTrackRepeat(false);
                player.setQueueRepeat(false);
                description = "▶️ Repetición **desactivada**";
                break;

            default:
                // Toggle automático
                if (player.trackRepeat) {
                    player.setTrackRepeat(false);
                    player.setQueueRepeat(true);
                    description = "🔁 Repetición de cola **activada**";
                } else if (player.queueRepeat) {
                    player.setQueueRepeat(false);
                    description = "▶️ Repetición **desactivada**";
                } else {
                    player.setTrackRepeat(true);
                    description = "🔂 Repetición de canción **activada**";
                }
                break;
        }

        message.reply({
            embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription(description)
            ]
        });
    }
};
