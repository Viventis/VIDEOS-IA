import React from "react";
import { C } from "./theme";

/**
 * Storybook figures, hand-built in SVG (no AI imagery, no stock faces).
 * Local origin = between the feet, figure faces right. Height ≈ 720 * s.
 */
export type PersonProps = {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  sweater: string;
  sweaterShade: string;
  pants?: string;
  skin?: string;
  hair?: string;
  hairStyle?: "bun" | "short" | "pony" | "curly";
  headTilt?: number; // degrees, + looks down
  armFront?: number; // degrees, + reaches forward
  armBack?: number;
  elbowFront?: number; // forearm bend, + bends up/forward
  walk?: number; // walk phase (radians); undefined = standing
  eyes?: "open" | "closed" | "down";
  blink?: boolean;
  smile?: boolean;
  scarf?: string;
  boil?: boolean;
  handItem?: React.ReactNode; // drawn in the front hand (forearm space)
  t?: number; // frame: adds breathing + idle head motion
};

const Limb: React.FC<{
  sx: number;
  sy: number;
  angle: number;
  bend: number;
  upper: number;
  lower: number;
  width: number;
  color: string;
  hand: string;
  item?: React.ReactNode;
}> = ({ sx, sy, angle, bend, upper, lower, width, color, hand, item }) => (
  <g transform={`translate(${sx} ${sy}) rotate(${-angle})`}>
    <path
      d={`M0 0 L0 ${upper}`}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
    />
    <g transform={`translate(0 ${upper}) rotate(${-bend})`}>
      <path
        d={`M0 0 L0 ${lower}`}
        stroke={color}
        strokeWidth={width * 0.9}
        strokeLinecap="round"
        fill="none"
      />
      {item ? <g transform={`translate(0 ${lower + width * 0.35})`}>{item}</g> : null}
      <circle cx={0} cy={lower + width * 0.35} r={width * 0.42} fill={hand} />
    </g>
  </g>
);

export const Person: React.FC<PersonProps> = ({
  x,
  y,
  s = 1,
  flip,
  sweater,
  sweaterShade,
  pants = C.night,
  skin = C.skin1,
  hair = C.hair1,
  hairStyle = "bun",
  headTilt = 0,
  armFront = 0,
  armBack = 0,
  elbowFront = 0,
  walk,
  eyes = "open",
  blink,
  smile = true,
  scarf,
  boil = true,
  t,
  handItem,
}) => {
  const w = walk ?? 0;
  const walking = walk !== undefined;
  const legA = walking ? Math.sin(w) * 22 : 3;
  const legB = walking ? -Math.sin(w) * 22 : -3;
  const idle = t === undefined ? 0 : Math.sin(t / 22);
  const bob = (walking ? Math.abs(Math.cos(w)) * -8 : 0) + idle * 2.5;
  const tilt = headTilt + (t === undefined ? 0 : Math.sin(t / 41) * 1.6);
  const armSwing = walking ? Math.sin(w) * 18 : 0;
  const eyeState = blink ? "closed" : eyes;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}
      filter={boil ? "url(#boil)" : undefined}
    >
      {/* soft ground shadow */}
      <ellipse cx={0} cy={4} rx={95} ry={14} fill={C.night} opacity={0.18} />
      <g transform={`translate(0 ${bob})`}>
        {/* back arm */}
        <Limb
          sx={-28}
          sy={-540}
          angle={armBack - armSwing}
          bend={8}
          upper={120}
          lower={110}
          width={40}
          color={sweaterShade}
          hand={skin}
        />
        {/* legs */}
        {[legB, legA].map((a, i) => (
          <g key={i} transform={`translate(${i ? 14 : -16} -290) rotate(${-a})`}>
            <path d="M0 0 L0 280" stroke={pants} strokeWidth={46} strokeLinecap="round" />
            <ellipse cx={14} cy={292} rx={34} ry={15} fill={i ? C.forest : C.night} />
          </g>
        ))}
        {/* torso */}
        <path
          d="M-68 -552 C-20 -580 30 -580 64 -552 C88 -470 86 -360 80 -268 C30 -255 -40 -255 -86 -268 C-92 -360 -90 -470 -68 -552 Z"
          fill={sweater}
        />
        {/* sweater hem + knit ribs */}
        <path d="M-86 -280 C-40 -268 30 -268 80 -280" stroke={sweaterShade} strokeWidth={10} fill="none" strokeLinecap="round" />
        {scarf ? (
          <path d="M-46 -560 C-20 -540 30 -540 52 -560 L44 -530 C20 -520 -20 -520 -40 -530 Z" fill={scarf} />
        ) : null}
        {/* neck */}
        <rect x={-15} y={-605} width={32} height={58} rx={14} fill={skin} />
        {/* head */}
        <g transform={`rotate(${tilt} 0 -590)`}>
          {hairStyle === "bun" ? <circle cx={-48} cy={-712} r={34} fill={hair} /> : null}
          {hairStyle === "pony" ? (
            <path d="M-50 -690 C-110 -660 -100 -590 -70 -560 C-80 -610 -70 -650 -40 -670 Z" fill={hair} />
          ) : null}
          {hairStyle === "curly"
            ? [
                [-50, -690, 30],
                [-20, -718, 32],
                [18, -716, 28],
                [-62, -650, 26],
              ].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={hair} />)
            : null}
          <circle cx={6} cy={-652} r={62} fill={skin} />
          {/* ear */}
          <ellipse cx={-14} cy={-648} rx={12} ry={16} fill={skin} stroke={C.skin3} strokeOpacity={0.25} strokeWidth={3} />
          {/* hair cap */}
          {hairStyle === "short" ? (
            <path d="M-56 -640 C-66 -720 20 -742 66 -690 C50 -700 10 -700 -10 -684 C-24 -670 -30 -650 -40 -630 Z" fill={hair} />
          ) : (
            <path d="M-58 -630 C-72 -716 24 -748 70 -686 C40 -700 4 -696 -12 -676 C-26 -660 -34 -630 -46 -604 Z" fill={hair} />
          )}
          {/* nose */}
          <path d="M66 -650 Q76 -640 66 -632" fill={skin} stroke={C.skin3} strokeOpacity={0.35} strokeWidth={3} />
          {/* eye */}
          {eyeState === "open" ? (
            <ellipse cx={42} cy={-660} rx={6} ry={8} fill={C.ink} />
          ) : eyeState === "down" ? (
            <path d="M34 -656 Q42 -650 50 -656" stroke={C.ink} strokeWidth={5} strokeLinecap="round" fill="none" />
          ) : (
            <path d="M34 -660 Q42 -652 50 -660" stroke={C.ink} strokeWidth={5} strokeLinecap="round" fill="none" />
          )}
          {/* brow */}
          <path d="M32 -680 Q42 -686 52 -681" stroke={hair} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />
          {/* cheek */}
          <ellipse cx={34} cy={-628} rx={14} ry={9} fill={C.terra} opacity={0.35} />
          {smile ? (
            <path d="M44 -614 Q54 -608 60 -616" stroke={C.ink} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.7} />
          ) : (
            <path d="M46 -614 L58 -614" stroke={C.ink} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
          )}
        </g>
        {/* front arm */}
        <Limb
          sx={30}
          sy={-540}
          angle={armFront + armSwing}
          bend={elbowFront}
          upper={120}
          lower={110}
          width={42}
          color={sweater}
          hand={skin}
          item={handItem}
        />
      </g>
    </g>
  );
};

