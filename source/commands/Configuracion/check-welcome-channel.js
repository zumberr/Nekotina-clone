const { MessageEmbed } = require("discord.js");
const Schema = require("../../models/welcome");

module.exports = {
  name: "check-welcome-channel",
  description: "",
  usage: "",
  aliases: ["cwchannel"],
  category: "welcome_leave",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  async run(client, message, args, prefix) {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription(
              "**no tienes permisos para establecer o checar el canal de bienvenidas! - [MANAGE_MESSAGES]**"
            )
            .setFooter("lenita bienvenidas")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
      if (!data)
        return message.channel.send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription("**este servidor y el canal de bienveidas no estan guardados en mi base de datos!!**")
            .setFooter("lenita")
        );
      const channel = client.channels.cache.get(data.Channel);

      return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Canal de bienvenidas " })
            .setDescription(`El canal ${channel} es el actual canal de bienvenidas`)
            ]
        })
    });
  },
};