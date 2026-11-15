import narration from "../narration.json";

export type Word = { w: string; s: number; e: number }; // frames, relative to the scene
export type Voice = { file: string | null; start: number; dur: number; words: Word[] };
export type TimingFile = {
  lines: { id: string; text: string; duration: number; words: { w: string; start: number; end: number }[] }[];
};

export const FPS = 30;

/** Scene plan: which narration line each scene carries, lead-in and tail. */
export const PLAN = [
  { id: "s1", lead: 30, tail: 12, min: 0 }, // house exterior gets a beat before the voice
  { id: "s2", lead: 8, tail: 16, min: 0 },
  { id: "s3", lead: 8, tail: 16, min: 0 },
  { id: "s4", lead: 10, tail: 38, min: 0 }, // tail = door light floods the frame
  { id: "s5", lead: 12, tail: 14, min: 0 },
  { id: "s6", lead: 10, tail: 22, min: 0 },
  { id: "s7", lead: 8, tail: 12, min: 0 },
  { id: "s8", lead: 8, tail: 14, min: 0 },
  { id: "s9", lead: 8, tail: 6, min: 0 },
  { id: "end", lead: 0, tail: 0, min: 156 }, // Legal's line ≥ 5 s
] as const;

export const OVERLAP = 14; // transition frames between scenes

/** Fallback when no ElevenLabs timing exists yet: ~2.55 words/s with pauses on punctuation. */
const estimate = (text: string) => {
  const words: Word[] = [];
  let t = 0;
  for (const w of text.split(/\s+/)) {
    const len = 6 + w.length * 1.6;
    words.push({ w, s: Math.round(t), e: Math.round(t + len) });
    t += len + (/[.,:?]$/.test(w) ? 9 : 1.5);
  }
  return { dur: Math.round(t), words };
};

export type Layout = {
  total: number;
  scenes: { id: string; from: number; dur: number; voice: Voice }[];
};

export const buildLayout = (timing: TimingFile | null): Layout => {
  const scenes: Layout["scenes"] = [];
  let cursor = 0;
  PLAN.forEach((p, i) => {
    const line = narration.lines.find((l) => l.id === p.id);
    const t = timing?.lines.find((l) => l.id === p.id);
    let voice: Voice = { file: null, start: p.lead, dur: 0, words: [] };
    if (t) {
      voice = {
        file: `voice/${p.id}.mp3`,
        start: p.lead,
        dur: Math.ceil(t.duration * FPS),
        words: t.words.map((w) => ({
          w: w.w,
          s: p.lead + Math.round(w.start * FPS),
          e: p.lead + Math.round(w.end * FPS),
        })),
      };
    } else if (line) {
      const e = estimate(line.text);
      voice = {
        file: null,
        start: p.lead,
        dur: e.dur,
        words: e.words.map((w) => ({ ...w, s: w.s + p.lead, e: w.e + p.lead })),
      };
    }
    const dur = Math.max(p.min, p.lead + voice.dur + p.tail);
    const from = i === 0 ? 0 : cursor - OVERLAP;
    scenes.push({ id: p.id, from, dur, voice });
    cursor = from + dur;
  });
  // "viventis punto health" is spoken; the caption shows the address
  for (const sc of scenes) {
    const w = sc.voice.words;
    for (let i = 1; i < w.length - 1; i++) {
      if (/^punto$/i.test(w[i].w) && /^health/i.test(w[i + 1].w) && /^viventis$/i.test(w[i - 1].w)) {
        w.splice(i - 1, 3, { w: "viventis.health" + (w[i + 1].w.endsWith(".") ? "." : ""), s: w[i - 1].s, e: w[i + 1].e });
      }
    }
  }
  return { total: cursor, scenes };
};

/** Frame (scene-relative) where the first word matching `needle` starts. */
export const at = (v: Voice, needle: string, fallback = 0) => {
  const n = needle.toLowerCase();
  const w = v.words.find((x) => x.w.toLowerCase().replace(/[^a-záéíóúñü]/g, "").startsWith(n));
  return w ? w.s : fallback;
};
export const atEnd = (v: Voice) => (v.words.length ? v.words[v.words.length - 1].e : v.start);
