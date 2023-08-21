const axios = require("axios").default;

module.exports = {
    name: "functions",
    usage: "functions | fs <No ARGS>",
    aliases: ["fs"],
    cooldown: 0,
    example: "functions | fs <No ARGS>",
    ownerOnly: true,
    UserPerms: [""],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Comando para probar funciones.",
    async run(client, message, args, prefix) {
   try {
    await axios.get(`https://dagpi.docs.apiary.io/`, {
        headers: {
            Authorization: "MTYzNjAxNzk0OA.xchjLz60vlLrlDdpUaExQqcfA2R3ol1C.3ccf7a6e45ec7f59" 
        }
    }).then((res) => {
        console.log(res.data)
    })
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}