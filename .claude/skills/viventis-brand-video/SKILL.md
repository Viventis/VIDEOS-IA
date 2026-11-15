---
name: viventis-brand-video
description: Viventis house rules for ANY video, Short, thumbnail, title card or end screen (YouTube, Reels, TikTok, ads). Use before writing a script, storyboard or composition for Viventis, a Texas medical discount membership. Holds the brand kit paths, palette, type, motion look, legal line, banned words, price rules and the pre-publish checklist. These rules override the generic video skills (business-motion-film, remotion-*) whenever they conflict.
---

# Viventis video rules

Viventis Health TX LLC sells a **medical discount membership (NOT insurance), Texas residents only**. The viewer is a working Texan mom, often Spanish-first, watching on her phone. Sources: Brand Manual v1.2, "Viventis Youtube" guidelines (Nov 2026), "Membresías y Precios" (prices as of 5 Nov 2026). If a source changes, update this file.

**Precedence:** this skill beats `business-motion-film` and `remotion-*`. Those give craft (motion, rendering, audio); this one decides what may be said and shown. If a generic skill suggests something below forbids (concept films with fictional brands, AI-generated people, stock faces, invented stats, "save X%"), do not do it.

## Brand kit location

`arte-viventis/Viventis_Graphic_Elements_2026-11/` (relative to the project root `VIDEOS IA`). Use these files; never redraw, recolour or retype them.

| Need | File / folder |
|---|---|
| Logo on sand/mint/white | `01_Logos/viventis-lockup_transparent_608x144.png` |
| Logo on forest/night/teal | `01_Logos/viventis-logo-chip_for-dark-grounds_704x216.png` (white chip) |
| Mark only | `01_Logos/viventis-mark_transparent_144px.png` |
| Sprouts, circles, clusters | `02_Graphic_Elements/sprouts`, `circles`, and vectors in `06_SVG/` |
| Service tiles (4, ES/EN) | `02_Graphic_Elements/service-tiles/` (never use the Solo Dental tile with them) |
| CTA chip, pills, number circles, quote mark, check bullets | `02_Graphic_Elements/...` |
| Icons | `03_Icons/{forest,teal,white}`, SVG in `06_SVG/icons` |
| Backgrounds | `04_Backgrounds/` (portrait 1080x1350, story 1080x1920, landscape 1200x627) |
| Palette | `05_Color/viventis-palette-card.png` |

Logo limits: largest file is 608x144 px. **Never enlarge past 608 px wide, never stretch, rotate, recolour, add effects, or retype the wordmark.** Minimum 120 px wide. Clear space = half the circle's height on every side. Light ground: place directly. Forest/night/teal ground: use the white chip. The tagline "DISCOUNT HEALTH PLANS" stays English and is **removed from sample cards/thumbnails** until Helga approves. For video, prefer vector SVG elements and keep the logo at or below native size (in a 1920x1080 frame it is small by design). Profile picture/banner are blocked until the logo is redrawn as vector.

## Look

- **Palette (hex only):** Forest `#344A32` (brand, headlines, dark panels), Teal `#2F6F67` (accent phrase), Sand `#F7F4EE` (default ground), Terra `#E0784E` (CTA only), Night `#1B2A1A`, Sage `#80A879`, Sage light `#95B88E`, Mint `#EBF2EA`, Rust `#B5522B`, Taupe `#7B6A52` (eyebrows), Ink `#1E232A` (body), Muted `#5E6873`, Pale green `#CFE3CB` (leaves on dark).
- **Mix:** ~55% sand/white/mint, 25% forest, 12% teal, 8% accents. Mostly light, a little bold. Sage, sage light and terra are for leaves, circles, tiles: **no text on them** (white on sage = 2.7:1, never). CTA label is **ink on terra, never white**. One terra CTA per piece.
- **Type:** Plus Jakarta Sans only (in Remotion: `@remotion/google-fonts/PlusJakartaSans`). Sentence case in both languages. Eyebrow 700 caps 0.14em taupe; headline 800, -3% tracking, forest with the **last phrase in teal and a teal full stop**; body 400 ink/muted; prices 800 forest. Spanish runs ~20% longer: size every layout for the Spanish line.
- **Graphics:** 2-3 elements per piece: sprout bottom right (never over text), overlapping circles bleeding off an edge (one small terra dot max), one outline pill above the headline, numbered steps (3-4 max, forest/teal/sage, rust for a third point), quote mark terra top left for beliefs.
- **Motion:** calm and warm, not SaaS-launch flash. Ease-out, gentle scale/slide, leaves growing from the stem, circles drifting in. No shake, glitch, red arrows, shocked faces, countdown urgency, or flashing. She has enough stress.
- **Video components (from the YouTube guide):**
  - Title card: sand ground, forest headline, teal accent, sprout bottom right, logo top left.
  - Lower third: name in a forest bar; Legal's line as a second lower third within the first 10 s.
  - Subtitles: white on a forest box, Plus Jakarta Sans Bold, max two lines, **always on** (burned into Shorts).
  - End screen: forest ground, logo in its chip, `viventis.health`, one next video, Legal's line for 5 s or more. **No phone number.**

