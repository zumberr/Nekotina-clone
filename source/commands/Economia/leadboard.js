const db = require("quick.db")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "eleadboard",
    usage: "eleadboard | etop <wallet | bank>",
    aliases: ["etop"],
    cooldown: 2,
    example: "eleadboard | etop wallet",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener información sobre la tabla de clasificación del servidor.",
    async run(client, message, args, prefix) {
    try {
    let type, member, content, balance, leadboard;
    type = args[0];

    if(!type) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3260" })
            .setDescription(`No se ha proporcionado el tipo de selección. \n\nUso correcto del comando: \n\` ${this.usage} \` \n\nSeleccionés válidas: \n\` wallet, bank \``)
            ])
        })
    } else if(type === "wallet") {
        leadboard = db.all().filter(lb => lb.ID.startsWith(`balance_${message.guild.id}`)).sort((a, b) => b.data - a.data)
        balance = leadboard.slice(0, 10);
        content = "";
    
        for (let i = 0; i < balance.length; i++) {
            member = client.users.cache.get(balance[i].ID.split("_")[2])
    
            content += `\`\`\`${i+1} | ${member.tag} | \$${balance[i].data}\n\`\`\``
        } 
        
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Tabla de clasificación de: ${message.guild.name}` })
            .setDescription(`${content}`)
            ])
        })
    } else if(type === "bank") {
        leadboard = db.all().filter(lb => lb.ID.startsWith(`bankBalance_${message.guild.id}`)).sort((a, b) => b.data - a.data)
        balance = leadboard.slice(0, 10);
        content = "";
    
        for (let i = 0; i < balance.length; i++) {
            member = client.users.cache.get(balance[i].ID.split("_")[2])
    
            content += `\`\`\`${i+1} | ${member.tag} | \$${balance[i].data}\n\`\`\``
        } 
        
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `Tabla de clasificación de: ${message.guild.name}` })
            .setDescription(`${content}`)
            ])
        })
    } else return;
    
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}