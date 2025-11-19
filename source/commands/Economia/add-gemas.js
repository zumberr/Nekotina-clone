const { MessageEmbed } = require("discord.js");
const Usuarios = require("../../models/userSchema");
const gemasUtils = require("../../utils/gemasUtils");
const economyConfig = require("../../config/economy");

module.exports = {
    name: "add-gemas",
    usage: "add-gemas <usuario> <cantidad>",
    aliases: ["addgems", "agregar-gemas"],
    cooldown: 0,
    example: "add-gemas @usuario 50",
    ownerOnly: true,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Agregar gemas a un usuario (Solo Owner).",

    async run(client, message, args, prefix) {
        try {
            // Obtener el usuario objetivo
            const targetMember = message.mentions.members.first() ||
                                message.guild.members.cache.get(args[0]);

            if (!targetMember) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Usuario no encontrado" })
                        .setDescription(`Debes mencionar a un usuario o proporcionar su ID.\n\n**Uso:** \`${prefix}${this.usage}\`\n**Ejemplo:** \`${prefix}${this.example}\``)
                    ]
                });
            }

            // Obtener cantidad
            const cantidad = parseInt(args[1]);

            if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
                return message.reply({
                    embeds: [new MessageEmbed()
                        .setColor(economyConfig.colores.error)
                        .setAuthor({ name: "❌ Error - Cantidad inválida" })
                        .setDescription(`Debes especificar una cantidad válida mayor a 0.\n\n**Uso:** \`${prefix}${this.usage}\`\n**Ejemplo:** \`${prefix}${this.example}\``)
                    ]
                });
            }

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
            }

            // Agregar gemas
            const gemasAntes = userData.gemas || 0;
            userData.gemas = gemasAntes + cantidad;
            await userData.save();

            // Crear embed de éxito
            const successEmbed = new MessageEmbed()
                .setColor(economyConfig.colores.success)
                .setAuthor({ name: "✅ Gemas Agregadas Exitosamente" })
                .setDescription(`Se han agregado **${cantidad}** gemas a ${targetMember.user.tag}.`)
                .addFields(
                    {
                        name: "👤 Usuario",
                        value: `${targetMember.user.tag}`,
                        inline: true
                    },
                    {
                        name: `${economyConfig.emojis.gemas} Gemas Antes`,
                        value: `\`${gemasAntes}\``,
                        inline: true
                    },
                    {
                        name: `${economyConfig.emojis.gemas} Gemas Después`,
                        value: `\`${userData.gemas}\``,
                        inline: true
                    },
                    {
                        name: "➕ Cantidad Agregada",
                        value: `\`+${cantidad}\``,
                        inline: true
                    }
                )
                .setTimestamp()
                .setFooter({ text: `Acción realizada por ${message.author.tag}` });

            return message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`);
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(economyConfig.colores.error)
                    .setAuthor({ name: "❌ Error" })
                    .setDescription("Ocurrió un error al agregar las gemas. Inténtalo de nuevo.")
                ]
            });
        }
    }
};
