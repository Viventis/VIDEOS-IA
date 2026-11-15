import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  SceneAsk,
  SceneBedroom,
  SceneBrand,
  SceneCTA,
  SceneDrawing,
  SceneEnd,
  SceneFamily,
  SceneKitchen,
  ScenePhone,
  SceneServices,
} from "./scenes";
import { LegalLowerThird, Subtitle } from "./ui";

const X = 15; // crossfade length
const scenes: { C: React.FC; d: number; fadeIn: boolean }[] = [
  { C: SceneKitchen, d: 150, fadeIn: false },
  { C: SceneDrawing, d: 165, fadeIn: true },
  { C: ScenePhone, d: 195, fadeIn: true },
  { C: SceneBedroom, d: 170, fadeIn: true },
  { C: SceneBrand, d: 180, fadeIn: false }, // hard cut: the door light already filled the frame
  { C: SceneAsk, d: 210, fadeIn: true },
  { C: SceneServices, d: 180, fadeIn: true },
  { C: SceneFamily, d: 165, fadeIn: true },
  { C: SceneCTA, d: 120, fadeIn: true },
  { C: SceneEnd, d: 180, fadeIn: true },
];

export const TOTAL = scenes.reduce((a, s) => a + s.d - (s.fadeIn ? X : 0), 0);

export const LoQueMasImporta: React.FC<{ music?: string }> = ({ music }) => {
  return (
    <AbsoluteFill style={{ background: "#1B2A1A" }}>
      <TransitionSeries>
        {scenes.flatMap((s, i) => [
          ...(s.fadeIn
            ? [
                <TransitionSeries.Transition
                  key={`t${i}`}
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: X })}
                />,
              ]
            : []),
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>
            <s.C />
          </TransitionSeries.Sequence>,
        ])}
      </TransitionSeries>

      {/* Always-on subtitles for the story half (no voice-over: these carry the words) */}
      <Subtitle text="Antes de que salga el sol, ya estás pensando en todos." start={12} end={140} top={1170} />
      <Subtitle text="Haces todo por ellos. Todos los días." start={150} end={282} top={1170} />
      <Subtitle text="Y cuando toca una cita, a veces la dejas para después." start={300} end={458} top={1170} />
      <Subtitle text="Porque para ti, primero están ellos." start={478} end={606} top={1170} />

      {/* Legal's short line, first 10 seconds */}
      <LegalLowerThird start={45} end={290} top={1420} />

      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) =>
            interpolate(f, [0, 20, TOTAL - 90, TOTAL - 5], [0, 0.55, 0.55, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
