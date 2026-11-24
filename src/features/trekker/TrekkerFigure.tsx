import type { CSSProperties } from "react";
import type { Gait } from "./path";
import { trekkerAsset, type TrekkerAsset } from "./asset";

/**
 * Renderer adapter. Contract (see ARCHITECTURE.md):
 *   - feet sit at the bottom-centre of the element (the anchor point)
 *   - reads `--cycle` (0..1 stride phase), `--facing` (1 | -1),
 *     `--light` (scene brightness), `--fade` (0..1) and `[data-gait]` on the parent
 * Both renderers are pure CSS: no per-frame React renders, no JS image swaps.
 */
export function TrekkerFigure() {
  return (
    <div className="trekker -translate-x-1/2 -translate-y-full">
      <ContactShadow />
      {trekkerAsset ? <SpriteSheetFigure asset={trekkerAsset} /> : <PlaceholderFigure />}
      <style>{`
        .trekker { position: relative; opacity: var(--fade, 1); filter: brightness(var(--light, 1)); }
        .trekker-flip { transform: scaleX(var(--facing, 1)); }
      `}</style>
    </div>
  );
}

/** Soft ambient-occlusion ellipse under the boots: dark core, feathered edge. */
function ContactShadow() {
  return (
    <span
      aria-hidden
      className="absolute bottom-[-5px] left-1/2 h-[10px] w-[64px] -translate-x-1/2"
      style={{ background: "radial-gradient(closest-side, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.25) 55%, transparent)" }}
    />
  );
}

/**
 * Frame-sequence renderer for the production asset. Frame index is computed in
 * CSS: round(down, cycle × frames) → background-position of that frame.
 * ponytail: CSS round() needs Chrome 125 / Safari 15.4 / Firefox 118; older
 * browsers show frame 0 (a static pose), which is an acceptable fallback.
 */
function SpriteSheetFigure({ asset }: { asset: TrekkerAsset }) {
  const first = Object.values(asset.gaits)[0];
  const width = Math.round((asset.displayHeight * first.frameWidth) / first.frameHeight);
  return (
    <div className="trekker-flip relative" style={{ width, height: asset.displayHeight }}>
      {(Object.entries(asset.gaits) as [Gait, TrekkerAsset["gaits"][Gait]][]).map(([gait, sheet]) => (
        <span
          key={gait}
          className="trekker-sheet absolute inset-0 bg-no-repeat"
          data-sheet={gait}
          data-loop={sheet.loopSeconds ? "" : undefined}
          style={
            {
              "--frames": sheet.frames,
              "--loop": `${sheet.loopSeconds ?? 0}s`,
              backgroundImage: `url(${sheet.src})`,
              backgroundSize: `${sheet.frames * 100}% 100%`,
            } as CSSProperties
          }
        />
      ))}
      <style>{`
        .trekker-sheet {
          display: none;
          background-position-x: calc(
            round(down, var(--cycle, 0) * var(--frames), 1) / (var(--frames) - 1) * 100%
          );
        }
        /* Idle loops breathe on a timer: a standing person still moves. */
        .trekker-sheet[data-loop] { animation: trekker-idle var(--loop) steps(var(--frames), jump-none) infinite; }
        @keyframes trekker-idle { from { background-position-x: 0%; } to { background-position-x: 100%; } }
        [data-gait="walk"] [data-sheet="walk"],
        [data-gait="climb"] [data-sheet="climb"],
        [data-gait="rest"] [data-sheet="rest"] { display: block; }
      `}</style>
    </div>
  );
}

/**
 * PLACEHOLDER — flat SVG silhouette, deliberately not realistic. Stands in
 * until a licensed character asset is supplied (`asset.ts`).
 */
function PlaceholderFigure() {
  return (
    <>
      <svg viewBox="0 0 60 120" width="60" height="120" className="trekker-flip block overflow-visible">
        <g className="trekker-body" fill="var(--color-ink-900)">
          <circle cx="30" cy="14" r="8" />
          <rect x="22" y="24" width="16" height="40" rx="6" />
          {/* backpack */}
          <rect x="12" y="26" width="12" height="28" rx="4" fill="var(--color-brand-500)" />
          <rect className="trekker-limb trekker-leg-a" x="25" y="60" width="7" height="58" rx="3.5" />
          <rect className="trekker-limb trekker-leg-b" x="28" y="60" width="7" height="58" rx="3.5" />
          {/* trekking pole */}
          <rect className="trekker-limb trekker-arm" x="38" y="28" width="3" height="88" rx="1.5" />
        </g>
      </svg>
      <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-sm bg-black/55 px-1.5 py-0.5 text-[9px] tracking-widest whitespace-nowrap text-white/85 uppercase">
        Placeholder
      </span>
      <style>{`
        .trekker-limb { transform-box: fill-box; transform-origin: 50% 0; }
        .trekker-leg-a { rotate: calc(sin(var(--cycle, 0) * 6.2832rad) * 24deg); }
        .trekker-leg-b { rotate: calc(sin(var(--cycle, 0) * 6.2832rad) * -24deg); }
        .trekker-arm   { rotate: calc(sin(var(--cycle, 0) * 6.2832rad) * -14deg - 8deg); }
        [data-gait="climb"] .trekker-body { rotate: 14deg; transform-origin: 50% 100%; transform-box: fill-box; }
        [data-gait="rest"] .trekker-limb { rotate: 0deg; }
      `}</style>
    </>
  );
}
