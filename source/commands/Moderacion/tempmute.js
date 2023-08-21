const ms = require("ms")
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "tempmute",
    usage: "tempmute | tmute",
    aliases: ["tmute"],
    cooldown: 0,
    example: "tempmute | tmute @usuario 3h Spam.",
    ownerOnly: false,
    UserPerms: ["MUTE_MEMBERS"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    description: "Mutear a un usuario por un tiempo y una razón especificá.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let muteRole;
    let muteTime;
    let muterole1;
    let muteReason;
    member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    muteTime = args[1];
    muteReason = args.slice(2).join(" ");
    muteRole = await message.guild.roles.cache.find((role) => role.name === "Muteado")
    
    if(!member) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3662" })
            .setDescription(`No se ha proporcionado la mención/ID.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    } else if(!muteTime) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4841" })
            .setDescription(`No se ha proporcionado el tiempo del mute.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
    }else if(member.id === message.author.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5881" })
            .setDescription(`No puedes mutearte a ti mismo.`)
            ]
        })
    } else if(member.id === message.guild.ownerId) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4691" })
            .setDescription(`No puedes mutear al dueño del servidor.`)
            ]
        })
    } else if(member.id === client.user.id) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 3867" })
            .setDescription(`No puedes mutearme, ya que no podre hacer absolutamente nada.`)
            ]
        })            
    } else if(message.member.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 4106" })
            .setDescription("El miembro mencionado tiene un rol superior o igual al tuyo.")
            ]
        })
    } else if(message.guild.me.roles.highest.position <= member.roles.highest.position) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5859" })
            .setDescription("El miembro mencionado tiene un rol superior o igual al mio.")
            ]
        })
    } else if(!muteRole) {
        try {
            message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: "Error Code: 3428" })
                .setDescription(`No se ha encontrado el rol de muteo, se intentara crear el rol.`)
                ]
            })
    
            muterole1 = await message.guild.roles.create({
                    name: "Muteado",
                    permissions: []
                });
    
            message.guild.channels.cache.filter(c => c.type == "GUILD_TEXT").forEach(async (channel) => {
                await channel.permissionOverwrites.create(muterole1, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
            });
    
            message.reply({
                embeds: [new MessageEmbed()
                .setColor("#fbd9ff")
                .setDescription("Se ha creado el rol `Muteado` para realizar el mute.")
                ]
            })
        } catch (error) {
            console.log(error)
        }
    };
    
    const role2 = await message.guild.roles.cache.find(r => r.name === "Muteado")
    
    if(member.roles.cache.has(role2)) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 5278" })
            .setDescription(`${member} actualmente ya esta muteado.`)
            ]
        })
    } else {
        await member.roles.add(role2)
    
        message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`${member} ha sido muteado correctamente.`)
            .addField("Información Extra", `Miembro muteado: ${member}
Razón del muteo: ${muteReason || "No se ha proporcionado la razón."}
Moderador propietario: ${message.author}
Fecha ejecutiva del muteo: <t:${Math.floor(Date.now() / 1000)}:R>`)
            ]
        })
    }
    
    setTimeout(async () => {
        await member.roles.remove(role2)
    
        message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription(`${member} ha sido desmuteado correctamente.`)
            .addField("Información Extra", `Miembro muteado: ${member}
Razón del muteo: ${muteReason || "No se ha proporcionado la razón."}
Moderador propietario: ${message.author}
Fecha ejecutiva del desmuteo: <t:${Math.ceil(new Date() / 1000)}:R>`)
            ]
        })
    }, ms(muteTime))
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}