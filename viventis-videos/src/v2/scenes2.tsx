import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, fontFamily } from "../theme";
import { Person, SleepingChild } from "../characters";
import { Crayon, Sprout, Stage, Stars } from "../scenes";
import { Headline, Paper, easeInOut, easeOut, env, prog } from "../ui";
import { Voice, at, atEnd } from "./timing";

export type SceneProps = { v: Voice; dur: number };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Camera: keyframes of {f, x, y, z, r}; eased between keys. Returns an SVG transform. */
type Key = { f: number; x: number; y: number; z: number; r?: number };
const camera = (frame: number, keys: Key[], ease = easeInOut) => {
  let a = keys[0];
  let b = keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].f) {
      a = keys[i];
      b = keys[i + 1];
    }
  }
  if (frame >= keys[keys.length - 1].f) a = b = keys[keys.length - 1];
  const t = a === b ? 1 : ease(clamp01((frame - a.f) / (b.f - a.f)));
  const x = lerp(a.x, b.x, t);
  const y = lerp(a.y, b.y, t);
  const z = lerp(a.z, b.z, t);
  const r = lerp(a.r ?? 0, b.r ?? 0, t);
  return `translate(540 960) scale(${z}) rotate(${r}) translate(${-x} ${-y})`;
};

/** Dust motes drifting in a light beam. */
const Motes: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; color?: string }> = ({
  f,
  x,
  y,
  w,
  h,
  n = 16,
  color = C.sand,
}) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const px = x + ((i * 97.3) % w) + Math.sin(f / 40 + i) * 14;
      const py = y + h - ((((i * 151.7) % h) + f * (0.6 + (i % 3) * 0.25)) % h);
      return <circle key={i} cx={px} cy={py} r={2 + (i % 3)} fill={color} opacity={0.25 + 0.25 * Math.sin(f / 20 + i)} />;
    })}
  </>
);

/* =====================================================================
   S1 — Before sunrise: outside the house, a window lights up, we fly in
   ===================================================================== */
const House: React.FC<{ f: number; lit: number }> = ({ f, lit }) => (
  <g>
    <defs>
      <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#14201A" />
        <stop offset="0.7" stopColor="#1E3A36" />
        <stop offset="1" stopColor="#2F5A52" />
      </linearGradient>
      <radialGradient id="winGlow">
        <stop offset="0" stopColor={C.sand} stopOpacity={0.55} />
        <stop offset="1" stopColor={C.sand} stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#nightSky)" />
    <Stars frame={f} pts={[[90, 180, 4], [250, 300, 3], [420, 140, 5], [610, 260, 3], [880, 200, 4], [980, 380, 3], [160, 520, 3], [760, 470, 4], [520, 420, 2.5], [330, 620, 3]]} />
    <circle cx={820} cy={330} r={70} fill={C.sand} />
    <circle cx={850} cy={312} r={64} fill="#18271F" />
    {/* hills */}
    <path d="M-50 1180 C 200 1060 420 1120 620 1090 C 820 1060 960 1100 1130 1070 L1130 1920 L-50 1920 Z" fill="#203A2C" />
    <path d="M-50 1300 C 300 1240 700 1290 1130 1250 L1130 1920 L-50 1920 Z" fill="#1A2E22" />
    {/* tree */}
    <g transform={`rotate(${Math.sin(f / 30) * 1.2} 170 1290)`} filter="url(#boil)">
      <rect x={155} y={1010} width={30} height={290} rx={10} fill="#3A3226" />
      <circle cx={170} cy={960} r={120} fill="#22402E" />
      <circle cx={100} cy={1030} r={80} fill="#22402E" />
      <circle cx={250} cy={1020} r={86} fill="#264634" />
    </g>
    {/* house */}
    <g filter="url(#boil)">
      <rect x={330} y={900} width={560} height={400} fill="#3C3A2F" />
      <path d="M300 910 L610 700 L920 910 Z" fill="#14201A" />
      <rect x={760} y={730} width={50} height={110} fill="#2A2A22" />
      {/* door */}
      <rect x={400} y={1080} width={110} height={220} rx={8} fill="#2A2A22" />
      <circle cx={492} cy={1190} r={6} fill={C.taupe} />
      {/* dark window */}
      <rect x={720} y={1000} width={130} height={130} rx={8} fill="#1A2620" />
      {/* the kitchen window */}
      <circle cx={600} cy={1050} r={260} fill="url(#winGlow)" opacity={lit} />
      <rect x={540} y={990} width={120} height={120} rx={8} fill="#1A2620" />
      <rect x={540} y={990} width={120} height={120} rx={8} fill={C.sand} opacity={lit} />
      <rect x={540} y={990} width={120} height={120} rx={8} fill="#F2D9A6" opacity={lit * 0.35} />
      <path d="M600 990 L600 1110 M540 1050 L660 1050" stroke="#3C3A2F" strokeWidth={8} />
      {/* porch light + mailbox */}
      <rect x={300} y={1240} width={16} height={70} fill="#2A2A22" />
      <rect x={284} y={1214} width={48} height={34} rx={10} fill={C.rust} opacity={0.75} />
    </g>
    <rect x={-20} y={1300} width={1120} height={700} fill="#16261C" />
  </g>
);

