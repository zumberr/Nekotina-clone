# Sistema de Música con Lavalink

Este bot incluye un sistema de música completo usando Lavalink, que proporciona audio de alta calidad y rendimiento para Discord.

## 📋 Características

- 🎵 Reproducción de música desde YouTube, SoundCloud y más
- 📃 Sistema de cola con paginación
- 🔁 Modos de repetición (canción/cola)
- 🔊 Control de volumen
- ⏯️ Controles de reproducción (play, pause, skip, stop)
- 🎨 Embeds visuales atractivos
- 🔒 Verificación de permisos de canal de voz

## 🚀 Configuración

### 1. Servidor Lavalink

El sistema usa un servidor público de Lavalink por defecto (`lava.link`). La configuración se encuentra en:

```
source/config/lavalink.json
```

**Configuración por defecto:**
```json
{
  "nodes": [
    {
      "host": "lava.link",
      "port": 80,
      "password": "youshallnotpass",
      "secure": false,
      "retryAmount": 5,
      "retryDelay": 3000
    }
  ]
}
```

### 2. Spotify (Opcional)

Para habilitar la búsqueda de Spotify, agrega tus credenciales en `source/config/lavalink.json`:

```json
{
  "spotify": {
    "clientID": "tu_client_id_aqui",
    "clientSecret": "tu_client_secret_aqui"
  }
}
```

**Cómo obtener credenciales de Spotify:**
1. Ve a https://developer.spotify.com/dashboard
2. Crea una nueva aplicación
3. Copia el Client ID y Client Secret

### 3. Nodos Lavalink Alternativos

Si el servidor por defecto no funciona, puedes usar otros servidores públicos:

**Opción 1 - lavalink.eu:**
```json
{
  "host": "lavalink.eu",
  "port": 2333,
  "password": "catfein",
  "secure": false
}
```

