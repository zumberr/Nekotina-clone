const { GTFlag } = require("../../monitors/guesstheflag")

module.exports = {
    name: "guesstheflag",
    usage: "guesstheflag | gtflag <null>",
    aliases: ["gtflag"],
    cooldown: 2,
    example: "guesstheflag | gtflag <null>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "Adivina la bandera la cual se te proporciona.",
    async run(client, message, args, prefix) {
   try {
    new GTFlag({
        message: message,
        maxAttempts: 3
    }).start()
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}