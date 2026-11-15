// Genera la narración con ElevenLabs y guarda audio + tiempos por palabra.
// Uso (en tu propia terminal, dentro de viventis-videos):
//   1) Crea el archivo .env con:  ELEVENLABS_API_KEY=tu_clave   (opcional: ELEVENLABS_VOICE_ID=...)
//   2) node tools/tts.mjs --list      -> lista tus voces
//   3) node tools/tts.mjs             -> genera public/voice/*.mp3 y public/voice/timing.json
// La clave nunca se imprime ni se guarda en otro lugar.
import fs from "node:fs";
import path from "node:path";

import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envFile = path.join(root, ".env");
if (fs.existsSync(envFile)) {
  for (const l of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Falta ELEVENLABS_API_KEY (ponlo en viventis-videos/.env).");
  process.exit(1);
}
const H = { "xi-api-key": KEY, "Content-Type": "application/json" };

if (process.argv.includes("--list")) {
  const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: H });
  if (!r.ok) { console.error("Error", r.status, await r.text()); process.exit(1); }
  const j = await r.json();
  for (const v of j.voices) {
    const l = v.labels || {};
    console.log([v.voice_id, v.name, l.gender, l.accent, l.age, l.description || l.descriptive, l.language].filter(Boolean).join(" | "));
  }
  process.exit(0);
}

const VOICE = process.env.ELEVENLABS_VOICE_ID || process.argv.find((a) => a.startsWith("--voice="))?.slice(8);
if (!VOICE) {
  console.error("Falta la voz: agrega ELEVENLABS_VOICE_ID=... a .env o usa --voice=ID (ver --list).");
  process.exit(1);
}
const MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const script = JSON.parse(fs.readFileSync(path.join(root, "src/narration.json"), "utf8"));
const outDir = path.join(root, "public/voice");
fs.mkdirSync(outDir, { recursive: true });

const timing = { voice: VOICE, model: MODEL, lines: [] };
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const tag = process.argv.find((a) => a.startsWith("--tag="))?.slice(6);
const L = script.lines;
for (let i = 0; i < L.length; i++) {
  const { id } = L[i];
  const text = MODEL === "eleven_v3" && L[i].v3 ? L[i].v3 : L[i].text;
  if (only && id !== only) continue;
  const body = {
    text,
    model_id: MODEL,
    language_code: "es",
    previous_text: MODEL === "eleven_v3" ? undefined : i > 0 ? L[i - 1].text : undefined,
    next_text: MODEL === "eleven_v3" ? undefined : i < L.length - 1 ? L[i + 1].text : undefined,
    voice_settings: MODEL === "eleven_v3"
      ? { stability: Number(process.env.TTS_STABILITY ?? 0.0), similarity_boost: 0.8, use_speaker_boost: true }
      : { stability: Number(process.env.TTS_STABILITY ?? 0.32), similarity_boost: 0.8, style: Number(process.env.TTS_STYLE ?? 0.6), use_speaker_boost: true, speed: Number(process.env.TTS_SPEED ?? 0.92) },
  };
  let r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST", headers: H, body: JSON.stringify(body),
  });
  if (!r.ok) {
    // some models reject language_code; retry without it
    delete body.language_code;
    r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST", headers: H, body: JSON.stringify(body),
    });
  }
  if (!r.ok) { console.error(id, "Error", r.status, await r.text()); process.exit(1); }
  const j = await r.json();
  fs.writeFileSync(path.join(outDir, tag ? `sample-${tag}-${id}.mp3` : `${id}.mp3`), Buffer.from(j.audio_base64, "base64"));
  const a = j.alignment || j.normalized_alignment;
  const words = [];
  let cur = null;
  let inTag = false;
  for (let k = 0; k < a.characters.length; k++) {
    const ch = a.characters[k];
    if (ch === "[") { inTag = true; if (cur) { words.push(cur); cur = null; } continue; }
    if (ch === "]") { inTag = false; continue; }
    if (inTag) continue;
    if (/\s/.test(ch)) { if (cur) { words.push(cur); cur = null; } continue; }
    if (!cur) cur = { w: "", start: a.character_start_times_seconds[k], end: 0 };
    cur.w += ch;
    cur.end = a.character_end_times_seconds[k];
  }
  if (cur) words.push(cur);
  const duration = a.character_end_times_seconds[a.character_end_times_seconds.length - 1];
  timing.lines.push({ id, text: L[i].text, duration, words });
  console.log(`ok ${id}  ${duration.toFixed(2)} s`);
}
if (!only) fs.writeFileSync(path.join(outDir, "timing.json"), JSON.stringify(timing, null, 2));
console.log("Listo: public/voice/timing.json");
