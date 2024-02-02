const {ShardingManager} = require("discord.js");

const shards = new ShardingManager("./source/main.js", {
    token: "agrega el token de tu bot aqui",
    totalShards: "auto"
});

shards.on("shardCreate", shard => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] shard lanzada #${shard.id}`);
});

shards.spawn(shards.totalShards, 10000);
shards.on("shardCreate", shard => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] shard lanzada #${shard.id}`);
});

shards.spawn(shards.totalShards, 10000);