const Kitchen: React.FC<{ f: number; lidT: number; sandwichT: number; armT: number }> = ({ f, lidT, sandwichT, armT }) => {
  const steam = (k: number) => ((f + k * 30) % 90) / 90;
  const sx = lerp(790, 825, sandwichT);
  const sy = lerp(830, 930, sandwichT) - Math.sin(sandwichT * Math.PI) * 50;
  return (
    <g>
      <rect width={1080} height={1920} fill="#22341F" />
      {/* window: same one we flew through, now from inside */}
      <rect x={110} y={250} width={400} height={500} rx={28} fill={C.taupe} />
      <rect x={130} y={270} width={360} height={460} rx={18} fill="#1E3A36" />
      <rect x={130} y={500} width={360} height={10} fill={C.taupe} />
      <rect x={305} y={270} width={10} height={460} fill={C.taupe} />
      <Stars frame={f} pts={[[170, 320, 4], [260, 380, 3], [420, 330, 5], [380, 440, 3], [200, 600, 3], [440, 640, 4]]} />
      <circle cx={240} cy={430} r={46} fill={C.sand} />
      <circle cx={262} cy={418} r={42} fill="#1E3A36" />
      {/* clock 5:40, second hand ticking */}
      <g transform="translate(850 400)">
        <circle r={86} fill={C.sand} />
        <circle r={86} fill="none" stroke={C.taupe} strokeWidth={10} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-3} y={-72} width={6} height={14} rx={3} fill={C.taupe} transform={`rotate(${i * 30})`} />
        ))}
        <rect x={-5} y={-40} width={10} height={44} rx={5} fill={C.forest} transform="rotate(170)" />
        <rect x={-3.5} y={-62} width={7} height={66} rx={4} fill={C.teal} transform="rotate(240)" />
        <rect x={-1.5} y={-66} width={3} height={74} rx={2} fill={C.rust} transform={`rotate(${Math.floor(f / 30) * 6 + 120})`} />
        <circle r={8} fill={C.forest} />
      </g>
      {/* lamp + beam */}
      <g transform={`rotate(${Math.sin(f / 45) * 1.2} 640 0)`}>
        <path d="M640 0 L640 260" stroke={C.taupe} strokeWidth={6} />
        <path d="M560 330 Q640 230 720 330 Z" fill={C.sage} />
        <ellipse cx={640} cy={330} rx={80} ry={14} fill={C.sand} />
      </g>
      <path d="M560 336 L360 1010 L920 1010 L720 336 Z" fill={C.sand} opacity={0.08 + Math.sin(f / 9) * 0.004} />
      <Motes f={f} x={430} y={380} w={420} h={600} />
      <ellipse cx={640} cy={1000} rx={360} ry={70} fill={C.sand} opacity={0.12} />
      <Person
        x={600}
        y={1290}
        sweater={C.teal}
        sweaterShade="#265B54"
        headTilt={14}
        eyes="down"
        armFront={lerp(62, 44, armT)}
        elbowFront={lerp(52, 40, armT)}
        armBack={30}
        blink={f % 110 > 104}
        t={f}
        smile={lidT > 0.5}
      />
      <rect x={-20} y={990} width={1120} height={36} rx={12} fill={C.sand} />
      <rect x={-20} y={1024} width={1120} height={900} fill={C.taupe} />
      {[60, 400, 740].map((x) => (
        <g key={x}>
          <rect x={x} y={1080} width={300} height={360} rx={18} fill="#6C5C46" />
          <rect x={x + 130} y={1110} width={40} height={10} rx={5} fill={C.taupe} />
        </g>
      ))}
      <g filter="url(#boil)">
        {/* lunchbox body */}
        <rect x={720} y={900} width={210} height={96} rx={20} fill={C.rust} />
        {/* sandwich travelling into the box */}
        {sandwichT < 1 ? (
          <g transform={`translate(${sx} ${sy}) rotate(${lerp(-20, 0, sandwichT)})`}>
            <path d="M-50 20 L0 -30 L50 20 Z" fill={C.sand} />
            <path d="M-44 14 L44 14" stroke={C.sage} strokeWidth={8} strokeLinecap="round" />
          </g>
        ) : null}
        {/* lid hinged at the back edge */}
        <g transform={`translate(930 900) rotate(${lerp(95, 0, lidT)}) translate(-930 -900)`}>
          <rect x={720} y={886} width={210} height={30} rx={14} fill="#C5643A" />
        </g>
        <rect x={790} y={870} width={70} height={22} rx={10} fill="none" stroke={C.rust} strokeWidth={9} opacity={lidT} />
        <circle cx={680} cy={960} r={34} fill={C.sage} />
        <path d="M680 926 Q690 906 704 902" stroke={C.forest} strokeWidth={5} fill="none" strokeLinecap="round" />
        <rect x={300} y={920} width={90} height={74} rx={14} fill={C.sand} />
        <path d="M390 940 Q426 950 390 974" stroke={C.sand} strokeWidth={12} fill="none" />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M${325 + k * 20} 910 q -12 -24 0 -48 q 12 -24 0 -48`}
            stroke={C.sand}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            opacity={0.5 * Math.sin(steam(k) * Math.PI)}
            transform={`translate(0 ${-steam(k) * 40})`}
          />
        ))}
      </g>
    </g>
  );
};

export const S1Sunrise: React.FC<SceneProps> = ({ v }) => {
  const f = useCurrentFrame();
  const lit = prog(f, 8, 10);
  const fly = prog(f, 22, 40, (t) => t * t * t); // accelerate into the window
  const inside = prog(f, 52, 12, easeInOut);
  const extCam = `translate(600 1050) scale(${lerp(1, 9, fly)}) translate(-600 -1050)`;
  const intZoom = lerp(1.35, 1.04, prog(f, 52, 50));
  const vEnd = atEnd(v);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <defs />
        <g transform={extCam} opacity={1 - inside}>
          <House f={f} lit={lit} />
        </g>
        <g opacity={inside} transform={`translate(540 760) scale(${intZoom}) translate(-540 -760)`}>
          <Kitchen
            f={f}
            sandwichT={prog(f, vEnd - 60, 26, easeInOut)}
            lidT={prog(f, vEnd - 30, 14, easeOut)}
            armT={prog(f, vEnd - 60, 30, easeInOut)}
          />
        </g>
        <BoilOnly />
      </svg>
      <Paper dark />
    </AbsoluteFill>
  );
};

/** Boil filter defs for raw <svg> blocks that don't use <Stage>. */
const BoilOnly: React.FC = () => {
  const f = useCurrentFrame();
  const seed = (Math.floor(f / 4) % 5) + 1;
  return (
    <defs>
      <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={seed} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={2.6} />
      </filter>
    </defs>
  );
};

/* =====================================================================
   S2 — Polaroids on the fridge: lonche → tarea → abrazo → pull back
   ===================================================================== */
const Polaroid: React.FC<{ x: number; y: number; r: number; children: React.ReactNode }> = ({ x, y, r, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-186} y={-206} width={372} height={420} rx={6} fill={C.night} opacity={0.12} transform="translate(8 10)" />
    <rect x={-186} y={-206} width={372} height={420} rx={6} fill={C.white} />
    <svg x={-166} y={-186} width={332} height={310} viewBox="0 0 332 310">
      {children}
    </svg>
    <rect x={-20} y={-226} width={40} height={40} rx={20} fill={C.teal} />
  </g>
);

const PicLunch: React.FC<{ t: number; f: number }> = ({ t, f }) => (
  <g>
    <rect width={332} height={310} fill={C.mint} />
    <rect y={200} width={332} height={110} fill={C.sand} />
    <rect x={70} y={150} width={190} height={90} rx={18} fill={C.rust} />
    {/* note with a heart slides in */}
    <g transform={`translate(${lerp(-80, 120, easeOut(clamp01(t * 1.6)))} ${lerp(100, 120, t)}) rotate(${lerp(-30, -8, t)})`}>
      <rect width={70} height={56} rx={4} fill={C.white} />
      <path d="M35 22 C 28 12 16 20 35 36 C 54 20 42 12 35 22 Z" fill={C.terra} />
    </g>
    <g transform={`translate(70 150) rotate(${lerp(-100, 0, easeOut(clamp01(t * 1.4 - 0.5)))})`}>
      <rect y={-14} width={190} height={28} rx={12} fill="#C5643A" />
    </g>
    <circle cx={280} cy={210} r={26} fill={C.sage} />
    <path d="M280 184 Q 288 168 300 166" stroke={C.forest} strokeWidth={4} fill="none" />
    <circle cx={40 + Math.sin(f / 10) * 3} cy={60} r={14} fill={C.sand} opacity={0.7} />
  </g>
);

const PicHomework: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={332} height={310} fill={C.sand} />
    <g transform="rotate(-6 166 160)">
      <rect x={40} y={40} width={260} height={230} rx={8} fill={C.white} />
      {[90, 130, 170, 210].map((y) => (
        <path key={y} d={`M60 ${y} L280 ${y}`} stroke={C.pale} strokeWidth={3} />
      ))}
      <Crayon d="M70 120 c 20 -20 30 20 50 0 s 30 20 50 0 s 30 20 50 0" p={clamp01(t * 1.5)} color={C.forest} w={5} len={260} />
      <Crayon d="M70 160 c 20 -20 30 20 50 0 s 30 20 50 0" p={clamp01(t * 1.5 - 0.4)} color={C.forest} w={5} len={180} />
      {/* star sticker */}
      <g transform={`translate(240 220) scale(${easeOut(clamp01(t * 2 - 1.2))}) rotate(${t * 20})`}>
        <path d="M0 -26 L8 -8 L27 -8 L12 4 L17 23 L0 12 L-17 23 L-12 4 L-27 -8 L-8 -8 Z" fill={C.teal} />
      </g>
    </g>
    {/* pencil following the line */}
    <g transform={`translate(${lerp(80, 250, clamp01(t * 1.5))} ${110 + Math.sin(t * 40) * 6}) rotate(35)`}>
      <rect x={-8} y={-110} width={16} height={100} rx={3} fill={C.terra} />
      <path d="M-8 -10 L8 -10 L0 8 Z" fill={C.sand} />
    </g>
  </g>
);

const PicHug: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const squeeze = 1 + Math.sin(clamp01(t * 1.4) * Math.PI) * 0.03;
  return (
    <g>
      <rect width={332} height={310} fill={C.sageLight} />
      <circle cx={260} cy={70} r={50} fill={C.sand} opacity={0.6} />
      <g transform={`translate(166 300) scale(${squeeze}) translate(-166 -300)`}>
        <Person x={120} y={520} s={0.55} sweater={C.rust} sweaterShade="#97431F" skin={C.skin2} hair={C.hair2} hairStyle="pony" eyes="closed" headTilt={-8} boil={false} />
        <Person x={215} y={560} s={0.62} flip sweater={C.teal} sweaterShade="#265B54" eyes="closed" headTilt={18} armFront={lerp(30, 78, easeOut(clamp01(t * 1.5)))} elbowFront={lerp(10, 70, easeOut(clamp01(t * 1.5)))} boil={false} />
      </g>
      {[0, 1, 2].map((k) => {
        const p = ((f / 50 + k / 3) % 1);
        return (
          <path
            key={k}
            transform={`translate(${200 + k * 30 + Math.sin(f / 10 + k) * 8} ${120 - p * 90}) scale(${0.6 + k * 0.2})`}
            d="M0 -6 C -6 -16 -20 -8 0 10 C 20 -8 6 -16 0 -6 Z"
            fill={C.terra}
            opacity={Math.sin(p * Math.PI) * clamp01(t * 3)}
          />
        );
      })}
    </g>
  );
};

export const S2Fridge: React.FC<SceneProps> = ({ v, dur }) => {
  const f = useCurrentFrame();
  const tTarea = at(v, "tarea", 50);
  const tAbrazo = at(v, "cada", 90);
  const tHaces = at(v, "haces", 130);
  const P1 = { x: 290, y: 1060, r: -5 };
  const P2 = { x: 800, y: 1020, r: 4 };
  const P3 = { x: 560, y: 1440, r: -2 };
  const Z = 2.55;
  const cam = camera(f, [
    { f: 0, x: P1.x, y: P1.y - 20, z: Z * 1.08, r: -P1.r },
    { f: tTarea - 10, x: P1.x, y: P1.y - 20, z: Z, r: -P1.r },
    { f: tTarea + 6, x: P2.x, y: P2.y - 20, z: Z, r: -P2.r },
    { f: tAbrazo - 10, x: P2.x, y: P2.y - 20, z: Z * 0.98, r: -P2.r },
    { f: tAbrazo + 6, x: P3.x, y: P3.y - 20, z: Z, r: -P3.r },
    { f: tHaces - 6, x: P3.x, y: P3.y - 20, z: Z * 0.97, r: -P3.r },
    { f: tHaces + 22, x: 540, y: 940, z: 1.0, r: 0 },
    { f: dur, x: 540, y: 930, z: 1.04, r: 0 },
  ]);
  const local = (s: number, len = 50) => clamp01((f - s) / len);
  const draw = (i: number) => prog(f, tHaces + 4 + i * 6, 22, easeInOut);
  return (
    <AbsoluteFill style={{ background: "#DCE8DA" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
        <BoilOnly />
        <g transform={cam}>
          <rect x={-600} y={-600} width={2400} height={3200} fill="#DCE8DA" />
          <rect x={980} y={-600} width={30} height={3200} fill="#C9D9C6" />
          <rect x={1020} y={300} width={26} height={700} rx={13} fill={C.sand} />
          {/* the child's drawing, drawn as we pull back */}
          <g transform="rotate(-2 540 520)">
            <rect x={280} y={180} width={520} height={620} rx={6} fill={C.white} />
            <g filter="url(#boil)" transform="translate(280 180) scale(0.666) translate(-150 -280)">
              <Crayon d="M790 400 m -55 0 a 55 55 0 1 0 110 0 a 55 55 0 1 0 -110 0" p={draw(0)} color={C.terra} len={360} />
              <Crayon d="M190 1010 C 330 990 520 1030 890 1000" p={draw(1)} color={C.sage} w={12} />
              <Crayon d="M300 640 m -45 0 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0 M300 685 L300 860 M300 860 L260 990 M300 860 L340 990 M300 730 L230 820 M300 730 L380 790" p={draw(2)} color={C.forest} len={1100} />
              <Crayon d="M480 660 m -42 0 a 42 42 0 1 0 84 0 a 42 42 0 1 0 -84 0 M450 630 C 430 600 520 590 515 640 M480 702 L420 900 L540 900 Z M450 900 L440 990 M510 900 L520 990 M480 750 L380 790 M480 750 L580 810" p={draw(3)} color={C.teal} len={1300} />
              <Crayon d="M640 780 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0 M640 814 L640 920 M640 920 L612 990 M640 920 L668 990 M640 850 L585 812 M640 850 L700 880" p={draw(4)} color={C.rust} len={800} />
              <Crayon d="M520 470 C 480 420 420 470 520 540 C 620 470 560 420 520 470 Z" p={draw(5)} color={C.terra} len={520} w={10} />
              <Crayon d="M230 400 L230 340 L260 380 L290 340 L290 400 M320 400 L345 340 L370 400 M330 378 L360 378 M400 400 L400 340 L430 380 L460 340 L460 400 M490 400 L515 340 L540 400 M500 378 L530 378 M512 322 L528 306" p={draw(6)} color={C.teal} len={1200} w={8} />
            </g>
            <circle cx={330} cy={196} r={26} fill={C.terra} />
          </g>
          <Polaroid {...P1}>
            <PicLunch t={local(0, 60)} f={f} />
          </Polaroid>
          <Polaroid {...P2}>
            <PicHomework t={local(tTarea - 4, 50)} />
          </Polaroid>
          <Polaroid {...P3}>
            <PicHug t={local(tAbrazo - 4, 45)} f={f} />
          </Polaroid>
        </g>
      </svg>
      <Paper />
    </AbsoluteFill>
  );
};

/* =====================================================================
   S3 — The question, and the appointment that slips away
   ===================================================================== */
export const S3Question: React.FC<SceneProps> = ({ v, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tCita = at(v, "cita", 40);
  const tPregunta = at(v, "cuánto", 80);
  const tDejas = at(v, "dejas", 160);
  const notif = spring({ frame: f - tCita, fps, config: { damping: 12, stiffness: 140 } });
  const notifOut = prog(f, tPregunta - 4, 10);
  const lower = prog(f, tDejas - 6, 22, easeInOut);
  const bubbleIn = spring({ frame: f - (tPregunta - 6), fps, config: { damping: 13 } });
  const bubbleOut = prog(f, tDejas + 18, 12);
  const qStart = v.words.findIndex((w) => w.s >= tPregunta - 2);
  const qEnd = v.words.findIndex((w, i) => i >= qStart && /\?$/.test(w.w));
  const qWords = qStart < 0 ? [] : v.words.slice(qStart, qEnd < 0 ? undefined : qEnd + 1);
  const dim = lower * 0.25;
  const zoom = interpolate(f, [0, tPregunta, dur], [1.0, 1.06, 1.12]);
  // calendar pages fly away after "dejas"
  const page = (i: number) => prog(f, tDejas + 2 + i * 7, 16, easeInOut);
  const tagSwing = Math.sin(f / 9) * 12;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Stage zoom={zoom} ox={480} oy={760}>
        <rect width={1080} height={1920} fill="#22341F" />
        {/* wall calendar */}
        <g transform="translate(760 520)" filter="url(#boil)">
          <rect width={260} height={280} rx={16} fill={C.sand} />
          {[0, 1, 2].map((i) => {
            const p = page(2 - i);
            return (
              <g key={i} transform={`translate(130 0) translate(${p * 260} ${p * -160}) rotate(${p * 70}) scale(1 ${1 - Math.sin(p * Math.PI) * 0.6}) translate(-130 0)`} opacity={1 - p}>
                <rect width={260} height={280} rx={16} fill={C.sand} />
                <rect width={260} height={60} rx={16} fill={C.sage} />
                <rect y={44} width={260} height={16} fill={C.sage} />
                {Array.from({ length: 20 }).map((_, k) => (
                  <rect key={k} x={22 + (k % 5) * 46} y={84 + Math.floor(k / 5) * 46} width={30} height={22} rx={6} fill="#E3DDD1" />
                ))}
                {i === 2 ? <circle cx={129} cy={141} r={30} fill="none" stroke={C.terra} strokeWidth={6} /> : null}
              </g>
            );
          })}
        </g>
        <ellipse cx={480} cy={1060} rx={460} ry={120} fill={C.sand} opacity={0.1 - dim * 0.2} />
        <Person
          x={400}
          y={1360}
          sweater={C.teal}
          sweaterShade="#265B54"
          headTilt={lerp(14, 26, lower)}
          eyes={lower > 0.5 ? "closed" : f > tPregunta ? "open" : "down"}
          smile={false}
          armFront={lerp(70, 36, lower)}
          elbowFront={lerp(70, 40, lower)}
          armBack={18}
          t={f}
          blink={f % 95 > 90}
        />
        <g transform={`translate(${lerp(580, 640, lower)} ${lerp(700, 1012, lower)}) rotate(${lerp(-20, -86, lower)})`}>
          <rect x={-34} y={-62} width={68} height={124} rx={12} fill={C.ink} />
          <rect x={-28} y={-54} width={56} height={104} rx={8} fill={lower > 0.85 ? C.ink : C.mint} />
          <circle cx={0} cy={-20} r={10} fill={C.terra} opacity={notif * (1 - notifOut) * (1 - lower)} />
        </g>
        <rect x={-20} y={1040} width={1120} height={34} rx={12} fill={C.taupe} />
        <rect x={-20} y={1072} width={1120} height={900} fill="#152114" />
        {/* thought bubble shell */}
        <g opacity={clamp01(bubbleIn) * (1 - bubbleOut)} transform={`translate(420 520) scale(${bubbleIn}) translate(-420 -520)`} filter="url(#boil)">
          <circle cx={500} cy={600} r={14} fill={C.sand} />
          <circle cx={540} cy={545} r={22} fill={C.sand} />
          <rect x={90} y={240} width={640} height={250} rx={125} fill={C.sand} />
        </g>
        {/* swinging price tag with a question mark */}
        <g opacity={clamp01(bubbleIn) * (1 - bubbleOut)} transform={`translate(720 230) rotate(${tagSwing})`}>
          <path d="M0 0 L0 40" stroke={C.stem} strokeWidth={4} />
          <path d="M-46 40 L46 40 L46 130 L0 160 L-46 130 Z" fill={C.sand} stroke={C.taupe} strokeWidth={4} />
          <text x={0} y={112} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={56} fill={C.rust}>?</text>
        </g>
        <rect width={1080} height={1920} fill={C.night} opacity={dim} />
      </Stage>
      {/* notification card for the appointment (no clinic name) */}
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 560,
          transform: `translateY(${(1 - notif) * 40}px) scale(${0.8 + notif * 0.2})`,
          opacity: clamp01(notif) * (1 - notifOut),
          background: C.sand,
          borderRadius: 24,
          padding: "18px 26px",
          fontFamily,
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
        }}
      >
        <Img src={staticFile("brand/icon_calendar_teal.png")} style={{ width: 64 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 44, color: C.forest }}>Cita</div>
          <div style={{ fontWeight: 400, fontSize: 32, color: C.muted }}>Jueves · 9:00</div>
        </div>
      </div>
      {/* question text, word-synced */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 240,
          width: 600,
          height: 250,
          display: "flex",
          flexWrap: "wrap",
          alignContent: "center",
          justifyContent: "center",
          fontFamily,
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: C.forest,
          opacity: 1 - bubbleOut,
          padding: "0 40px",
          boxSizing: "border-box",
        }}
      >
        {qWords.map((w, i) => {
          const p = easeOut(clamp01((f - w.s + 3) / 8));
          return (
            <span key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)`, display: "inline-block", marginRight: 14 }}>
              {w.w.replace(/^pregunta:?$/i, "")}
            </span>
          );
        })}
      </div>
      <Paper dark />
    </AbsoluteFill>
  );
};

