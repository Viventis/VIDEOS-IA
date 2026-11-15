# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Voz con ElevenLabs (API key)

La narración se genera con `tools/tts.mjs`, que necesita **tu propia** API key de ElevenLabs:

1. Copia la plantilla: `cp .env.example .env`
2. Abre `.env` y reemplaza `pon_tu_api_key_aqui` por tu clave ([consíguela aquí](https://elevenlabs.io/app/settings/api-keys)).
3. Ejecuta `node tools/tts.mjs --list` para ver tus voces y `node tools/tts.mjs` para generar el audio.

`.env` está en `.gitignore`, así que tu clave nunca se sube al repositorio.

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
