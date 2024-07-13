const [MessageEmbed, Discord] = require("discord.js")

module.exports = {
    name:"tictactoe",
    aliases: ["ttt","gato","3enraya","tateti"],
    usage: "ttt @user",
    description: "El clasico juego del tictactoe",
    timeout:"10000",
    UserPerms: ["SEND_MESSAGES"],
    ClientPerms: ["SEND_MESSAGES"],
    run: async(client, message, args, prefix)=>{

        const user = message.mentions.users.first()
        if(!user) return message.reply("Debes mencionar a un usuario para jugar")
        let tictactoe = [
            [" ", " ", " "],
            [" ", " ", " "],
            [" ", " ", " "]
        ]
        let turno = message.author.id
        let embed = new Discord.MessageEmbed()
        .setTitle("TicTacToe")
        .setDescription(`Turno de ${message.author.username}`)
        .addField("Tablero", `\`\`\`
        ${tictactoe[0].join(" | ")}
        ${tictactoe[1].join(" | ")}
        ${tictactoe[2].join(" | ")}
        \`\`\``)
        let msg = await message.channel.send(embed)
        for(let i = 0; i < 9; i++){
            const filter = (reaction, user) => {
                return ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].includes(reaction.emoji.name) && user.id === turno
            }
            const collector = msg.createReactionCollector(filter, { time: 60000 })
            collector.on("collect", async(reaction, user) => {
                const pos = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].indexOf(reaction.emoji.name)
                const x = Math.floor(pos / 3)
                const y = pos % 3
                if(tictactoe[x][y] !== " "){
                    message.reply("Esa casilla ya esta ocupada")
                    return
                }
                tictactoe[x][y] = turno === message.author.id ? "X" : "O"
                turno = turno === message.author.id ? user.id : message.author.id
                embed.setDescription(`Turno de ${turno === message.author.id ? message.author.username : user.username}`)
                embed.addField("Tablero", `\`\`\`
                ${tictactoe[0].join(" | ")}
                ${tictactoe[1].join(" | ")}
                ${tictactoe[2].join(" | ")}
                \`\`\``)
                msg.edit(embed)
                reaction.users.remove(user.id)
            })
            collector.on("end", () => {
                if(i === 8){
                    embed.setDescription("Empate")
                    msg.edit(embed)
                    return
                }
                let ganador = null
                for(let j = 0; j < 3; j++){
                    if(tictactoe[j][0] === tictactoe[j][1] && tictactoe[j][1] === tictactoe[j][2] && tictactoe[j][0] !== " "){
                        ganador = tictactoe[j][0]
                        break
                    }
                    if(tictactoe[0][j] === tictactoe[1][j] && tictactoe[1][j] === tictactoe[2][j] && tictactoe[0][j] !== " "){
                        ganador = tictactoe[0][j]
                        break
                    }
                }
                if(tictactoe[0][0] === tictactoe[1][1] && tictactoe[1][1] === tictactoe[2][2] && tictactoe[0][0] !== " "){
                    ganador = tictactoe[0][0]
                }
                if(tictactoe[0][2] === tictactoe[1][1] && tictactoe[1][1] === tictactoe[2][0] && tictactoe[0][2] !== " "){
                    ganador = tictactoe[0][2]
                }
                if(ganador){
                    embed.setDescription(`Gana ${ganador === "X" ? message.author.username : user.username}`)
                    msg.edit(embed)
                }
            })
        }
        
        
    }
}
