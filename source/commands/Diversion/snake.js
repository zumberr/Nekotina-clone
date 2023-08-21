const { SnakeGame } = require("../../monitors/snake")

module.exports = {
    name: "snake",
    usage: "snake <No ARGS>",
    aliases: [""],
    cooldown: 10,
    example: "snake <No ARGS>",
    ownerOnly: false,
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
    description: "El juego de la serpiente o mayormente conocido como el juego del Nokia.",
    async run(client, message, args, prefix) {
   try {
    new SnakeGame({ message: message, buttons: true, snake: '🟩', apple: '🍎', snakehead: '🟨', embedColor: "PURPLE", leftButton: '⬅', rightButton: '➡', upButton: '⬆', downButton: '⬇', }).start();
    } catch (error) {
       console.log(`${error} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}