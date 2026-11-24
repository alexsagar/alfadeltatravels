"use client";

// Dithered mountain range at the foot of the site footer (Milestone 9.4),
// adapted from the supplied RidgelineDitherFooter reference: six ridges from
// ridged noise, printed in 8×8 ordered dither, recede into slowly drifting
// valley mist. When the footer enters the viewport the range develops back to
// front and the mist lifts; afterwards the pointer adds a gentle parallax and
// parts the mist around it. The reference's altitude readout is omitted: its
// numbers are invented, not real elevations.
//
// Performance (measured; see DESIGN.md → Footer):
// - nothing runs until the scene is near the viewport, and the loop stops
//   whenever it leaves it or the tab is hidden;
// - the idle drift is
//   redrawn at ~8 fps (it moves a fraction of a dither cell per frame), and
//   reveal and pointer motion are capped at ~30 fps; the drift rests (last
//   frame held) 20 s after the last pointer activity or scroll into view;
// - per-cell grain is precomputed once per resize, not hashed every frame;
// - the mist field is computed at quarter resolution;
// - one dither cell = 2 CSS px (3 below 640 px), independent of device pixel
//   ratio, so a phone draws the same small grid as a desktop;
// - prefers-reduced-motion: the range is drawn once, fully developed, with
//   still mist and no listeners or animation loop.
// Before the first draw the scene shows only the footer's paper colour, so
// there is no layout shift (its height comes from CSS).

import { useEffect, useRef } from "react";
import { BAYER, dither, easeOut, fbm, GLACIER_TONES, hash, hexRgb, noise, packRgb, ridgeline, smooth } from "./ridgeline";

const LAYERS = 6;
const SEED = 23;
const MIST = 0.8;
const RADIUS = 130;
const IDLE_MS = 125; // idle mist drift: ~8 fps
const ACTIVE_MS = 33; // reveal and pointer: ~30 fps
const REST_MS = 20000; // idle drift stops this long after the last activity (battery)

