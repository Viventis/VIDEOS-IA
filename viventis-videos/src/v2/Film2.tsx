import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { none } from "@remotion/transitions/none";
import { slide } from "@remotion/transitions/slide";
import { C, fontFamily } from "../theme";
import { LegalLowerThird, easeOut } from "../ui";
import { Layout, OVERLAP, TimingFile, buildLayout } from "./timing";
import { S1Sunrise, S2Fridge, S3Question, S4Goodnight, S5Brand, S6CallAhead, S7Services, S8Family, S9CTA, SEnd, SceneProps } from "./scenes2";

export type Film2Props = { music: string; timing: TimingFile | null; layout?: Layout };

const SCENES: Record<string, React.FC<SceneProps>> = {
  s1: S1Sunrise,
  s2: S2Fridge,
  s3: S3Question,
  s4: S4Goodnight,
  s5: S5Brand,
  s6: S6CallAhead,
  s7: S7Services,
  s8: S8Family,
  s9: S9CTA,
  end: SEnd,
};

// How each scene enters (the scene before it is underneath)
const ENTRY: Record<string, "fade" | "none" | "slide"> = {
  s2: "fade",
  s3: "fade",
  s4: "fade",
  s5: "none", // the door light already filled the frame
  s6: "none", // split screen slides itself in
  s7: "slide",
  s8: "fade",
  s9: "none", // iris from the sun
  end: "slide",
};

// Caption height per scene (keep clear of the Shorts UI at the bottom/right)
const CAPTION_TOP: Record<string, number> = {
  s1: 1250, s2: 1250, s3: 1250, s4: 1250, s5: 1430, s6: 1430, s7: 1500, s8: 1440, s9: 1400,
};

export const calcFilm2: CalculateMetadataFunction<Film2Props> = async ({ props }) => {
  let timing: TimingFile | null = null;
  try {
    const r = await fetch(staticFile("voice/timing.json"));
    if (r.ok) timing = await r.json();
  } catch {
    timing = null;
  }
  const layout = buildLayout(timing);
  return { durationInFrames: layout.total, props: { ...props, timing, layout } };
};

/** Karaoke captions: white on forest, max two lines, the spoken word lights up. */
const Captions: React.FC<{ layout: Layout }> = ({ layout }) => {
  const f = useCurrentFrame();
  for (const sc of layout.scenes) {
    if (!sc.voice.words.length) continue;
    // chunk into phrases of <= 34 chars or at sentence ends
    const chunks: { s: number; e: number; words: typeof sc.voice.words }[] = [];
    let cur: typeof sc.voice.words = [];
    let len = 0;
    for (const w of sc.voice.words) {
      cur.push(w);
      len += w.w.length + 1;
      if (len > 34 || /[.?:]$/.test(w.w)) {
        chunks.push({ s: cur[0].s, e: cur[cur.length - 1].e, words: cur });
        cur = [];
        len = 0;
      }
    }
    if (cur.length) {
      const last = chunks[chunks.length - 1];
      if (last && cur.length <= 2 && !/[.?:]$/.test(last.words[last.words.length - 1].w)) {
        last.words.push(...cur);
        last.e = cur[cur.length - 1].e;
      } else chunks.push({ s: cur[0].s, e: cur[cur.length - 1].e, words: cur });
    }
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const next = chunks[i + 1];
      const s = sc.from + c.s - 4;
      const e = sc.from + (next ? next.s - 4 : c.e + 14);
      if (f < s || f >= e) continue;
      const pin = easeOut(Math.min(1, (f - s) / 8));
      const pout = next ? 1 : 1 - Math.max(0, (f - (e - 8)) / 8);
      return (
        <div style={{ position: "absolute", top: CAPTION_TOP[sc.id] ?? 1300, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(pin, pout), transform: `translateY(${(1 - pin) * 12}px)` }}>
          <div style={{ maxWidth: 860, background: C.forest, borderRadius: 22, padding: "18px 32px", fontFamily, fontWeight: 700, fontSize: 52, lineHeight: 1.28, textAlign: "center", boxShadow: "0 10px 30px rgba(27,42,26,0.25)" }}>
            {c.words.map((w, k) => {
              const spoken = f >= sc.from + w.s;
              const active = spoken && f < sc.from + w.e + 2;
              return (
                <span key={k} style={{ color: active ? C.pale : C.white, opacity: spoken ? 1 : 0.55, display: "inline-block", transform: `translateY(${active ? -2 : 0}px)`, marginRight: 14 }}>
                  {w.w}
                </span>
              );
            })}
          </div>
        </div>
      );
    }
  }
  return null;
};

export const Film2: React.FC<Film2Props> = ({ music, layout: L, timing }) => {
  const layout = L ?? buildLayout(timing);
  const voiceSpans = layout.scenes.filter((s) => s.voice.dur).map((s) => [s.from + s.voice.start, s.from + s.voice.start + s.voice.dur]);
  const duck = (f: number) => {
    let d = 0;
    for (const [a, b] of voiceSpans) {
      d = Math.max(d, interpolate(f, [a - 10, a, b, b + 14], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    }
    return d;
  };
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <TransitionSeries>
        {layout.scenes.flatMap((sc, i) => {
          const Comp = SCENES[sc.id];
          const entry = ENTRY[sc.id];
          const pres = entry === "slide" ? slide({ direction: "from-bottom" }) : entry === "none" ? none() : fade();
          return [
            ...(i > 0 ? [<TransitionSeries.Transition key={`t${i}`} presentation={pres} timing={linearTiming({ durationInFrames: OVERLAP })} />] : []),
            <TransitionSeries.Sequence key={sc.id} durationInFrames={sc.dur}>
              <Comp v={sc.voice} dur={sc.dur} />
            </TransitionSeries.Sequence>,
          ];
        })}
      </TransitionSeries>

      <Captions layout={layout} />
      <LegalLowerThird start={50} end={295} top={1460} />

      {layout.scenes.map((sc) =>
        sc.voice.file ? (
          <Sequence key={`v${sc.id}`} from={sc.from + sc.voice.start} durationInFrames={sc.voice.dur + 20}>
            <Audio src={staticFile(sc.voice.file)} volume={1} />
          </Sequence>
        ) : null,
      )}
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) => {
            const base = interpolate(f, [0, 15, layout.total - 70, layout.total - 4], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return base * (0.55 - 0.33 * duck(f));
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
