const { MessageEmbed } = require("discord.js");
const Schema = require("../../models/welcome");

module.exports = {
  name: "set-welcome",
  description: "",
  usage: "",
  aliases: ["setwelcome"],
  category: "Configuracion",
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
              "**ups no tienes los permisos nesesarios! - [MANAGE_MESSAGES]**"
            )
        
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    const channel = message.mentions.channels.first() || message.channel;
    if (!channel) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription("**Porfavor menciona un canal **")
            
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
      if (data) {
        data.Channel = channel.id;
        data.save();
      } else {
        new Schema({
          Guild: message.guild.id,
          Channel: channel.id,
        }).save();
      }
      // db.set(`welcomeChannel_${message.guild.id}`, channel.id)
       console.log(`${channel}`)
       return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Canal de bienvenidas establecido" })
            .setDescription(`El canal ${channel} ha sido establecido para las bienvenidas`)
            ]
        })
        //.setImage("una imagen")
     // return message.channel.send(welcomess);
        
    });
  },
};