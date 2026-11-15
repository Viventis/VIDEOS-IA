import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, fontFamily } from "./theme";
import { Person, SleepingChild } from "./characters";
import { BoilDefs, Headline, Paper, Subtitle, easeInOut, easeOut, env, prog } from "./ui";

export const Stage: React.FC<{ children: React.ReactNode; zoom?: number; ox?: number; oy?: number }> = ({
  children,
  zoom = 1,
  ox = 540,
  oy = 960,
}) => (
  <svg
    viewBox="0 0 1080 1920"
    width={1080}
    height={1920}
    style={{ position: "absolute", inset: 0 }}
  >
    <BoilDefs />
    <g transform={`translate(${ox} ${oy}) scale(${zoom}) translate(${-ox} ${-oy})`}>{children}</g>
  </svg>
);

/** The brand sprout (paths from 06_SVG/sprouts), growing from its stem. */
export const Sprout: React.FC<{
  x: number;
  y: number;
  s?: number;
  grow: number;
  dark?: boolean;
  sway?: number;
}> = ({ x, y, s = 1, grow, dark, sway = 0 }) => {
  const leaf = easeOut(Math.max(0, Math.min(1, grow * 1.6 - 0.6)));
  const stem = Math.min(1, grow * 1.6);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-60 -166)`}>
      <path
        d="M60 74V166"
        fill="none"
        stroke={dark ? "#C9BBA6" : C.stem}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={92}
        strokeDashoffset={92 * (1 - stem)}
      />
      <g transform={`rotate(${sway} 60 76) translate(60 76) scale(${leaf}) translate(-60 -76)`}>
        <path d="M57 76C25 76 6 52 8 14c33 0 54 25 49 62Z" fill={C.sageLight} />
        <path d="M63 76c32 0 51-24 49-62-33 0-54 25-49 62Z" fill={dark ? C.pale : C.sage} />
      </g>
    </g>
  );
};

export const Stars: React.FC<{ frame: number; pts: number[][] }> = ({ frame, pts }) => (
  <>
    {pts.map(([x, y, r], i) => (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={r}
        fill={C.sand}
        opacity={0.45 + 0.4 * Math.sin(frame / 14 + i * 1.7)}
      />
    ))}
  </>
);

/* ---------------- 1. Before sunrise: the kitchen ---------------- */
export const SceneKitchen: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 165], [1.0, 1.06]);
  const chop = Math.sin(f / 5) * 10;
  const steam = (k: number) => ((f + k * 30) % 90) / 90;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Stage zoom={zoom} oy={800}>
        {/* wall */}
        <rect width={1080} height={1920} fill="#22341F" />
        {/* window */}
        <rect x={110} y={250} width={400} height={500} rx={28} fill={C.taupe} />
        <rect x={130} y={270} width={360} height={460} rx={18} fill="#1E3A36" />
        <rect x={130} y={500} width={360} height={10} fill={C.taupe} />
        <rect x={305} y={270} width={10} height={460} fill={C.taupe} />
        <Stars frame={f} pts={[[170, 320, 4], [260, 380, 3], [420, 330, 5], [380, 440, 3], [200, 600, 3], [440, 640, 4]]} />
        <circle cx={240} cy={430} r={46} fill={C.sand} />
        <circle cx={262} cy={418} r={42} fill="#1E3A36" />
        {/* clock: 5:40 */}
        <g transform="translate(850 400)">
          <circle r={86} fill={C.sand} />
          <circle r={86} fill="none" stroke={C.taupe} strokeWidth={10} />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={-3} y={-72} width={6} height={14} rx={3} fill={C.taupe} transform={`rotate(${i * 30})`} />
          ))}
          <rect x={-5} y={-40} width={10} height={44} rx={5} fill={C.forest} transform="rotate(170)" />
          <rect x={-3.5} y={-62} width={7} height={66} rx={4} fill={C.teal} transform={`rotate(${240 + f * 0.2})`} />
          <circle r={8} fill={C.forest} />
        </g>
        {/* lamp */}
        <path d="M640 0 L640 260" stroke={C.taupe} strokeWidth={6} />
        <path d="M560 330 Q640 230 720 330 Z" fill={C.sage} />
        <ellipse cx={640} cy={330} rx={80} ry={14} fill={C.sand} />
        <path d="M560 336 L360 1010 L920 1010 L720 336 Z" fill={C.sand} opacity={0.08} />
        <ellipse cx={640} cy={1000} rx={360} ry={70} fill={C.sand} opacity={0.12} />
        {/* mom behind the counter */}
        <Person
          x={600}
          y={1290}
          s={1.0}
          sweater={C.teal}
          sweaterShade="#265B54"
          hairStyle="bun"
          headTilt={14}
          eyes="down"
          armFront={58 + chop * 0.4}
          elbowFront={48}
          armBack={30}
          blink={f % 110 > 104}
        />
        {/* counter */}
        <rect x={-20} y={990} width={1120} height={36} rx={12} fill={C.sand} />
        <rect x={-20} y={1024} width={1120} height={900} fill={C.taupe} />
        <rect x={60} y={1080} width={300} height={360} rx={18} fill="#6C5C46" />
        <rect x={400} y={1080} width={300} height={360} rx={18} fill="#6C5C46" />
        <rect x={740} y={1080} width={300} height={360} rx={18} fill="#6C5C46" />
        {/* lunchbox, apple, mug */}
        <g filter="url(#boil)">
          <rect x={720} y={900} width={210} height={96} rx={20} fill={C.rust} />
          <rect x={780} y={884} width={90} height={24} rx={10} fill="none" stroke={C.rust} strokeWidth={10} />
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
      </Stage>
      <Paper dark />
    </AbsoluteFill>
  );
};

/* ---------------- 2. The fridge drawing ---------------- */
export const Crayon: React.FC<{ d: string; p: number; color: string; w?: number; len?: number }> = ({
  d,
  p,
  color,
  w = 9,
  len = 900,
}) => (
  <path
    d={d}
    stroke={color}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    strokeDasharray={len}
    strokeDashoffset={len * (1 - p)}
  />
);

export const SceneDrawing: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 180], [1.0, 1.08]);
  const st = (i: number) => prog(f, 6 + i * 9, 26, easeInOut);
  const handIn = prog(f, 95, 40);
  return (
    <AbsoluteFill style={{ background: C.mint }}>
      <Stage zoom={zoom} oy={720}>
        <rect width={1080} height={1920} fill="#DCE8DA" />
        {/* fridge door edge + handle */}
        <rect x={960} y={0} width={30} height={1920} fill="#C9D9C6" />
        <rect x={1000} y={300} width={26} height={600} rx={13} fill={C.sand} />
        {/* paper */}
        <g transform="rotate(-3 540 700)">
          <rect x={150} y={280} width={780} height={860} rx={8} fill={C.white} />
          <rect x={150} y={280} width={780} height={860} rx={8} fill="none" stroke="#E6E1D6" strokeWidth={4} />
          {/* crayon drawing */}
          <g filter="url(#boil)">
            {/* sun */}
            <Crayon d="M790 400 m -55 0 a 55 55 0 1 0 110 0 a 55 55 0 1 0 -110 0" p={st(0)} color={C.terra} len={360} />
            <Crayon d="M790 310 L790 280 M870 400 L900 400 M850 340 L872 318 M850 460 L872 482 M730 340 L708 318" p={st(1)} color={C.terra} len={400} w={7} />
            {/* ground */}
            <Crayon d="M190 1010 C 330 990 520 1030 890 1000" p={st(2)} color={C.sage} w={12} />
            {/* dad */}
            <Crayon d="M300 640 m -45 0 a 45 45 0 1 0 90 0 a 45 45 0 1 0 -90 0 M300 685 L300 860 M300 860 L260 990 M300 860 L340 990 M300 730 L230 820 M300 730 L380 790" p={st(3)} color={C.forest} len={1100} />
            {/* mom */}
            <Crayon d="M480 660 m -42 0 a 42 42 0 1 0 84 0 a 42 42 0 1 0 -84 0 M450 630 C 430 600 520 590 515 640 M480 702 L420 900 L540 900 Z M450 900 L440 990 M510 900 L520 990 M480 750 L380 790 M480 750 L580 810" p={st(4)} color={C.teal} len={1300} />
            {/* child */}
            <Crayon d="M640 780 m -34 0 a 34 34 0 1 0 68 0 a 34 34 0 1 0 -68 0 M640 814 L640 920 M640 920 L612 990 M640 920 L668 990 M640 850 L585 812 M640 850 L700 880" p={st(5)} color={C.rust} len={800} />
            {/* little one */}
            <Crayon d="M760 860 m -26 0 a 26 26 0 1 0 52 0 a 26 26 0 1 0 -52 0 M760 886 L760 950 M760 950 L742 995 M760 950 L778 995 M760 905 L708 880" p={st(6)} color={C.sage} len={600} />
            {/* heart */}
            <Crayon d="M520 470 C 480 420 420 470 520 540 C 620 470 560 420 520 470 Z" p={st(7)} color={C.terra} len={520} w={10} />
            {/* "mamá" in crayon letters */}
            <Crayon
              d="M230 400 L230 340 L260 380 L290 340 L290 400 M320 400 L345 340 L370 400 M330 378 L360 378 M400 400 L400 340 L430 380 L460 340 L460 400 M490 400 L515 340 L540 400 M500 378 L530 378 M512 322 L528 306"
              p={st(8)}
              color={C.teal}
              len={1200}
              w={8}
            />
          </g>
        </g>
        {/* magnets */}
        <circle cx={250} cy={300} r={34} fill={C.terra} />
        <circle cx={820} cy={262} r={30} fill={C.teal} />
        {/* mom's hand straightening the drawing */}
        <g transform={`translate(${interpolate(handIn, [0, 1], [-260, 0])} 0)`} filter="url(#boil)">
          <path d="M-40 1130 L120 1080" stroke={C.teal} strokeWidth={70} strokeLinecap="round" />
          <ellipse cx={170} cy={1066} rx={46} ry={34} fill={C.skin1} transform="rotate(-18 170 1066)" />
        </g>
      </Stage>
      <Paper />
    </AbsoluteFill>
  );
};

/* ---------------- 3. The question she keeps putting off ---------------- */
export const ScenePhone: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 200], [1.04, 1.0]);
  const lower = prog(f, 125, 30, easeInOut);
  const bubble = env(f, 34, 128, 14);
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Stage zoom={zoom} oy={900}>
        <rect width={1080} height={1920} fill="#22341F" />
        {/* calendar with a circled day */}
        <g transform="translate(760 560)" filter="url(#boil)">
          <rect width={260} height={280} rx={16} fill={C.sand} />
          <rect width={260} height={60} rx={16} fill={C.sage} />
          <rect y={44} width={260} height={16} fill={C.sage} />
          {Array.from({ length: 20 }).map((_, i) => (
            <rect key={i} x={22 + (i % 5) * 46} y={84 + Math.floor(i / 5) * 46} width={30} height={22} rx={6} fill="#E3DDD1" />
          ))}
          <circle cx={129} cy={141} r={30} fill="none" stroke={C.terra} strokeWidth={6} />
        </g>
        {/* warm lamp pool */}
        <ellipse cx={500} cy={1060} rx={460} ry={120} fill={C.sand} opacity={0.10} />
        {/* mom seated */}
        <Person
          x={430}
          y={1360}
          sweater={C.teal}
          sweaterShade="#265B54"
          hairStyle="bun"
          headTilt={interpolate(lower, [0, 1], [16, 24])}
          eyes={lower > 0.5 ? "closed" : "down"}
          smile={false}
          armFront={interpolate(lower, [0, 1], [70, 36])}
          elbowFront={interpolate(lower, [0, 1], [70, 40])}
          armBack={18}
        />
        {/* phone in hand */}
        <g
          transform={`translate(${interpolate(lower, [0, 1], [610, 650])} ${interpolate(lower, [0, 1], [700, 1010])}) rotate(${interpolate(lower, [0, 1], [-20, -84])})`}
        >
          <rect x={-34} y={-62} width={68} height={124} rx={12} fill={C.ink} />
          <rect x={-28} y={-54} width={56} height={104} rx={8} fill={lower > 0.85 ? C.ink : C.mint} />
        </g>
        {/* table */}
        <rect x={-20} y={1040} width={1120} height={34} rx={12} fill={C.taupe} />
        <rect x={-20} y={1072} width={1120} height={900} fill="#152114" />
        {/* thought bubble */}
        <g opacity={bubble} transform={`translate(0 ${(1 - bubble) * 20})`} filter="url(#boil)">
          <circle cx={600} cy={560} r={14} fill={C.sand} />
          <circle cx={640} cy={500} r={22} fill={C.sand} />
          <rect x={120} y={250} width={600} height={210} rx={105} fill={C.sand} />
        </g>
      </Stage>
      {/* bubble text (crisp, outside the boil) */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 250,
          width: 600,
          height: 210,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: C.forest,
          textAlign: "center",
          opacity: bubble,
          transform: `translateY(${(1 - bubble) * 20}px)`,
        }}
      >
        ¿Cuánto me va
        <br />a costar?
      </div>
      <Paper dark />
    </AbsoluteFill>
  );
};

/* ---------------- 4. Goodnight: the turn ---------------- */
export const SceneBedroom: React.FC = () => {
  const f = useCurrentFrame();
  const reach = prog(f, 20, 60, easeInOut);
  const breath = Math.sin(f / 22);
  const flood = prog(f, 138, 30, easeInOut);
  const mobile = Math.sin(f / 30) * 6;
  return (
    <AbsoluteFill style={{ background: C.night }}>
      <Stage zoom={interpolate(f, [0, 170], [1.0, 1.05])} oy={1000}>
        <rect width={1080} height={1920} fill="#1A2B2A" />
        {/* door + light wedge */}
        <rect x={40} y={380} width={250} height={760} fill={C.sand} opacity={0.9} />
        <path d="M40 1140 L290 1140 L900 1920 L-200 1920 Z" fill={C.sand} opacity={0.14} />
        <rect x={20} y={360} width={20} height={800} fill={C.taupe} />
        {/* window with stars */}
        <rect x={640} y={300} width={300} height={360} rx={150} fill="#24474A" />
        <Stars frame={f} pts={[[700, 420, 4], [790, 380, 5], [880, 460, 3], [740, 540, 3], [860, 580, 4]]} />
        {/* mobile */}
        <g transform={`rotate(${mobile} 560 160)`} filter="url(#boil)">
          <path d="M560 0 L560 160 M470 200 L650 200 M560 160 L560 200 M470 200 L470 260 M650 200 L650 280" stroke={C.stem} strokeWidth={4} />
          <circle cx={470} cy={280} r={20} fill={C.sage} />
          <circle cx={650} cy={300} r={18} fill={C.terra} />
        </g>
        {/* child asleep */}
        <SleepingChild x={650} y={1040} breath={breath} s={1.05} />
        {/* mom leans over */}
        <Person
          x={250}
          y={1130}
          s={1.0}
          sweater={C.teal}
          sweaterShade="#265B54"
          hairStyle="bun"
          headTilt={interpolate(reach, [0, 1], [8, 26])}
          eyes={reach > 0.6 ? "closed" : "down"}
          armFront={interpolate(reach, [0, 1], [6, 30])}
          elbowFront={interpolate(reach, [0, 1], [4, 18])}
          armBack={6}
        />
      </Stage>
      {/* the door light floods the frame and becomes the next scene */}
      <AbsoluteFill
        style={{
          background: C.sand,
          clipPath: `polygon(${interpolate(flood, [0, 1], [3.7, -60])}% ${interpolate(flood, [0, 1], [20, -40])}%, ${interpolate(flood, [0, 1], [26.8, 160])}% ${interpolate(flood, [0, 1], [20, -40])}%, ${interpolate(flood, [0, 1], [26.8, 160])}% ${interpolate(flood, [0, 1], [59, 160])}%, ${interpolate(flood, [0, 1], [3.7, -60])}% ${interpolate(flood, [0, 1], [59, 160])}%)`,
          opacity: flood > 0 ? 1 : 0,
        }}
      />
      <Paper dark />
    </AbsoluteFill>
  );
};

/* ---------------- 5. Brand turn ---------------- */
export const SceneBrand: React.FC = () => {
  const f = useCurrentFrame();
  const pill = prog(f, 12, 24);
  const circles = prog(f, 0, 50);
  return (
    <AbsoluteFill style={{ background: C.sand }}>
      <Stage>
        <g transform={`translate(${interpolate(circles, [0, 1], [160, 0])} ${interpolate(circles, [0, 1], [-120, 0])})`}>
          <circle cx={1010} cy={250} r={250} fill={C.forest} />
          <circle cx={790} cy={470} r={90} fill={C.sage} />
          <circle cx={700} cy={190} r={16} fill={C.terra} />
        </g>
        <Sprout x={930} y={1540} s={1.7} grow={prog(f, 30, 70)} sway={Math.sin(f / 26) * 3} />
      </Stage>
      <Img
        src={staticFile("brand/viventis-lockup_transparent_608x144.png")}
        style={{ position: "absolute", left: 90, top: 140, width: 380, opacity: prog(f, 0, 20) }}
      />
      <div style={{ position: "absolute", left: 90, right: 90, top: 720 }}>
        <Img
          src={staticFile("brand/pill-outline_membresia-descuentos-medicos_es_for-light-grounds.png")}
          style={{
            width: 640,
            opacity: pill,
            transform: `translateY(${(1 - pill) * 16}px)`,
            marginBottom: 44,
          }}
        />
        <Headline lead="Cuida de los tuyos" accent="sin dejarlo para después" size={104} reveal={prog(f, 22, 70, (t) => t)} />
      </div>
      <Paper />
    </AbsoluteFill>
  );
};

/* ---------------- 6. Ask your discounted price ---------------- */
export const SceneAsk: React.FC = () => {
  const f = useCurrentFrame();
  const phone = prog(f, 0, 34);
  const card = prog(f, 22, 30);
  const sparkle = prog(f, 60, 30);
  return (
    <AbsoluteFill style={{ background: C.mint }}>
      <Stage>
        <circle cx={540} cy={1060} r={420} fill={C.sand} />
        <circle cx={130} cy={1440} r={60} fill={C.sageLight} opacity={0.7} />
        <g transform={`translate(0 ${430 + (1 - phone) * 260}) rotate(${(1 - phone) * 8} 540 640)`} filter="url(#boil)">
          {/* sleeve + palm behind the phone */}
          <path d="M600 1500 C 590 1300 570 1160 560 1060" stroke={C.teal} strokeWidth={170} strokeLinecap="round" fill="none" />
          <ellipse cx={545} cy={1010} rx={150} ry={92} fill={C.skin1} />
          <rect x={330} y={270} width={420} height={780} rx={56} fill={C.ink} />
          <rect x={350} y={300} width={380} height={720} rx={40} fill={C.sand} />
          {/* fingers on the left edge, thumb on the right */}
          {[760, 840, 920].map((fy) => (
            <ellipse key={fy} cx={334} cy={fy} rx={30} ry={38} fill={C.skin1} />
          ))}
          <ellipse cx={748} cy={860} rx={32} ry={66} fill={C.skin1} transform="rotate(-14 748 860)" />
        </g>
      </Stage>
      {/* digital card on the phone screen (crisp) */}
      <div
        style={{
          position: "absolute",
          left: 372,
          top: 870 + (1 - phone) * 260,
          width: 336,
          height: 210,
          borderRadius: 22,
          background: C.forest,
          opacity: card,
          transform: `scale(${0.9 + card * 0.1})`,
          padding: 22,
          boxSizing: "border-box",
          fontFamily,
          color: C.white,
          boxShadow: "0 12px 30px rgba(27,42,26,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: C.white, borderRadius: 999, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={staticFile("brand/viventis-mark_transparent_144px.png")} style={{ width: 34 }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: C.pale }}>MIEMBRO</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 30, marginTop: 30 }}>Tu nombre</div>
        <div style={{ fontWeight: 400, fontSize: 22, marginTop: 4, color: C.pale }}>VV-0000-0000</div>
      </div>
      {/* tiny check confirms the card is ready */}
      <div
        style={{
          position: "absolute",
          left: 660,
          top: 840 + (1 - phone) * 260,
          width: 64,
          height: 64,
          borderRadius: 999,
          background: C.teal,
          transform: `scale(${easeOut(sparkle)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={34} height={34} viewBox="0 0 24 24">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke={C.white} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 200 }}>
        <div
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.14em",
            color: C.taupe,
            marginBottom: 22,
            opacity: prog(f, 30, 20),
          }}
        >
          ANTES DE TU CITA
        </div>
        <Headline lead="Pregunta tu precio con descuento" accent="antes de tu cita" size={88} reveal={prog(f, 36, 70, (t) => t)} />
      </div>
      <Paper />
    </AbsoluteFill>
  );
};

