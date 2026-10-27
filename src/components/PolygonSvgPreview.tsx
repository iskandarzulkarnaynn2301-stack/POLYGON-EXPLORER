import React from 'react';
import { getPolygonPoints, pointsToSvgPointsString } from '../utils/geometry';

interface PolygonSvgPreviewProps {
  type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon' | 'irregular_pentagon' | 'irregular_hexagon' | 'rotated_hexagon' | 'rotated_pentagon' | 'rotated_heptagon' | 'rotated_octagon' | 'triangle' | 'square' | 'counting_pentagon' | 'counting_hexagon';
  size?: number;
  rotation?: number;
  highlightSides?: boolean;
  highlightVertices?: boolean;
  fillColor?: string;
  strokeColor?: string;
  className?: string;
}

export const PolygonSvgPreview: React.FC<PolygonSvgPreviewProps> = ({
  type,
  size = 180,
  rotation = 0,
  highlightSides = false,
  highlightVertices = false,
  fillColor = '#3b82f6',
  strokeColor = '#1e3a8a',
  className = ''
}) => {
  let sides = 5;
  let isRegular = true;
  let defaultRotation = rotation;

  switch (type) {
    case 'pentagon':
    case 'counting_pentagon':
      sides = 5;
      break;
    case 'hexagon':
    case 'counting_hexagon':
      sides = 6;
      break;
    case 'heptagon':
      sides = 7;
      break;
    case 'octagon':
      sides = 8;
      break;
    case 'irregular_pentagon':
      sides = 5;
      isRegular = false;
      break;
    case 'irregular_hexagon':
      sides = 6;
      isRegular = false;
      break;
    case 'rotated_pentagon':
      sides = 5;
      defaultRotation = 72;
      break;
    case 'rotated_hexagon':
      sides = 6;
      defaultRotation = 45;
      break;
    case 'rotated_heptagon':
      sides = 7;
      defaultRotation = 90;
      break;
    case 'rotated_octagon':
      sides = 8;
      defaultRotation = 67.5;
      break;
    case 'triangle':
      sides = 3;
      break;
    case 'square':
      sides = 4;
      break;
  }

  const center = { x: size / 2, y: size / 2 };
  const radius = (size / 2) * 0.75;

  const points = getPolygonPoints(sides, radius, center, defaultRotation, isRegular);
  const pointsString = pointsToSvgPointsString(points);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`inline-block drop-shadow-md ${className}`}>
      {/* Background container */}
      <rect x="2" y="2" width={size - 4} height={size - 4} rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

      {/* Polygon main shape */}
      <polygon
        points={pointsString}
        fill={fillColor}
        fillOpacity="0.85"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Optionally highlight sides with numbered labels */}
      {highlightSides && points.map((p1, idx) => {
        const p2 = points[(idx + 1) % points.length];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        return (
          <g key={`side-${idx}`}>
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#f59e0b"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx={midX} cy={midY} r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
            <text x={midX} y={midY + 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              {idx + 1}
            </text>
          </g>
        );
      })}

      {/* Optionally highlight vertices with dots */}
      {highlightVertices && points.map((p, idx) => (
        <g key={`vertex-${idx}`}>
          <circle cx={p.x} cy={p.y} r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
          <text x={p.x} y={p.y + 3.5} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="extrabold">
            {idx + 1}
          </text>
        </g>
      ))}
    </svg>
  );
};
