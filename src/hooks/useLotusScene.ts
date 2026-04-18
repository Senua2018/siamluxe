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
  canvasRef: RefObject<HTMLCanvasElement | null>,
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

    const initW = canvas.clientWidth;
    const initH = canvas.clientHeight || canvas.clientWidth;
    if (initW === 0) return;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      initW / initH,
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
    renderer.setSize(initW, initH, false);

    // ── Lotus particles ─────────────────────────────────────
    const positions = new Float32Array(count * 3);
    const petalCount = 6;
    const pointsPerPetal = Math.floor(count / petalCount);
    let idx = 0;

    for (let p = 0; p < petalCount; p++) {
      const petalAngle = (p * Math.PI * 2) / petalCount;
      const cosA = Math.cos(petalAngle);
      const sinA = Math.sin(petalAngle);

      for (let j = 0; j < pointsPerPetal; j++) {
        const t = j / pointsPerPetal;
        const localX = t * 1.8 * scale;
        const localY =
          Math.sin(Math.PI * t) * 0.55 * scale * (Math.random() * 2 - 1);
        const localZ = (Math.random() - 0.5) * 0.4 * scale;

        positions[idx * 3]     = localX * cosA - localY * sinA;
        positions[idx * 3 + 1] = localX * sinA + localY * cosA;
        positions[idx * 3 + 2] = localZ;
        idx++;
      }
    }

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
    let rafId = 0;
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
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
    };
  }, [active, canvasRef, scale, particleCount, enableMouseParallax, showTorus]);
}
