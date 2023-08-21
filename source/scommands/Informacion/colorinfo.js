const { get } = require("axios").default;
const { MessageEmbed, CommandInteraction } = require("discord.js")

module.exports = {
    name: "colorinfo",
    permissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre algun hex color.",
    options: [
        {
            name: "color",
            type: "STRING",
            description: "Nombre del HexColor",
            required: true
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    async run(client, interaction) {
   try {
    if (interaction) {
        let color = interaction.options.getString("color");

        await get(`https://api.popcat.xyz/color/${color}`).then((res) => {
            return interaction.followUp({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .addField("HexID", `${res.data.hex}`, true)
                .addField("Nombre del HexColor", `${res.data.name}`, true)
                .addField("RGB del HexColor", `${res.data.rgb}`, true)
                .addField("Color mas brillante", `${res.data.brightened}`)
                ]
            })
        }).catch(function(error) {
            if(error.response) {
                return interaction.followUp({
                    embeds: [new MessageEmbed()
                    .setColor("#fbd9ff")
                    .setAuthor({ name: "Error Code: Slash611" })
                    .setDescription("No se han encontrado resultados.")
                    ]
                })
            }
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${interaction} || ${interaction.author} || ${interaction.guild.name}`)
        }
    }
}