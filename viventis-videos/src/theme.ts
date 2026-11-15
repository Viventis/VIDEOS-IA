import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

// Viventis palette (brand manual v1.2) — hex only.
export const C = {
  forest: "#344A32",
  teal: "#2F6F67",
  sand: "#F7F4EE",
  terra: "#E0784E",
  night: "#1B2A1A",
  sage: "#80A879",
  sageLight: "#95B88E",
  mint: "#EBF2EA",
  rust: "#B5522B",
  taupe: "#7B6A52",
  ink: "#1E232A",
  muted: "#5E6873",
  pale: "#CFE3CB",
  white: "#FFFFFF",
  // Illustration-only tones (people need skin and hair; reviewed as art, not brand colour)
  skin1: "#C98F67",
  skin2: "#B07650",
  skin3: "#8C5A3C",
  hair1: "#3B2A21",
  hair2: "#22180F",
  stem: "#B8A98F",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
