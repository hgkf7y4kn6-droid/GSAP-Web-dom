# Riches Digital Ventures

Portfolio site for Riches Digital Ventures, built with [Astro](https://astro.build).
Pages are static HTML. JavaScript is added only where it earns its place.

## Commands

```sh
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the built site
npm run lint     # oxlint
```

## Structure

```
src/
  data/site.js          Projects, nav, about and contact copy (single source of truth)
  content/work/*.md     Case-study write-ups, one per project slug
  pages/index.astro     Home page
  pages/work/[slug]     Case-study pages, generated from site.js
  components/           Astro sections, plus the React 3D hero island
  scripts/              GSAP, ScrollTrigger and Lenis behaviour for the static HTML
  styles/global.css     Tailwind v4 theme tokens and component styles
```

### Adding a project

1. Add an entry with a unique `slug` to `projects` in `src/data/site.js`.
2. Optionally add `src/content/work/<slug>.md` for the long-form write-up. Without
   one, the case-study page falls back to the project summary.

## Performance choices

- **3D hero.** React Three Fiber and Drei render the circuit-core scene. A still of
  the scene (`public/images/hero-scene.webp`) shows first. three.js is only
  downloaded on devices with WebGL, at least 4 GB of memory and Data Saver off,
  and the scene stops rendering once it is scrolled out of view. Reduced-motion
  visitors get a still render.
- **Motion.** GSAP runs as small bundled scripts, with no React needed. Lenis smooth
  scrolling is limited to mouse and trackpad users who haven't asked for reduced motion.
- **Mobile.** Cards stack full width on phones, every tap target is at least 44px, and
  touch devices keep native scrolling.
- **Fonts.** Latin subsets only, with the display and body fonts preloaded.
