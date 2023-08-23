// Vaciar la Consola al iniciar
 console.clear()

 // Funcion para ejecutar
 function start() {
    // Definir "discord.js"
    const { Client, Collection } = require("discord.js");
    
    // Base de datos general
    const Database = require("quick.db");
    const mongo = require("./inhibitors/filter.json")["Configuracion General"].mongo_uri
     
    const mongoose = require ('mongoose');

mongoose
  .connect(mongo,{
  
    useNewUrlParser: true,
    useUnifiedTopology: true,

  })
  .then(() => {
  
    console.log('========================= MONGO DB =========================');
    console.log('Conectado exitosamente a MongoDB');
    console.log('========================= LOGS DEL BOT =========================');

  })
  .catch((e) => {
  
    console.log('Error al conectar: '+e);

  });

    // Procesos de "Node.js"
    const process = require("node:process");

    // Expancion de "Node.js"
    require("events").defaultMaxListeners = 55;

    // Configuracion
    const config = require("./inhibitors/filter.json")["Configuracion General"].token;

    // Configuracion del Cliente en General
    const client = new Client({
    fetchAllMembers: true,
    restTimeOffset: 0,
    shards: "auto",
    retryLimit: 700,
    allowedMentions: {
      parse: ["roles", "users"],
      repliedUser: false
    },
    presence: {
      status: "online"
    },
    partials: ["GUILD_MEMBER", "MESSAGE", "CHANNEL", "REACTION", "GUILD_SCHEDULED_EVENT"],
    //intents: 32767,
    intents: 130815,
    })

    const { Player } = require("discord-music-player");
      const player = new Player(client, {
     leaveOnEmpty: false,
    timeout: 30000 // This options are optional.
   });
// You can define the Player as *client.player* to easily access it.
   client.player = player;
     
     module.exports = player;

    // Exportacion Completa
    const fs = require("fs")

    // Modulo de Exportacion
    module.exports = client;
    
    // Exportaciones
     //// discord player
    // Coleccion de los comandos completa
    client.commands = new Collection();
    // Aliases
    client.aliases = new Collection();
    // Snipes
    client.snipes = new Collection();
    // Esnipes
    client.esnipes = new Collection();
    // Cooldown
    client.cooldown = new Map();
    // Database
    client.database = Database
    // SlashCommands
    client.scommands = new Collection();
    // Configuracion (OWNERID)
    client.config = require("./inhibitors/filter.json")["Configuracion General"];

    // Categorias 
    client.categories = fs.readdirSync("./source/commands/");
    const { GiveawaysManager } = require("discord-giveaways");


    // No apagar el BOT al encontrar un error
    process.on("uncaughtException", function(err) {
     console.log(err);
    });

    // Command y integer
    ["command", "integer", "interaction"].forEach(handler => {
      require(`./arguments/${handler}`)(client);
    }),
      //client.on('presenceUpdate', async (oldPresence, newPresence) => {
    //const role = newPresence.guild.roles.cache.get("929218153303638033");
    //const member = newPresence.member
    //const activities = member.user.presence.activities[0];
  
    //if (activities && (activities.state.includes( ".gg/seelyrandom" ) || 
    //activities.state.includes("discord.gg/seelyrandom" ))) {
      //return newPresence.member.roles.add(role)
    //} else {
      //if(member.roles.cache.get(role.id)) {
        //newPresence.member.roles.remove(role)
        //}
      //}
    //})

    // Gateway Discord v9 Login config
   client.login(config) ///token de lena

  


    //const answers = ["Wlc", "parece que ha llegado un nuevo usuario", "ah aparecido una estrella salvaje."];
    //client.on('guildMemberAdd', guild =>{
    //const channelId = '929218153786015829';//add your channel ID
    //const channel = client.channels.cache.get(channelId).send(answers[Math.floor(Math.random() * answers.length)]); //This Gets That Channel
    
    //if(!channel){
      //return;
    //}//If the channel is invalid it returns
   /// return channel.send(answers[Math.floor(Math.random() * answers.length)]);
      
    //});
//////////////////////////////////

////////////////////////////
  };
const keepAlive = require("./server");
keepAlive();

  // Ejecutar "function start()" y terminar el codigo general
  start()



 
