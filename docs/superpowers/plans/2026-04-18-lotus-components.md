# Lotus 3D Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `LotusLoader` (fullscreen loading screen) and `LotusSection` (100vh transition) with Three.js golden particle lotus, wired into the homepage via a `HeroWithLoader` client wrapper.

**Architecture:** Shared `useLotusScene` hook owns all Three.js logic. Each component creates its own `WebGLRenderer` (no canvas conflicts). `HeroWithLoader` is the single client component that bridges loader state with HeroSection's video-ready event. Page.tsx (server component) stays untouched except for the import swap.

**Tech Stack:** Three.js ^0.178, @types/three, React 19, Next.js 16, TypeScript strict, Tailwind CSS 4, next-intl 4

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/hooks/useLotusScene.ts` | All Three.js: scene, particles, torus, parallax, cleanup |
| Create | `src/components/home/LotusLoader.tsx` | Fullscreen loader UI + lifecycle |
| Create | `src/components/home/HeroWithLoader.tsx` | Client wrapper sharing videoLoaded state |
| Create | `src/components/home/LotusSection.tsx` | 100vh transition section |
| Modify | `src/components/home/HeroSection.tsx` | Add `onVideoReady` prop + `onCanPlayThrough` |
| Modify | `src/app/[locale]/page.tsx` | Swap `<HeroSection />` → `<HeroWithLoader />`, add `<LotusSection />` |
| Modify | `src/messages/fr.json` | Add `lotusSection` namespace |
| Modify | `src/messages/en.json` | Add `lotusSection` namespace |
| Modify | `src/messages/ru.json` | Add `lotusSection` namespace |
| Modify | `src/app/globals.css` | Add `.grain-animated` keyframe utility |

---

### Task 1: Install Three.js

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install dependencies**

```bash
cd "C:/Users/jkino/OneDrive/Bureau/Thai beauty/siamluxe"
npm install three @types/three
```

Expected: `added N packages` with no peer-dep errors.

- [ ] **Step 2: Verify**

```bash
node -e "const d=require('./package.json'); console.log('three:', d.dependencies.three, '@types/three:', d.devDependencies['@types/three'])"
```

Expected: both versions printed.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: install three.js and @types/three"
```

---

### Task 2: Add animated grain utility to globals.css

**Files:**
- Modify: `src/app/globals.css`

Both components share the same animated grain overlay. Add one keyframe + class here rather than duplicating SVG inline twice.

- [ ] **Step 1: Append to `src/app/globals.css`**

```css
/* Animated grain for dark sections (LotusLoader, LotusSection) */
@keyframes grain-shift {
  0%,
  100% { transform: translate(0, 0) scale(1.05); }
  20%   { transform: translate(-2%, 3%) scale(1.05); }
  40%   { transform: translate(3%, -1%) scale(1.05); }
  60%   { transform: translate(-1%, -3%) scale(1.05); }
  80%   { transform: translate(2%, 2%) scale(1.05); }
}

.grain-animated::after {
  content: "";
  position: absolute;
  inset: -5%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  opacity: 0.18;
  mix-blend-mode: overlay;
  pointer-events: none;
  animation: grain-shift 8s steps(4) infinite;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add grain-animated utility for lotus dark sections"
```

---

### Task 3: Create `useLotusScene` hook

