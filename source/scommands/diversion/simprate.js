const { Client, CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'simprate', 
     description: 'Simprate',
         options: [
             {
                 name: "user",
                 description: "User",
                 type: "USER",
                 required: true
             },
         ],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {
        const human = interaction.options.getUser("user")
        const rate = Math.floor(Math.random() * (100 - 1 + 1) + 1);

        if(human == interaction.author) {
            const Embed = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle('***Tu rango de simp***')
            .setDescription(`es un **${rate}**% Simp `)
            .setImage ('https://cdn.discordapp.com/attachments/1005696873769742480/1050139429286711326/IMG_0862.jpg')
            .setFooter(`${human.user.username}`)
            interaction.followUp({ embeds: [Embed] })
        } else {
            const Embed2 = new MessageEmbed()
            .setColor('#FF0000')
            .setTitle(`***${human.username}'s Simprate***`)
            .setDescription(`${human} es **${rate}**% Simp `)
            .setImage ('https://cdn.discordapp.com/attachments/1005696873769742480/1050139429286711326/IMG_0862.jpg')
             .setFooter(`${human.tag}`)
            interaction.followUp({ embeds: [Embed2]})
        }

    }
}