## Formats

| Format | Spec |
|---|---|
| Long-form | 16:9, 1920x1080+, explainers 3-5 min, stories up to 6 |
| Short | 9:16, 1080x1920, 30-60 s (max 3 min). Keep text in the middle: buttons cover the right side and bottom |
| Thumbnail | 1280x720, JPG/PNG, <2 MB, 3-5 words, a real face, small logo top left, **no prices**, no "gratis", no red arrows |
| Chapters | first at 0:00, at least 3, each 10 s+, written as the questions she'd ask |

Every long video gets one or two vertical cuts, each ending on Legal's line.

## Language and voice

- **One language per video** (image, voice, subtitles). Spanish first; English versions are separate videos. Spanish is fully Spanish.
- **Tú** in Spanish, "you" in English. **Never usted**: the brand manual forbids it; the YouTube guide wants it only for elders in video 04 and that is still pending New Benefits. Default to tú.
- Warm, plain, a neighbour who knows how this works. Benefit first, short sentences. Lead with what the member gets and how it works.
- Say "Membresía de descuentos médicos" / "medical discount membership". Use "participating providers" / "proveedores participantes". Core line: **"Pregunta tu precio con descuento antes de tu cita."**
- Services, exactly four and in this order: **Médicos y hospitales, Laboratorio, Imágenes diagnósticas, Farmacia** (EN: physicians and hospitals, lab work, diagnostic imaging, pharmacy). The price sheet says "Medicamentos recetados"; use "Farmacia" on screen to match the manual. Dental is **Solo Dental**, a separate product ($145.99/year, up to 5 family members, bought apart): never a membership benefit, never beside the four service tiles, and not mentioned at all until Kenneth confirms refund terms and launch date (V1-361).

## Legal line (verbatim, never shorten or translate)

- **ES:** Esto NO es un seguro. Membresía de descuentos médicos, solo en Texas. Tú pagas el precio con descuento al proveedor. Operador: Viventis Health TX LLC. Cancela en 30 días y recibe el reembolso total.
- **EN:** This is NOT insurance. Discount medical membership, Texas only. You pay the discounted price to the provider. Operator: Viventis Health TX LLC. Cancel within 30 days for a full refund.

Appears **three times** in every YouTube video: lower third in the first 10 s, end screen for 5 s+, and last in the description. Shorts end on it. The short on-screen variant "Esto NO es un seguro. Membresía de descuentos médicos, solo en Texas." is only for the lower third, as in the guide.

## Prices (only in the prices video, totals only)

| | Per year | Every 6 months |
|---|---|---|
| Individual (1 person) | $499.99 | $249.99 |
| Pareja / Couple (2) | $599.99 | $299.99 |
| Familia / Family (up to 5) | $699.99 | $349.99 |
| Solo Dental | $145.99 | annual only |

Must match viventis.health to the cent (confirmed live Nov 11, 2026; prices final). Never per-month, per-day or per-person prices, crossed-out/"regular" prices, "free months", employer prices, "Más popular", or "% off". Prices live on screen only in video 03 / price content, never in thumbnails or other videos. If the site or sheet changes, update this file.

## Never

- Anything that sounds like emergencies are covered. If it comes up: **"En una emergencia, llama al 911."**
- Words: seguro (except in the legal line / "no es un seguro"), cobertura/coverage, plan (except the logo tagline), copago, deducible, prima, PPO, insurance, copay, deductible, premium, gratis/free, "sin sorpresas", "know the price before you go", "no surprise bills", guaranteed savings, telemedicine.
- Medical advice, diagnoses, or anyone's health details (members too). Savings figures we cannot prove.
- A clinic's name or directory. The phone number in voice-over or on the end screen (description only).
- Real member card or ID on screen: use "Tu nombre · VV-0000-0000".
- **Real people only**: team or members with a signed release in their own language. **No stock footage faces, no AI-generated people, no invented testimonials.** (This overrides the AI-footage approach in `business-motion-film`; use it for craft only: motion, type, audio mix.)