**Files:**
- Create: `src/hooks/useLotusScene.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/hooks/useLotusScene.ts
"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

export interface UseLotusSceneOptions {
  scale?: number;
  particleCount?: number;
  enableMouseParallax?: boolean;
  showTorus?: boolean;
  active?: boolean;
}

export function useLotusScene(
  canvasRef: RefObject<HTMLCanvasElement>,
  options: UseLotusSceneOptions = {}
) {
  const {
    scale = 1.0,
    particleCount = 2800,
    enableMouseParallax = true,
    showTorus = true,
    active = true,
  } = options;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.min(particleCount, 1200) : particleCount;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / (canvas.clientHeight || canvas.clientWidth),
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // false = don't override CSS size with inline style
    renderer.setSize(canvas.clientWidth, canvas.clientHeight || canvas.clientWidth, false);

    // ── Lotus particles ─────────────────────────────────────
    // 6-petal shape: each petal is a filled teardrop rotated around the origin.
    // Local petal coords: x along petal length (0→tip), y is bilateral width (sin envelope).
    const positions = new Float32Array(count * 3);
    const petalCount = 6;
    const pointsPerPetal = Math.floor(count / petalCount);
    let idx = 0;

    for (let p = 0; p < petalCount; p++) {
      const petalAngle = (p * Math.PI * 2) / petalCount;
      const cosA = Math.cos(petalAngle);
      const sinA = Math.sin(petalAngle);

      for (let j = 0; j < pointsPerPetal; j++) {
        const t = j / pointsPerPetal; // 0 → 1 from base to tip
        const localX = t * 1.8 * scale;
        // sin envelope: 0 at base, peak at mid, 0 at tip — bilateral
        const localY =
          Math.sin(Math.PI * t) * 0.55 * scale * (Math.random() * 2 - 1);
        const localZ = (Math.random() - 0.5) * 0.4 * scale;

        positions[idx * 3]     = localX * cosA - localY * sinA;
        positions[idx * 3 + 1] = localX * sinA + localY * cosA;
        positions[idx * 3 + 2] = localZ;
        idx++;
      }
    }

    // Centre cluster fills any remainder
    while (idx < count) {
      positions[idx * 3]     = (Math.random() - 0.5) * 0.3 * scale;
      positions[idx * 3 + 1] = (Math.random() - 0.5) * 0.3 * scale;
      positions[idx * 3 + 2] = (Math.random() - 0.5) * 0.2 * scale;
      idx++;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color("#C9A96E"),
      size: 0.025 * scale,
      transparent: true,
      opacity: 0.9,
    });
    const lotusPoints = new THREE.Points(geo, mat);
    scene.add(lotusPoints);

    // ── Torus rings (desktop only) ──────────────────────────
    const torusGroup = new THREE.Group();
    const torusSpeeds: number[] = [];

    if (showTorus && !isMobile) {
      const configs = [
        { radius: 1.2 * scale, tube: 0.008, speed: 0.003 },
        { radius: 1.8 * scale, tube: 0.006, speed: -0.002 },
        { radius: 2.4 * scale, tube: 0.005, speed: 0.0015 },
      ];
      configs.forEach(({ radius, tube, speed }) => {
        const torusGeo = new THREE.TorusGeometry(radius, tube, 8, 64);
        const torusMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color("#C9A96E"),
          transparent: true,
          opacity: 0.55,
          wireframe: true,
        });
        torusGroup.add(new THREE.Mesh(torusGeo, torusMat));
        torusSpeeds.push(speed);
      });
      scene.add(torusGroup);
    }

    // ── Mouse parallax ──────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    if (enableMouseParallax) window.addEventListener("mousemove", handleMouse);

    // ── ResizeObserver ──────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || canvas.clientWidth;
      if (w === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    });
    ro.observe(canvas);

    // ── Animation loop ──────────────────────────────────────
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      lotusPoints.rotation.z += 0.001;
      torusGroup.children.forEach((child, i) => {
        child.rotation.x += torusSpeeds[i];
        child.rotation.y += torusSpeeds[i] * 0.7;
      });
      if (enableMouseParallax) {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (mouseY - camera.position.y) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (enableMouseParallax) window.removeEventListener("mousemove", handleMouse);
      geo.dispose();
      mat.dispose();
      torusGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [active, canvasRef, scale, particleCount, enableMouseParallax, showTorus]);
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no output (zero errors).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useLotusScene.ts
git commit -m "feat: add useLotusScene Three.js shared hook"
```

---

### Task 4: Create `LotusLoader.tsx`

**Files:**
- Create: `src/components/home/LotusLoader.tsx`

- [ ] **Step 1: Create the file**