/* =====================================================================
   S4 — Goodnight; the door light becomes the brand
   ===================================================================== */
export const S4Goodnight: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const walkT = prog(f, 0, 44, easeInOut);
  const walking = walkT < 1;
  const reach = prog(f, 46, 34, easeInOut);
  const stroke = reach > 0.9 ? Math.sin((f - 80) / 7) * 4 : 0;
  const breath = Math.sin(f / 22);
  const flood = prog(f, dur - 40, 32, easeInOut);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Stage zoom={interpolate(f, [0, dur], [1.0, 1.08])} ox={420} oy={900}>
        <rect width={1080} height={1920} fill="#1A2B2A" />
        <rect x={40} y={380} width={250} height={760} fill={C.sand} opacity={0.9} />
        <path d="M40 1140 L290 1140 L900 1920 L-200 1920 Z" fill={C.sand} opacity={0.14} />
        <rect x={20} y={360} width={20} height={800} fill={C.taupe} />
        <rect x={640} y={300} width={300} height={360} rx={150} fill="#24474A" />
        <Stars frame={f} pts={[[700, 420, 4], [790, 380, 5], [880, 460, 3], [740, 540, 3], [860, 580, 4]]} />
        {/* fireflies outside */}
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={700 + ((i * 63 + f * 0.8) % 220)} cy={480 + Math.sin(f / 15 + i * 2) * 60} r={4} fill={C.pale} opacity={0.4 + 0.4 * Math.sin(f / 8 + i)} />
        ))}
        <g transform={`rotate(${Math.sin(f / 30) * 7} 560 160)`} filter="url(#boil)">
          <path d="M560 0 L560 160 M470 200 L650 200 M560 160 L560 200 M470 200 L470 260 M650 200 L650 280" stroke={C.stem} strokeWidth={4} />
          <circle cx={470} cy={280} r={20} fill={C.sage} />
          <circle cx={650} cy={300} r={18} fill={C.terra} />
          <path d="M556 238 L566 258 L588 260 L572 274 L576 296 L556 285 L536 296 L540 274 L524 260 L546 258 Z" fill={C.sand} transform="translate(0 -20)" />
        </g>
        <SleepingChild x={650} y={1040} breath={breath} s={1.05} />
        <Person
          x={lerp(110, 250, walkT)}
          y={1130}
          sweater={C.teal}
          sweaterShade="#265B54"
          headTilt={lerp(8, 26, reach)}
          eyes={reach > 0.6 ? "closed" : "down"}
          armFront={lerp(6, 30, reach) + stroke}
          elbowFront={lerp(4, 18, reach)}
          armBack={6}
          walk={walking ? f / 5 : undefined}
          t={f}
        />
      </Stage>
      <AbsoluteFill
        style={{
          background: C.sand,
          clipPath: `polygon(${lerp(3.7, -60, flood)}% ${lerp(20, -40, flood)}%, ${lerp(26.8, 160, flood)}% ${lerp(20, -40, flood)}%, ${lerp(26.8, 160, flood)}% ${lerp(59, 160, flood)}%, ${lerp(3.7, -60, flood)}% ${lerp(59, 160, flood)}%)`,
          opacity: flood > 0 ? 1 : 0,
        }}
      />
      <Paper dark />
    </AbsoluteFill>
  );
};

