const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const WIDTH = 12;
const HEIGHT = 8;
const gameBoard = [];
const apple = { x: 1, y: 1 };

class SnakeGame {
    constructor(options) {
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                gameBoard[y * WIDTH + x] = "⬛";
            }
        }

        this.message = options.message;
        this.snake = options.snake || "🟩";
        this.apple = options.apple || "🍎";
        this.leftButton = options.leftButton || '⬅';;
        this.rightButton = options.rightButton || '➡';
        this.upButton = options.upButton || '⬆️';
        this.downButton = options.downButton || '⬇';
    }

    start() {
        let snake = [{ x: 5, y: 5 }]
        let snakeLength = 1;
        let score = 0;

        const gameBoardTostring = () => {
            let str = ""
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (x == apple.x && y == apple.y) {
                        str += this.apple;
                        continue;
                    }

                    let flag = true;
                    for (let s = 0; s < snake.length; s++) {
                        if (x == snake[s].x && y == snake[s].y) {
                            str += this.snake;
                            flag = false;
                        }
                    }

                    if (flag)
                        str += gameBoard[y * WIDTH + x];
                }
                str += "\n";
            }
            return str;
        }

        const isLocInSnake = (pos) => {
            return snake.find(sPos => sPos.x == pos.x && sPos.y == pos.y)
        }

        const newAppleLoc = () => {

            let newApplePos = { x: 0, y: 0 };

            if (isLocInSnake(newApplePos)) newApplePos = { x: parseInt(Math.random() * WIDTH), y: parseInt(Math.random() * HEIGHT) };

            apple.x = newApplePos.x;
            apple.y = newApplePos.y;

        }

        const embed = new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: `El juego de la culebra` })
            .setDescription(gameBoardTostring())
        const row1 = new MessageActionRow().addComponents(new MessageButton()
                .setStyle('SECONDARY')
                .setLabel(`\u200b`)
                .setCustomId('extra1')
                .setDisabled(true),
            ).addComponents(new MessageButton()
                .setStyle('PRIMARY')
                .setCustomId('up')
                .setEmoji(this.upButton)
            ).addComponents(new MessageButton()
                .setStyle("DANGER")
                .setLabel(`Detener`)
                .setCustomId('stop'))

        const row2 = new MessageActionRow().addComponents(new MessageButton()
                .setStyle('PRIMARY')
                .setEmoji(this.leftButton)
                .setCustomId('left'),
            ).addComponents(new MessageButton()
                .setStyle('PRIMARY')
                .setCustomId('down')
                .setEmoji(this.downButton)
            ).addComponents(new MessageButton()
                .setStyle('PRIMARY')
                .setCustomId('right')
                .setEmoji(this.rightButton))
        this.message.channel.send({ embeds: [embed], components: [row1, row2] }).then(gameMessage => {
            const waitForReaction = () => {
                const filter = i => { return i.user.id === this.message.author.id; }
                gameMessage.awaitMessageComponent({ filter, componentType: 'BUTTON', max: 1, time: 60000, errors: ['time'] })
                    .then((interaction) => {
                        const button = interaction;
                        const snakeHead = snake[0]
                        const nextPos = { x: snakeHead.x, y: snakeHead.y };
                        if (button.customId === 'left') {
                            button.deferUpdate();
                            let nextX = snakeHead.x - 1;
                            if (nextX < 0)
                                nextX = WIDTH - 1;
                            nextPos.x = nextX;
                        } else if (button.customId === 'up') {
                            button.deferUpdate();
                            let nextY = snakeHead.y - 1;
                            if (nextY < 0)
                                nextY = HEIGHT - 1;
                            nextPos.y = nextY;
                        } else if (button.customId === 'down') {
                            button.deferUpdate();
                            let nextY = snakeHead.y + 1;
                            if (nextY >= HEIGHT)
                                nextY = 0;
                            nextPos.y = nextY;
                        } else if (button.customId === 'right') {
                            button.deferUpdate();
                            let nextX = snakeHead.x + 1;
                            if (nextX >= WIDTH)
                                nextX = 0;
                            nextPos.x = nextX;
                        } else if (button.customId === 'stop') {
                            gameOver()
                        }

                        if (isLocInSnake(nextPos)) {
                            gameOver()
                        } else {
                            snake.unshift(nextPos)
                            if (snake.length > snakeLength)
                            snake.pop()
                            step()
                        }
                    }).catch(() => {
                        const editEmbed = new MessageEmbed()
                            .setColor("#fbd9ff")
                            .setAuthor({ name: `Has perdido la partida` })
                            .setDescription(`No reaccionaste a tiempo.\nEsta es la cantidad de manzanas recoletadas: ${score}`)
                        gameMessage.edit({ embeds: [editEmbed], components: [] })
                    })}
            waitForReaction()
            const step = () => {
                if (apple.x == snake[0].x && apple.y == snake[0].y) {
                    score += 1;
                    snakeLength++;
                    newAppleLoc()
                }

                const editEmbed = new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `El juego de la culebra` })
                .setDescription(gameBoardTostring())
                gameMessage.edit({ embeds: [editEmbed], components: [row1, row2] })
                waitForReaction()
            }
            const gameOver = () => {
                const editEmbed = new MessageEmbed()
                .setColor("#fbd9ff")
                .setAuthor({ name: `Has perdido la partida` })
                .setDescription(`Has perdido la partida.\nEsta es la cantidad de manzanas recoletadas: ${score}`)
                gameMessage.edit({ embeds: [editEmbed], components: [] })}})}}

module.exports = {
    SnakeGame
}