/** Small child, same construction at ~0.62 scale with a rounder head. */
export const Child: React.FC<Omit<PersonProps, "s"> & { s?: number }> = (p) => (
  <Person {...p} s={(p.s ?? 1) * 0.6} />
);

/** Sleeping child in bed, seen from the side. Breath drives the blanket. */
export const SleepingChild: React.FC<{ x: number; y: number; breath: number; s?: number }> = ({
  x,
  y,
  breath,
  s = 1,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#boil)">
    {/* bed frame */}
    <rect x={-330} y={-40} width={660} height={60} rx={20} fill={C.taupe} />
    <rect x={-350} y={-230} width={40} height={300} rx={18} fill={C.taupe} />
    <rect x={310} y={-150} width={40} height={220} rx={18} fill={C.taupe} />
    <rect x={-300} y={20} width={24} height={60} rx={8} fill={C.taupe} />
    <rect x={276} y={20} width={24} height={60} rx={8} fill={C.taupe} />
    {/* mattress */}
    <rect x={-310} y={-90} width={620} height={60} rx={22} fill={C.sand} />
    {/* pillow */}
    <ellipse cx={-210} cy={-112} rx={100} ry={38} fill={C.white} />
    {/* head */}
    <g>
      <circle cx={-200} cy={-150} r={52} fill={C.skin2} />
      <path d="M-252 -150 C-262 -214 -170 -230 -146 -186 C-170 -196 -196 -190 -214 -170 C-226 -160 -236 -150 -246 -132 Z" fill={C.hair2} />
      <circle cx={-246} cy={-178} r={22} fill={C.hair2} />
      <path d="M-178 -152 Q-170 -145 -162 -152" stroke={C.ink} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      <ellipse cx={-176} cy={-128} rx={12} ry={7} fill={C.terra} opacity={0.4} />
      <path d="M-160 -122 Q-154 -118 -150 -124" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" opacity={0.6} />
    </g>
    {/* blanket with breathing */}
    <g transform={`translate(40 -90) scale(1 ${1 + breath * 0.05}) translate(-40 90)`}>
      <path
        d="M-150 -96 C-60 -170 120 -168 300 -120 L300 -50 L-150 -50 Z"
        fill={C.sageLight}
      />
      <path d="M-150 -96 C-60 -170 120 -168 300 -120" stroke={C.sage} strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* tiny stars on the blanket */}
      {[
        [-40, -100],
        [60, -110],
        [160, -98],
        [240, -82],
        [0, -70],
        [120, -70],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={6} fill={C.sand} opacity={0.8} />
      ))}
    </g>
    {/* plush bunny */}
    <g transform="translate(-60 -150)">
      <ellipse cx={0} cy={0} rx={30} ry={26} fill={C.sand} />
      <ellipse cx={-12} cy={-40} rx={8} ry={24} fill={C.sand} transform="rotate(-12 -12 -40)" />
      <ellipse cx={10} cy={-42} rx={8} ry={24} fill={C.sand} transform="rotate(10 10 -42)" />
      <circle cx={8} cy={-2} r={3.5} fill={C.ink} />
      <ellipse cx={-4} cy={8} rx={6} ry={4} fill={C.terra} opacity={0.45} />
    </g>
  </g>
);
