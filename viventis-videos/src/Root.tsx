import React from "react";
import { Composition } from "remotion";
import { LoQueMasImporta, TOTAL } from "./LoQueMasImporta";
import { Film2, calcFilm2 } from "./v2/Film2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LoQueMasImporta-v2-ES-9x16"
        component={Film2}
        durationInFrames={1600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ music: "music/option-a.wav", timing: null }}
        calculateMetadata={calcFilm2}
      />
      <Composition
        id="LoQueMasImporta-v1-ES-9x16"
        component={LoQueMasImporta}
        durationInFrames={TOTAL}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ music: "" }}
      />
    </>
  );
};
