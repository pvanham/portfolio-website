"use client";

/** Interactive particle flow-field background for the homepage hero. */

import { useEffect, useRef } from "react";

const MAX_PARTICLES = 180;
const MIN_PARTICLES = 60;
const PARTICLES_PER_PIXEL = 1 / 9000;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hue: number;
};

function particleCount(width: number, height: number) {
  return Math.min(
    MAX_PARTICLES,
    Math.max(MIN_PARTICLES, Math.floor(width * height * PARTICLES_PER_PIXEL)),
  );
}

function spawn(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0,
    vy: 0,
    hue: 175 + Math.random() * 20,
  };
}

function flowAngle(x: number, y: number, time: number) {
  return (
    Math.sin(x * 0.0028 + time * 0.00025) *
    Math.cos(y * 0.0024 - time * 0.0002) *
    Math.PI *
    2
  );
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvasNode = canvasRef.current;
    const wrapperNode = wrapperRef.current;
    const drawingContext = canvasNode?.getContext("2d", { alpha: true });
    if (!canvasNode || !wrapperNode || !drawingContext) return;

    const canvas: HTMLCanvasElement = canvasNode;
    const wrapper: HTMLDivElement = wrapperNode;
    const ctx: CanvasRenderingContext2D = drawingContext;

    const pointer = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let last = performance.now();
    let visible = document.visibilityState === "visible";
    let inView = true;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = particleCount(width, height);
      if (particles.length === 0) {
        particles = Array.from({ length: count }, () => spawn(width, height));
      } else if (particles.length < count) {
        while (particles.length < count) particles.push(spawn(width, height));
      } else {
        particles.length = count;
      }
    }

    function drawParticles(time: number, dt: number, animate: boolean) {
      for (const particle of particles) {
        if (animate) {
          const angle = flowAngle(particle.x, particle.y, time);
          particle.vx += Math.cos(angle) * 0.12;
          particle.vy += Math.sin(angle) * 0.12;

          if (pointer.active) {
            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;
            const dist = Math.hypot(dx, dy) || 1;
            if (dist < 160) {
              const force = (1 - dist / 160) * 0.8;
              particle.vx += (dx / dist) * force;
              particle.vy += (dy / dist) * force;
            }
          }

          particle.vx *= 0.96;
          particle.vy *= 0.96;
          particle.x += particle.vx * dt * 60;
          particle.y += particle.vy * dt * 60;

          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = height + 10;
          if (particle.y > height + 10) particle.y = -10;
        }

        const speed = Math.hypot(particle.vx, particle.vy);
        const alpha = 0.18 + Math.min(speed * 0.25, 0.5);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 55%, ${alpha})`;
        ctx.arc(particle.x, particle.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function paintBackground() {
      ctx.fillStyle = "#0c1417";
      ctx.fillRect(0, 0, width, height);
    }

    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      if (visible && inView) {
        ctx.fillStyle = "rgba(12, 20, 23, 0.18)";
        ctx.fillRect(0, 0, width, height);
        drawParticles(now, dt, true);
      }
      raf = requestAnimationFrame(loop);
    }

    resize();
    paintBackground();
    drawParticles(0, 0, false);

    let idleId = 0;
    let timeoutId = 0;
    if (!prefersReduced) {
      const startLoop = () => {
        raf = requestAnimationFrame(loop);
      };
      const scheduleIdle = window.requestIdleCallback?.bind(window);
      if (scheduleIdle) {
        idleId = scheduleIdle(startLoop, { timeout: 1500 });
      } else {
        timeoutId = window.setTimeout(startLoop, 200);
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };

    const intersection = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    intersection.observe(wrapper);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full">
        Interactive particle flow-field background
      </canvas>
    </div>
  );
}