/* =====================================================================
   S5 — The sprout grows; the brand arrives
   ===================================================================== */
export const S5Brand: React.FC<SceneProps> = ({ v }) => {
  const f = useCurrentFrame();
  const tViv = at(v, "viventis", 30);
  const tUna = at(v, "una", 50);
  const grow = prog(f, 0, 44, easeOut);
  const settle = prog(f, tViv - 4, 26, easeInOut);
  const x = lerp(540, 930, settle);
  const y = lerp(1160, 1560, settle);
  const s = lerp(4.2, 1.7, settle);
  const logo = prog(f, tViv - 2, 20);
  const pill = prog(f, tUna - 6, 16);
  const end = atEnd(v);
  const headReveal = clamp01((f - tUna + 4) / Math.max(20, end - tUna));
  return (
    <AbsoluteFill style={{ background: C.sand }}>
      <Stage>
        <g transform={`translate(${lerp(260, 0, prog(f, tViv - 10, 40))} ${lerp(-200, 0, prog(f, tViv - 10, 40))})`}>
          <circle cx={1010} cy={250} r={250} fill={C.forest} />
          <circle cx={790} cy={470} r={90} fill={C.sage} />
          <circle cx={700} cy={190} r={16} fill={C.terra} />
        </g>
        {/* leaf particles burst as the sprout opens */}
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const p = prog(f, 22, 40);
          return (
            <ellipse
              key={i}
              cx={540 + Math.cos(a) * p * 420}
              cy={900 + Math.sin(a) * p * 420 + p * p * 120}
              rx={12}
              ry={22}
              fill={i % 2 ? C.sage : C.sageLight}
              opacity={Math.sin(p * Math.PI) * 0.8}
              transform={`rotate(${a * 57 + p * 200} ${540 + Math.cos(a) * p * 420} ${900 + Math.sin(a) * p * 420 + p * p * 120})`}
            />
          );
        })}
        <Sprout x={x} y={y} s={s} grow={grow} sway={Math.sin(f / 22) * 3} />
      </Stage>
      <Img
        src={staticFile("brand/viventis-lockup_transparent_608x144.png")}
        style={{
          position: "absolute",
          left: 90,
          top: 300,
          width: 520,
          opacity: logo,
          clipPath: `inset(0 ${100 - logo * 100}% 0 0)`,
        }}
      />
      <div style={{ position: "absolute", left: 90, right: 90, top: 640 }}>
        <Img
          src={staticFile("brand/pill-outline_membresia-descuentos-medicos_es_for-light-grounds.png")}
          style={{ width: 640, opacity: pill, transform: `translateY(${(1 - pill) * 16}px)`, marginBottom: 40 }}
        />
        <Headline lead="Una membresía de descuentos médicos," accent="solo en Texas" size={96} reveal={headReveal} />
      </div>
      <Paper />
    </AbsoluteFill>
  );
};

