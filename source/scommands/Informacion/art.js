// const WomboDream = require('dream-api'); // Temporarily disabled due to security vulnerability
const fetch = require('node-fetch')
const { MessageEmbed } = require("discord.js");
module.exports = {
    name:'imagen',
    description: 'imagen generada a apartir de una ia',
    options: [
        {
            name:'query',
            description:'lo que deseas que interprete',
            type:'STRING',
            required:true
        },
        {
            name:'style',
            description:'estilo de arte',
            type:'NUMBER',
            required:false
        }

    ],

    run: async (client, interaction) => {

        const query = interaction.options.getString('query')
        const sty = interaction.options.getNumber('style')

        const GetStyle = await fetch('https://paint.api.wombo.ai/api/styles/').then(res => res.json())
        const style = GetStyle.map(style => {
            return {
              id: style.id,
              name: style.name,
            }
          })


        

        if(!sty){
            return interaction.followUp('por favor especifica un estilo de arte con alguno de los siguientes numeros!' + "\n" + style.map(style => `\`${style.id}\` = \`${style.name}\``).join('\n'))
        }

        interaction.followUp(`Generando tu imagen.......`)


        styName = " "

        for(let i = 0; i<GetStyle.length; i++){
            if(sty == GetStyle[i].id){
                styName = GetStyle[i].name
            }
        }




        // Temporarily disabled due to security vulnerability in dream-api
        return interaction.followUp({
            embeds: [new MessageEmbed()
                .setColor('#fbd9ff')
                .setTitle('Función temporalmente deshabilitada')
                .setDescription('La función de generación de imágenes está temporalmente deshabilitada por motivos de seguridad. Se reactivará pronto con una nueva implementación.')
            ]
        });

        /* Original code commented out due to security vulnerability
        let image = await WomboDream.generateImage(sty, query);

        //console.log(query)
        //console.log(sty)

        let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${query.toUpperCase()} arte con estilo ${styName.toUpperCase()}`)
        .setImage(image.result.final)
        .setTimestamp()

        interaction.channel.send({embeds:[embed]})
        */





    }
}