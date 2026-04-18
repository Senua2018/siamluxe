// src/components/home/LotusSection.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import * as THREE from "three";

const PALETTE = [
  new THREE.Color("#C9A96E"),
  new THREE.Color("#E2C898"),
  new THREE.Color("#FDFAF5"),
  new THREE.Color("#D4B483"),
  new THREE.Color("#B8956A"),
];

export function LotusSection() {
  const t = useTranslations("lotusSection");
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

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

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const TOTAL = isMobile ? 1200 : 2800;

    const initW = canvas.clientWidth;
    const initH = canvas.clientHeight || canvas.clientWidth;
    if (initW === 0) return;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, initW / initH, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initW, initH, false);

    // ── Sprite texture (soft glowing dot) ──────────────────
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext("2d");
    if (!ctx) return;
    const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.4, "rgba(255,255,255,0.6)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(spriteCanvas);

    // ── Particles ──────────────────────────────────────────
    const origPos = new Float32Array(TOTAL * 3);
    const colors  = new Float32Array(TOTAL * 3);
    const speeds  = new Float32Array(TOTAL);
    const phases  = new Float32Array(TOTAL);

    for (let i = 0; i < TOTAL; i++) {
      const i3   = i * 3;
      const type = Math.random();
      let x, y, z;

      if (type < 0.55) {
        // Petal rings — 6-fold symmetry
        const angle = Math.random() * Math.PI * 2;
        const snap  = Math.round(angle / (Math.PI / 3)) * (Math.PI / 3);
        const a     = snap + (angle - snap) * 0.3;
        const ring  = Math.floor(Math.random() * 5) + 1;
        const r     = ring * 0.55 + Math.random() * 0.35;
        const elong = 1 + 0.7 * Math.abs(Math.sin(3 * a));
        x = Math.cos(a) * r * elong;
        y = Math.sin(a) * r * elong;
        z = (Math.random() - 0.5) * 0.8;
      } else if (type < 0.75) {
        // Centre cluster
        const r = Math.random() * 0.5;
        const a = Math.random() * Math.PI * 2;
        x = Math.cos(a) * r;
        y = Math.sin(a) * r;
        z = (Math.random() - 0.5) * 0.4;
      } else {
        // Ambient drift cloud
        x = (Math.random() - 0.5) * 9;
        y = (Math.random() - 0.5) * 9;
        z = (Math.random() - 0.5) * 4;
      }

      origPos[i3] = x; origPos[i3 + 1] = y; origPos[i3 + 2] = z;

      const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      colors[i3] = col.r; colors[i3 + 1] = col.g; colors[i3 + 2] = col.b;

      speeds[i] = Math.random() * 0.4 + 0.1;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const posBuffer = origPos.slice();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(posBuffer, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.05,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const lotusPoints = new THREE.Points(geo, mat);
    scene.add(lotusPoints);

    // ── Torus rings (desktop only) ──────────────────────────
    const rings: THREE.Mesh[] = [];
    if (!isMobile) {
      [
        { radius: 1.8, tube: 0.003, opacity: 0.25 },
        { radius: 2.8, tube: 0.002, opacity: 0.15 },
        { radius: 0.9, tube: 0.002, opacity: 0.20 },
      ].forEach(({ radius, tube, opacity }) => {
        const rGeo = new THREE.TorusGeometry(radius, tube, 8, 120);
        const rMat = new THREE.MeshBasicMaterial({ color: 0xc9a96e, transparent: true, opacity });
        rings.push(new THREE.Mesh(rGeo, rMat));
        scene.add(rings[rings.length - 1]);
      });
    }

    // ── Animation ──────────────────────────────────────────
    const posArr = geo.attributes.position.array as Float32Array;
    let clock = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      clock += 0.006;

      for (let i = 0; i < TOTAL; i++) {
        const i3 = i * 3;
        posArr[i3]     = origPos[i3]     + Math.cos(clock * speeds[i] * 0.7 + phases[i]) * 0.02;
        posArr[i3 + 1] = origPos[i3 + 1] + Math.sin(clock * speeds[i]       + phases[i]) * 0.04;
      }
      geo.attributes.position.needsUpdate = true;

      lotusPoints.rotation.z += 0.0008;

      if (rings.length === 3) {
        rings[0].rotation.z =  clock * 0.05;
        rings[1].rotation.z = -clock * 0.03;
        rings[2].rotation.z =  clock * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

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

    // ── Cleanup ─────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      tex.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden grain-animated"
      style={{ minHeight: "60vh", background: "#2E1B12" }}
    >
      <div className="relative z-10 w-full flex flex-col-reverse md:flex-row items-center px-8 md:px-16 lg:px-24 gap-12 md:gap-0 py-20 md:py-0">

        {/* Text block — left on desktop */}
        <div
          className="w-full md:w-[45%]"
          style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? "translateX(0)" : "translateX(-30px)",
            transition: "opacity 0.9s ease-out 0.2s, transform 0.9s ease-out 0.2s",
          }}
        >
          <p style={{
            fontFamily: "var(--font-josefin)",
            fontWeight: 100,
            fontSize: "10px",
            color: "#C9A96E",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            {t("eyebrow")}
          </p>

          <div style={{ width: "60px", height: "1px", background: "#C9A96E", marginBottom: "20px" }} />

          <h2 style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
            fontSize: "clamp(32px, 4vw, 52px)",
            color: "#FDFAF5",
            lineHeight: 1.05,
            marginBottom: "24px",
          }}>
            {t("title")}
          </h2>

          <p style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "18px",
            color: "rgba(253,250,245,0.60)",
            lineHeight: 1.7,
            maxWidth: "380px",
          }}>
            {t("body")}
          </p>
        </div>

        {/* Canvas — right on desktop */}
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
            style={{ width: "100%", maxWidth: "500px", aspectRatio: "1 / 1", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
