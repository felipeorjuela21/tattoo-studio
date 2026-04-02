# Tattoo Studio — Galería + Agenda WhatsApp + Asistente IA (imágenes GRATIS)

Este proyecto está listo para desplegar con **Next.js 14 + TailwindCSS** y trae:
- **/galeria**: grid con filtros y lightbox simple.
- **/agenda**: formulario que abre **WhatsApp** con el mensaje preparado.
- **/asistente**: chat tipo webview; modo **Generar imagen (GRATIS)** usa Pollinations (sin API key).

> **Nota:** El chat de texto (no las imágenes) es opcional y requiere `OPENAI_API_KEY` si quieres usar OpenAI.
> Por defecto, el chat queda en **modo demo**.

---

## Instalación (paso a paso)

1. **Requisitos**
   - Node.js 18+
   - npm 9+

2. **Descarga y descomprime**
   - Descomprime el ZIP o clónalo en tu máquina.

3. **Instala dependencias**
   ```bash
   npm i
   ```

4. **Configura variables (opcional)**
   - Copia `.env.example` a `.env.local` y ajusta:
     - `NEXT_PUBLIC_WHATSAPP_NUMBER`: tu número de WhatsApp en formato internacional (ej. 57313xxxxxxx).
     - `OPENAI_API_KEY` *(opcional para el chat)*.

5. **Ejecuta en desarrollo**
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000

6. **Despliegue en Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```
   Recuerda definir en Vercel tus variables de entorno.

---

## ¿Cómo es gratis la generación de imágenes?
Usamos la URL pública de **Pollinations** que genera y sirve una imagen basada en tu prompt **sin costo**. El endpoint puede estar sujeto a límites/cambios del proveedor. Si prefieres un proveedor con SLA/controles, te puedo integrar Stable Horde (gratuito con rate limits) o un modelo propio en GPU.

- Código: `lib/images.ts`
- API: `app/api/image/route.ts`

---

## Personalización rápida
- Cambia la lista de imágenes en `app/galeria/page.tsx` (const `ITEMS`).
- Ajusta estilos en `app/globals.css`.
- Cambia el prompt del sistema del chat en `lib/openai.ts`.
- Integra agenda real (Google Calendar/Calendly) o base de datos (Supabase) si lo necesitas.

---

## Scripts
- `npm run dev` — Desarrollo
- `npm run build` — Build de producción
- `npm start` — Servir producción

---

## Licencia
Uso libre para tu estudio. Las imágenes generadas vía Pollinations siguen sus términos.