/* ---------------- 7. The four services ---------------- */
const tiles = [
  "brand/tile_1_physicians-hospitals_es.png",
  "brand/tile_2_lab-work_es.png",
  "brand/tile_3_diagnostic-imaging_es.png",
  "brand/tile_4_pharmacy_es.png",
];

export const SceneServices: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.sand }}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 250 }}>
        <div style={{ fontFamily, fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", color: C.taupe, marginBottom: 22, opacity: prog(f, 0, 18) }}>
          CON PROVEEDORES PARTICIPANTES
        </div>
        <Headline lead="Para el cuidado" accent="de todos los días" size={88} reveal={prog(f, 4, 50, (t) => t)} />
      </div>
      {tiles.map((t, i) => {
        const p = prog(f, 34 + i * 10, 30);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <Img
            key={t}
            src={staticFile(t)}
            style={{
              position: "absolute",
              left: 150 + col * 400,
              top: 660 + row * 410,
              width: 370,
              opacity: p,
              transform: `translateY(${(1 - p) * 60}px) scale(${0.94 + p * 0.06 + Math.sin(f / 40 + i) * 0.004})`,
              borderRadius: 28,
              boxShadow: `0 ${14 * p}px ${30 * p}px rgba(52,74,50,0.12)`,
            }}
          />
        );
      })}
      <Stage>
        <Sprout x={1000} y={1560} s={1.0} grow={prog(f, 60, 60)} sway={Math.sin(f / 26) * 3} />
      </Stage>
      <Paper />
    </AbsoluteFill>
  );
};

