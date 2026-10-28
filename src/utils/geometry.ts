export interface Point {
  x: number;
  y: number;
}

export interface PolygonSpec {
  sides: number;
  name: string;
  radius?: number;
  center?: Point;
  rotation?: number; // in degrees
  isRegular?: boolean;
}

/**
 * Calculates vertex points for a polygon.
 * Regular polygons have equal side lengths and equal angles.
 * Irregular polygons have unequal side lengths or altered vertices.
 */
export function getPolygonPoints(
  sides: number,
  radius: number = 80,
  center: Point = { x: 100, y: 100 },
  rotationDegrees: number = 0,
  isRegular: boolean = true
): Point[] {
  const points: Point[] = [];
  const rotationRad = (rotationDegrees * Math.PI) / 180;

  // Angle offset to make top side horizontal or top vertex pointed up nicely
  // For pentagon, vertex up; for hexagon, vertex up or flat top; etc.
  const baseOffset = -Math.PI / 2;

  for (let i = 0; i < sides; i++) {
    const angle = baseOffset + rotationRad + (i * 2 * Math.PI) / sides;

    let r = radius;
    if (!isRegular) {
      // Scale base radius slightly down to guarantee zero clipping inside SVG viewbox
      // Perturb radius deterministically per vertex to create a clear, elegant irregular polygon with straight sides and unequal side lengths
      const baseR = radius * 0.75;
      const perturbationFactor = [1.25, 0.75, 1.20, 0.70, 1.15, 0.80];
      r = baseR * perturbationFactor[i % perturbationFactor.length];
    }

    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    points.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
  }

  return points;
}

export function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
}

export function pointsToSvgPointsString(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

/**
 * Calculates side lengths between consecutive vertices
 */
export function getSideLengths(points: Point[]): number[] {
  const lengths: number[] = [];
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    lengths.push(Math.round(dist * 10) / 10);
  }
  return lengths;
}

/**
 * Metadata for Year 3 Malaysian curriculum polygons
 */
export const POLYGON_INFO: Record<string, { name: string; sides: number; vertices: number; description: string; color: string; badge: string }> = {
  pentagon: {
    name: 'Pentagon',
    sides: 5,
    vertices: 5,
    description: 'A regular pentagon has 5 straight sides of equal length and 5 vertices.',
    color: '#3b82f6', // blue
    badge: '★ 5 Sides'
  },
  hexagon: {
    name: 'Hexagon',
    sides: 6,
    vertices: 6,
    description: 'A regular hexagon has 6 straight sides of equal length and 6 vertices.',
    color: '#10b981', // green
    badge: '★ 6 Sides'
  },
  heptagon: {
    name: 'Heptagon',
    sides: 7,
    vertices: 7,
    description: 'A regular heptagon has 7 straight sides of equal length and 7 vertices.',
    color: '#8b5cf6', // purple
    badge: '★ 7 Sides'
  },
  octagon: {
    name: 'Octagon',
    sides: 8,
    vertices: 8,
    description: 'A regular octagon has 8 straight sides of equal length and 8 vertices.',
    color: '#f59e0b', // amber
    badge: '★ 8 Sides'
  }
};
