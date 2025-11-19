const { MessageEmbed } = require("discord.js"); //HEYY
const Discord = require("discord.js"); //HEYY

module.exports = {
    name: "delwarn",
    aliases: ["deletewarn"],
    description: "Quita la advertencia especificada de un usuario",
    usage: "<prefix>unwarn <@Usuario> <ID de la advertencia>",
  
    /**
     * @param {import("../../classes/Client")} client
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     */
   async run(client, message, args, prefix) {
      try {
        const { Client } = require("discord.js");
        const modelo = require('../../models/warn');
  
        if (!message.member.permissions.has("MANAGE_MESSAGES"))
          return message.channel.send("No tienes los permisos `Gestionar Mensajes`");
  
        let server = message.guild.id;

        let warnid = args[0];
        if(!warnid) return message.reply('Debes especificar la ID de la advertencia!');
  
        let amm = await modelo.find({
          guildId: message.guild.id
        });

        if(!amm) {
          return message.channel.send(
            "`No hay advertencias en el servidor`"
          );
        };

        let warningsIds = amm.map(x => `${x._id}`);
        if(!warningsIds.includes(warnid)) return message.reply('No encontré esa advertencia en ningún miembro del servidor');

        let xr = await modelo.findOne({
          _id: warnid,
          guildId: message.guild.id
        });

        let userId;

        if(xr) {
          let member = message.guild.members.cache.get(xr.userId);
          if(member) {
            userId = member ? member.user.id : undefined;
            user = member ? member.user : undefined;
          };

          await modelo.deleteOne({
            __id: warnid,
            guildId: message.guild.id
          });
        };

        message.channel.send({ content: `He eliminado la advertencia con la ID \`${args[0]}\` exitósamente.` });

          
          /*                futuro sistema de logs 


        let logEmbed = new MessageEmbed()
        .setTitle('Advertencia eliminada')
        .setFooter('Sally Mod Logs')
        .setTimestamp()
        .addField('Staff', `<@${message.author.id}>`, true)
        .addField('Miembro', `${user ? `<@${user.id}>` : 'No encontrado'}`)
        .addField('ID de la Advertencia', `${warnid}`)
        .setThumbnail(user ? user.displayAvatarURL({ dynamic: true }) : client.user.displayAvatarURL())

        const logModelo = require('../../models/futuroslogs');
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
          .setColor(process.env.EMBED_HEX.toString())
          .setFooter("Sally moderacion")
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
          .setFooter("Sally | Sally erorres")
          .setColor("RANDOM")
          .setTimestamp()
          .setThumbnail(message.author.avatarURL());
        const canal = "1055890003131117569";
        client.channels.cache.get(canal).send({ embeds: [ae] });
      }
    },
  };
  