const Discord  = require('discord.js');

const agree    = "✅";
const disagree = "❌";

module.exports = {
  name: "sugerencia",
  category: "Developer",
  description: "Sugiere un cambio para la bot.'",
  run: async (client, message, args) => {

    ////////////////////////// este comando la finalidad era crear encuentas para las personas y demas
    if(!args || args[0] === 'help') return message.reply("Uso: vote <question>")

    let msg = await message.channel.send(`Sugerencia: ${message.content.split(" ").splice(1).join(" ")} \nVota ahora! (tiempo de voto: 5min)`);
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
  
            .addField("finalizado:", "----------------------------------------\n" +
                                          "Sugerencia: " + message.content.split(" ").splice(1).join(" ") + "\n" +
                                          "Votos a si (Yes): " + `${YES_Count-1}\n` +
                                          "Votos a no (NO): " + `${NO_Count-1}\n` +
                                          "----------------------------------------", true)

            .setColor("0x#FF0000")
            .setFooter(`© Esto es un comando de sally`);
  await message.channel.send({embed: nightcoreat});
  
  }
};
