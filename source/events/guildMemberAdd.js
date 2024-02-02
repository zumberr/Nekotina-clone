const database = require("quick.db")
const Schema1 = require("../models/welcome");
const client = require("../main")
const { MessageEmbed } = require("discord.js")

client.on("guildMemberAdd", async (member) => {
    let papo;
    let channel = await database.get(`welcome_${member.guild.id}`)
    let subchannel = await database.get(`clientlogs_${member.guild.id}`)
    let autorole = await database.get(`autorole_${member.guild.id}`)
    let content = await database.get(`welcomedes_${member.guild.id}`)
    //let format = await content.replace(`<member>`, member.author).replace(`<memberRank>`, member.guild.members.cache.size)
  //codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
    if(subchannel === null) return;
    else if(channel === null) return;
    else if(autorole === null) return;
    else if(content === null) {
        papo = `${member} ha entrado al servidor!\n**Información del Usuario**\nIdentificación/ID del usuario: ${member.id}\nFecha de creación de la cuenta: <t:${Math.floor(member.user.createdAt / 1000)}:R>`;
    } else try {
        const newrole = member.guild.roles.cache.get(autorole);
        if(newrole) await member.roles.add(newrole)
        await client.channels.cache.get(channel).send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
            .setAuthor({ name: "Un nuevo usuario ha entrado al servidor" })
            .setDescription(`${papo}`)
                     //.setDescription(`${format || papo}`)
            ]
        })
    } catch(error) {
        console.error(error)
        return;
    }
})


const { MessageAttachment } = require("discord.js");


client.on("guildMemberAdd", async (member) => {
Schema1.findOne({ Guild: member.guild.id }, async (e, data) => {
    if (!data) return;
    let user = member.user;
    const channel = member.guild.channels.cache.get(data.Channel);
    channel.send({
        content: `${member.user}`,
            embeds: [new MessageEmbed()
            .setColor("#fa8995")
            .setAuthor({ name: `${member.user.username} se ha unido a ${member.guild.name}`})
            .setDescription(`Holi, ${member.user.username} bienvenido al servidor ${member.guild.name} 🎀 \nEres el miembro número ${member.guild.memberCount}!\n\n<:toslena:1054079675338604637> • No olvides leer las reglas O.o\n<:welcome:1058440895751524372> • Diviértete <3`)
             .setImage('https://cdn.discordapp.com/attachments/1053495932559306785/1054432480955994152/aniyuki-anya-spy-x-family-6.gif')
                     .setFooter('© Sally')
                     .setTimestamp()
            ]
        })

  });
});

