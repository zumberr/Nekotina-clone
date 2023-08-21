const { Collection } = require('mongoose');
const kissSchema = require('../../models/kissSchema');
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'kiss',
    aliases: ['besar','beso'],
    description: 'Da un beso a un miembro del servidor.',
    category: 'Interaccion',
    usage: '<prefix>kiss <@user/id>',
  
    async run(client, message, args, Discord) { 

        var kiss = [
            
           'https://i.imgur.com/8WKFiAa.gif',
            'https://i.imgur.com/x9ex9O3.gif',
            'https://i.imgur.com/9KfZ4Xg.gif',
            'https://i.imgur.com/uIvXVAo.gif',
            'https://i.imgur.com/sGVgr74.gif',
            'https://i.imgur.com/nezYlx1.gif',
            'https://i.imgur.com/i3uwlmZ.gif',
            'https://i.imgur.com/qALwmUW.gif',
            'https://i.imgur.com/Cxpz1s7.gif',
            'https://i.imgur.com/txNxEz3.gif',
            'https://i.imgur.com/SvFRZyQ.gif',
            'https://i.imgur.com/Yjk1OQF.gif',
            'https://i.imgur.com/kFkDuX8.gif',
            'https://i.imgur.com/kFkDuX8.gif',
            'https://i.imgur.com/f8qiCq2.gif',
            'https://i.imgur.com/pTAWoC5.gif',
            'https://i.imgur.com/o96X1SF.gif',
            'https://i.imgur.com/TItLfqh.gif',
            'https://i.imgur.com/wQjUdnZ.gif',
            'https://i.imgur.com/lmY5soG.gif',
            'https://i.imgur.com/IgGumrf.gif',
            'https://i.imgur.com/KKAMPju.gif',
            'https://i.imgur.com/e0ep0v3.gif',
            'https://i.imgur.com/3aX4Qq2.gif',
            'https://i.imgur.com/3jzT5g6.gif',
            'https://i.imgur.com/FozOXkB.gif',
            'https://i.imgur.com/7GhTplD.gif',
            'https://i.imgur.com/B6UKulT.gif',
            'https://i.imgur.com/Uow8no2.gif',
            'https://i.imgur.com/I159BUo.gif',
            'https://i.imgur.com/8YZFU1Z.gif',
            'https://i.imgur.com/FQPdG2C.gif',
            'https://i.imgur.com/agdhkfE.gif',
            'https://i.imgur.com/pDScNqs.gif',
            'https://i.imgur.com/gWIm5bK.gif',
            'https://i.imgur.com/1IuyOxK.gif',
            'https://i.imgur.com/LJ42CU8.gif',
            'https://i.imgur.com/nVM7Ll8.gif',
            'https://i.imgur.com/GoJvaea.gif',
            'https://i.imgur.com/siVySzs.gif',
        ]

        let conteo, desc, consulta
        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
        let ramdonkiss = kiss[Math.floor(Math.random()*kiss.length)]

        if (!img || img.id === message.author.id) return message.reply({embeds: [
          
            new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
            .setColor('RED')
            .setDescription(`¿Te quieres besar a ti mismo?`)
        
        ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        if (img.user.bot) return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
          
            new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
            .setColor('RED')
            .setDescription(`Soy Loli, no puedes besarme >~<`)
        
        ]}).catch((e) => console.log('Error al enviar mensaje: '+e))

        consulta = await kissSchema.findOne({u1: message.author.id, u2: img.id})
        
        if(!consulta){

            consulta = await kissSchema.findOne({u1: img.id, u2: message.author.id})

            while(!consulta){

                let tkiss = await kissSchema.create({

                    u1: img.id,
                    u2: message.author.id,
                    c: 0

                })

                tkiss.save()
            
                consulta = await kissSchema.findOne({u1: img.id, u2: message.author.id})

            } 
            
            let update = await kissSchema.findOneAndUpdate({u1: img.id, u2: message.author.id},
                {

                    c: consulta.c + 1

                })

            update.save()
      
            conteo = consulta.c + 1

        } else {

            try {

                let update = await kissSchema.findOneAndUpdate({u1: message.author.id, u2: img.id},
                    {
    
                        c: consulta.c + 1
    
                    })
            
                update.save()

                conteo = consulta.c + 1
              
            } catch (error) {
                
                console.log('No se actualizó la tabla kiss por el error: '+error)

            }

        }

        if(conteo === 1){
          
            conteo ='**'+conteo+'** vez.'
            desc = '¡Su primer Beso!'
        
        } else {
          
            if(conteo <= 10){

                desc = '¡Que tiernos! Van **' + conteo + '**, pero ustedes pueden más O.o'

            } else if(conteo > 10 && conteo <= 20){

                desc = '¡Se gustan mucho! Ya tienen **' + conteo + '** besos acumulados.'
                
            } else if(conteo > 20 && conteo <= 50){

                desc = 'Vaya vaya, que golosos.. Tienen **' + conteo + '** y creo que van por más. '

            } else if(conteo > 50 && conteo <= 100){

                desc = '¡Que cursis! Ya tienen **' + conteo + '** y quién sabe si algo más uwu'

            } else if(conteo > 100 && conteo <= 200){

                desc = '¡Madre mía, Willy! Acumulan **' + conteo + '** y continúan subiendo...'
                
             } else if(conteo > 200 && conteo <= 250){

                desc = '¡Nunca paren, se ven hermosos **' + conteo + '** <3'

            } else if(conteo > 250 && conteo <= 500){

                desc = '¡Cuantos besos! Ya son **' + conteo + '** >///<'

            } else if(conteo > 500){

                desc = 'En serio se han besado **' + conteo + '** veces? Ya tengan bebés'

            }
        
        }


        while (!ramdonkiss || ramdonkiss === null || ramdonkiss === '' || ramdonkiss === undefined) {
            
            ramdonkiss = kiss[Math.floor(Math.random()*kiss.length)]
            
        }
        

        const embed = new MessageEmbed()
        .setDescription(`**${message.author.username}** le dió un beso a **${img.user.username}** >3< `)
        .addField('<:heart:1058447141145681981>','> ' + desc)
        .setImage(ramdonkiss)
        .setColor('RANDOM')
        .setTimestamp(new Date())
        .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })
  
        message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))

    }

}