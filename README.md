# FlightWise Frontend

Interfaz web de **FlightWise**, un asistente de viajes construido con **Next.js 16 + React 19**.
Permite conversar con un backend de IA para obtener recomendaciones de vuelos y visualizar resultados en formato de tarjetas.

## Características

- Chat en tiempo real con historial en sesión.
- Sugerencias iniciales de consultas (destinos/alojamiento).
- Renderizado de respuestas en Markdown.
- Parseo de vuelos en texto para mostrarlos como tarjetas (`FlightCard`).
- Enlace directo a Google Flights cuando viene en la respuesta del backend.
- API route interna (`/api/chat`) que funciona como proxy al backend.

## Requisitos

- Node.js 20+
- npm 10+

## Configuración

La app usa la variable de entorno:

- `BACKEND_URL` (opcional): URL del backend que responde el chat.
	- Valor por defecto: `http://api:8080/api/chat`

Puedes crear un archivo `.env.local` con, por ejemplo:

```env
BACKEND_URL=http://localhost:8080/api/chat
```

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abrir en: [http://localhost:3000](http://localhost:3000)

## Build de producción

```bash
npm run build
npm run start
```

## Ejecutar con Docker

Construir imagen:

```bash
docker build -t flightwise-front .
```

Ejecutar contenedor:

```bash
docker run --rm -p 3000:3000 -e BACKEND_URL=http://host.docker.internal:8080/api/chat flightwise-front
```

## Estructura principal

```text
app/
	page.tsx                  # Entrada principal (renderiza ChatInterface)
	api/chat/route.ts         # Proxy al backend
	components/
		ChatInterface.tsx       # Lógica principal de conversación
		ChatInput.tsx           # Input y envío de mensajes
		ChatMessage.tsx         # Render Markdown + parseo de vuelos
		FlightCard.tsx          # Tarjeta visual de vuelo
```

## Scripts

- `npm run dev` — entorno de desarrollo.
- `npm run build` — compila la app para producción.
- `npm run start` — levanta la build de producción.
- `npm run lint` — ejecuta ESLint.

## Notas

- El frontend envía `sessionId` y `message` al backend.
- Se espera que el backend retorne JSON con la propiedad `response`.
