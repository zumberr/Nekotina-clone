const Discord  = require('discord.js');

const agree    = "✅";
const disagree = "❌";

module.exports = {
  name: "vote",
  category: "moderation",
  description: "Vote for the message above.'",
  run: async (client, message, args) => {

    
    if(!args || args[0] === 'help') return message.reply("Usage: vote <question>")

    let msg = await message.channel.send(`Question: ${message.content.split(" ").splice(1).join(" ")} \nVote now! (Vote time: 5min)`);
  await msg.react(agree);
  await msg.react(disagree);

    const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 300000});
  msg.delete();

    var NO_Count = reactions.get(disagree).count;
  var YES_Count = reactions.get(agree);
    if(YES_Count == undefined){
    var YES_Count = 1;
  }else{
    var YES_Count = reactions.get(agree).count;
  }

  var nightcoreat = new Discord.MessageEmbed()
  
            .addField("Voting Finished:", "----------------------------------------\n" +
                                          "Question: " + message.content.split(" ").splice(1).join(" ") + "\n" +
                                          "Total votes (Yes): " + `${YES_Count-1}\n` +
                                          "Total votes (NO): " + `${NO_Count-1}\n` +
                                          "----------------------------------------", true)

            .setColor("0x#FF0000")
            .setFooter(`© Esto es un test de Lenita`);
  await message.channel.send({embed: nightcoreat});
  
  }
};