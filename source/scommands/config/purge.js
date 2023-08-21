module.exports = {
    name: "purge",
    description: "Elimina una cantidad de mensajes deseado",
     botPerms: ["MANAGE_MESSAGES"],
    userPerms: ["MANAGE_MESSAGES"],
   options: [
                {
                    name: 'number',
                    description: '1-100',
                    type: "INTEGER"
                }
            ],
             run: async(client, interaction, args) => {
       const msgnum = interaction.options.getInteger('number')
       interaction.reply('eliminando...');
       interaction.channel.bulkDelete(msgnum);
    interaction.channel.send("Mensajes eliminados! <:moderacion:1058446616937369611>"); 
  }
}
