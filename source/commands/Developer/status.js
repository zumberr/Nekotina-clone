const discord = require("discord.js")

module.exports = {
  name: "btstatus",
  description: "Cambia el status del bot",
  usage: "status <here>",
  category: "Developer",
  userPermissions: ["ADMINISTRATOR"],
  ownerOnly: true,
  run: async (client, message, args) => {
    
  
     if(!args.length) {
      return message.channel.send("dame un nombre para el estado")
    }
    
 client.user.setActivity(args.join(" ")); 
 message.channel.send("listo ya esta mi nuevo estatus")

    
  }
}