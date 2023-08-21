const { MessageEmbed, Discord } = require("discord.js"); 
const discord = require("discord.js");
const modelo = require('../../models/warn');
const canalito = "1055890003131117569";
module.exports = {
    name: "warn",
    usage: "warn <@member | memberID> <Opcional | Razón>",
    aliases: [""],
    example: "warn @usuario1610 xD",
    ownerOnly: false,
    UserPerms: [""],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Warnear a un usuario especifico.",
    async run(client, message, args, prefix) {
      try {
        
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("No tienes los permisos `Gestionar Mensajes`");

        const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => {})

        if(!user) return message.reply('Debes mencionar o escribir la id del usuario')

        if(user.bot) return message.reply("No puedes advertir bots! <:emoji_10:1045822747978248253>");

        if (user == message.author) return message.reply("`" + message.author.tag + "` por qué te adviertes a ti mismo bro? O.o");

        if (user === client.user) return message.reply(`No me puedo warnear a mi misma :<`);

        if (!user) return message.reply("`" + message.author.tag +"` Debes Mencionar a un usuario!");

        if(message.guild.members.cache.get(user.id).roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return message.reply('No puedes advertir a alguien de tu mismo rol o superior. <:emoji_10:1045822747978248253>');
        let razon = args.slice(1).join(" ") || "No se ha proporcionado la razón."
            //message.options.getString("razon")

        let server = message.guild.id;
        let id = user.id;

        let amm = await modelo.find({
          guildId: message.guild.id,
          userId: user.id
        });

        let cantidad = amm ? amm.map(x => x.reason).length : 0;

        if(cantidad == 30) return message.reply(`\`${message.author.tag}\`, lastimosamente \`${user.tag}\` tiene el numero maximo permitido de advertencias, el cual es 30 XD`)


        let warninggg = await new modelo({
          guildId: message.guild.id,
          userId: user.id,
          reason: razon,
          warning: cantidad + 1,
          staffId: message.author.id
        }).save();

        message.reply({ content: `He advertido a **${user.tag}** porque **${razon}**!` });
  
        let pribateembed = new MessageEmbed()
          .setTitle("**Te han dado un warn!**")
          .setTimestamp()
          .setFooter(`En el servidor con la id ${message.guild.id}`)
          .setColor("RED")
          .setDescription(
            "<:emoji_10:1045822747978248253> Fuiste advertido en  `" + message.guild.name + "`"
          )
          .addField("**Llevas un total de **", `${cantidad + 1} `, "advertencias", true)
          .addField("Desde el **canal**", `<#${message.channel.id}>`, true)
          .addField("**Servidor**", `${message.guild.name}`, true)
          .addField("**Razon**", `\`\`\`js\n${razon}\`\`\``)
          .setThumbnail(user.avatarURL());
        user.send({ embeds: [pribateembed] }).catch(() => {});

      } catch (error) {
        message.reply(("se supone que el siguiente error no debio de ocurrir (si sigues teniendo el mismo error comunicate con mi soporte)", error ))
      }
    },
  };
  