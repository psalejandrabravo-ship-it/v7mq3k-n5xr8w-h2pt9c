/**
 * Mapa 111247.jpg. Coordenadas normalizadas (0–1).
 * Ahora 5 misiones + cofre.
 */

export type Pt = { x: number; y: number };

export const MAP_VIEW = { w: 1168, h: 784 };
export const MAP_ASPECT = MAP_VIEW.w / MAP_VIEW.h;

export const stops: { order: number; at: Pt }[] = [
  { order: 1, at: { x: 0.332, y: 0.56 } },
  { order: 2, at: { x: 0.47, y: 0.49 } },
  { order: 3, at: { x: 0.544, y: 0.354 } },
  { order: 4, at: { x: 0.81, y: 0.27 } },
  { order: 5, at: { x: 0.876, y: 0.614 } },
];

/** Punto final del cofre, después de la misión 5. */
export const chestPoint: Pt = { x: 0.318, y: 0.82 };

/**
 * Descanso del pirata según misiones completadas (0 a 5).
 */
export const pirateRests: Pt[] = [
  { x: 0.399, y: 0.604 },
  { x: 0.426, y: 0.423 },
  { x: 0.604, y: 0.329 },
  { x: 0.852, y: 0.298 },
  { x: 0.895, y: 0.66 },
  { x: 0.276, y: 0.848 },
];

/** Un punto de curva entre cada par de descansos. */
export const legBends: Pt[] = [
  { x: 0.492, y: 0.525 },
  { x: 0.515, y: 0.376 },
  { x: 0.732, y: 0.343 },
  { x: 0.9, y: 0.48 },
  { x: 0.478, y: 0.794 },
];

export function legPoints(index: number): Pt[] {
  const a = pirateRests[index];
  const b = pirateRests[index + 1];
  const c = legBends[index];
  if (!a || !b || !c) return a ? [a] : [];
  return sampleQuad(a, c, b, 32);
}

export function fullTrail(): Pt[] {
  const all: Pt[] = [];
  for (let i = 0; i < legBends.length; i++) {
    const part = legPoints(i);
    if (all.length && part.length) part.shift();
    all.push(...part);
  }
  return all;
}

export function sampleQuad(a: Pt, control: Pt, b: Pt, n = 28): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push({
      x: u * u * a.x + 2 * u * t * control.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * control.y + t * t * b.y,
    });
  }
  return out;
}

function dist(a: Pt, b: Pt): number {
  const dx = (b.x - a.x) * MAP_ASPECT;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

export function pointOnPolyline(points: Pt[], t: number): Pt {
  if (points.length === 0) return { x: 0.5, y: 0.5 };
  if (points.length === 1 || t <= 0) return points[0];
  if (t >= 1) return points[points.length - 1];
  const lengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const d = dist(points[i - 1], points[i]);
    lengths.push(d);
    total += d;
  }
  if (total === 0) return points[0];
  let remain = t * total;
  for (let i = 0; i < lengths.length; i++) {
    const span = lengths[i];
    if (remain <= span || i === lengths.length - 1) {
      const u = span === 0 ? 0 : remain / span;
      const p = points[i];
      const q = points[i + 1];
      return { x: p.x + (q.x - p.x) * u, y: p.y + (q.y - p.y) * u };
    }
    remain -= span;
  }
  return points[points.length - 1];
}

export function trailPathD(points: Pt[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x * MAP_VIEW.w).toFixed(1)} ${(p.y * MAP_VIEW.h).toFixed(1)}`)
    .join(" ");
}
