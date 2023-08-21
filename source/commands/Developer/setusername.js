const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  name: "setname",
  description: "Change the bot username",
  usage: "setname <here>",
  ownerOnly: true,
  run: async (client, message, args) => {
    const oldn = client.user.username
    const noname = new MessageEmbed()
      .setColor("#fc0330")
      .addField(`**__No Name Was Provided__**`, "Please Give A Username");

    if (!args.length) return message.reply({ embeds: [noname] });
    const newname = args.join(" ");
    
  
    if (newname) {
        client.user.setUsername(`${newname}`);
      const newnn = new MessageEmbed()
      .setColor("#00FF00")
      .addField(
        "**__Name Changed__**",
        `**__New Name:__** ${newname}`
      );
      return  message.channel.send({ embeds: [newnn] });}
  },
};
