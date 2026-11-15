# VIDEOS-IA · Videos de Viventis hechos con IA

Repositorio para crear videos de marca para **Viventis** (membresía de descuentos médicos en Texas; **no es un seguro**) con un agente de IA (Claude Code, Codex, Cursor, etc.).
Los videos se programan en código con [Remotion](https://www.remotion.dev/) (React → MP4), la voz se genera con **ElevenLabs** y todo sigue las reglas de marca de Viventis.

> **Humano:** lo único que necesitas configurar es tu API key de ElevenLabs (paso 2). Luego abre el repo con tu agente de IA y pídele un video, por ejemplo:
> *"Lee el README y crea un Short 9:16 en español sobre cómo preguntar tu precio con descuento antes de tu cita."*

---

## 1. Requisitos

- Node.js 20.19+ / 22.13+ / 24+
- Una cuenta de [ElevenLabs](https://elevenlabs.io) (para la voz)
- Opcional: un agente de IA que lea este repo (Claude Code carga automáticamente las skills de `.claude/skills/`)

## 2. Configuración (lo único que tienes que hacer)

```bash
cd viventis-videos
npm i --loglevel=error
cp .env.example .env        # en Windows PowerShell: Copy-Item .env.example .env
```

Abre `viventis-videos/.env` y reemplaza `pon_tu_api_key_aqui` por tu clave ([consíguela aquí](https://elevenlabs.io/app/settings/api-keys)).
`.env` está en `.gitignore`: **tu clave nunca se sube al repositorio.**

---

## 3. Instrucciones para el agente de IA

**Lee esta sección completa antes de escribir un guion o una composición.**

### 3.1 Orden de lectura obligatorio

1. **`.claude/skills/viventis-brand-video/SKILL.md`** — reglas de la casa: paleta, tipografía, logo, línea legal literal, palabras prohibidas, precios, formatos y checklist antes de publicar. **Estas reglas mandan sobre cualquier otra skill.**
2. `.claude/skills/viventis-brand-video/references/` — ideas de videos aprobadas y material de apoyo.
3. Para el oficio (movimiento, audio, render): `.claude/skills/business-motion-film/` y `.claude/skills/remotion-*/`. Si contradicen a `viventis-brand-video`, gana `viventis-brand-video`.
4. El video existente en `viventis-videos/src/v2/` como ejemplo de referencia de estructura, ritmo y subtítulos.

### 3.2 Mapa del repositorio

| Ruta | Qué es |
|---|---|
| `arte-viventis/` | Fuentes de marca: manual de marca, guía de YouTube, precios (PDF) y kit gráfico oficial `Viventis_Graphic_Elements_2026-11/`. No redibujar ni recolorear. |
| `viventis-videos/` | Proyecto Remotion. |
| `viventis-videos/src/Root.tsx` | Registro de composiciones (cada video es una `<Composition id=...>`). |
| `viventis-videos/src/narration.json` | Guion por escenas (`id`, `text`, y `v3` con etiquetas de emoción para el modelo `eleven_v3`). |
| `viventis-videos/src/v2/` | Video de ejemplo "Lo que más importa" v2 (Short 9:16 ES): `Film2.tsx` (composición), `scenes2.tsx` (escenas), `timing.ts` (sincroniza escenas y subtítulos con la voz). |
| `viventis-videos/src/theme.ts`, `ui.tsx`, `characters.tsx` | Paleta, componentes de UI de marca y personajes ilustrados en SVG. |
| `viventis-videos/public/brand/` | Copias de los elementos de marca usados en los videos. |
| `viventis-videos/public/voice/` | Audios generados (`s1.mp3`…) y `timing.json` con tiempos por palabra. |
| `viventis-videos/public/music/` | Música de fondo. |
| `viventis-videos/tools/tts.mjs` | Genera la voz con ElevenLabs a partir de `narration.json`. |
| `viventis-videos/out/` | Renders (ignorado por git). |

### 3.3 Flujo para crear un video nuevo

1. **Brief:** formato (Short 9:16 1080x1920 o largo 16:9), idioma (uno solo por video, español primero, tutear), mensaje principal. Confírmalo con el humano si no está claro.
2. **Guion:** escribe las escenas en un JSON de narración (copia la forma de `src/narration.json`; usa un archivo nuevo o reemplaza el actual si el humano lo pide). Respeta las frases obligatorias, los cuatro servicios en orden y la línea legal **literal** de la skill de marca.
3. **Voz** (gasta créditos de ElevenLabs; hazlo solo cuando el guion esté aprobado):
   ```bash
   cd viventis-videos
   node tools/tts.mjs --list                                  # ver voces disponibles
   ELEVENLABS_MODEL=eleven_v3 node tools/tts.mjs --voice=ID   # genera public/voice/*.mp3 + timing.json
   ```
   En PowerShell: `$env:ELEVENLABS_MODEL="eleven_v3"; node tools/tts.mjs --voice=ID`.
   Si no hay `.env` con `ELEVENLABS_API_KEY`, **detente y pide al humano que lo configure** (paso 2). Nunca imprimas ni escribas la clave en ningún archivo versionado.
4. **Composición:** crea una carpeta nueva en `src/` (p. ej. `src/v3/`) basándote en `src/v2/`, y regístrala en `src/Root.tsx` con un `id` descriptivo (`NombreVideo-ES-9x16`).
5. **Previsualizar:** `npm run dev` (Remotion Studio). **Verificar:** `npm run lint`.
6. **Render:** `npx remotion render <id-composicion> out/<archivo>.mp4`.
7. **Checklist:** recorre la checklist de `viventis-brand-video/SKILL.md` y deja un `out/LEEME-<video>.md` con guion, descripción de YouTube y puntos pendientes de aprobación. Todo video es **BORRADOR** hasta aprobación escrita de Viventis.

### 3.4 Reglas que nunca se rompen (resumen; el detalle está en la skill)

- Decir siempre que **no es un seguro**; línea legal literal, sin acortar ni traducir.
- Nada de personas generadas por IA, caras de stock, estadísticas inventadas ni "ahorra X%".
- Precios solo en el video de precios, totales exactos de la skill; nunca en miniaturas.
- Solo la tipografía Plus Jakarta Sans y la paleta oficial; el logo nunca se agranda, estira ni recolorea.
- Nunca subir `.env` ni claves API al repositorio.

---

## 4. Comandos útiles

```bash
cd viventis-videos
npm run dev                                   # Remotion Studio (vista previa)
npm run lint                                  # ESLint + TypeScript
npx remotion render LoQueMasImporta-v2-ES-9x16 out/ejemplo.mp4
node tools/tts.mjs --list                     # voces de ElevenLabs
```

Remotion puede requerir licencia de empresa según el caso: <https://github.com/remotion-dev/remotion/blob/main/LICENSE.md>.
