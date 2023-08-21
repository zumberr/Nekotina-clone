const {Message, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js')
const Client = require('../../main.js')

module.exports = {
    name: 'sancion',
    description: 'muestra un menu con las sanciones comunes',
      userPerms: ['KICK_MEMBERS', 'BAN_MEMBERS'],
    botPerms: ['KICK_MEMBERS', 'BAN_MEMBERS'],
    dev: false,
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     * @param {MessageEmbed} embed
     */
    run: async (client, message, args, ) => {
        const member = message.mentions.members.first()
        if (!member) return message.channel.send('porfavor menciona un usuario para moderar')
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
        if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply('Quieres sancionar a alguien con rangos mas altos que el tuyo?.')
        if (member.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply('no puedo sancionar este usuario debido a que tiene roles mas altos que yo.')
        if (member.id === message.member.id) return send('Te sancionaras a ti mismo?.')
        if (member.id === message.guild.me.id) return send('Me quieres sacnionar :(?.')
        let reason = args.slice(1).join(' ') || 'sin razon'

        const kButton = new MessageButton().setCustomId('kick').setLabel('Kick').setStyle('DANGER')
        const banButton = new MessageButton().setCustomId('ban').setLabel('Ban').setStyle('DANGER')

        let row = new MessageActionRow().addComponents(kButton, banButton)
        const collector = message.channel.createMessageComponentCollector({componentType: 'BUTTON', time: 30000})
        message.channel.send({content: 'Selecciona una sancion para el usuario.', components: [row]}).then(async (message)=>{
            const buttons=async(i)=>{
                if (m.user.id !== authorId) {
                    return m.reply({
                        content: `solo ${onlyAuthor} puede usar los botones!`,
                        ephemeral: true
                    })
                }

        collector.on('collect', async (m) => {
            if (m.customId === 'kick') {
                member.kick({reason: reason || 'sin razon.'})
                kButton.setDisabled(true)
                banButton.setDisabled(true)
                row = new MessageActionRow().addComponents(kButton, banButton)
                m.update({content: `${member.user.tag} ha sido expulsado por ${reason}`, components: [row]})
            }
            if (m.customId === 'ban') {
                member.ban({reason: reason || 'sin razon.'})
                kButton.setDisabled(true)
                banButton.setDisabled(true)
                row = new MessageActionRow().addComponents(kButton, banButton)
                m.update({content: `adios ${member.user.tag} te ira mejor en el bote , baneado debido a  ${reason}`, components: [row]})

          
    }
        })
    }
}  )
                                                       }}