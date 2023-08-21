const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
    name: "enlearna",
    usage: "<prefix>enlearna <leccion>",
    aliases: [""],
    cooldown: 2,
    example: "enlearna 1", 
    description: "Aprender ingles nivel A1/A2. 20 lecciones en total.",
        async run(client, message, args, prefix) {
   try {
       let lection;
       lection = args[0];
       
           if(!lection) {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#fbd9ff")
            .setAuthor({ name: "Error Code: 7781" })
            .setDescription(`No se ha proporcionado la leccion.\n\nUso correcto del comando:\n\` ${this.usage} \``)
            ]
        })
               
               } else if(lection === "1") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #1" })
            .setDescription("**ALFABETO** <:emoji_23:1049518836354928640> \nEl alfabeto en inglés es muy similar al usado en español en su forma escrita, pero la pronunciación de cada una de sus letras cambia.\n-La Ch no se considera una letra del abecedario en inglés. Sin embargo, es común ver palabras con esta combinación de letras, muchas de ellas con el mismo sonido que se presenta en el español, por ejemplo: Chat, church, chest, entre otros. \n-La letra Ñ no existe en este idioma. \n-En ciertos acentos del inglés sucede que, cuando la letra R se ubica al final de una palabra, no se pronuncia. Por ejemplo, la R en la palabra war, cambiaría su sonido por la vocal a.")
            .setImage('https://i.ytimg.com/vi/kK3g3sY0FBI/maxresdefault.jpg')
            .setFooter('Clases de Inglés con Lenita')
], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.mx/blog/abecedario-en-ingles`).setStyle("LINK").setLabel("Leccion"))]
        })
                   
                                  } else if(lection === "2") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #2" })
            .setDescription("**NUMEROS** <:emoji_23:1049518836354928640> \nAprender los números en inglés es un fundamento clave para poder expresarte sobre cualquier tema, especialmente para preguntar o decir direcciones, números de teléfono, fechas, hacer cuentas, etc. \nExisten dos tipos de números: los cardinales y los ordinales. \nLos números que usamos comúnmente para hacer cuentas, (one, two, three...), son cardinales. \nPor otra parte, aquellos números que usamos para representar posición, hacer un listado o dar una orden, (first, second, third...), se denominan ordinales. ")
            .setImage('https://4.bp.blogspot.com/-qlzU9mYgdEc/WlO-eRcyBFI/AAAAAAAAImg/JiiUDKiUDpYajNbifObW3EQ50iCM_kuNgCLcBGAs/s640/011%2B-%2BNumeros%2B1.png')
            .setFooter('Clases de Inglés con Lenita')
], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a1/numeros-en-ingles/`).setStyle("LINK").setLabel("Leccion"))]
        })
                                      
                    } else if(lection === "3") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #3" })
            .setDescription("**COLORES** <:emoji_23:1049518836354928640> \nLos colores /The colors  son parte fundamental del vocabulario en inglés porque nos permiten describir todo lo que vemos, como el cielo o un delicioso helado. En esta página nos concentraremos en aprenderlos y practicarlos.\n Los colores se clasifican en: primarios, secundarios y terciarios. Como la teoría no cambia con el idioma, te presentaremos cómo se denominan dichos colores en inglés.")
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1055913321720721418/1654685012_image.png')
            .setFooter('Clases de Inglés con Lenita')
], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a1/los-colores-en-ingles/`).setStyle("LINK").setLabel("Leccion"))]
        })
                        
                        } else if(lection === "4") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #4" })
            .setDescription("**PARTES DEL CUERPO** <:emoji_23:1049518836354928640> \nEl cuerpo humano es algo fascinante, está conformado por diferentes partes. En la siguiente imagen podrás aprender cómo se llama cada una de estas, en inglés.\nEstúdialas detalladamente para incrementar tu vocabulario y avanzar en este proceso.")
            .setImage('https://gcfglobalidiomas.blob.core.windows.net/idiomas-container/course/en/levels/image/partescuerpo-01_xl.png')
            .setFooter('Clases de Inglés con Lenita')
], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a1/las-partes-del-cuerpo-en-ingles/`).setStyle("LINK").setLabel("Leccion"))]
        })
                            } else if(lection === "5") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #5" })
            .setDescription("**SALUDOS** <:emoji_23:1049518836354928640> \nExisten varias formas de saludar en inglés dependiendo del contexto. A continuación te compartimos las más frecuentes que puedes usar en un tono formal:\nHello! (¡Hola!)\nGood morning!  (¡Buenos días!)\nGood afternoon!  (¡Buenas tardes!)\nGood evening!  (¡Buenas noches!)\nHow are you? (¿Cómo está usted?)\nHow do you do?   (¿Cómo está usted?)\nHow are you doing?  (¿Cómo está usted?)\nNice to meet you!   (Encantada/o de conocerle)\nIt’s a pleasure to meet you   (Encantada/o de conocerle).\nLos saludos informales pueden encontrarlos en la siguiente imagen:")
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1055915459913977906/image.png')
            .setFooter('Clases de Inglés con Lenita')
], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a1/saludos-en-ingles/`).setStyle("LINK").setLabel("Leccion"))]
        })  
                            
               
                   } else if(lection === "6") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #6" })
            .setDescription("**PRONOMBRES PERSONALES** <:emoji_23:1049518836354928640> \nLos pronombres personales en función del sujeto reemplazan al sujeto de la oración. \nTIP: Te darás cuenta que en el español se omite, pero en el inglés siempre se muestra como parte importante de la oración.")
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1053407102179213332/image.png')
            .setFooter('Clases de Inglés con Lenita')
], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.ve/blog/aprende-ingles/pronombres`).setStyle("LINK").setLabel("Leccion"))]
        })
                                } else if(lection === "7") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #7" })
            .setDescription("**VERBO TO BE** <:emoji_23:1049518836354928640> \n El verbo to be es uno de los más camaleónicos del inglés, por lo que en muchas ocasiones su significado depende del contexto en el que te lo encuentres. Sin embargo, sus significados principales son los siguientes: \n**Ser**: He is smart = Él es inteligente \n**Estar**: It is cold today = Hoy está hacienda frío \n**Haber**: Is there anybody inside? = ¿Hay alguien adentro? \n**Poder**: Tell her she is not to open the door to strangers = Dile que no puede abrirle la puerta a extraños." ) 
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1053410761067737088/image.png')
            .setFooter('Clases de Inglés con Lenita')
                                 ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.mx/blog/verbo-to-be`).setStyle("LINK").setLabel("Leccion"))]

        })          
           } else if(lection === "8") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #8" })
            .setDescription("**ORACIONES INTERROGATIVAS** <:emoji_23:1049518836354928640> \nRecordemos que, según el contexto en el que usemos el verbo to be (ser o estar en español), se obtiene información específica sobre el aspecto o estado, situación o ubicación de algo o alguien. Para hacer preguntas con el verbo to be simplemente debes invertir el lugar del verbo y el sujeto." ) 
            .setImage('https://cdn.discordapp.com/attachments/1041541025879048355/1053432558152597594/image.png')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.ve/blog/aprende-ingles/oraciones-interrogativas`).setStyle("LINK").setLabel("Leccion"))]

        })       
                          } else if(lection === "9") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #9" })
            .setDescription("**PRESENTE SIMPLE** <:emoji_23:1049518836354928640> \n*Claves para utilizar el present simple* \n\nEstablezcamos algunas condiciones claves para que puedas usar y expresarte correctamente con el presente simple:\n1. Cuando quieres comunicar estados o acciones permanentes. Ejemplo: The earth is the third planet from the sun.\n2. Al manifestar estados o situaciones que son rutinarias o acciones que tienen periodicidad. Ejemplo: Every ten years is a decade. \n3. Para hablar de hábitos, rutinas o hechos que se repiten en lapsos de tiempo determinado. Ejemplo: I drink coffee every morning.\n4. Cuando das indicaciones, instrucciones y señales. Ejemplo: You go down this street to the cinema, then you turn right.\n5. Para transmitir citas, hechos o compromisos que pasarán en un tiempo determinado. Ejemplo: Tomorrow is my birthday \n\nSaber emplear el presente simple en inglés no es sólo conocer su estructura, se debe entender también la forma adecuada para su conjugación correcta de los verbos en present simple ." ) 
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1053504294676090970/image.png')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.co/blog/aprende-ingles/present-simple`).setStyle("LINK").setLabel("Leccion"))]

        })  
                     } else if(lection === "10") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #10" })
            .setDescription("**PRESENTE SIMPLE 2** <:emoji_23:1049518836354928640> \n*Reglas del presente simple y la tercera persona* \n\nPodremos observar cómo el present simple influye únicamente en la tercera persona de esta forma:\n\nEn las oraciones afirmativas del present simple a todos los verbos se les adiciona una -s al final. No olvides que, al encontrarse en oraciones negativas e interrogativas, la -s no debe ponerse.\n\nCuando los verbos finalizan en -o, -sh, -ch, -ss, -x y -z debes añadirles -es al final. Por ejemplo: verbo to go = He go**es**.\n\nPara los verbos finalizados en -y, debes reemplazar la -y por i y luego adicionar -es. Por ejemplo: verbo to cry = She cries.\n\nExiste otra excepción para los verbos terminados en -y. Cuando hay una vocal antes de la -y, debes conservar esta y adicionar la -s. Por ejemplo: verbo to play = She play**s**" ) 
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1053508612007403590/image.png')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.co/blog/aprende-ingles/present-simple`).setStyle("LINK").setLabel("Leccion"))]
                    })  
                         
                         } else if(lection === "11") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #11" })
            .setDescription("**PRESENTE CONTINUO** <:emoji_23:1049518836354928640> \nLos cinco usos principales del present continuous son:\nDescribir acciones que ocurren en el momento exacto en que se habla o escribe. Ejemplo: You are studying English.\nEstablecer contextos. Hablar de situaciones generales, personales o sociales, que ocurren en la actualidad. En estos casos, se puede acompañar por adverbios como currently, lately o these days, entre otros. Ejemplo: She is working a lot lately.\nAdelantar hechos, citas, eventos o acciones que ocurrirán en el futuro. Quien habla debe estar seguro de que ocurrirán. Ejemplo: They are going to the zoo next Saturday.\nMencionar hechos temporales. Ejemplo: Today is snowing, but yesterday was sunny.\nDescribir acciones que ocurren constantemente. En estos casos la oración se refuerza con adverbios como always, forever, constantly, entre otros. Ejemplo: The birds are always singing since sunrise.\n\n**Cómo formar el present continuos?**\n>Afirmativo: Sujeto + verbo to be + verbo en gerundio + complemento \n>Negativo: Sujeto + verbo to be + not + verbo en gerundio + complemento \n>Interrogativo: Verbo to be + sujeto + verbo en gerundio + complemento." ) 
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1055941771500204114/image.png')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.mx/blog/present-continuous`).setStyle("LINK").setLabel("Leccion"))]
                    })
                         
                         } else if(lection === "12") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #12" })
            .setDescription("**ADVERBIOS DE LUGAR** <:emoji_23:1049518836354928640> \nComo lo indica su nombre, determinan el sitio en donde la acción ocurre.Y se ubican después del verbo principal de la oración, así:\n Subject + Verb + Adverb + Complement.\nAlgunos de los más comunes son:" ) 
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1055916611346907206/image.png')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a2/que-son-los-adverbios-de-lugar-en-ingles/`).setStyle("LINK").setLabel("Leccion"))]
                    })  
                             
                             } else if(lection === "13") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #13" })
            .setDescription("**PREPOSICIONES DE LUGAR** <:emoji_23:1049518836354928640> \nAhora que puedes expresar cuando algo sucede en un lugar en específico, aprende cómo decir que algo está en determinado lugar.\nLas preposiciones de lugar o prepositions of place, nos permiten decir con exactitud el lugar dónde se encuentran las cosas.\n\n**In:** Dentro de, en el interior. Ex: Mary is **in** the hospital.\n**At:** En, al lado de, junto a. Ex: Carlos is **at** home.\n**On:** Encima de, sobre. Ex: The food is **on** the table.\n**Next to:**  Al lado de. Ex: The cat is **next to** the couch.\n**Between:**  Entre. Ex: My school is **between** the library and the hospital.\n**Behind:** Detrás. Ex: The glasses are **behind** those dishes.\n**In front of:** Enfrente de. Ex: She is sitting **in front of** me.\n**Opposite:** Opuesto a, del otro lado. Ex: The bank is **opposite** the train station.\n**Under:** Debajo de. Ex: The dog is **under** your bed.\n**Above:** Encima de. Ex: The clock is **above** the chair.\n**Below:** Por debajo de. Ex: We are walking **below** the bridge.")
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/gramatica/preposiciones-de-lugar-en-ingles/`).setStyle("LINK").setLabel("Leccion"))]
                    })
                             
                         
                         } else if(lection === "14") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #14" })
            .setDescription("**ORACIONES INTERROGATIVAS 2** <:emoji_23:1049518836354928640> \nAquí te hablaremos de las 8 preguntas WH, que son los pronombres y adverbios interrogativos del inglés. Estas te ayudarán a obtener información sobre personas, cosas, tiempo, razones o lugares. Si bien 7 de estas inician con w y h, hay una excepción al hablar de how." ) 
            .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1053854505298567249/image.png')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.ve/blog/aprende-ingles/oraciones-interrogativas`).setStyle("LINK").setLabel("Leccion"))]

        })
                             } else if(lection === "15") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #15" })
            .setDescription("**TIEMPO PASADO** <:emoji_23:1049518836354928640> \nPara conjugar los verbos regulares en tiempo pasado solo debes agregarles la terminación *ed*, por ejemplo: Work (trabajar) - Worked\nEn caso que el verbo termine en *e*, sólo debes agregar la letra *d*. Ejemplo: Hope (esperar) - Hoped\nSi el verbo termina una consonante y en *y*, remplazas esta última letra por una *i*. Después le agregas la terminación *ed*. Ejemplo: Carry (cargar) - Carried, Cry (llorar) - Cried\nPor último, en algunos verbos que terminan en consonante deberás duplicar la letra final antes de agregar la terminación *ed*. Deberás hacerlo cuando el acento de la palabra vaya en la última sílaba. Por ejemplo: Stop (parar) - Stopped, Program (programar) - Programmed. \n\nPara los verbos irregulares esto no aplica, pueden estudiarlos en la siguiente imagen:" ) 
            .setImage('https://gcfglobalidiomas.blob.core.windows.net/idiomas-container/course/en/levels/image/tabla-verbos-1_xl.png')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a2/verbos-irregulares-en-ingles/`).setStyle("LINK").setLabel("Leccion"))]

        })
                                 
                               } else if(lection === "16") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #16" })
            .setDescription("**PASADO SIMPLE** <:emoji_23:1049518836354928640> \nEl simple past tense o tiempo pasado simple se utiliza para hablar de acciones o situaciones que se dieron en algún momento del pasado.\nEn la leccion anterior aprendiste a conjugar verbos regulares e irregulares en este tiempo de forma afirmativa.\n**Negativo**\nPara construir oraciones en pasado simple en su forma negativa se tiene que utilizar el auxiliar do/does, el cual es el único que se conjuga en pasado. El verbo principal permanece en su forma infinitiva. Por ejemplo: \nAfirmativa: I went to your house on my bicycle (Fui a tu casa en mi bicicleta).\nNegativa: I **didn’t** go to your house on my bicycle (No fui a tu casa en mi bicicleta).\n**Interrogativo**\nEn cuanto a las oraciones interrogativas, nuevamente hay que usar el auxiliar do/does. Al igual que en la forma negativa, solo el auxiliar se conjuga en pasado, mientras el verbo principal se queda en su forma infinitiva. \nAfirmativa: You remembered the correct answer just before the end of test time (Tú recordaste la respuesta correcta justo antes del final del examen).\nInterrogativa: **Did** you remember the correct answer just before the end of test time? (¿Recordaste la respuesta correcta justo antes del final del examen)." ) 
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.mx/blog/past-simple`).setStyle("LINK").setLabel("Leccion"))]

        })  
                                   
                                   } else if(lection === "17") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #17" })
            .setDescription("**PASADO CONTINUO** <:emoji_23:1049518836354928640> \nEl past continuous en inglés se usa para:\n1. Expresar acciones o estados que estaban llevándose a cabo en el pasado cuando otra acción o estado la interrumpe o refuerza. Por ejemplo: I was walking when I saw an eagle (Estaba caminando cuando vi un águila).\n2. Ofrecer contexto, es decir, dar información sobre hechos o situaciones en un tiempo específico. Ejemplo: Last year, I was studying for the exams (El año pasado, estaba estudiando para los exámenes)\n3. Mencionar dos o más acciones del pasado que sucedieron al mismo tiempo. Ejemplo: While my son was playing videogames, I was sleeping in his bedroom (Mientras mi hijo estaba jugando videojuegos, yo estaba durmiendo en su recámara)." ) 
            .setImage('https://www.britishcouncil.org.mx/sites/default/files/styles/bc-square-630x630/public/past_continuous_1.png?itok=UWbjUFWu')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.org.mx/blog/past-simple`).setStyle("LINK").setLabel("Leccion"))]

        })  
                                       
                                       } else if(lection === "18") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #18" })
            .setDescription("**AUXILIAR DO/DOES** <:emoji_23:1049518836354928640> \nEl verbo to do o to does  se traduce como hacer al español. Así como el verbo to be, to do  varía de forma en tiempo presente dependiendo con qué pronombre se conjuga. Usamos Do con los pronombres I, you, we y they, y Does con los pronombres he, she e it." ) 
            .setImage('https://sites.google.com/site/inglesdodoes/_/rsrc/1378933670686/home/-que-son-los-verbos-auxiliares/si.png?height=245&width=400')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a2/uso-de-do-y-does/`).setStyle("LINK").setLabel("Leccion"))]

        })  
                                           } else if(lection === "19") {
        return message.reply({
            embeds: [new MessageEmbed()
            .setColor("#b6ccf0")
            .setAuthor({ name: "Leccion #19" })
            .setDescription("**AUXILIAR HAVE/HAS** <:emoji_23:1049518836354928640> \nEl verbo auxiliar to have  significa tener. Una de sus particularidades es que cambia dependiendo del pronombre con que se conjugue, así que usamos have con los pronombres I, you, we  y they, pero has con los pronombres he, she, it." ) 
            .setImage('https://es-static.z-dn.net/files/d55/ff756e40b39a9553a3a388e1e9d57d24.jpg')
            .setFooter('Clases de Inglés con Lenita')
           ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://idiomas.gcfglobal.org/es/curso/ingles/a2/uso-de-have-y-has/`).setStyle("LINK").setLabel("Leccion"))]

        })  
                             
                             
                         } else if(lection === "20") {
                             return message.reply({
                                 embeds: [new MessageEmbed()
                               .setColor("#b6ccf0")
                               .setAuthor({ name: "Leccion #20"})
                               .setDescription("**ADVERBIOS DE FRECUENCIA** <:emoji_23:1049518836354928640> \nEstos adverbios nos permiten exponer con qué regularidad ocurre algo. \nLos adverbios de frecuencia, como su nombre indica, sirven para señalar cada cuánto tiempo se produce la acción del verbo o con qué periodicidad sucede lo expresado por la frase entera. A excepción de “hardly ever” (“casi nunca”), los adverbios de frecuencia en inglés están formados por una sola palabra. Pero ¿cómo saber cuál hay que usar en cada ocasión? Eso depende del nivel de regularidad que quieras transmitir. La tabla siguiente te ayudará:")
                                .setImage('https://cdn.discordapp.com/attachments/987554348131295263/1054122842486214676/image.png')
                                .setFooter('Clases de Inglés con Lenita')
                               ], components: [new MessageActionRow().addComponents(new MessageButton().setURL(`https://www.britishcouncil.es/blog/como-utilizar-adverbios-frecuencia-ingles`).setStyle("LINK").setLabel("Leccion"))]
                             })
                                 

           }
    } catch (error) {
       console.log(`${error.stack} || ${this.name} || ${message} || ${message.author} || ${message.guild.name}`)
        }
    }
}
    