const { MessageEmbed } = require("discord.js"); //HEYY
const Discord = require("discord.js"); //HEYY
module.exports = {
    name: "clearwarn",
    aliases: ["clearwarns", "borrar-todos-warns", "clear-warn"],
    description: "Borra todas las advertencias de un usuario en el servidor",
    usage: "<prefix>clearwarn <@Usuario>",
  
    /**
     * @param {import("../../classes/Client")} client
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     */
   async run(client, message, args, prefix) {
        const modelo = require('../../models/warn');
      try {

        var user = message.mentions.users.first()

        if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("No tienes los permisos `Gestionar Mensajes`")
        if (!user) return message.channel.send("`"+message.author.tag+"` Debes mencionar a un usuario!")

        let server = message.guild.id;
        let id = user.id;

        let mm = await modelo.find({
          guildId: message.guild.id,
          userId: user.id
        });

        if(!mm) return message.reply('El usuario no tiene advertencias!');

        let warnings = mm.map(x => x._id);
        warnings.forEach(async (warn_id) => {
          await modelo.deleteOne({
            _id: warn_id,
            guildId: message.guild.id,
            userId: user.id
          });
        });


        message.reply(`He eliminado todas las advertencias del usuario \`${user.tag}\``);
        let pribateembed = new Discord.MessageEmbed()
          .setTitle("**Te han retirado los avisos!**")
          .setColor("GREEN")
          .setDescription("Te han retirado todas las advertencias del servidor `"+ message.guild.name+"`")
          .addField("`📱` **Avisos**",`\`\`\`js\nAhora tienes 0 advertencias\`\`\``)
          .addField("`📁` **Canal**", `<#${message.channel.id}>`, true)
          .addField("`💻` **Servidor**", `${message.guild.name}`, true)
          .setThumbnail(client.user.avatarURL());
        user.send({ embeds: [pribateembed] }).catch(() => {});
///////////////////////////// futuro sistema de logs ////////////////7
          /*
        let logEmbed = new MessageEmbed()
        .setTitle('Advertencias eliminadas')
        .setFooter('lenita Mod Logs')
        .setTimestamp()
        .addField('Miembro', `<@${user.id}>`, true)
        .addField('Staff', `<@${message.author.id}>`, true)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addField('Total de advertencias', `0`, true);

        const logModelo = require('../../models/server/modlogs');
        let alrEx = await logModelo.findOne({
          guildId: message.guild.id
        });

        if(alrEx) {
          message.guild.channels.cache.get(alrEx.channelId).send({ embeds: [logEmbed] }).catch(() => {});
        }; */
      } catch (error) {
        const embed = new Discord.MessageEmbed()
          .setDescription(
            "**Ha ocurrido un error que no tendría que ocurrir, Porfavor reportalo a traves de mi dm**"
          )
          .setColor("FF0000")
          .setFooter("lenita | lenita Support")
          .setThumbnail(client.user.avatarURL())
          .setTimestamp();
        message.channel.send({ embeds: [embed] }); // finalmente
  
        const ae = new Discord.MessageEmbed()
          .addField("💻 El error es: ", "`" + error + "`", true)
          .addField(
            "👮‍♂️ El usuario que lo ha sufrido ha sido ",
            "`" + message.author.tag + "`",
            true
          )
          .addField(
            "⚙ Id del usuario que lo ha sufrido ",
            "`" + message.author.id + "`",
            true
          )
          .addField(
            "🔨 El error estaba en el comando ",
            "`" + message.content + "`",
            true
          )
          .addField(
            "📲 El error ha sido en el servidor ",
            "`" + message.guild.name + "`",
            true
          )
          .addField(
            "👤 Usuarios en el servidor ",
            "`" + message.guild.memberCount + "`",
            true
          )
          .addField(
            "🌐 Región del servidor ",
            "`" + message.guild.region + "`",
            true
          )
          .addField("🆔 Id del servidor ", "`" + message.guild.id + "`", true)
          .setTitle("❗ Nuevo Error ❗")
          .setFooter("lenita | lenita Support")
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(message.author.avatarURL());
        const canal = "1055890003131117569";
        client.channels.cache.get(canal).send({ embeds: [ae] });
      }
    },
  };
  