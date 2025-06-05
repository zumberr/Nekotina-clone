# Nombre del Bot (Sally)

## Descripción General
Decidí hacerlo opensource, en agradecimiento a varias personas que tienen curiosidad y tratar que las cosas sean accesibles para todos. No está completo y por ello pido una disculpa.
Actualmente estoy viendo si integrar el mejoramiento de rendimiento del bot por IA y hacer más escalable el proyecto, aunque claro esto lo estaré implementando en los siguientes días.
Es una versión con menos cosas, la idea es recrear más no copiarla al 100%; los sistemas de economía y demás estaré haciéndolos futuramente.

## Características Principales
*   Moderación 
*   Música 
*   Economía 
*   Soporte para stickers 

## Instalación
### Prerrequisitos
*   Una versión reciente de Node.js. Debes tener Node.js descargado.
### Pasos
1.  Clona este repositorio: `git clone https://github.com/zumberr/Nekotina-clone`
2.  Instala las dependencias:
    ```bash
    npm i
    ```
3.  Inicia el bot:
    ```bash
    npm run start
    ```

## Configuración
*   La configuración principal se encuentra en `source/inhibitors/filter.json` (Nota: la ruta original era `src/inhibitors/filter.json`, se ha mantenido `source` según la nueva estructura). Este archivo contiene filtros y configuraciones para el comportamiento de ciertos comandos y funciones del bot. Asegúrate de revisar y ajustar este archivo según tus necesidades. Algunas cosas son requeridas y otras no tanto.
*   Considera usar un archivo `.env` para variables sensibles como el token del bot.

## Uso Básico
*   **Prefijo:** El bot responde a comandos que utilizan un prefijo. (El prefijo por defecto es `!` o puedes mencionarme para saberlo - Placeholder, ajustar si se conoce el prefijo real o cómo obtenerlo).
*   **Comando de Ayuda:** Para descubrir todos los comandos disponibles y cómo usarlos, utiliza el comando `help`. Por ejemplo: `!help` o `s!help <nombre_del_comando>`. .

## Contribuciones
¡Las contribuciones son bienvenidas! Si deseas mejorar el bot, por favor considera:
*   Abrir un "issue" para reportar bugs o sugerir nuevas características.
*   Enviar un "pull request" con tus mejoras.
*   Denle star al repo, es difícil mantenerlo activo y actualizado. Son necesarios para demostrar el apoyo de la comunidad al bot, y esto únicamente si tú deseas hacerlo.

## Licencia
Mientras respetes los derechos de autor de este código, no tendré problemas.
No permito si se distribuye comercialmente sin permiso. Simplemente, si quieres usar algunos comandos, tampoco tendré problemas.
Este proyecto es de código abierto. Puedes usar, modificar y distribuir el código bajo los términos de la licencia.

## Servidor de Soporte
Para cualquier duda, soporte, para usar los stickers o cualquier inquietud con referente a derechos de autor y demás, o si simplemente quieres charlar, únete a nuestro servidor de Discord:
[Enlace al Servidor de Discord](https://discord.gg/seelyrandom)
Es un servidor social, así que puedes aprovechar y relacionarte. Si me necesitas con urgencia, abre un ticket y dame ping.

## Aclaración y Disclaimer
*   **Aclaración:** Es difícil para mí mantener todo el código actualizado, por lo cual debes tener un conocimiento básico de Node.js o bueno, saber solucionar los errores para correr el código. Muchas personas me preguntan si pueden usar parte del código en sus bots (no tengo problema) con tal que tu bot respete la licencia y no sea de uso comercial, pero igual casi no hay casos así.
*   **Disclaimer:** Cualquier derecho y demás sobre "Nekotina" es originalmente a sus creador@s y cualquier duda será atendida con respecto a esto mismo.

