const client = require("../main");
const { bot } = require("discord.js")

client.on("messageDelete", async (message) => {
   // if(message.author.bot) {
     //   return;
    //} else {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get() || message.channel;
//codigo hecho por el zumber https://github.com/zumber o discord.gg/seelyrandom
        await client.snipes.set(channel.id, {
            content: message.content,
         //   author: message.member.tag,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null,
            timestamp: Math.floor(message.createdTimestamp / 1000)
        })
    //}
})