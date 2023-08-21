const { Collection } = require('mongoose');
const userSchema = require('../../models/userSchema');
const { MessageEmbed } = require('discord.js');
module.exports =  {
    
    name: 'hug',
    aliases: ['abrazar','abrazo'],
    description: 'Da un abrazo a un miembro del servidor.',
    category: 'Interaccion',
    usage: '<prefix>hug [@user/id]',
  
    async run(client, message, args, Discord) { 
        
        var hug = [
        
            'https://i.imgur.com/ntqYLGl.gif',
            'https://i.imgur.com/v47M1S4.gif',
            'https://i.imgur.com/82xVqUg.gif',
            'https://i.imgur.com/4oLIrwj.gif',
            'https://i.imgur.com/6qYOUQF.gif',
            'https://i.imgur.com/UMm95sV.gif',
            'https://i.imgur.com/l1shN1W.gif',
            'https://i.imgur.com/e6IEwzg.gif',
            'https://i.imgur.com/fWCJmEj.gif',
            'https://i.imgur.com/hwt71Li.gif',
            'https://i.imgur.com/SZsj1Bd.gif',
            'https://i.imgur.com/DaKws14.gif',
            'https://i.imgur.com/Glotp9N.gif',
            'https://i.imgur.com/5frDSwr.gif',
            'https://i.imgur.com/yeDjQFK.gif',
            'https://i.imgur.com/XJIBhAw.gif',
            'https://i.imgur.com/pTUhMhJ.gif',
            'https://i.imgur.com/VAoTtjb.gif',
            'https://i.imgur.com/vL3vlvK.gif',
            'https://i.imgur.com/Avih7pz.gif',
            'https://i.imgur.com/fWpi1oX.gif',
            'https://i.imgur.com/8sFE4d5.gif',
            'https://i.imgur.com/IRTEJR7.gif',
            'https://i.imgur.com/p2zs9pG.gif',
            'https://i.imgur.com/aiogsW4.gif',
            'https://i.imgur.com/rNN5alH.gif',
            'https://i.imgur.com/QLhG5ZB.gif',
            'https://i.imgur.com/9GVXl8s.gif',
            'https://i.imgur.com/32JxoqB.gif',
            'https://i.imgur.com/4UJWo8b.gif',
            'https://i.imgur.com/uFmtH36.gif',
            'https://i.imgur.com/zemGZ28.gif',
            'https://i.imgur.com/QbmVOFK.gif',
            'https://i.imgur.com/ysQrrA6.gif',
            'https://i.imgur.com/YHaPGpB.gif',
            'https://i.imgur.com/Ux3d1iP.gif',
            'https://i.imgur.com/jXk7Pbg.gif',
            'https://i.imgur.com/xUeYgAq.gif',
            'https://i.imgur.com/1XQvrd0.gif',
            'https://i.imgur.com/cC0tSOH.gif',
            'https://i.imgur.com/2EdwW9f.gif',
            'https://i.imgur.com/TRiWr5O.gif',
            'https://i.imgur.com/r9aU2xv.gif',
            'https://i.imgur.com/wOmoeF8.gif',
            'https://i.imgur.com/nrdYNtL.gif',
            'https://i.imgur.com/BPLqSJC.gif',
            
        ]
    
        var hug2 = [
            
            'https://i.imgur.com/TRiWr5O.gif',
            'https://i.imgur.com/r9aU2xv.gif',
            'https://i.imgur.com/wOmoeF8.gif',
            'https://i.imgur.com/nrdYNtL.gif',
            'https://i.imgur.com/BPLqSJC.gif',
    
        ]

        let img = message.guild.members.resolve(message.mentions.users.first() || client.users.cache.get(args[0]));
        let ramdonhug = hug[Math.floor(Math.random()*hug.length)]
        let ramdonhug2 = hug2[Math.floor(Math.random()*hug2.length)]

        console.log('Ramdonhug1: ' + ramdonhug + ' - Length: ' + hug.length)
        console.log('Ramdonhug2: ' + ramdonhug2)

        while (!ramdonhug || ramdonhug === null || ramdonhug === '' || ramdonhug === undefined) {
            
            ramdonhug = hug[Math.floor(Math.random() * hug.length)]

        }
        
        while (!ramdonhug2 || ramdonhug2 === null || ramdonhug2 === '' || ramdonhug2 === undefined) {
            
            ramdonhug2 = hug2[Math.floor(Math.random()*hug2.length)]

        }

        console.log('2Ramdonhug1: ' + ramdonhug)
        console.log('2Ramdonhug2: ' + ramdonhug2)
        
        if (!img || img.id === message.author.id) {
    
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** se está abrazando a sí mismo.`)
            .setImage(await ramdonhug2)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
    
        } else if (img.user.bot){
          
            return message.reply({ allowedMentions: { repliedUser: false}, embeds: [
          
                new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true}) })
                .setColor('RED')
                .setDescription(`Gracias por ese abrazo :3`)
          
            ]}).catch((e) => console.log('Error al enviar mensaje: '+e))
          
        } else {

            let usuario2 = await userSchema.findOne({idusuario: img.id})
            let text

            while(!usuario2){
 
                let user = await userSchema.create({

                    idusuario: img.id,
                    username: img.username,
    
                })
    
                user.save();
                console.log('Usuario Registrado ===> Id: '+ img.id + ' Username: ' + img.username)
    
                usuario2 = await userSchema.findOne({idusuario: img.id})

            }

            let update = await userSchema.findOneAndUpdate({idusuario: img.id},
                {

                    hug: usuario2.hug + 1
            
                });
            
            update.save()

            if((usuario2.hug + 1) === 1){
                
                text = '**'+(usuario2.hug + 1)+'** abrazo'

            } else{
            
                text = '**'+(usuario2.hug + 1)+'** abrazos'
          
            }
        
            const embed = new MessageEmbed()
            .setDescription(`**${message.author.username}** está abrazando a **${img.user.username}** :3 \n *${img.user.username}* ha recibido ${text} en total.`)
            .setImage(await ramdonhug)
            .setColor('RANDOM')
            .setTimestamp(new Date())
            .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() ? message.guild.iconURL({ dynamic: true }) : 'https://i.imgur.com/MNWYvup.gif' })

            message.channel.send({ embeds: [embed] }).catch((e) => console.log('Error al enviar mensaje: '+e))
      
        }

    }

}