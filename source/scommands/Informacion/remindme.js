const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'recordatorio',
    description: 'Te recuerdo con un ping las cosas que me pediste que te recordara',
    options: [
        {
            type: 3,
            name: 'time',
            description: 'establece el tiempo en  segundos(s), Minutos (m), Horas (h), Dias (d)',
            required: true,
        },
        {
            type: 3,
            name: 'contenido',
            description: 'cosa que quieres que te recuerde',
            required: true,
        },
    ],
    userperm: ['SEND_MESSAGES'],
    botperm: ['SEND_MESSAGES'],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const [time, todo] = args;
        if (todo.length > 200)
            return interaction.followUp({
                content: 'el recordatorio maximo no puede pasar mas de 500 letras',
                ephemeral: true,
            });

        const setreminderembed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('recordatorio establecido!')
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`te he establecido el recordatorio exitosamente <@${interaction.user.id}> !`)
            .addField('⌛ Te recordare en ⌛', `\`${time}\``)
            .addField('👥 Recordatorio 👥', `${todo}`)
            .setTimestamp();

        interaction.followUp({ embeds: [setreminderembed] });

        // Pake arrow function () => {} biar keren :v
        setTimeout(async () => {
            interaction.followUp({
                content: `<@${interaction.user.id}> tu recordatorio esta aqui!`,
            });

            const alertembed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Alerta de recordatorio!')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Hey, <@${interaction.user.id}>! te acuerdas de tu recordatorio?`)
                .addField('⌛ Recordatorio ⌛', `\`${todo}\``)
                .setTimestamp();

            interaction.followUp({ embeds: [alertembed] });
        }, ms(time));
    },
};
