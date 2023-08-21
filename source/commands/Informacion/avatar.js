const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js")

module.exports = {
    name: "avatar",
    usage: "avatar | av <@member | memberID>",
    aliases: ["av"],
    cooldown: 0,
    example: "avatar | av @Zumber#1610",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Mostrar el avatar de un usuario en especifico.",
    async run(client, message, args, prefix) {
    try {
    let member;
    member = message.mentions.members.first() || message.guild.members.cache.get() || client.users.cache.get() || message.member;

        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId("Selector")
            .setPlaceholder("Seleccione una categoría.")
            .addOptions([
                {
                    label: "Formato PNG",
                    description: "Formato de Imágen PNG.",
                    value: "fpng"
                },
                {
                    label: "Formato JPEG",
                    description: "Formato de Imágen JPEG.",
                    value: "fjpeg"
                },
                {
                  label: "Formato JPG",
                  description: "Formato de Imágen JPG.",
                  value: "fjpg"
                },
                {
                  label: "Formato WEBP",
                  description: "Formato de Imágen WEBP.",
                  value: "fwebp"
                }
            ]),
        );
      const Home = new MessageEmbed()
      .setColor("#fbd9ff")
      .setDescription("Seleccione un formato de imágen.")
  
      const PNG = new MessageEmbed()
      .setColor("#fbd9ff")
      .setDescription(`[Click aquí.](${member.displayAvatarURL({ format: "png" })})`)
      .setImage(`${member.displayAvatarURL({ dynamic: true, size: 1024 })}`)
  
      const JPEG = new MessageEmbed()
      .setColor("#fbd9ff")
      .setDescription(`[Click aquí.](${member.displayAvatarURL({ format: "jpeg" })})`)
      .setImage(`${member.displayAvatarURL({ dynamic: true, size: 1024 })}`)
  
      const JPG = new MessageEmbed()
      .setColor("#fbd9ff")
      .setDescription(`[Click aquí.](${member.displayAvatarURL({ format: "jpg" })})`)
      .setImage(`${member.displayAvatarURL({ dynamic: true, size: 1024 })}`)
  
      const WEBP = new MessageEmbed()
      .setColor("#fbd9ff")
      .setDescription(`[Click aquí.](${member.displayAvatarURL({ format: "webp" })})`)
      .setImage(`${member.displayAvatarURL({ dynamic: true, size: 1024 })}`)
  
   const m = await message.reply({ embeds: [Home], components: [row] })
    const ifilter = i => i.member.id === message.member.id;
       const collector = m.createMessageComponentCollector({ filter: ifilter, time: 70000 })
       
       collector.on('collect', async i => {
          if(i.values[0] === "fpng") {
            await i.deferUpdate()
            i.editReply({ embeds: [PNG], components: [row] })
            }
        })
  
      collector.on('collect', async i => {
          if(i.values[0] === "fjpeg") {
            await i.deferUpdate()
            i.editReply({ embeds: [JPEG], components: [row] })
            }
        })
  
      collector.on('collect', async i => {
          if(i.values[0] === "fjpg") {
            await i.deferUpdate()
            i.editReply({ embeds: [JPG], components: [row] })
            }
        })
  
      collector.on('collect', async i => {
          if(i.values[0] === "fwebp") {
            await i.deferUpdate()
            i.editReply({ embeds: [WEBP], components: [row] })
            }
        })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}