export function RidgelineScene({ className = "" }: { className?: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!scene || !canvas || !ctx) return;
    const root = (scene.closest("footer") as HTMLElement | null) ?? scene;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pal = new Uint32Array(GLACIER_TONES.map((t) => packRgb(hexRgb(t)!)));
    const nTones = pal.length;

    let p = 2, cols = 1, rows = 1, margin = 2, ceil = 0, fadeTo = 1;
    let img: ImageData | null = null;
    let buf = new Uint32Array(0);
    let tops: Float32Array[] = [];
    let pools: Float32Array[] = [];
    let colTop = new Float32Array(0), colSlope = new Float32Array(0), colPool = new Float32Array(0);
    let fog = new Float32Array(0), fw = 1, fh = 1;
    let grain = new Float32Array(0); // static per-cell texture, replaces a per-pixel hash every frame
    const k = new Float32Array(LAYERS), toneBase = new Float32Array(LAYERS), rev = new Float32Array(LAYERS);
    for (let i = 0; i < LAYERS; i++) {
      k[i] = i / (LAYERS - 1);
      toneBase[i] = 0.16 + 0.76 * Math.pow(k[i], 1.6);
    }

    let revealAt: number | null = reduced ? -Infinity : null;
    let raf = 0, visible = false, lastDraw = 0, lastTick = performance.now(), lastActive = performance.now();
    let tx = 0, ty = 0, ex = 0, ey = 0, inside = false, clear = 0, pt = 0, pe = 0;

    const layout = () => {
      const rect = scene.getBoundingClientRect();
      p = rect.width < 640 ? 3 : 2;
      cols = Math.max(8, Math.ceil(rect.width / p));
      rows = Math.max(8, Math.ceil(rect.height / p));
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = `${cols * p}px`;
      canvas.style.height = `${rows * p}px`;
      img = ctx.createImageData(cols, rows);
      buf = new Uint32Array(img.data.buffer);
      margin = Math.ceil(cols * 0.045) + 3;
      ceil = Math.max(rows * 0.17, 40 / p);
      fadeTo = Math.max(rows * 0.3, 96 / p);
      tops = [];
      pools = [];
      for (let i = 0; i < LAYERS; i++) {
        const t = ridgeline(cols, rows, i, LAYERS, SEED, margin);
        for (let x = 0; x < t.length; x++) if (t[x] < ceil) t[x] = ceil - (ceil - t[x]) * 0.2;
        const pool = new Float32Array(t.length);
        for (let x = 0; x < t.length; x++) pool[x] = 0.45 + 1.1 * fbm(((x - margin) / cols) * 4, i * 5.3, SEED + 9, 2);
        tops.push(t);
        pools.push(pool);
      }
      colTop = new Float32Array(LAYERS * cols);
      colSlope = new Float32Array(LAYERS * cols);
      colPool = new Float32Array(LAYERS * cols);
      fw = (cols >> 2) + 2;
      fh = (rows >> 2) + 2;
      fog = new Float32Array(fw * fh);
      grain = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) grain[y * cols + x] = hash(x, y, SEED) - 0.5;
    };

    const draw = (now: number) => {
      if (!img) return;
      const dt = Math.min(64, now - lastTick);
      lastTick = now;
      const age = revealAt === null ? -1 : now - revealAt;
      const ease = 1 - Math.pow(0.82, dt / 16.7);
      const slow = 1 - Math.pow(0.93, dt / 16.7);
      ex += (tx - ex) * ease;
      ey += (ty - ey) * ease;
      clear += ((inside ? 1 : 0) - clear) * slow;
      pe += (pt - pe) * slow;
      const fogT = reduced ? 0 : (now / 1000) * 0.045;

      // Mist: a wide, slow fractal field at quarter resolution.
      const sx = 18 / cols, sy = 8.8 / rows;
      for (let gy = 0; gy < fh; gy++) {
        const ny = gy * sy;
        for (let gx = 0; gx < fw; gx++) {
          const nx = gx * sx + fogT;
          const warp = noise(nx * 0.45 - fogT * 0.6, ny * 0.8, 77) * 0.6;
          fog[gy * fw + gx] = smooth(0.3, 0.74, fbm(nx + warp, ny + warp * 0.4, 31, 3));
        }
      }

      for (let i = 0; i < LAYERS; i++) {
        rev[i] = age < 0 ? 0 : easeOut((age - 380 - i * 170) / 1300);
        const fogDepth = rows * (0.08 + 0.42 * k[i]);
        const rise = (1 - rev[i]) * rows * 0.09;
        const shift = Math.round(pe * (0.25 + k[i]) * 0.75 * (margin - 3));
        const t = tops[i], last = t.length - 1;
        for (let x = 0; x < cols; x++) {
          const at = x + margin + shift;
          colTop[i * cols + x] = t[at] + rise;
          colSlope[i * cols + x] = t[Math.min(last, at + 2)] - t[Math.max(0, at - 2)];
          colPool[i * cols + x] = fogDepth * pools[i][at];
        }
      }
      const lift = age < 0 ? 1 : 1 - easeOut((age - 900) / 1800);
      const r = Math.max(1, RADIUS / p), r2 = r * r;

      for (let y = 0; y < rows; y++) {
        const fade = smooth(0, fadeTo, y);
        const frow = (y >> 2) * fw;
        const by = (y & 7) * 8;
        const dyc = (y - ey) * 1.5;
        for (let x = 0; x < cols; x++) {
          let L = -1;
          for (let i = LAYERS - 1; i >= 0; i--) {
            if (y >= colTop[i * cols + x]) {
              L = i;
              break;
            }
          }
          let tone = 0, mk = 0.3;
          if (L >= 0) {
            const kk = k[L];
            const top = colTop[L * cols + x];
            const d = y - top;
            const depth = colPool[L * cols + x];
            tone = toneBase[L] * (1 - smooth(0, depth, d) * (0.88 - 0.45 * kk));
            const sl = colSlope[L * cols + x] * 0.06;
            tone += (sl < -0.2 ? -0.2 : sl > 0.2 ? 0.2 : sl) * (1 - smooth(0, depth * 0.5, d));
            tone += grain[y * cols + x] * 0.07 * kk;
            tone *= rev[L];
            mk = 0.95 - 0.5 * kk;
          } else {
            tone = 0.05 * smooth(rows * 0.15, rows * 0.6, y);
          }
          let m = fog[frow + (x >> 2)] * MIST * mk;
          if (clear > 0.01) {
            const dx = x - ex;
            const q = (dx * dx + dyc * dyc) / r2;
            if (q < 4) {
              const c = clear * Math.exp(-q);
              m *= 1 - c * 0.92;
              if (L >= 0) tone += c * 0.16 * rev[L];
            }
          }
          if (tone > 0.93) tone = 0.93;
          m += lift * 0.55;
          if (m > 1) m = 1;
          tone = (tone * (1 - m) + 0.09 * m * (1 - lift)) * fade;
          buf[y * cols + x] = pal[dither(tone, nTones, BAYER[by + (x & 7)])];
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    // Full rate while revealing or easing toward the pointer; slow idle drift otherwise.
    const busy = (now: number) => (revealAt !== null && now - revealAt < 3400) || inside || Math.abs(pt - pe) > 0.002 || clear > 0.005;
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const active = busy(now);
      if (active) lastActive = now;
      // At rest: the last frame stays on screen until the pointer or a scroll back wakes it.
      if (!active && now - lastActive > REST_MS) return;
      if (now - lastDraw > (active ? ACTIVE_MS : IDLE_MS)) {
        draw(now);
        lastDraw = now;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!reduced && !raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const b = root.getBoundingClientRect();
      pt = b.width > 0 ? ((e.clientX - b.left) / b.width) * 2 - 1 : 0;
      const s = scene.getBoundingClientRect();
      const lx = (e.clientX - s.left) / p, ly = (e.clientY - s.top) / p;
      const was = inside;
      inside = lx >= 0 && ly >= 0 && lx < cols && ly < rows;
      lastActive = performance.now();
      tx = lx;
      ty = ly;
      if (inside && !was) {
        ex = tx;
        ey = ty;
      }
      wake();
    };
    const onLeave = () => {
      pt = 0;
      inside = false;
      wake();
    };

    layout();
    if (reduced) draw(performance.now());

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        if (visible && revealAt === null) revealAt = performance.now();
        if (visible) {
          lastTick = lastActive = performance.now();
          wake();
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(scene);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
      wake();
    });
    ro.observe(scene);
    const onVisibility = () => wake();
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduced) {
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={sceneRef} aria-hidden className={`relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute bottom-0 left-0 block max-w-none [image-rendering:pixelated]" />
    </div>
  );
}