/* ---------------- 8. Morning walk, together ---------------- */
export const SceneFamily: React.FC = () => {
  const f = useCurrentFrame();
  const w = f / 6.2;
  const far = (f * 1.0) % 1400;
  const near = (f * 3.2) % 1400;
  const sun = prog(f, 0, 120);
  return (
    <AbsoluteFill style={{ background: C.mint }}>
      <Stage>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.mint} />
            <stop offset="1" stopColor={C.sand} />
          </linearGradient>
        </defs>
        <rect width={1080} height={1920} fill="url(#sky)" />
        <circle cx={760} cy={interpolate(sun, [0, 1], [760, 600])} r={130} fill={C.sand} />
        <circle cx={760} cy={interpolate(sun, [0, 1], [760, 600])} r={190} fill={C.sand} opacity={0.5} />
        {/* far hills */}
        <g transform={`translate(${-far} 0)`}>
          {[0, 1400].map((o) => (
            <path key={o} d={`M${o - 100} 980 C ${o + 200} 820 ${o + 450} 860 ${o + 700} 940 C ${o + 950} 1010 ${o + 1150} 840 ${o + 1500} 930 L ${o + 1500} 1920 L ${o - 100} 1920 Z`} fill={C.sageLight} opacity={0.65} />
          ))}
        </g>
        {/* near hills + trees */}
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
        {/* path */}
        <rect x={0} y={1310} width={1080} height={70} fill={C.sand} opacity={0.8} />
        {/* the family */}
        <Person x={250} y={1350} s={0.92} sweater={C.forest} sweaterShade="#283A27" hairStyle="short" hair={C.hair2} skin={C.skin2} walk={w + 1.2} smile eyes="open" blink={f % 90 > 85} />
        <Person x={460} y={1360} s={0.6} sweater={C.rust} sweaterShade="#97431F" hairStyle="pony" hair={C.hair2} skin={C.skin2} walk={w + 2.4} armFront={20} smile />
        <Person x={640} y={1350} s={0.88} sweater={C.teal} sweaterShade="#265B54" hairStyle="bun" walk={w} armBack={-14} smile blink={f % 110 > 104} />
        <Person x={820} y={1360} s={0.5} sweater={C.sageLight} sweaterShade={C.sage} hairStyle="curly" hair={C.hair1} skin={C.skin1} walk={w + 0.6} armBack={30} smile />
      </Stage>
      <Subtitle text="Una membresía Familia: hasta cinco personas." start={14} end={165} top={1440} />
      <Paper />
    </AbsoluteFill>
  );
};

