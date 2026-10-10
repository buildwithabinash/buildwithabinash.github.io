/**
 * The light-ray background: a thin bright core with progressively wider,
 * blurrier copies stacked behind it for the bloom, plus two dimmer rays
 * fanning off at other angles. All CSS, no images.
 *
 * These are deliberately faint. The rays are there to light the portrait
 * and give the section depth, not to be looked at.
 */
const rays: { top: string; height: number; blur: number; opacity: number; rotate: number; tint: string }[] = [
  { top: "52%", height: 320, blur: 130, opacity: 0.13, rotate: -8, tint: "rgba(26, 107, 84, 0.9)" },
  { top: "52%", height: 130, blur: 75, opacity: 0.14, rotate: -8, tint: "rgba(58, 217, 113, 0.5)" },
  { top: "52%", height: 34, blur: 26, opacity: 0.2, rotate: -8, tint: "rgba(58, 217, 113, 0.75)" },
  { top: "52%", height: 3, blur: 4, opacity: 0.4, rotate: -8, tint: "rgba(214, 255, 231, 0.9)" },
  { top: "32%", height: 96, blur: 66, opacity: 0.07, rotate: -23, tint: "rgba(58, 217, 113, 0.7)" },
  { top: "74%", height: 76, blur: 58, opacity: 0.06, rotate: 6, tint: "rgba(58, 217, 113, 0.6)" },
];

export function Beams() {
  return (
    <div className="beams pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {rays.map((r, i) => (
        <div
          key={i}
          className={i < 4 ? "beam beam--drift" : "beam"}
          style={{
            top: r.top,
            height: r.height,
            marginTop: -r.height / 2,
            filter: `blur(${r.blur}px)`,
            opacity: r.opacity,
            transform: `rotate(${r.rotate}deg)`,
            background: `linear-gradient(90deg, transparent 2%, ${r.tint} 38%, ${r.tint} 64%, transparent 88%)`,
            animationDelay: `${i * -2.6}s`,
          }}
        />
      ))}
      {/* The bloom where the rays converge, behind the portrait, and a
          dark settle along the bottom edge. */}
      <div className="beam-bloom" />
    </div>
  );
}
