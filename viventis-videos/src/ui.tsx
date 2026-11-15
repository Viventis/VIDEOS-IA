import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./theme";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0→1 over [start, start+dur] with ease-out, clamped. */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  ease: (t: number) => number = easeOut,
) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

/** In-and-out envelope: rises over `fade`, holds, falls over `fade` before `end`. */
export const env = (frame: number, start: number, end: number, fade = 12) =>
  Math.min(prog(frame, start, fade), 1 - prog(frame, end - fade, fade, easeInOut));

/**
 * Hand-drawn "line boil": a tiny displacement whose noise seed changes every
 * 4 frames, like a traditionally animated drawing. Deterministic per frame.
 */
export const BoilDefs: React.FC<{ id?: string; scale?: number }> = ({
  id = "boil",
  scale = 2.6,
}) => {
  const frame = useCurrentFrame();
  const seed = (Math.floor(frame / 4) % 5) + 1;
  return (
    <defs>
      <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.035"
          numOctaves={2}
          seed={seed}
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} />
      </filter>
    </defs>
  );
};

/** Paper grain + soft vignette over the whole frame. */
export const Paper: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const seed = (Math.floor(frame / 3) % 4) + 7;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#grain)"
          opacity={dark ? 0.09 : 0.07}
          style={{ mixBlendMode: dark ? "screen" : "multiply" }}
        />
      </svg>
      <AbsoluteFill
        style={{
          background: dark
            ? "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,18,10,0.45) 100%)"
            : "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(52,74,50,0.10) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Always-on subtitle: white Plus Jakarta Bold on a forest box, max two lines. */
export const Subtitle: React.FC<{
  text: string;
  start: number;
  end: number;
  top?: number;
}> = ({ text, start, end, top = 1150 }) => {
  const frame = useCurrentFrame();
  const o = env(frame, start, end, 10);
  if (o <= 0) return null;
  const y = interpolate(prog(frame, start, 18), [0, 1], [18, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: o,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 860,
          background: C.forest,
          color: C.white,
          fontFamily,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.28,
          padding: "20px 34px",
          borderRadius: 22,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(27,42,26,0.25)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Legal's short lower-third variant (first 10 s only). */
export const LegalLowerThird: React.FC<{ start: number; end: number; top?: number }> = ({
  start,
  end,
  top = 1440,
}) => {
  const frame = useCurrentFrame();
  const o = env(frame, start, end, 14);
  if (o <= 0) return null;
  const x = interpolate(prog(frame, start, 22), [0, 1], [-40, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 90,
        right: 150,
        opacity: o,
        transform: `translateX(${x}px)`,
        display: "flex",
      }}
    >
      <div style={{ width: 10, background: C.terra, borderRadius: 5, marginRight: 0 }} />
      <div
        style={{
          background: C.forest,
          color: C.white,
          fontFamily,
          fontWeight: 700,
          fontSize: 32,
          lineHeight: 1.3,
          padding: "16px 24px",
          borderRadius: "0 14px 14px 0",
        }}
      >
        Esto NO es un seguro. Membresía de descuentos médicos, solo en Texas.
      </div>
    </div>
  );
};

/** Sentence-case headline: forest, last phrase teal, teal full stop. */
export const Headline: React.FC<{
  lead: string;
  accent: string;
  size?: number;
  color?: string;
  accentColor?: string;
  reveal: number;
}> = ({ lead, accent, size = 92, color = C.forest, accentColor = C.teal, reveal }) => {
  const words = [...lead.split(" ").map((w) => ({ w, a: false })), ...accent.split(" ").map((w) => ({ w, a: true }))];
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.03em",
        color,
      }}
    >
      {words.map((x, i) => {
        const t = Math.max(0, Math.min(1, reveal * (words.length + 3) - i));
        const e = easeOut(t);
        const last = i === words.length - 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: e,
              transform: `translateY(${(1 - e) * 26}px)`,
              color: x.a ? accentColor : color,
              marginRight: "0.24em",
            }}
          >
            {x.w}
            {last ? <span style={{ color: accentColor }}>.</span> : null}
          </span>
        );
      })}
    </div>
  );
};
