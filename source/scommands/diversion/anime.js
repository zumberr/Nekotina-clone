module.exports = {
    name: "anime",
    description: "obten una reaccion de anime",
    options: [
        { 
            name: 'categoria', 
            description: "que accion quieres hacer?",
            required: true,
            type: "STRING",
        
          
             
            //You can also do it without choices but these are the only available types! Its recommended that u use choices
            choices: [
                { 
                    name: "cuddle",
                    value: "cuddle"
                },
                { 
                    name: "hug",
                    value: "hug"
                },
                { 
                    name: "kiss",
                    value: "kiss"
                },
                { 
                    name: "smile",
                    value: "smile"
                },
                { 
                    name: "wave",
                    value: "wave"
                },
                { 
                    name: "handhold",
                    value: "handhold"
                },
                { 
                    name: "wink",
                    value: "wink"
                },
                { 
                    name: "poke",
                    value: "poke"
                },
                { 
                    name: "dance",
                    value: "dance"
                },
                { 
                    name: "cringe",
                    value: "cringe"
                },
                { 
                    name: "kill",
                    value: "kill"
                },
                { 
                    name: "slap",
                    value: "slap"
                },
                { 
                    name: "bite",
                    value: "bite"
                },
                { 
                    name: "highfive",
                    value: "highfive"
                },
                { 
                    name: "blush",
                    value: "blush"
                },
                { 
                    name: "pat",
                    value: "pat"
                },
                { 
                    name: "smug",
                    value: "smug"
                },
                { 
                    name: "bonk",
                    value: "bonk"
                },
                { 
                    name: "cry",
                    value: "cry"
                },
                { 
                    name: "bully",
                    value: "bully"
                },
                { 
                    name: "yeet",
                    value: "yeet"
                },
                { 
                    name: "happy",
                    value: "happy"
                },
                { 
                    name: "kick",
                    value: "kick"
                },
            ],
        },
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const { Slash } = require('djs-anime')
        const slash = new Slash({
        type: args,
        interaction: interaction,
        embedFooter: "© Lenita Anime", //The Footer of the embed
        embedTitle: `aqui esta tu ${args} GIF`, //The title of the embed
        embedColor: "#FF0000", //The color of the embed! (Use Hex codes or use the color name)
        })
        slash.anime()
        

    },
    

}
