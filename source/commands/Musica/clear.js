const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "clear",
    aliases: ["limpiar", "clearqueue"],
    description: "Limpia toda la cola de música",
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

        if (player.queue.size === 0) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("ORANGE")
                    .setDescription("⚠️ No hay canciones en la cola para limpiar.")
                ]
            });
        }

        const queueSize = player.queue.size;
        player.queue.clear();

        message.reply({
            embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`🗑️ Se eliminaron **${queueSize}** canciones de la cola.`)
            ]
        });
    }
};
