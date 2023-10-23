const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'expulsa un usuario del servidor',
	options: [
		{
			type: 9,
			name: 'member',
			description: 'Miembro a sacar',
			required: true,
		},
		{
			type: 3,
			name: 'reason',
			description: 'razon para expulsar a este miembro?',
		},
	],
	userperm: ['KICK_MEMBERS'],
	botperm: ['KICK_MEMBERS'],
	userPermissions: ['KICK_MEMBERS'],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const [member, reason] = args;
		const memberFixed = await client.guilds.cache
			.get(interaction.guild.id)
			.members.fetch(member);

		if (interaction.member.roles.highest <= memberFixed.roles.highest.position)
			return interaction.followUp({
				content:
					"no puedes expulsar esta persona debido a que esta a un rol mas alto que el tuyo o el mio.",
				ephemeral: true,
			});

		const reason_fixed = reason || 'sin razon';
		const memberPfp = client.users.cache
			.get(memberFixed.id)
			.displayAvatarURL({ size: 512, dynamic: true });
		const embed = new MessageEmbed()
			.setTitle(
				` ${memberFixed.user.username} ha sido expulsado!`
			)
			.setThumbnail(memberPfp)
			.addField('Usuario expulsado', `${memberFixed}`)
			.addField('Moderador', `<@${interaction.user.id}>`)
			.addField('Razon', `${reason_fixed}`)
			.setColor('RED')
			.setTimestamp();

		await memberFixed.kick({ reason }).catch((err) =>
			interaction.followUp({
				content: `un error ocurrio!\nError message :\n\`\`\`yml\n${err}\n\`\`\``,
				ephemeral: true,
			})
		);
		interaction.followUp({ embeds: [embed] });
	},
};
