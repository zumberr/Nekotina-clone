const axios = require("axios")
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "githubmember",
    usage: "githubmember | github <user_name>",
    aliases: ["github"],
    cooldown: 0,
    example: "githubmember | github alguien",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Obtener informacíón sobre cualquier cuenta de GitHub.",
    async run(client, message, args, prefix) {
   try {
    let member;
    let githubAPI;
    let typemember;

    if(!args[0]) {
        return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 2687" })
            .setDescription(`No se ha proporcionado el nombre de usuario. \n\nUso correcto del comando: \n\` ${this.usage} \``)
            ])
        })
    }

    member = args.slice(0).join(" ")
    githubAPI = await axios(`https://api.github.com/users/${member}`);

    typemember = {
        User: "Usuario.",
        Organization: "Organización.",
        Enterprise: "Empresa."
    }

    return message.reply({
        embeds: ([new MessageEmbed()
        .setColor("#fbd9ff")
        .setThumbnail(`${githubAPI.data.avatar_url}`)
        .addField("Información General", `Link de la cuenta: [Click Aquí.](${githubAPI.data.html_url})
Nombre de usuario: ${githubAPI.data.login}
Avatar de la cuenta: [Click Aquí.](${githubAPI.data.avatar_url})
Identificación de la cuenta: Id.${githubAPI.data.id}
Descripción/Bio de la cuenta: ${githubAPI.data.bio || "La cuenta no tiene una descripción."}
Tipo de cuenta de GitHub Data: ${typemember[githubAPI.data.type ? githubAPI.data.type : "Indefinido."]}
Fecha de Creación de la cuenta: ${githubAPI.data.created_at.substring(8, 10)}/${githubAPI.data.created_at.substring(5, 7)}/${githubAPI.data.created_at.substring(0, 4)}`)

        .addField("Información Extra", `
Seguidores de la cuenta: ${githubAPI.data.followers || "La cuenta no tiene seguidores."}
Cuentas en siguiendo: ${githubAPI.data.following || "La cuenta no sigue ninguna cuenta."}
Sitio web proporcionado: ${githubAPI.data.blog || "No se ha proporcionado un sitio web."}
Compañía de la cuenta: ${githubAPI.data.company || "No se ha proporcionado una compañía."}
Correo eletronico de la cuenta: ${githubAPI.data.email || "La cuenta no ha proporcionado un correo eletronico."}
Localizacion de la cuenta: ${githubAPI.data.location || "No se ha proporcionado la localizacion."}
Nombre de usuario de Twitter: ${githubAPI.data.twitter_username || "La cuenta no ha proporcionado una cuenta de Twitter."}
Repositorios de la cuenta: ${githubAPI.data.public_repos ? `${githubAPI.data.public_repos} ${githubAPI.data.public_repos === 1 ? "repositorio." : "repositorios."}` : "La cuenta no tinene ningun repositorio."}
Esencias de la cuenta: ${githubAPI.data.public_gists ? `${githubAPI.data.public_gists} ${githubAPI.data.public_gists === 1 ? "esencia." : "esencias."}` : "La cuenta no tinene ninguna esencia (gists)."}`)
        ])
    })
   } catch(error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)

         return message.reply({
            embeds: ([new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 082"})
            .setDescription("No se ha podido encontrar la cuenta de usuario. Verifique si el nombre de usuario es correcto o si la cuenta existe actualmente.")
                ])
            })
        }
    }
}