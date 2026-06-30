import { SurveyAnswer } from "@/types/survey";

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffffff;
  return Math.abs(h);
}

/**
 * Returns a stable, organic position for a single answer (hash-based).
 */
export function getLandscapeXY(
  answer: SurveyAnswer,
  W: number,
  H: number,
): { x: number; y: number } {
  const hx = (hash(answer.id + "lx") % 100000) / 100000;
  const hy = (hash(answer.id + "ly") % 100000) / 100000;

  const padX = 0.13;
  const padY = 0.17;

  return {
    x: (padX + hx * (1 - padX * 2)) * W,
    y: (padY + hy * (1 - padY * 2)) * H,
  };
}

/**
 * Returns layout positions for all answers with repulsion applied so that
 * shapes don't overlap. Starts from hash-based positions (stable, organic),
 * then iteratively pushes overlapping pairs apart.
 */
export function getLayoutPositions(
  answers: SurveyAnswer[],
  W: number,
  H: number,
): Record<string, { x: number; y: number }> {
  const MIN_DIST = 120; // minimum center-to-center distance (px in SVG units)
  const MAX_ITER = 250;
  const STRENGTH  = 0.45; // fraction of overlap corrected per iteration

  // Clamp bounds (slightly tighter than hash padding to keep annotations in view)
  const minX = 0.14 * W;
  const maxX = 0.86 * W;
  const minY = 0.20 * H;
  const maxY = 0.80 * H;

  // Initialise from hash positions
  const pts = answers.map((a) => ({ id: a.id, ...getLandscapeXY(a, W, H) }));

  for (let iter = 0; iter < MAX_ITER; iter++) {
    let moved = false;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[j].x - pts[i].x;
        const dy = pts[j].y - pts[i].y;
        const d  = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (d >= MIN_DIST) continue;

        const overlap = (MIN_DIST - d) * STRENGTH;
        const nx = (dx / d) * overlap;
        const ny = (dy / d) * overlap;

        pts[i].x -= nx;
        pts[i].y -= ny;
        pts[j].x += nx;
        pts[j].y += ny;
        moved = true;
      }
    }

    // Clamp every point to the valid region
    for (const p of pts) {
      p.x = Math.max(minX, Math.min(maxX, p.x));
      p.y = Math.max(minY, Math.min(maxY, p.y));
    }

    if (!moved) break;
  }

  return Object.fromEntries(pts.map((p) => [p.id, { x: p.x, y: p.y }]));
}
