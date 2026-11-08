/** Three four-pointed sparkles: [centre x, centre y, half-width, half-height]. */
const STARS = [
  [186, 110, 89, 90],
  [68, 160, 44, 45],
  [127, 239, 59, 59],
];

/** One sparkle: four sharp points joined by curves that bow in toward the centre. */
function sparklePath([cx, cy, rx, ry]: number[]) {
  const pt = (x: number, y: number) => `${cx + x * rx} ${cy + y * ry}`;
  return [
    `M${pt(0, -1)}`,
    `C${pt(0.05, -0.4)} ${pt(0.4, -0.05)} ${pt(1, 0)}`,
    `C${pt(0.4, 0.05)} ${pt(0.05, 0.4)} ${pt(0, 1)}`,
    `C${pt(-0.05, 0.4)} ${pt(-0.4, 0.05)} ${pt(-1, 0)}`,
    `C${pt(-0.4, -0.05)} ${pt(-0.05, -0.4)} ${pt(0, -1)}Z`,
  ].join(" ");
}

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="20 15 260 290" aria-hidden="true" focusable="false">
      {STARS.map((star, i) => (
        <path key={i} d={sparklePath(star)} fill="currentColor" />
      ))}
    </svg>
  );
}