```tsx
// src/components/home/LotusLoader.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useLotusScene } from "@/hooks/useLotusScene";

interface LotusLoaderProps {
  videoLoaded: boolean;
  onDismissed?: () => void;
}

export function LotusLoader({ videoLoaded, onDismissed }: LotusLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fading, setFading] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const mountedAt = useRef(Date.now());

  useLotusScene(canvasRef, {
    scale: 1.0,
    enableMouseParallax: true,
    showTorus: true,
  });

  // "Siam Luxe" text fades in at 0.8s
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Progress bar: trigger CSS transition on next paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => setProgressWidth(100));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Dismiss after video ready (minimum 2s visible)
  useEffect(() => {
    if (!videoLoaded) return;
    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, 2000 - elapsed);
    const t = setTimeout(() => {
      setFading(true);
      setTimeout(() => onDismissed?.(), 1200);
    }, wait);
    return () => clearTimeout(t);
  }, [videoLoaded, onDismissed]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden grain-animated"
      style={{
        background: "#2E1B12",
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 1.2s ease-out" : "none",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Three.js canvas — fills the container */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />

      {/* "Siam Luxe" label — centred below the lotus */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{ top: "62%" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "#FDFAF5",
            letterSpacing: "0.08em",
            opacity: textVisible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
            userSelect: "none",
          }}
        >
          Siam Luxe
        </p>
      </div>

      {/* Progress bar — 1px gold line at bottom */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden" style={{ height: "1px" }}>
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #C9A96E, #E2C898, #C9A96E, transparent)",
            width: `${progressWidth}%`,
            transition:
              progressWidth === 100 ? "width 2.5s ease-out" : "none",
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/LotusLoader.tsx
git commit -m "feat: add LotusLoader fullscreen Three.js component"
```

---

### Task 5: Add `onVideoReady` to HeroSection

**Files:**
- Modify: `src/components/home/HeroSection.tsx:26-38`

- [ ] **Step 1: Add the prop interface and wire it**

At the top of `src/components/home/HeroSection.tsx`, after the imports, add:

```tsx
interface HeroSectionProps {
  onVideoReady?: () => void;
}
```

Change the function signature:

```tsx
export function HeroSection({ onVideoReady }: HeroSectionProps) {
```

Find the `<video>` element and add the event handler:

```tsx
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        onCanPlayThrough={onVideoReady}
        poster="/assets/images/hero-fallback.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HeroSection.tsx
git commit -m "feat: add onVideoReady prop to HeroSection"
```

---

### Task 6: Create `HeroWithLoader` client wrapper

**Files:**
- Create: `src/components/home/HeroWithLoader.tsx`

`page.tsx` is a server component — it cannot hold `useState`. This thin client wrapper owns the two shared state variables and renders both `LotusLoader` and `HeroSection`.

- [ ] **Step 1: Create the file**

```tsx
// src/components/home/HeroWithLoader.tsx
"use client";

import { useState } from "react";
import { LotusLoader } from "@/components/home/LotusLoader";
import { HeroSection } from "@/components/home/HeroSection";

export function HeroWithLoader() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loaderDismissed, setLoaderDismissed] = useState(false);

  return (
    <>
      {!loaderDismissed && (
        <LotusLoader
          videoLoaded={videoLoaded}
          onDismissed={() => setLoaderDismissed(true)}
        />
      )}
      <HeroSection onVideoReady={() => setVideoLoaded(true)} />
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HeroWithLoader.tsx
git commit -m "feat: add HeroWithLoader client state wrapper"
```

---

### Task 7: Wire HeroWithLoader into page.tsx

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Swap the import**

In `src/app/[locale]/page.tsx`, replace:

```tsx
import { HeroSection } from "@/components/home/HeroSection";
```

with:

```tsx
import { HeroWithLoader } from "@/components/home/HeroWithLoader";
```

- [ ] **Step 2: Swap the JSX**

Replace `<HeroSection />` with `<HeroWithLoader />`:

```tsx
  return (
    <>
      <HeroWithLoader />
      <TrustBanner />
      <FeaturedSalons salons={featured} />
      <WhyUs />
      <ImmersiveQuote />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <FinalCTA />
    </>
  );
```