## Launch status (updated: Viventis is LIVE)

The user confirmed (Nov 11, 2026) that Viventis already launched, before the Dec 1 date written in the brand manual and YouTube guide, and that memberships can be bought now at viventis.health. Prices are final (table above). So the old pre-launch gate is **void**:

- Sign-up asks and "Únete hoy" / "Join today" (CTA chip `cta-chips/`) are allowed now. Do not say "llega el 1 de diciembre", "ya estamos abiertos" countdowns, or pre-launch teasers; the pills "Coming Dec 1" / "Llega 1 diciembre" are retired. "Now open" / "Ya estamos abiertos" is fine.
- Prices may be shown, but still only in price content, totals with their period, never in thumbnails.
- Still one CTA per piece, and the right UTM link on viventis.health.
- Still required, unchanged: written approval from New Benefits before anything publishes. Launch does not waive it.
- Texas residents only, verified at sign-up on the site.
- The Dec 4 / Dec 11 / Dec 18 / Jan 8 dates in `references/video-ideas.md` are a schedule from the guide; the user decides the real dates.
- **Nothing publishes without written approval from New Benefits** (owner: Kenneth). Every deliverable you produce is a draft for review, never "final". Open items: usted for elders (Helga), tagline on sample card (Helga), who counts as family (New Benefits, blocks A6), Solo Dental details (Kenneth, blocks D5), channel handle (Marketing).

## Workflow

1. Confirm series, language, format, length and CTA. Series: **Así funciona** (explain), **Mamá pregunta / Antes de tu cita** (help), **Texas que trabaja** (belong, after launch only). Ideas and hooks are in `references/video-ideas.md`.
2. Write the script in the video's single language: hook in the first 3 s, three beats, one CTA. Check it against "Never" before building.
3. Build with `remotion-*` (rendering) and `business-motion-film` (motion grammar, audio, critic loop), using only assets from the brand kit and the look above. Keep music soft, no stingers.
4. Run the checklist below, then deliver with the YouTube description (template in `references/video-ideas.md`).

## Source of truth (decided by the user, Nov 11, 2026)

viventis.health is current and is the source of truth for prices, offers, product names and CTA wording. If the site and the PDFs disagree on a fact, follow the site. Two things still hold: Legal's line stays verbatim, and the approval gate stays. Where site wording conflicts with the brand manual's banned words (e.g. "gratis" / "2 meses gratis"), put that exact claim on the script's review list for New Benefits before it appears in a video; do not silently drop it and do not silently ship it.

## Site conflicts (viventis.health, checked Nov 11, 2026 via an automated page summary, unverified by eye)

The prices on the site match the table ($499.99 / year, from $249.99 every 6 months, Solo Dental $145.99 / year). But the page apparently also says things the brand manual forbids. **Do not copy site wording into videos**, and report these to Kenneth/Helga:

- A "2 meses gratis" badge: the manual forbids "free months" and "gratis". The math is also off (two 6-month payments are $499.98, not $499.99).
- "Paquete todo incluido" and "programa de descuentos": the approved wording is "membresía de descuentos médicos".
- Its disclaimer ("Esto no es un seguro. Es un programa de descuentos.") is not Legal's verbatim line. Videos use Legal's line only.
- "Solicita una Demo" buttons, which do not fit a consumer membership.
- Per-tier prices were not visible in the summary; verify Individual/Pareja/Familia on the live page before filming the prices video.

## Pre-publish checklist (any empty box = does not go out)

- [ ] Approved in writing by New Benefits
- [ ] One language everywhere (image, voice, subtitles, description)
- [ ] Legal's line 3x (lower third <10 s, end screen 5 s+, description)
- [ ] No banned word or claim; four services only; Dental not listed as a benefit
- [ ] Prices only if it's the prices video, totals only, matching viventis.health
- [ ] Real people with signed releases; no real member card/ID; no clinic name
- [ ] Phone number only in the description, not on screen or in voice-over
- [ ] Logo on light ground or in white chip, >=120 px, not enlarged beyond 608 px
- [ ] Palette hex only, Plus Jakarta Sans, one terra CTA, subtitles on
- [ ] One CTA ("Únete hoy" allowed, Viventis is live); right UTM link; no pre-launch/Dec 1 wording
- [ ] Nothing on screen or in the script repeats a viventis.health claim that breaks these rules (see "Site conflicts" below)