**Opción 2 - Servidor propio:**
Puedes ejecutar tu propio servidor Lavalink siguiendo la [documentación oficial](https://github.com/freyacodes/Lavalink).

## 🎮 Comandos Disponibles

### Reproducción

| Comando | Alias | Descripción | Uso |
|---------|-------|-------------|-----|
| `!play` | `p`, `reproducir` | Reproduce una canción o playlist | `!play despacito` |
| `!pause` | `pausar` | Pausa la reproducción actual | `!pause` |
| `!resume` | `reanudar`, `continuar` | Reanuda la reproducción pausada | `!resume` |
| `!skip` | `s`, `saltar`, `next` | Salta la canción actual | `!skip` |
| `!stop` | `detener`, `dc`, `leave` | Detiene la música y desconecta el bot | `!stop` |

### Cola y Control

| Comando | Alias | Descripción | Uso |
|---------|-------|-------------|-----|
| `!queue` | `q`, `cola` | Muestra la cola de reproducción | `!queue [página]` |
| `!nowplaying` | `np`, `now`, `actual` | Muestra la canción actual | `!nowplaying` |
| `!clear` | `limpiar`, `clearqueue` | Limpia toda la cola | `!clear` |
| `!volume` | `vol`, `v`, `volumen` | Ajusta el volumen (1-100) | `!volume 50` |
| `!loop` | `repeat`, `repetir` | Cambia el modo de repetición | `!loop [track/queue/off]` |

## 📝 Ejemplos de Uso

### Reproducir una canción:
```
!play imagine dragons believer
!play https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Reproducir una playlist:
```
!play https://www.youtube.com/playlist?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG
```

### Ver la cola:
```
!queue        # Ver la primera página
!queue 2      # Ver la página 2
```

### Modos de repetición:
```
!loop track   # Repetir la canción actual
!loop queue   # Repetir toda la cola
!loop off     # Desactivar repetición
!loop         # Cambiar entre modos automáticamente
```

### Ajustar volumen:
```
!volume 75    # Establecer volumen al 75%
!volume       # Ver volumen actual
```

## 🏗️ Estructura del Sistema

```
source/
├── config/
│   └── lavalink.json          # Configuración de Lavalink
├── utils/
│   └── musicManager.js        # Gestor principal de música
├── commands/
│   └── Musica/
│       ├── play.js            # Comando de reproducción
│       ├── pause.js           # Pausar música
│       ├── resume.js          # Reanudar música
│       ├── skip.js            # Saltar canción
│       ├── stop.js            # Detener música
│       ├── queue.js           # Ver cola
│       ├── nowplaying.js      # Canción actual
│       ├── volume.js          # Control de volumen
│       ├── clear.js           # Limpiar cola
│       └── loop.js            # Modo de repetición
└── events/
    └── startup.js             # Inicialización del manager
```

## 🔧 Funciones del Manager

El archivo `source/utils/musicManager.js` exporta las siguientes funciones útiles:

### `initMusicManager(client)`
Inicializa el gestor de música y configura todos los eventos.

### `checkVoiceChannel(member)`
Verifica si un usuario está en un canal de voz válido.

**Retorna:**
```javascript
{
  valid: boolean,
  message?: string  // Solo si valid es false
}
```

### `checkSameVoiceChannel(member, player)`
Verifica si el usuario está en el mismo canal de voz que el bot.

### `formatDuration(ms)`
Convierte milisegundos a formato legible (HH:MM:SS).

## 📡 Eventos del Sistema

El sistema emite los siguientes eventos automáticamente:

- **trackStart**: Se reproduce una nueva canción
- **queueEnd**: La cola ha terminado
- **playerMove**: El bot fue movido de canal
- **trackStuck**: Una canción se quedó atascada
- **trackError**: Error al reproducir una canción
- **nodeConnect**: Conexión exitosa con Lavalink
- **nodeError**: Error en el nodo de Lavalink

## ⚠️ Solución de Problemas

### El bot no reproduce música:

1. **Verifica que Lavalink esté funcionando:**
   - Revisa los logs del bot al iniciar
   - Busca el mensaje: "Nodo de Lavalink conectado"

2. **Prueba con otro servidor:**
   - Cambia la configuración en `source/config/lavalink.json`
   - Reinicia el bot

3. **Verifica permisos:**
   - El bot necesita permisos de "Conectar" y "Hablar" en el canal de voz

### Error "No se encontraron resultados":

- Verifica que la URL sea válida
- Prueba con diferentes términos de búsqueda
- Asegúrate de que el servidor de Lavalink esté funcionando

### El bot se desconecta automáticamente:

- Es normal si no hay música en la cola durante 2 minutos
- Para evitarlo, agrega más canciones a la cola

## 🆕 Personalización

### Cambiar el tiempo de inactividad:

Edita `source/utils/musicManager.js`, línea ~76:

```javascript
setTimeout(() => {
    if (!player.playing && player.queue.size === 0) {
        player.destroy();
    }
}, 120000); // 120000ms = 2 minutos
```

### Cambiar colores de los embeds:

Los colores están definidos en cada comando. Por ejemplo, en `play.js`:

```javascript
.setColor("#4B0082")  // Índigo
```

Puedes usar:
- Nombres: `"RED"`, `"GREEN"`, `"BLUE"`, etc.
- Hex: `"#FF0000"`, `"#00FF00"`, etc.
- RGB: `[255, 0, 0]`

### Agregar más comandos:

Crea un nuevo archivo en `source/commands/Musica/` siguiendo la estructura:

```javascript
const { MessageEmbed } = require("discord.js");
const { checkSameVoiceChannel } = require("../../utils/musicManager");

module.exports = {
    name: "nombre_comando",
    aliases: ["alias1", "alias2"],
    description: "Descripción del comando",
    category: "music",
    usage: "<uso>",
    cooldown: 3,

    async execute(client, message, args) {
        const player = client.manager.get(message.guild.id);

        if (!player) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription("❌ No hay música reproduciéndose.")
                ]
            });
        }

        // Tu lógica aquí
    }
};
```

## 📚 Recursos Adicionales

- [Documentación de Lavalink](https://github.com/freyacodes/Lavalink)
- [Documentación de Erela.js](https://erela.js.org/)
- [Lista de servidores públicos de Lavalink](https://lavalink-list.darrennathanael.com/)

## 🤝 Contribuir

Si encuentras bugs o quieres agregar características:

1. Reporta issues en GitHub
2. Crea un fork del repositorio
3. Envía un pull request con tus mejoras

---

**Desarrollado con ❤️ para el proyecto Nekotina-clone**
