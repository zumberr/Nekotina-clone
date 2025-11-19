const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "skip",
    aliases: ["s", "saltar", "next"],
    description: "Salta la canción actual",
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

        if (!player.queue.current) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription("❌ No hay una canción reproduciéndose actualmente.")
                ]
            });
        }

        const currentTrack = player.queue.current;
        player.stop();

        message.reply({
            embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setTitle("⏭️ Canción saltada")
                .setDescription(`Se saltó: **${currentTrack.title}**`)
            ]
        });
    }
};