/* =====================================================================
   S6 — Split screen: she calls ahead and asks her discounted price
   ===================================================================== */
const Bubble: React.FC<{ show: number; x: number; y: number; children: React.ReactNode; tail?: "left" | "right"; color?: string; textColor?: string }> = ({
  show,
  x,
  y,
  children,
  tail = "left",
  color = C.white,
  textColor = C.forest,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${show})`,
      transformOrigin: tail === "left" ? "0% 100%" : "100% 100%",
      opacity: clamp01(show * 1.5),
      background: color,
      color: textColor,
      fontFamily,
      fontWeight: 800,
      fontSize: 40,
      lineHeight: 1.2,
      padding: "22px 30px",
      borderRadius: 32,
      borderBottomLeftRadius: tail === "left" ? 6 : 32,
      borderBottomRightRadius: tail === "right" ? 6 : 32,
      boxShadow: "0 12px 30px rgba(27,42,26,0.18)",
      maxWidth: 560,
    }}
  >
    {children}
  </div>
);

export const S6CallAhead: React.FC<SceneProps> = ({ v, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMiembro = at(v, "miembro", 30);
  const tPregunta = at(v, "pregunta", 60);
  const split = prog(f, 0, 22, easeInOut);
  const b1 = spring({ frame: f - (tMiembro - 10), fps, config: { damping: 12, stiffness: 150 } });
  const b2 = spring({ frame: f - (tPregunta - 4), fps, config: { damping: 12, stiffness: 150 } });
  const ok = spring({ frame: f - (atEnd(v) - 6), fps, config: { damping: 10, stiffness: 160 } });
  const nod = f > tPregunta + 12 && f < tPregunta + 40 ? Math.sin((f - tPregunta) / 3) * 6 : 0;
  const ring = prog(f, 4, 20);
  const exit = prog(f, dur - 16, 16, easeInOut);
  const phone = (
    <g transform="rotate(-10)">
      <rect x={-20} y={-60} width={40} height={74} rx={8} fill={C.ink} />
    </g>
  );
  return (
    <AbsoluteFill style={{ background: C.mint }}>
      {/* TOP: mom at home, morning */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960, transform: `translateY(${lerp(-960, 0, split) - exit * 200}px)`, overflow: "hidden" }}>
        <Stage oy={480}>
          <rect width={1080} height={960} fill={C.sand} />
          <rect x={640} y={140} width={300} height={360} rx={24} fill={C.mint} stroke={C.taupe} strokeWidth={12} />
          <circle cx={860} cy={240} r={50} fill={C.sand} opacity={0.9} />
          <path d="M640 320 L940 320" stroke={C.taupe} strokeWidth={8} />
          <g transform="translate(150 960)">
            <Person x={0} y={0} s={1.08} sweater={C.teal} sweaterShade="#265B54" armFront={110} elbowFront={126} armBack={10} headTilt={4} eyes="open" t={f} handItem={phone} blink={f % 100 > 95} smile={f > tPregunta + 30} />
          </g>
          {/* ring waves */}
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${330 + k * 26} ${230 - k * 6} q 20 30 0 60`} stroke={C.teal} strokeWidth={6} fill="none" strokeLinecap="round" opacity={ring * (0.5 + 0.5 * Math.sin(f / 5 - k))} />
          ))}
        </Stage>
      </div>
      {/* BOTTOM: front desk, headset */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, height: 960, transform: `translateY(${lerp(960, 0, split) + exit * 200}px)`, overflow: "hidden" }}>
        <Stage oy={480}>
          <rect width={1080} height={960} fill={C.mint} />
          <rect x={80} y={120} width={240} height={160} rx={16} fill={C.white} />
          <path d="M120 160 L280 160 M120 200 L240 200 M120 240 L260 240" stroke={C.pale} strokeWidth={10} strokeLinecap="round" />
          <circle cx={900} cy={140} r={60} fill={C.sageLight} opacity={0.6} />
          <g transform="translate(700 860)">
            <Person x={0} y={0} s={1.0} flip sweater={C.sage} sweaterShade="#6D9467" skin={C.skin3} hair={C.hair2} hairStyle="curly" headTilt={nod} armFront={40} elbowFront={60} t={f + 30} blink={f % 120 > 115} />
            {/* headset */}
            <path d="M-58 -700 C -40 -760 50 -760 66 -690" stroke={C.ink} strokeWidth={8} fill="none" transform="scale(-1 1)" />
          </g>
          <rect x={-20} y={640} width={1120} height={40} rx={12} fill={C.sand} />
          <rect x={-20} y={676} width={1120} height={300} fill={C.taupe} />
          <rect x={360} y={470} width={200} height={150} rx={14} fill={C.forest} />
          <rect x={440} y={620} width={40} height={24} fill={C.forest} />
        </Stage>
      </div>
      {/* divider */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 952, height: 16, background: C.forest, transform: `scaleX(${split})` }} />
      {/* bubbles */}
      <div style={{ transform: `translateY(${-exit * 200}px)` }}>
        <Bubble show={b1} x={420} y={250}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: C.forest, borderRadius: 14, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ background: C.white, borderRadius: 99, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Img src={staticFile("brand/viventis-mark_transparent_144px.png")} style={{ width: 26 }} />
              </div>
              <div style={{ color: C.white, fontSize: 20, fontWeight: 700 }}>VV-0000-0000</div>
            </div>
            Soy miembro.
          </div>
        </Bubble>
        <Bubble show={b2} x={420} y={430}>
          ¿Cuál es mi precio
          <br />
          con descuento?
        </Bubble>
      </div>
      <div style={{ transform: `translateY(${exit * 200}px)` }}>
        <div
          style={{
            position: "absolute",
            left: 230,
            top: 1150,
            width: 120,
            height: 120,
            borderRadius: 99,
            background: C.teal,
            transform: `scale(${ok})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 30px rgba(27,42,26,0.25)",
          }}
        >
          <svg width={64} height={64} viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke={C.white} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - clamp01(ok))} />
          </svg>
        </div>
      </div>
      <Paper />
    </AbsoluteFill>
  );
};

/* =====================================================================
   S7 — The four services, each arriving on its word
   ===================================================================== */
const TILES = [
  { src: "brand/tile_1_physicians-hospitals_es.png", word: "médicos" },
  { src: "brand/tile_2_lab-work_es.png", word: "laboratorio" },
  { src: "brand/tile_3_diagnostic-imaging_es.png", word: "imágenes" },
  { src: "brand/tile_4_pharmacy_es.png", word: "farmacia" },
];

export const S7Services: React.FC<SceneProps> = ({ v }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tProv = at(v, "proveedores", 100);
  const eyebrow = prog(f, tProv - 8, 16);
  return (
    <AbsoluteFill style={{ background: C.sand }}>
      <Stage>
        {[[120, 300, 90, C.mint], [980, 760, 140, C.mint], [90, 1500, 70, C.sageLight]].map(([x, y, r, c], i) => (
          <circle key={i} cx={(x as number) + Math.sin(f / 50 + i) * 20} cy={(y as number) + Math.cos(f / 60 + i) * 20} r={r as number} fill={c as string} opacity={0.8} />
        ))}
        <Sprout x={1000} y={1560} s={1.0} grow={prog(f, 20, 50)} sway={Math.sin(f / 26) * 3} />
      </Stage>
      <div style={{ position: "absolute", left: 90, right: 90, top: 200 }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", color: C.taupe, marginBottom: 22, opacity: eyebrow, transform: `translateY(${(1 - eyebrow) * 10}px)` }}>
          CON PROVEEDORES PARTICIPANTES
        </div>
        <Headline lead="Para el cuidado" accent="de todos los días" size={88} reveal={prog(f, 0, 40, (t) => t)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, perspective: 1400 }}>
        {TILES.map((t, i) => {
          const s0 = at(v, t.word, 14 + i * 22) - 6;
          const sp = spring({ frame: f - s0, fps, config: { damping: 14, stiffness: 130 } });
          const wave = Math.sin(clamp01((f - tProv - i * 4) / 18) * Math.PI) * -18;
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <Img
              key={t.src}
              src={staticFile(t.src)}
              style={{
                position: "absolute",
                left: 150 + col * 400,
                top: 600 + row * 410,
                width: 370,
                opacity: clamp01(sp * 2),
                transform: `translateY(${(1 - sp) * 80 + wave}px) rotateY(${(1 - sp) * 80}deg) scale(${0.9 + sp * 0.1})`,
                borderRadius: 28,
                boxShadow: "0 14px 30px rgba(52,74,50,0.12)",
              }}
            />
          );
        })}
      </div>
      <Paper />
    </AbsoluteFill>
  );
};

/* =====================================================================
   S8 — Morning walk, together
   ===================================================================== */
export const S8Family: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const w = f / 6.2;
  const far = (f * 1.0) % 1400;
  const near = (f * 3.2) % 1400;
  const sun = prog(f, 0, 120);
  const sunY = lerp(760, 600, sun);
  const rays = f * 0.15;
  const zoom = interpolate(f, [0, dur], [1.1, 1.0], { easing: easeOut });
  return (
    <AbsoluteFill style={{ background: C.mint }}>
      <Stage zoom={zoom} oy={1200}>
        <defs>
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.mint} />
            <stop offset="1" stopColor={C.sand} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#sky2)" />
        <g transform={`rotate(${rays} 760 ${sunY})`} opacity={0.35}>
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M760 ${sunY} L${760 + Math.cos((i / 12) * Math.PI * 2) * 900} ${sunY + Math.sin((i / 12) * Math.PI * 2) * 900} L${760 + Math.cos((i / 12 + 0.03) * Math.PI * 2) * 900} ${sunY + Math.sin((i / 12 + 0.03) * Math.PI * 2) * 900} Z`} fill={C.white} opacity={0.5} />
          ))}
        </g>
        <circle cx={760} cy={sunY} r={190} fill={C.sand} opacity={0.6} />
        <circle cx={760} cy={sunY} r={130} fill={C.sand} />
        {/* birds */}
        {[0, 1, 2].map((i) => {
          const bx = ((f * 2.2 + i * 160) % 1300) - 100;
          const by = 380 + i * 50 + Math.sin(f / 20 + i) * 20;
          const flap = Math.sin(f / 4 + i) * 14;
          return <path key={i} d={`M${bx - 22} ${by - flap} Q ${bx - 10} ${by - 8} ${bx} ${by} Q ${bx + 10} ${by - 8} ${bx + 22} ${by - flap}`} stroke={C.forest} strokeWidth={5} fill="none" strokeLinecap="round" />;
        })}
        <g transform={`translate(${-far} 0)`}>
          {[0, 1400].map((o) => (
            <path key={o} d={`M${o - 100} 980 C ${o + 200} 820 ${o + 450} 860 ${o + 700} 940 C ${o + 950} 1010 ${o + 1150} 840 ${o + 1500} 930 L ${o + 1500} 1920 L ${o - 100} 1920 Z`} fill={C.sageLight} opacity={0.65} />
          ))}
        </g>
        <g transform={`translate(${-near} 0)`}>
          {[0, 1400].map((o) => (
            <g key={o}>
              <path d={`M${o - 100} 1100 C ${o + 300} 1020 ${o + 700} 1080 ${o + 1500} 1060 L ${o + 1500} 1920 L ${o - 100} 1920 Z`} fill={C.sage} />
              {[160, 620, 1080].map((tx) => (
                <g key={tx} transform={`translate(${o + tx} 1060)`}>
                  <rect x={-8} y={-80} width={16} height={90} fill={C.taupe} />
                  <circle cx={0} cy={-120} r={62} fill={C.forest} opacity={0.85} />
                </g>
              ))}
            </g>
          ))}
        </g>
        <rect x={0} y={1310} width={1080} height={70} fill={C.sand} opacity={0.8} />
        {/* the family, holding hands */}
        <Person x={250} y={1350} s={0.92} sweater={C.forest} sweaterShade="#283A27" hairStyle="short" hair={C.hair2} skin={C.skin2} walk={w + Math.PI} armFront={24} elbowFront={6} eyes="open" blink={f % 90 > 85} t={f} />
        <Person x={420} y={1360} s={0.6} sweater={C.rust} sweaterShade="#97431F" hairStyle="pony" hair={C.hair2} skin={C.skin2} walk={w + 2.4} armFront={50} armBack={-40} t={f} />
        <Person x={620} y={1350} s={0.88} sweater={C.teal} sweaterShade="#265B54" hairStyle="bun" walk={w} armBack={-36} armFront={30} elbowFront={10} blink={f % 110 > 104} t={f} />
        <g transform={`translate(0 ${-Math.abs(Math.sin(w * 0.9)) * 30})`}>
          <Person x={790} y={1360} s={0.5} sweater={C.sageLight} sweaterShade={C.sage} hairStyle="curly" hair={C.hair1} skin={C.skin1} walk={w * 1.3 + 0.6} armBack={-50} t={f} />
        </g>
        {/* falling leaves */}
        {[0, 1, 2, 3].map((i) => {
          const p = ((f / 120 + i / 4) % 1);
          return <ellipse key={i} cx={100 + i * 260 + Math.sin(p * 8 + i) * 40} cy={200 + p * 1100} rx={9} ry={16} fill={i % 2 ? C.sage : C.sageLight} transform={`rotate(${p * 400} ${100 + i * 260} ${200 + p * 1100})`} opacity={Math.sin(p * Math.PI)} />;
        })}
      </Stage>
      <Paper />
    </AbsoluteFill>
  );
};

