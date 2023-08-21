const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "xpleadboard",
    usage: "xpleadboard | xptop <xp | level>",
    aliases: ["xptop"],
    cooldown: 2,
    example: "xpleadboard | xptop xp",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener la lista de usuarios con mayor XP y Nivel.",
    async run(client, message, args, prefix) {
   try {
    let xpranker = await client.database.get(`xprank_${message.guild.id}`);

    if(xpranker === true) {
        let format;
        format = args[0];
    
        if(!format) {
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 4979" })
                .setDescription(`No se ha proporcionado el formato.\n\nUso corecto del comando:\n\` ${this.usage} \``)
                ]
            })
        } else if(format === "xp") {
            let leadboard = client.database.all().filter(lb => lb.ID.startsWith(`xp_${message.guild.id}`)).sort((a, b) => b.data - a.data)
            let balance = leadboard.slice(0, 10);
            let content = "";
        
            for(let i = 0; i < balance.length; i++) {
                let member = client.users.cache.get(balance[i].ID.split("_")[2])
                content += `\`\`\`${i+1} | ${member.tag} | ${balance[i].data}xp\n\`\`\``
            }
    
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `Tabla de clasificación de XP de: ${message.guild.name}` })
                .setDescription(`${content}`)
                ]
            })
        } else if(format === "level") {
            let leadboard = client.database.all().filter(lb => lb.ID.startsWith(`level_${message.guild.id}`)).sort((a, b) => b.data - a.data)
            let balance = leadboard.slice(0, 10);
            let content = "";
        
            for (let i = 0; i < balance.length; i++) {
                member = client.users.cache.get(balance[i].ID.split("_")[2])
        
                content += `\`\`\`${i+1} | ${member.tag} | Nivel ${balance[i].data}\n\`\`\``
            }
    
            return message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `Tabla de clasificación de Nivel de: ${message.guild.name}` })
                .setDescription(`${content}`)
                ]
            })
        } else return;
    } else {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3914" })
            .setDescription("El sistema de XP esta desactivado actualmente en el servidor.")
            ]
        })
    }
    } catch (error) {
       console.error(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}