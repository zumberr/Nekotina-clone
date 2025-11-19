const { MessageEmbed } = require("discord.js");
const Usuarios = require("../../models/userSchema");
const gemasUtils = require("../../utils/gemasUtils");
const economyConfig = require("../../config/economy");

module.exports = {
    name: "gemas",
    usage: "gemas [usuario]",
    aliases: ["gems", "premium"],
    cooldown: 0,
    example: "gemas",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Ver tu balance de gemas (tokens premium) y formas de obtenerlas.",

    async run(client, message, args, prefix) {
        try {
            // Obtener el usuario objetivo
            const targetMember = message.mentions.members.first() ||
                                message.guild.members.cache.get(args[0]) ||
                                message.member;

            // Obtener datos del usuario desde MongoDB
            let userData = await Usuarios.findOne({ idusuario: targetMember.id });

            if (!userData) {
                // Crear usuario si no existe
                userData = new Usuarios({
                    idusuario: targetMember.id,
                    username: targetMember.user.tag,
                    dinero: 0,
                    banco: 0,
                    total: 0,
                    gemas: 0
                });
                await userData.save();
            }

            const gemas = userData.gemas || 0;

            // Obtener formas de obtener gemas y usos
            const formasObtener = gemasUtils.obtenerFormasObtenerGemas();
            const usos = gemasUtils.obtenerUsosGemas();

            // Crear embed principal
            const embed = new MessageEmbed()
                .setColor(economyConfig.colores.gemas)
                .setAuthor({
                    name: `${economyConfig.emojis.gemas} Gemas de ${targetMember.user.tag}`,
                    iconURL: targetMember.user.displayAvatarURL({ dynamic: true })
                })
                .setDescription(`**Balance de Gemas:** ${gemasUtils.formatearGemas(gemas)}\n\nLas gemas son tokens premium que no se pueden comprar con dinero del juego. Solo se obtienen por logros especiales.`)
                .setTimestamp();

            // Agregar formas de obtener gemas
            let formasText = "";
            formasObtener.forEach(forma => {
                formasText += `${economyConfig.emojis.gemas} **${forma.nombre}** - \`${forma.gemas} gemas\`\n└ ${forma.descripcion}\n\n`;
            });
            embed.addField("🎯 Formas de Obtener Gemas", formasText);

            // Agregar usos de gemas
            let usosText = "";

            usosText += "**⏰ Saltar Cooldowns:**\n";
            usos.cooldowns.forEach(uso => {
                usosText += `└ ${uso.nombre}: \`${uso.costo} gemas\`\n`;
            });

            usosText += "\n**🎨 Cosméticos:**\n";
            usos.cosmeticos.forEach(uso => {
                usosText += `└ ${uso.nombre}: \`${uso.costo} gemas\`\n`;
            });

            usosText += "\n**🏦 Mejoras de Banco:**\n";
            usos.banco.forEach(uso => {
                usosText += `└ ${uso.nombre}: \`${uso.costo} gemas\`\n`;
            });

            embed.addField("💎 Usos de las Gemas", usosText);

            embed.setFooter({ text: `Usa ${prefix}shop-gemas para ver la tienda de gemas` });

            return message.reply({ embeds: [embed] });

        } catch (error) {
            console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`);
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(economyConfig.colores.error)
                    .setAuthor({ name: "❌ Error" })
                    .setDescription("Ocurrió un error al obtener las gemas. Inténtalo de nuevo.")
                ]
            });
        }
    }
};
