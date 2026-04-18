# Lotus 3D Components — Design Spec
*SiamLuxe · 2026-04-18*

---

## Overview

Two standalone React components using Three.js (npm) to render a golden 3D lotus particle effect. A shared `useLotusScene` hook avoids geometry duplication. Compatible with Next.js 16 / React 19 / Tailwind CSS 4.

---

## Palette & Typography

| Token | Value |
|-------|-------|
| Or | `#C9A96E` |
| Or clair | `#E2C898` |
| Blanc chaud | `#FDFAF5` |
| Brun foncé | `#2E1B12` |

Fonts: **Cormorant Garamond** (italic, body) + **Josefin Sans** (weight 100, eyebrow UI) — already loaded via `next/font/google` in root layout.

---

## Architecture

```
src/
  hooks/
    useLotusScene.ts          ← shared Three.js lotus hook
  components/
    home/
      LotusLoader.tsx         ← fullscreen loading screen
      LotusSection.tsx        ← 100vh transition section
```

### `useLotusScene(canvasRef, options)`

**Options:**
```ts
{
  scale?: number            // default 1.0
  particleCount?: number    // default 2800, auto-reduced to 1200 on mobile
  enableMouseParallax?: boolean  // default true
  showTorus?: boolean       // default true
}
```

**Returns:** `{ cleanup: () => void }`

**Internals:**
- Detects `isMobile` via `window.innerWidth < 768` at mount
- Particle count auto-capped at 1200 on mobile regardless of prop
- `devicePixelRatio` capped at 2
- `ResizeObserver` on canvas container for responsive renderer size
- Full cleanup on return: `renderer.dispose()`, cancel `requestAnimationFrame`, remove event listeners

---

## Component 1: LotusLoader.tsx

### Props
```ts
{
  videoLoaded: boolean
  onDismissed?: () => void
}
```

### Three.js Scene

**Particles (2800 desktop / 1200 mobile):**
- 6-petal lotus using polar Bézier curve: `r = a·cos(θ)·sin(θ)`
- Each petal offset ±0.3 on Z axis (random, seeded per particle) for depth
- `BufferGeometry` + `PointsMaterial`, color `#C9A96E`, size `0.025`
- Slow axial rotation: `0.001` rad/frame

**3 Torus rings (desktop only, hidden on mobile):**
| Ring | Radius | Tube | Speed |
|------|--------|------|-------|
| Inner | 1.2 | 0.008 | +0.003 rad/frame |
| Mid | 1.8 | 0.006 | −0.002 rad/frame |
| Outer | 2.4 | 0.005 | +0.0015 rad/frame |
- `MeshBasicMaterial` wireframe, color `#C9A96E` opacity 0.6

**Camera:** Perspective, FOV 60, Z=5. Mouse parallax: `mousemove` → lerp `camera.position.x/y` max ±0.4.

### DOM Overlay (above canvas)
- **"Siam Luxe"** — Cormorant Garamond italic, 36px, `#FDFAF5`, `transition: opacity 0.8s`, delayed 0.8s after mount
- **Progress bar** — fixed bottom, 1px height, `#C9A96E`, `width: 0% → 100%` over 2.5s `ease-out`
- **Grain overlay** — `::after` pseudo, SVG `feTurbulence` inline data-URI, `opacity: 0.15`, `mix-blend-mode: overlay`

### Lifecycle
1. Mount → Three.js init, progress bar animation starts
2. `videoLoaded` prop → `true`: wait until progress bar ≥ 80% elapsed (min 2s total)
3. Trigger fade-out: wrapper `opacity: 0` over 1.2s (`transition`)
4. After transition: call `onDismissed()` → parent unmounts component

### Integration (parent page)
```tsx
// [locale]/page.tsx
const [videoLoaded, setVideoLoaded] = useState(false)
const [loaderDismissed, setLoaderDismissed] = useState(false)

{!loaderDismissed && (
  <LotusLoader
    videoLoaded={videoLoaded}
    onDismissed={() => setLoaderDismissed(true)}
  />
)}
<HeroSection onVideoReady={() => setVideoLoaded(true)} />
```

**HeroSection change:** add `onVideoReady?: () => void` prop, call it from `<video onCanPlayThrough={onVideoReady}>`.

---

## Component 2: LotusSection.tsx

### Props
None (standalone).

### Three.js Scene
- Uses `useLotusScene` with `scale: 0.7`, `enableMouseParallax: false`, `showTorus: false`
- Three.js **init deferred** until section enters viewport (`IntersectionObserver threshold: 0.2`)
- Three.js **destroyed** when section leaves viewport (performance)
- Particles only, rotation `0.001` rad/frame

### Layout
```
desktop : flex-row  → [text 45%] [canvas 55%], items-center
mobile  : flex-col-reverse → [canvas] then [text]
```

Section: `height: 100vh`, `background: #2E1B12`.

### Text Block (left on desktop)
| Element | Style |
|---------|-------|
| Eyebrow "Notre Vision" | Josefin Sans 100, `#C9A96E`, 10px, `letter-spacing: 0.5em`, uppercase |
| Gold separator | `60px × 1px`, `#C9A96E`, `margin: 12px 0` |
| Title "L'art de la beauté thaïlandaise" | Cormorant Garamond, `#FDFAF5`, 52px desktop / 36px mobile, `line-height: 1.05` |
| Paragraph | Cormorant italic, `rgba(253,250,245,0.60)`, 18px |

### Entrance Animations (CSS transitions, triggered by IntersectionObserver)
| Element | From | To | Duration | Delay |
|---------|------|----|----------|-------|
| Text block | `translateX(-30px) opacity:0` | `translateX(0) opacity:1` | 0.9s ease-out | 0.2s |
| Canvas | `translateX(30px) opacity:0` | `translateX(0) opacity:1` | 0.9s ease-out | 0.4s |

Grain overlay: same as LotusLoader.

---

## Technical Constraints

- Install: `npm install three @types/three`
- Each component creates its own `WebGLRenderer` — no shared renderer, no canvas conflict
- `useLotusScene` cleanup runs in `useEffect` return: disposes geometry, material, renderer; cancels rAF
- `"use client"` directive on both components
- No GSAP dependency — animations via CSS transitions + `requestAnimationFrame`
- Torus rings hidden on mobile (`window.innerWidth < 768`) to maintain 60fps

---

## File Checklist

- [ ] `src/hooks/useLotusScene.ts`
- [ ] `src/components/home/LotusLoader.tsx`
- [ ] `src/components/home/LotusSection.tsx`
- [ ] `src/components/home/HeroSection.tsx` — add `onVideoReady` prop + `onCanPlayThrough`
- [ ] `src/app/[locale]/page.tsx` — add loader state + wire props
