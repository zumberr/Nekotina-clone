 
const { MessageEmbed } = require("discord.js");

module.exports = {
        name: 'guildlist',
        category: 'Developer',
        description: 'Lista de los servidores donde esta Lenita.',
        ownerOnly: true,
    async run(client, message, args, prefix) {
        try {
        const guild = message.client.guilds.cache;
        const format = await guild.map(g => '\`' + g.id + `\` **|** \`` + g.name + `\` **|** \`` + g.memberCount + '\`') || 'None';
           const formar = format.splice(50, 100).join("\n")
        const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "Guild List", iconURL: client.user.displayAvatarURL() })
            .setDescription(format.splice(0, 68).join("\n"));

        message.channel.send({ embeds: [embed] });
    //codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom (puto si lo borras)
   } catch(error) {
      console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
       }
    }
}