- [ ] **Step 3: Verify TypeScript and smoke-test**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Open `http://localhost:3000` — the lotus loader should appear, hold for ≥ 2s, then fade to the hero video. Check the browser console for errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: integrate HeroWithLoader into homepage"
```

---

### Task 8: Create `LotusSection.tsx`

**Files:**
- Create: `src/components/home/LotusSection.tsx`
- Modify: `src/messages/fr.json`, `src/messages/en.json`, `src/messages/ru.json`

- [ ] **Step 1: Add translations**

In `src/messages/fr.json`, add inside the root JSON object:

```json
"lotusSection": {
  "eyebrow": "Notre Vision",
  "title": "L'art de la beauté thaïlandaise",
  "body": "Chaque salon Siam Luxe est une invitation à l'excellence. Un investissement dans un art de vivre."
}
```

In `src/messages/en.json`:

```json
"lotusSection": {
  "eyebrow": "Our Vision",
  "title": "The art of Thai beauty",
  "body": "Every Siam Luxe salon is an invitation to excellence. An investment in a way of life."
}
```

In `src/messages/ru.json`:

```json
"lotusSection": {
  "eyebrow": "Наша Философия",
  "title": "Искусство тайской красоты",
  "body": "Каждый салон Siam Luxe — это приглашение к совершенству. Инвестиция в искусство жизни."
}
```

- [ ] **Step 2: Create the component**

```tsx
// src/components/home/LotusSection.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLotusScene } from "@/hooks/useLotusScene";

export function LotusSection() {
  const t = useTranslations("lotusSection");
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Init Three.js only when section is in viewport; destroy when it leaves
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setHasEntered(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useLotusScene(canvasRef, {
    scale: 0.7,
    enableMouseParallax: false,
    showTorus: false,
    active: isVisible,
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden grain-animated"
      style={{ minHeight: "100vh", background: "#2E1B12" }}
    >
      {/* Layout: col-reverse on mobile → row on desktop */}
      <div className="relative z-10 w-full flex flex-col-reverse md:flex-row items-center px-8 md:px-16 lg:px-24 gap-12 md:gap-0 py-20 md:py-0">

        {/* ── Text block (left on desktop) ── */}
        <div
          className="w-full md:w-[45%]"
          style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? "translateX(0)" : "translateX(-30px)",
            transition: "opacity 0.9s ease-out 0.2s, transform 0.9s ease-out 0.2s",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-josefin)",
              fontWeight: 100,
              fontSize: "10px",
              color: "#C9A96E",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {t("eyebrow")}
          </p>

          {/* Gold separator */}
          <div
            style={{
              width: "60px",
              height: "1px",
              background: "#C9A96E",
              marginBottom: "20px",
            }}
          />

          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(32px, 4vw, 52px)",
              color: "#FDFAF5",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}
          >
            {t("title")}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "18px",
              color: "rgba(253,250,245,0.60)",
              lineHeight: 1.7,
              maxWidth: "380px",
            }}
          >
            {t("body")}
          </p>
        </div>

        {/* ── Canvas (right on desktop) ── */}
        <div
          className="w-full md:w-[55%] flex justify-center"
          style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? "translateX(0)" : "translateX(30px)",
            transition: "opacity 0.9s ease-out 0.4s, transform 0.9s ease-out 0.4s",
          }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              width: "100%",
              maxWidth: "500px",
              aspectRatio: "1 / 1",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/LotusSection.tsx src/messages/fr.json src/messages/en.json src/messages/ru.json
git commit -m "feat: add LotusSection 100vh Three.js transition component"
```

---

### Task 9: Add LotusSection to homepage + final push

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Add import**

In `src/app/[locale]/page.tsx`, add:

```tsx
import { LotusSection } from "@/components/home/LotusSection";
```

- [ ] **Step 2: Add to JSX (after HeroWithLoader)**

```tsx
  return (
    <>
      <HeroWithLoader />
      <LotusSection />
      <TrustBanner />
      <FeaturedSalons salons={featured} />
      <WhyUs />
      <ImmersiveQuote />
      <HowItWorks />
      <Gallery />
      <Testimonials />
      <FinalCTA />
    </>
  );
```

- [ ] **Step 3: Final visual check**

Desktop (`http://localhost:3000`):
- Lotus loader: appears, holds ≥ 2s, golden progress bar fills, fades out smoothly
- Hero video visible after loader
- Scrolling down: LotusSection reveals with left-text / right-lotus layout
- Text and canvas slide in from their respective sides
- Torus rings visible on the loader, absent in LotusSection
- Mouse parallax works on loader, not on LotusSection

Mobile (`http://192.168.1.111:3000`):
- Loader: 1200 particles, no torus rings, still has progress bar + "Siam Luxe"
- LotusSection: canvas stacked above text (flex-col-reverse)
- No console errors

- [ ] **Step 4: Final commit and push**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: add LotusSection to homepage — lotus system complete"
git push
```
