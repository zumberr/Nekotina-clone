const axios = require("axios").default;
const database = require("../inhibitors/filter.json")["Minijuegos"]["Guess The Flag"];
const { MessageEmbed } = require("discord.js");

class GTFlag {
    constructor(options) {
        this.message = options.message;
        this.stopCommand = options.stopCommand || "STOP"
        this.maxAttempts = options.maxAttempts || 3;
        this.commandName = options.commandName || "gtflag";
    }

    async start() {
        let random = database[Math.floor(Math.random() * database.length)];
        console.log(random)
        this.message.channel.send({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("Por favor, espere mientras se crea la partida...")
            ]
        }).then(async (m) => {
            const Embed = new MessageEmbed()
            .setColor("#fbd9ff")
            .setDescription("¿Que bandera es...? Tienes 20 segundos!")
            .setImage(`https://countryflagsapi.com/png/${random}`)
            return m.edit({ embeds: [Embed] }).then(() => {
                const gameFilter = m => m.author.id === this.message.author.id;
                const gameCollector = this.message.channel.createMessageCollector({ filter: gameFilter, time: 60000 });
                let i = this.maxAttempts - 1;
                gameCollector.on("collect", async (message) => {
                    if(message.author.bot || message.author.id !== this.message.author.id) return;
                    const select = message.content;
                    if(message.author.id === this.message.author.id && select.includes((this.commandName).toLowerCase())) {
                        this.message.channel.send({ content: "Actualmente tienes una partida activa."})
                        return;
                    } else {
                        if(select === random) {
                            this.message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor("#fbd9ff")
                                .setDescription(`Has adivinado correctamente el país! La respuesta correcta era: ${random}`)
                                .setImage(`https://countryflagsapi.com/png/${random}`)
                                ]
                            })
                            
                            return gameCollector.stop();
                        } else if(select === this.stopCommand.toLowerCase()) {
                            this.message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor("#fbd9ff")
                                .setDescription(`Se ha finalizado la partida, la respuesta correcta era: ${random}`)
                                .setImage(`https://countryflagsapi.com/png/${random}`)
                                ]
                            })
                            
                            return gameCollector.stop();
                        } else if(i <= this.maxAttempts && select !== random && select !== this.stopCommand && i > 0) {
                            i--;
                            this.message.channel.send({ content: `Tienes ${i + 1} intentos para adivinar la bandera, puedes escribir \`STOP\` para finalizar la partida.` })
                        } else if(i <= 0 && select !== random) {
                            this.message.channel.send({
                                embeds: [new MessageEmbed()
                                .setColor("#fbd9ff")
                                .setDescription(`Se te han acabado los intentos para adivinar la bandera, la respuesta correcta era: ${random}`)
                                .setImage(`https://countryflagsapi.com/png/${random}`)
                                ]
                            })
    
                            return gameCollector.stop();
                        }
                    }
                })
            })
        })
    }
}

module.exports = {
    GTFlag
}