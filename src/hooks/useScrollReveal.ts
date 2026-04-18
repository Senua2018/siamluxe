"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  children?: boolean;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.8,
      delay = 0,
      stagger = 0.15,
      ease = "power3.out",
      start = "top 85%",
      children = false,
    } = options;

    const targets = children ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        x,
        opacity,
        duration,
        delay,
        stagger: children ? stagger : 0,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [options.y, options.x, options.duration, options.delay, options.stagger, options.ease, options.start, options.children]);

  return ref;
}
