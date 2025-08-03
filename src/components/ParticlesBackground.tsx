// src/components/ParticlesBackground.tsx
"use client"; // This directive is important for Client Components

import { useEffect, useRef } from "react";

// --- Import particlesJS for its side effects ---
import 'particles.js';

export default function ParticlesBackground() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- Access particlesJS via the window object ---
    // Type assertion is used because the library doesn't provide built-in TS types.
    const pJS = (window as unknown as { particlesJS?: (tagId: string, params: object) => void }).particlesJS;

    // The typeof window check isn't strictly necessary here anymore
    // because this code only runs on the client due to "use client"
    // and being inside useEffect. But it doesn't hurt.
    if (typeof window !== "undefined" && pJS && particlesRef.current) {
      pJS("particles-js", {
        particles: {
          number: {
            value: 160,
            density: { enable: true, value_area: 800 },
          },
          color: { value: "#1d588a" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
          },
          opacity: {
            value: 1,
            random: true,
            anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 4, size_min: 0.3, sync: false },
          },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 600 },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "bubble" },
            onclick: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: {
              distance: 250,
              size: 0,
              duration: 2,
              opacity: 0,
              speed: 3,
            },
            repulse: { distance: 400, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      });
    }

    // Optional: Clean up particles.js on unmount if needed
    // return () => {
    //   if (window.pJSDom && window.pJSDom.length) {
    //     window.pJSDom[0].pJS.fn.vendors.destroypJS();
    //     window.pJSDom = [];
    //   }
    // };
  }, []); // Run only once on mount

  return (
    <div
      id="particles-js"
      ref={particlesRef}
      style={{
        position: "absolute",
        left: 0,
        top: "8rem",
        width: "100vw",
        height: "32rem", // matches py-32
        zIndex: 0,
        pointerEvents: "auto",
      }}
    />
  );
}
