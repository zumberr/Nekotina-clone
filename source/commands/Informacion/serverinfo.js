const { MessageEmbed } = require("discord.js")
const moment = require("moment");

module.exports = {
    name: "serverinfo",
    usage: "serverinfo | server <No ARGS>",
    aliases: ["server"],
    cooldown: 0,
    example: "serverinfo | server <No ARGS>",
    ownerOnly: false,
    UserPerms: ["MANAGE_GUILD"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_GUILD"],
    description: "Obtener información sobre todo el servidor de Discord.",
    async run(client, message, args, prefix) {
   try {
       const regions = {
        europe: "Europa",
        brazil: "Brasil",
        hongkong: "Hong Kong",
        japan: "Japón",
        russia: "Rusia",
        singapore: "Singapur",
        southafrica: "Sudáfrica",
        sydney: "Sydney",
        "us-central": "Central US",
        "us-east": "Este US",
        "us-south": "Sur US",
        "us-west": "Oeste US",
        "vip-us-east": "VIP US Este",
        "eu-central": "Europa Central",
        "eu-west": "Europa Oeste",
        london: "London",
        amsterdam: "Amsterdam",
        india: "India",
      }

      const filterName = {
        DISABLED: "Desactivado.",
        MEMBERS_WITHOUT_ROLES: "Sólo miembros sin roles.",
        ALL_MEMBERS: "Todos los miembros.",
      };

      const verification = {
          NONE: "Ninguna sistema de verificación de Discord.",
          LOW: "Sistema de verificación Bajo.",
          MEDIUM: "Sistema de verificación Mediano.",
          HIGH: "Sistema de verificación Alto.",
          VERY_HIGH: "Sistema de verificación Muy Alta."
      }

      const sc = (message.guild.createdTimestamp) /1000
      const st = Math.round(sc)
      const guild = message.guild;
      const role = guild.roles.cache.sort((a, b) => b.position - a.position).map((role) => role.toString()).slice(0, -1);
      const emojis = guild.emojis.cache;
      const boostcount = guild.premiumSubscriptionCount;
      const create = moment(guild.createdTimestamp).format("DD-MM-YYYY, h:mm:ss A")

      return message.reply({
        embeds: [new MessageEmbed()
        .setColor("#fbd9ff")
        .setAuthor({ name: `Información de: ${guild.name}`})
        .setThumbnail(guild.iconURL({ dynamic: true, format: "png" }))
        .setDescription(`Nombre del Servidor: ${guild.name}
Owner del Servidor: <@${guild.ownerId}>
Icono del Servidor: [Click aquí.](${guild.iconURL({ dynamic: true, format: "png" })})
Región del Servidor: ${regions[guild.region] || "RN Indefinida."}
Identificación/ID del Servidor: ${guild.id}
        
**Caracteristicas del Servidor**
${guild.features.join(", ") || "El servidor no tiene caracteristicas especiales."}
        
**Información secundaria**
Miembros del Servidor: ${guild.memberCount} miembros.
Emojis del Servidor: ${emojis.size} emotes.
Cantidad de Roles: ${role.length} roles.
Fecha de Creación del Servidor: ${create} (<t:${st}:R>)
Cantidad de Boost: ${boostcount} boost(s).
Filtro explícito: ${filterName[guild.explicitContentFilter]}
Verificación: ${verification[guild.verificationLevel]}
        
**Roles del Servidor**
${message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).join(" ")}
        
**Información Extra**
Cantidad de Canales de Texto: ${guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size} canales. 
Cantidad de Canales de Voz: ${guild.channels.cache.filter((c) => c.type === "GUILD_VOICE").size} canales.`)
        ]
      })
   } catch (error) {
        console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}