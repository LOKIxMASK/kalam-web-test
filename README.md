# KalamSpark by Acubotz — launch microsite

A cinematic, scroll-driven landing page for KalamSpark, India's first humanoid study companion.
Built with Next.js (App Router), React, Tailwind CSS v4, Framer Motion and Lenis.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build: `npm run build` then `npm start`.

## Editing content

| What | Where |
| --- | --- |
| Package names, prices, features, CTA links | `lib/content.ts` → `packages` |
| Subjects in the learning universe | `lib/content.ts` → `subjects` |
| Ask → Understand → Practice → Plan → Focus timeline | `lib/content.ts` → `experienceStages` |
| Nav and footer links, site URL | `lib/content.ts` |
| Colours and type scale | `app/globals.css` (`:root` tokens) |

Official pricing has not been published, so every price reads `[PRICE TO BE ADDED]`
and Package 03 lists placeholder features. Change them in `lib/content.ts` only.
All "Get KalamSpark" / "Explore Package" buttons currently link to `#`.

## Page structure

`app/page.tsx` composes the sections in order:

1. `Hero` — pinned scroll sequence (no buttons). The robot video in `public/sequence/` scrubs with scroll
   while five feature chapters reveal on alternating sides. Chapter copy and timing live at the top of
   `components/sections/Hero.tsx`; the canvas player is `components/FrameSequence.tsx`.
2. `Manifesto` — Learn. / Build. / Inspire. one word per viewport
3. `WhatIs` — robot ↔ phone with animated connection lines
4. `AlwaysReady` — pinned dashboard; six parts light up in sequence
5. `VoiceFirst` — the conversation reveals with scroll over a live waveform
6. `Homework` — notebook scan, steps unlocked along a golden line
7. `NightStudy` — dims the whole page; focus ring counts down to 18:00
8. `Universe` — seven subjects orbiting Kalam; hover or tap to inspect
9. `LightDark` — scroll-linked navy → cream transition with a vertical wipe
10. `Experience` — horizontal timeline driven by vertical scroll
11. `Pricing` — packages arrive one at a time in perspective depth
12. `FinalCTA` — golden sunrise, closing statement and main CTA

Shared pieces: `components/SpaceBackground.tsx` (canvas stars, nebulas, planets, grain),
`components/mockups/` (phone screens and the robot), `components/ui/Reveal.tsx` (motion vocabulary).

## Hero frame sequence

`public/sequence/f001.webp … f150.webp` are cut-outs of the frames in `public/images/`
(every 2nd frame, background removed with the u2net model, masks smoothed across neighbouring
frames and faded at the edges so the robot sits directly on the site background).
The page only loads `public/sequence/`. The original PNGs in `public/images/` (~175 MB) are not
used at runtime; move them out of `public/` before deploying to keep the upload small.

## Notes

- Scroll progress goes through `lib/useProgress.ts`. Framer Motion 13 otherwise hands
  simple opacity transforms to a native ViewTimeline that ignores custom offsets.
- `prefers-reduced-motion` disables Lenis, parallax, blur reveals and the star animation.
- The Kalam portrait (`public/kalam-face.png`) was cropped from the supplied KalamSpark deck.
  The standing robot figure is `public/kalam-robot.png`, supplied by Acubotz.
