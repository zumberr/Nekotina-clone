const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  name: "setavatar",
  description: "Change the bot avatar",
  usage: "setavatar <link>",
  ownerOnly: true,
  run: async (client, message, args) => {
    const oldn = client.user.username
    const nolink = new MessageEmbed()
      .setColor("#fc0330")
      .addField(`**__No se ah dado ningun link__**`, "Porfavor introduce un link");

    if (!args.length) return message.reply({ embeds: [nolink] });
    const newav = args.join(" ");
    
  
    if (newav) {
        client.user.setAvatar(`${newav}`);
      const newnn = new MessageEmbed()
      .setColor("#00FF00")
      .addField(
        "**__Avatar Cambiado__**",
        `**__Nuevo avatar:__** ${newav}`
      );
      return  message.channel.send({ embeds: [newnn] });}
  },
};
