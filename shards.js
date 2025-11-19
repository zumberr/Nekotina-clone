require('dotenv').config();
const {ShardingManager} = require("discord.js");

// Verificar que el token esté configurado
if (!process.env.DISCORD_TOKEN) {
    console.error("ERROR: No se ha configurado el token del bot.");
    console.error("Por favor, crea un archivo .env con DISCORD_TOKEN=tu_token_aqui");
    process.exit(1);
}

const shards = new ShardingManager("./source/main.js", {
    token: process.env.DISCORD_TOKEN,
    totalShards: "auto"
});

shards.on("shardCreate", shard => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] shard lanzada #${shard.id}`);
});

shards.spawn(shards.totalShards, 10000);
