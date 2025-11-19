# Configuración del Bot 

## Requisitos Previos

- Node.js v16 o superior
- npm o yarn
- Una cuenta de bot de Discord
- MongoDB (opcional, para funciones de base de datos)

## Pasos de Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura las siguientes variables:

#### Obligatorio:
- `DISCORD_TOKEN`: Token de tu bot de Discord (obtenerlo en https://discord.com/developers/applications)

#### Opcional:
- `PREFIX`: Prefijo para comandos (por defecto: `!`)
- `OWNER_IDS`: IDs de propietarios separados por comas
- `MONGO_URI`: URI de conexión a MongoDB
- `OSU_KEY`: API key de osu!
- `GIPHY_API_KEY`: API key de Giphy
- `SOMERANDOM_API`: API key de Some Random API

### 3. Iniciar el Bot

#### Modo Producción (con sharding):
```bash
node shards.js
```

#### Modo Desarrollo (sin sharding):
```bash
node source/main.js
```

## Solución de Problemas

### Error: "No se ha configurado el token del bot"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que `DISCORD_TOKEN` está configurado en el archivo `.env`

### Error de MongoDB
- Si no necesitas MongoDB, puedes dejarlo en blanco
- Si lo necesitas, verifica que `MONGO_URI` esté correctamente configurado

### Comandos no funcionan
- Verifica que el bot tenga los permisos necesarios en tu servidor
- Verifica que el prefijo esté configurado correctamente

## Estructura del Proyecto

```
.
├── shards.js              # Punto de entrada con sharding
├── source/
│   ├── main.js           # Punto de entrada principal
│   ├── arguments/        # Cargadores de comandos y eventos
│   ├── commands/         # Comandos del bot organizados por categorías
│   ├── events/           # Eventos de Discord
│   ├── models/           # Modelos de base de datos
│   ├── monitors/         # Monitores y utilidades
│   └── scommands/        # Slash commands
├── .env                  # Configuración (NO COMPARTIR)
└── .env.example          # Plantilla de configuración
```

## Comandos Disponibles

Una vez iniciado el bot, usa `!help` (o el prefijo que hayas configurado) para ver todos los comandos disponibles.

## Soporte

Para reportar problemas o solicitar ayuda, visita:
- GitHub Issues: https://github.com/zumberr/Nekotina-clone/issues