/* =====================================================================
   S9 — CTA: the sun opens onto the brand
   ===================================================================== */
export const S9CTA: React.FC<SceneProps> = ({ v }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iris = prog(f, 0, 22, easeInOut);
  const tUnete = at(v, "únete", 24);
  const tUrl = v.words.length ? v.words[v.words.length - 1].s : 60;
  const logo = spring({ frame: f - 6, fps, config: { damping: 14 } });
  const chip = spring({ frame: f - (tUnete - 6), fps, config: { damping: 11, stiffness: 150 } });
  const tap = prog(f, tUnete + 14, 18);
  const press = 1 - Math.sin(clamp01((f - tUnete - 14) / 8) * Math.PI) * 0.05;
  const url = "viventis.health";
  const typed = Math.round(clamp01((f - tUrl + 2) / 20) * url.length);
  const breathe = 1 + Math.sin(f / 18) * 0.008;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${iris * 160}% at 70% 31%)`, background: C.sand }}>
      <Stage>
        <circle cx={-60} cy={1700} r={260} fill={C.mint} />
        <circle cx={140} cy={1460} r={60} fill={C.sageLight} opacity={0.8} />
        <circle cx={1000 + Math.sin(f / 40) * 10} cy={260} r={150} fill={C.mint} />
        <Sprout x={960} y={1560} s={1.4} grow={prog(f, 10, 50)} sway={Math.sin(f / 26) * 3} />
      </Stage>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("brand/viventis-lockup_transparent_608x144.png")} style={{ width: 560, opacity: clamp01(logo), transform: `translateY(${(1 - logo) * 30}px)` }} />
        <div style={{ height: 120 }} />
        <div style={{ position: "relative" }}>
          <Img src={staticFile("brand/cta_unete-hoy_es.png")} style={{ width: 534, opacity: clamp01(chip * 2), transform: `scale(${(0.85 + chip * 0.15) * press * breathe})` }} />
          {/* tap ripple */}
          <div
            style={{
              position: "absolute",
              left: 400 - 90 * tap,
              top: 80 - 90 * tap,
              width: 180 * tap,
              height: 180 * tap,
              borderRadius: 999,
              border: `6px solid ${C.forest}`,
              opacity: (1 - tap) * (tap > 0 ? 0.5 : 0),
            }}
          />
        </div>
        <div style={{ marginTop: 44, fontFamily, fontWeight: 800, fontSize: 64, letterSpacing: "-0.02em", color: C.forest, minHeight: 80 }}>
          {url.slice(0, typed)}
          <span style={{ opacity: typed < url.length && f % 16 < 8 && typed > 0 ? 1 : 0, color: C.teal }}>|</span>
        </div>
      </div>
      <Paper />
    </AbsoluteFill>
  );
};

/* =====================================================================
   End — Legal's line ≥ 5 s
   ===================================================================== */
export const SEnd: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.forest }}>
      <Stage>
        <circle cx={1080 + Math.sin(f / 50) * 10} cy={0} r={300} fill={C.teal} opacity={0.55} />
        <circle cx={60} cy={1500} r={90} fill={C.teal} opacity={0.35} />
        <Sprout x={960} y={1560} s={1.2} grow={prog(f, 0, 40)} dark sway={Math.sin(f / 26) * 3} />
      </Stage>
      <div style={{ position: "absolute", top: 380, left: 90, right: 90, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("brand/viventis-logo-chip_for-dark-grounds_704x216.png")} style={{ width: 520, opacity: prog(f, 0, 16), transform: `scale(${0.95 + prog(f, 0, 20) * 0.05})` }} />
        <div style={{ marginTop: 50, fontFamily, fontWeight: 800, fontSize: 60, color: C.white, opacity: prog(f, 6, 16) }}>viventis.health</div>
        <div style={{ marginTop: 90, fontFamily, fontWeight: 400, fontSize: 38, lineHeight: 1.45, color: C.white, textAlign: "center", opacity: prog(f, 10, 18) }}>
          <b style={{ fontWeight: 800 }}>Esto NO es un seguro.</b> Membresía de descuentos médicos, solo en Texas. Tú pagas el precio con descuento al proveedor. Operador: Viventis Health TX LLC. Cancela en 30 días y recibe el reembolso total.
        </div>
      </div>
      <Paper dark />
    </AbsoluteFill>
  );
};

export { env };
