const {ShardingManager} = require("discord.js");
const config = require("./config.json")

const shards = new ShardingManager("./source/main.js", {
    token: config.token,
    totalShards: "auto"
});

shards.on("shardCreate", shard => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] shard lanzada #${shard.id}`);
});

shards.spawn(shards.totalShards, 10000);