/* ---------------- 9. CTA ---------------- */
export const SceneCTA: React.FC = () => {
  const f = useCurrentFrame();
  const logo = prog(f, 0, 24);
  const chip = prog(f, 26, 26);
  const breathe = 1 + Math.sin(f / 18) * 0.01;
  return (
    <AbsoluteFill style={{ background: C.sand }}>
      <Stage>
        <circle cx={-60} cy={1700} r={260} fill={C.mint} />
        <circle cx={140} cy={1460} r={60} fill={C.sageLight} opacity={0.8} />
        <Sprout x={960} y={1560} s={1.4} grow={prog(f, 10, 60)} sway={Math.sin(f / 26) * 3} />
      </Stage>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img
          src={staticFile("brand/viventis-lockup_transparent_608x144.png")}
          style={{ width: 560, opacity: logo, transform: `translateY(${(1 - logo) * 20}px)` }}
        />
        <div style={{ height: 120 }} />
        <Img
          src={staticFile("brand/cta_unete-hoy_es.png")}
          style={{ width: 534, opacity: chip, transform: `scale(${(0.92 + chip * 0.08) * breathe})` }}
        />
        <div
          style={{
            marginTop: 44,
            fontFamily,
            fontWeight: 800,
            fontSize: 64,
            letterSpacing: "-0.02em",
            color: C.forest,
            opacity: prog(f, 40, 20),
          }}
        >
          viventis.health
        </div>
      </div>
      <Paper />
    </AbsoluteFill>
  );
};

