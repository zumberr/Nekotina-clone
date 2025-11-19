const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "stop",
    aliases: ["detener", "disconnect", "dc", "leave"],
    description: "Detiene la música y desconecta el bot",
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

        player.destroy();

        message.reply({
            embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setDescription("⏹️ Música detenida y cola limpiada. ¡Hasta luego!")
            ]
        });
    }
};
