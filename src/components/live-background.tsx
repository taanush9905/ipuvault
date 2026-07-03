import { useEffect, useRef } from "react";

/**
 * LiveBackground — fully live, real-time animated homepage background.
 *
 * - Full-screen aurora/mesh gradient whose colors continuously morph.
 * - Independent blurred gradient blobs with smooth organic motion
 *   (prime-number durations so the pattern never repeats obviously).
 * - Subtle cursor parallax on the blob field.
 * - Premium flashlight that follows the cursor with rAF lerp smoothing.
 * - Glass blur layer for depth.
 * - Theme-aware: uses the site's primary / secondary / accent CSS variables.
 * - GPU-accelerated (transform / filter / opacity only), 60 FPS friendly.
 * - Respects prefers-reduced-motion.
 * - fixed, -z-10, pointer-events-none: always behind content, never blocks
 *   scrolling or clicking.
 */

const css = `
.lb-root {
  --lx: 50vw;
  --ly: 40vh;
  --par-x: 0;
  --par-y: 0;
}

/* \u2500\u2500 Aurora / mesh base: colors morph + drift forever \u2500\u2500 */
.lb-aurora {
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(40% 55% at 20% 25%, hsl(var(--primary) / 0.16), transparent 60%),
    radial-gradient(45% 60% at 80% 18%, hsl(var(--primary-glow) / 0.12), transparent 60%),
    radial-gradient(50% 65% at 62% 85%, hsl(var(--accent-foreground) / 0.10), transparent 65%),
    radial-gradient(38% 52% at 28% 78%, hsl(var(--secondary) / 0.55), transparent 60%);
  animation: lb-hue 37s linear infinite, lb-pan 53s ease-in-out infinite alternate;
  will-change: transform, filter;
}
@keyframes lb-hue {
  0%   { filter: hue-rotate(0deg) saturate(1); }
  50%  { filter: hue-rotate(22deg) saturate(1.15); }
  100% { filter: hue-rotate(0deg) saturate(1); }
}
@keyframes lb-pan {
  0%   { transform: translate3d(-2%, -1%, 0) scale(1); }
  50%  { transform: translate3d(2%, 2%, 0) scale(1.06); }
  100% { transform: translate3d(-1%, 3%, 0) scale(1.02); }
}

/* \u2500\u2500 Parallax field (driven by --par-x / --par-y from JS) \u2500\u2500 */
.lb-parallax {
  position: absolute;
  inset: 0;
  transform: translate3d(calc(var(--par-x) * 22px), calc(var(--par-y) * 16px), 0);
  will-change: transform;
}

/* \u2500\u2500 Independent organic blobs \u2500\u2500 */
.lb-blob {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: 0.5;
  will-change: transform;
}
.lb-blob-1 {
  width: clamp(280px, 42vw, 620px);
  height: clamp(280px, 42vw, 620px);
  top: -8%;
  left: 6%;
  background: radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.35), transparent 70%);
  animation: lb-drift-1 41s ease-in-out infinite;
}
.lb-blob-2 {
  width: clamp(240px, 36vw, 540px);
  height: clamp(240px, 36vw, 540px);
  top: 20%;
  right: -6%;
  background: radial-gradient(circle at 65% 40%, hsl(var(--primary-glow) / 0.28), transparent 70%);
  animation: lb-drift-2 29s ease-in-out infinite;
}
.lb-blob-3 {
  width: clamp(220px, 32vw, 480px);
  height: clamp(220px, 32vw, 480px);
  bottom: -10%;
  left: 24%;
  background: radial-gradient(circle at 45% 60%, hsl(var(--accent-foreground) / 0.22), transparent 70%);
  animation: lb-drift-3 47s ease-in-out infinite;
}
.lb-blob-4 {
  width: clamp(200px, 28vw, 420px);
  height: clamp(200px, 28vw, 420px);
  top: 45%;
  left: 42%;
  background: radial-gradient(circle at 50% 50%, hsl(var(--secondary) / 0.8), transparent 70%);
  animation: lb-drift-4 59s ease-in-out infinite;
}
@keyframes lb-drift-1 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  25%      { transform: translate3d(9vw, 7vh, 0) scale(1.12); }
  50%      { transform: translate3d(-4vw, 13vh, 0) scale(0.94); }
  75%      { transform: translate3d(6vw, -5vh, 0) scale(1.05); }
}
@keyframes lb-drift-2 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  33%      { transform: translate3d(-8vw, 9vh, 0) scale(1.08); }
  66%      { transform: translate3d(4vw, -7vh, 0) scale(0.92); }
}
@keyframes lb-drift-3 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  20%      { transform: translate3d(7vw, -8vh, 0) scale(1.1); }
  55%      { transform: translate3d(-9vw, -3vh, 0) scale(0.96); }
  80%      { transform: translate3d(3vw, 6vh, 0) scale(1.04); }
}
@keyframes lb-drift-4 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  40%      { transform: translate3d(-6vw, -9vh, 0) scale(1.14); }
  70%      { transform: translate3d(8vw, 5vh, 0) scale(0.9); }
}

/* \u2500\u2500 Flashlight: softly illuminates the background, follows cursor \u2500\u2500 */
.lb-flashlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    560px circle at var(--lx) var(--ly),
    hsl(var(--primary) / 0.12),
    hsl(var(--primary) / 0.04) 40%,
    transparent 70%
  );
  mix-blend-mode: screen;
}

/* \u2500\u2500 Glass blur depth layer \u2500\u2500 */
.lb-glass {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(34px) saturate(1.15);
  -webkit-backdrop-filter: blur(34px) saturate(1.15);
  background: hsl(var(--background) / 0.14);
}

/* \u2500\u2500 Accessibility: freeze everything for reduced motion \u2500\u2500 */
@media (prefers-reduced-motion: reduce) {
  .lb-aurora,
  .lb-blob {
    animation: none !important;
  }
  .lb-flashlight {
    display: none;
  }
}
`;

export function LiveBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let x = targetX;
    let y = targetY;

    // Smoothly interpolate the flashlight + parallax toward the cursor (60 FPS)
    const tick = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      root.style.setProperty("--lx", `${x.toFixed(1)}px`);
      root.style.setProperty("--ly", `${y.toFixed(1)}px`);
      root.style.setProperty("--par-x", ((x / window.innerWidth - 0.5) * 2).toFixed(4));
      root.style.setProperty("--par-y", ((y / window.innerHeight - 0.5) * 2).toFixed(4));
      if (Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="lb-root fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <style>{css}</style>

      {/* Morphing aurora / mesh gradient base */}
      <div className="lb-aurora" />

      {/* Parallax blob field \u2014 blobs move independently inside */}
      <div className="lb-parallax">
        <div className="lb-blob lb-blob-1" />
        <div className="lb-blob lb-blob-2" />
        <div className="lb-blob lb-blob-3" />
        <div className="lb-blob lb-blob-4" />
      </div>

      {/* Cursor flashlight */}
      <div className="lb-flashlight" />

      {/* Glass depth layer */}
      <div className="lb-glass" />
    </div>
  );
}
