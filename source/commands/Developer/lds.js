const Discord = require('discord.js');
const ownerid = "505156137067216898"; //cambialo al tuyo
module.exports = {
  name: 'listado-de-servidores',
  aliases: ['lds'],
  category: 'Developer',
  description: '¡Muestra la lista de servidores en los que estoy!',
  usage: 'si',
// bot
  async run(client, message, args)  {
   if (message.author.id !== ownerid)
      return message.reply(
        '<:alto:918195864625872986> | ¿A quién quieres engañar? - .'
      );
    if (message.author.id == ownerid) {
      if (!message.guild.me.permissions.has('ADMINISTRATOR'))
        return message.channel
          .send(
            '<:x:> | No tengo el permiso de `Administrador` aquí .'
          )
          .then((msg) => msg.delete({ timeout: 5000 }));

      let i0 = 0;
      let i1 = 10;
      let page = 1;

      let description =
        ` Actualmente estoy en ${client.guilds.cache.size} servidores.\n\n` +
        client.guilds.cache
          .sort((a, b) => b.memberCount - a.memberCount)
          .map((r) => r)
          .map(
            (r, i) =>
              `**${i + 1}** - ${r.name} | ${
                r.memberCount
              } Miembros \nID - ${r.id}`
          )
          .slice(0, 10)
          .join('\n\n');

      let embed = new Discord.MessageEmbed()
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL({ dynamic: true })})

        .setColor('00FFFF')
        .setFooter({ text: `Página - ${page}/${Math.ceil(client.guilds.cache.size / 10)}`})
        .setDescription(description);

        const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
          .setCustomId('retroceder')
          .setEmoji('⬅')
          .setStyle('SECONDARY'),

          new Discord.MessageButton()
          .setCustomId('avanzar')
          .setEmoji('➡')
          .setStyle('SECONDARY'),

          new Discord.MessageButton()
          .setCustomId('cancelar')
          .setEmoji('❌')
          .setStyle('SECONDARY'),
        )

      let msg = await message.reply({ embeds: [embed], components: [row] });

      const ifilter = i => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({ filter: ifilter, time: 120000 })
// bot
      collector.on('collect', async(i) => {
        await i.deferUpdate()
        if(i.customId === 'retroceder'){
          i0 = i0 - 10;
          i1 = i1 - 10;
          page = page - 1;

          if (i0 + 1 < 0) {
            console.log(i0);
            return msg.delete();
          }
          if (!i0 || !i1) {
            return msg.delete();
          }

          description =
            `<:ServerTag:918576149704106014> | Estoy en ${client.guilds.cache.size} servidores.\n\n` +
            client.guilds.cache
              .sort((a, b) => b.memberCount - a.memberCount)
              .map((r) => r)
              .map(
                (r, i) =>
                  `**${i + 1}** - ${r.name} | ${
                    r.memberCount
                  } Miembros \nID - ${r.id}`
              )
              .slice(i0, i1)
              .join('\n\n');

          embed
            .setFooter({
              text: `Página - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
            })
            .setDescription(description);

          msg.edit({ embeds: [embed] });          
        }
        if(i.customId === 'avanzar'){
          i0 = i0 + 10;
          i1 = i1 + 10;
          page = page + 1;

          if (i1 > client.guilds.cache.size + 10) {
            return msg.delete();
          }
          if (!i0 || !i1) {
            return msg.delete();
          }

          description =
            `Estoy en ${client.guilds.cache.size} servidores.\n\n` +
            client.guilds.cache
              .sort((a, b) => b.memberCount - a.memberCount)
              .map((r) => r)
              .map(
                (r, i) =>
                  `**${i + 1}** - ${r.name} | ${
                    r.memberCount
                  } Miembros\nID - ${r.id}`
              )
              .slice(i0, i1)
              .join('\n\n');

          embed
            .setFooter(
              `Página - ${page}/${Math.round(client.guilds.cache.size / 10 + 1)}`
            )
            .setDescription(description);

          msg.edit({ embeds: [embed] });
        }
        if(i.customId === 'cancelar'){
          return msg.delete();
        }
      });

  };  
 }
};