/* ---------------- 10. End screen with Legal's line ---------------- */
export const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.forest }}>
      <Stage>
        <circle cx={1080} cy={0} r={300} fill={C.teal} opacity={0.55} />
        <Sprout x={960} y={1560} s={1.2} grow={1} dark sway={Math.sin(f / 26) * 3} />
      </Stage>
      <div style={{ position: "absolute", top: 380, left: 90, right: 90, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("brand/viventis-logo-chip_for-dark-grounds_704x216.png")} style={{ width: 520, opacity: prog(f, 0, 18) }} />
        <div style={{ marginTop: 50, fontFamily, fontWeight: 800, fontSize: 60, color: C.white, opacity: prog(f, 8, 18) }}>
          viventis.health
        </div>
        <div
          style={{
            marginTop: 90,
            fontFamily,
            fontWeight: 400,
            fontSize: 38,
            lineHeight: 1.45,
            color: C.white,
            textAlign: "center",
            opacity: prog(f, 14, 20),
          }}
        >
          <b style={{ fontWeight: 800 }}>Esto NO es un seguro.</b> Membresía de descuentos médicos, solo en Texas. Tú pagas el precio con descuento al proveedor. Operador: Viventis Health TX LLC. Cancela en 30 días y recibe el reembolso total.
        </div>
      </div>
      <Paper dark />
    </AbsoluteFill>
  );
};
