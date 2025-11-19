const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const modelo = require('../../models/warn');

module.exports = {
    name: "warns",
    usage: "warns <@member | memberID> ",
    aliases: [""],
    example: "warns @usuario1610 ",
    ownerOnly: false,
    UserPerms: [""],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Warnear a un usuario especificó.",
    async run(client, message, args, prefix){
      try {
        let mn = message.mentions.users.first() ? message.mentions.users.first().id : args[0];

        let page = 1;

      if(!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("No tienes los permisos `Gestionar Mensajes`")
      let user = client.users.cache.get(mn);
      if (!user) return message.channel.send("`"+message.author.tag+"` debes mencionar a un usuario!");

      let guildMember = message.guild.members.cache.get(mn);
      if(!guildMember) return message.reply('El usuario no está en este servidor!');

      let server = message.guild.id;
      let id = user;

      let amm = await modelo.find({
        guildId: message.guild.id,
        userId: user.id
      });

      let amms = await modelo.findOne({
        guildId: message.guild.id,
        userId: user.id
      });

      if(!amms) return message.reply('Ese usuario no tiene advertencias en este servidor!');

      let cantidad = amm.map(x => x.reason).length;

      let warnings = amm.map(x => `**ID:** ${x._id}\n**Razón:** ${x.reason}\n**Staff:** <@${x.staffId}>\n`);

      let warnlist1 = new MessageEmbed()
      .addField("`💻` **Servidor**", `${message.guild.name}`, true)
      .addField("`🔑` **Usuario**", `${user.tag}`, true)
      .setColor("RED")
      .setThumbnail(user.avatarURL());

      let warnlist2 = new MessageEmbed()
      .addField("`💻` **Servidor**", `${message.guild.name}`, true)
      .addField("`🔑` **Usuario**", `${user.tag}`, true)
      .setColor("RED")
      .setThumbnail(user.avatarURL());

      let warnlist3 = new MessageEmbed()
      .addField("`💻` **Servidor**", `${message.guild.name}`, true)
      .addField("`🔑` **Usuario**", `${user.tag}`, true)
      .setColor("RED")
      .setThumbnail(user.avatarURL());

      let warnlist4 = new MessageEmbed()
      .addField("`💻` **Servidor**", `${message.guild.name}`, true)
      .addField("`🔑` **Usuario**", `${user.tag}`, true)
      .setColor("RED")
      .setThumbnail(user.avatarURL());

      let warnlist5 = new MessageEmbed()
      .addField("`💻` **Servidor**", `${message.guild.name}`, true)
      .addField("`🔑` **Usuario**", `${user.tag}`, true)
      .setColor("RED")
      .setThumbnail(user.avatarURL());

      for(let i = 0; i < warnings.length; i++) {
        if(i < 5) {
          warnlist1.addField(`Advertencia ${i + 1}`, `${warnings[i]}`);
        } else if(i >= 5 && i < 10) {
          warnlist2.addField(`Advertencia ${i + 1}`, `${warnings[i]}`);
        } else if(i >= 10 && i < 15) {
          warnlist3.addField(`Advertencia ${i + 1}`, `${warnings[i]}`);
        } else if(i >= 15 && i < 20) {
          warnlist4.addField(`Advertencia ${i + 1}`, `${warnings[i]}`);
        } else if(i >= 20 && i < 25) {
          warnlist5.addField(`Advertencia ${i + 1}`, `${warnings[i]}`);
        };
      };

      const row = new MessageActionRow().addComponents(
        new MessageButton()
        .setLabel('◀')
        .setCustomId('retroceder')
        .setStyle('PRIMARY'),

        new MessageButton()
        .setLabel('✖')
        .setCustomId('borrar')
        .setStyle('DANGER'),

        new MessageButton()
        .setLabel('▶')
        .setCustomId('siguiente')
        .setStyle('PRIMARY')
    );

    message.channel.send({ embeds: [warnlist1], components: [row] }).then(async (msg) => {
        const filter = (p) => p.user.id === message.author.id;

        const collector = msg.createMessageComponentCollector({ filter: filter, time: 60000 });
        collector.on('collect', async (button) => {
            if(button.customId == 'borrar') {
                button.deferUpdate();
                collector.stop();
                msg.delete();
            } else if(button.customId == 'siguiente') {
              await button.deferUpdate();
              if(page == 1) {
                if(warnings.length > 5) {
                  msg.edit({ embeds: [warnlist2] });
                  page++;
                };
              } else if(page == 2) {
                if(warnings.length > 10) {
                  msg.edit({ embeds: [warnlist3] });
                  page++;
                };
              } else if(page == 3) {
                if(warnings.length > 15) {
                  msg.edit({ embeds: [warnlist4] });
                  page++;
                };
              } else if(page == 4) {
                if(warnings.length > 20) {
                  msg.edit({ embeds: [warnlist5] });
                  page++;
                };
              };
            } else if(button.customId == 'retroceder') {
              await button.deferUpdate();
              if(page == 2) {
                msg.edit({ embeds: [warnlist1] });
                page --;
              } else if(page == 3) {
                msg.edit({ embeds: [warnlist2] });
                page --;
              } else if(page == 4) {
                msg.edit({ embeds: [warnlist3] });
                page --;
              } else if(page == 5) {
                msg.edit({ embeds: [warnlist4] });
                page --;
              };
            };
          });

        collector.on('end', async () => {
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            row.components[2].setDisabled(true);

            msg.edit({ components: [row] }).catch(() => {});
        });
    });
  } catch(error) {
    console.log(error)
      const embed = new MessageEmbed()
        .setDescription("**Ha ocurrido un error que no tendría que ocurrir, por favor reportalo en mi servidor de soporte!**")
        .setColor("FF0000")
        .setFooter("Sally errores")
        .setTimestamp()
      message.channel.send({ embeds: [embed] }) // finalmente
      const ae = new MessageEmbed()
      .addField("💻 El error es: ","`"+error+"`", true)
      .addField("👮‍♂️ El usuario que lo ha sufrido ha sido ","`"+message.author.tag+"`", true)
      .addField("⚙ Id del usuario que lo ha sufrido ","`"+message.author.id+"`", true)
      .addField("🔨 El error estaba en el comando ","`"+message.content+"`", true)
      .addField("📲 El error ha sido en el servidor ","`"+message.guild.name+"`", true)
      .addField("👤 Usuarios en el servidor ","`"+message.guild.memberCount+"`", true)
      .addField("🌐 Región del servidor ", "`"+message.guild.region+"`",true)
      .addField("🆔 Id del servidor ", "`"+message.guild.id+"`",true)
      .setTitle("❗ Nuevo Error ❗")
      .setFooter("Sally errores")
      .setColor("RANDOM")
      .setTimestamp()
      .setThumbnail(message.author.avatarURL())
      const canal = "1055890003131117569";
      client.channels.cache.get(canal).send({ embeds: [ae] });
    }
  }
}