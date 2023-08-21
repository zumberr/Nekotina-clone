const block = "⬛";
const heart = "🟥";
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "love",
    usage: "love <@member1 | member2 | memberID>",
    aliases: [""],
    cooldown: 2,
    example: "love @Oussan#6625",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Medidor de amor.",
    async run(client, message, args, prefix) {
   try {
    let member;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    function ship() {
        const hearts = Math.floor(Math.random() * 100) + 1;
        const hearte = (hearts/10);
      
        const str = `${heart.repeat(hearte)}${block.repeat(11 - hearte)} ${hearts}%`;
        return str;
    }

    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        }) 
    } else if(member.id === message.author.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3771" })
            .setDescription("No puedes medir tu propio amor.")
            ]
        })
    } else if(message.mentions.members.size < 2) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Resultados del amor entre ${message.author} y de ${member}.`)
            .addField("Resultados", `${ship()}`)
            .setImage(`https://api.popcatdev.repl.co/ship?user1=${message.author.displayAvatarURL({ dynamic: false, format: "png" })}&user2=${member.displayAvatarURL({ dynamic: false, format: "png" })}`)
            ]
        })
    } else if(message.mentions.members.size > 1) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`Resultados del amor entre ${message.mentions.users.first()} y de ${message.mentions.members.last()}.`)
            .addField("Resultados", `${ship()}`)
            .setImage(`https://api.popcatdev.repl.co/ship?user1=${message.mentions.users.first().displayAvatarURL({ dynamic: false, format: "png" })}&user2=${message.mentions.users.last().displayAvatarURL({ dynamic: false, format: "png" })}`)
            ]
        })
    }
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}