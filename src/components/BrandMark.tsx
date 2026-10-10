/**
 * The brand mark: three rising bars with an arrow on the tallest, resting in
 * a half circle that sits underneath them ("Cradle" from the logo canvas, round 10).
 *
 * Geometry on a 120 grid: the arc is an exact half circle, radius 44, centred
 * on the tile, 9 units thick. Bars are 12 wide with 4-unit gaps and the group
 * is centred on the same point. The tile corner radius is a percentage so it
 * stays correct at every size, and no SVG ids are used because the mark can
 * render more than once per page.
 */
export function BrandMark({ className = "", size = 30 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      // 28 of 120: the radius the mark was drawn with.
      style={{ borderRadius: "23.333%" }}
      className={`flex-none ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="120" height="120" fill="#124a3a" />
      <path d="M16 60 A44 44 0 0 0 104 60" fill="none" stroke="#3ad971" strokeWidth="10" strokeLinecap="round" />
      <rect x="35" y="62" width="12" height="24" rx="2" fill="#f2f0e8" />
      <rect x="51" y="48" width="12" height="38" rx="2" fill="#f2f0e8" />
      <rect x="67" y="36" width="12" height="50" rx="2" fill="#f2f0e8" />
      <path d="M61.5 38 L73 20 L84.5 38 Z" fill="#f2f0e8" />
    </svg>
  );
}
