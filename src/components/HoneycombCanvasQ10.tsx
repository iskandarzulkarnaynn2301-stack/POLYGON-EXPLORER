import React, { useState } from 'react';
import { PikoMascot } from './PikoMascot';
import { Check, X, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { getPolygonPoints, pointsToSvgPointsString } from '../utils/geometry';

interface Piece {
  id: string;
  x: number; // center X on canvas
  y: number; // center Y on canvas
  snappedTargetIndex: number | null; // index of target position 0..6 if snapped
}

interface HoneycombCanvasQ10Props {
  onEvaluate: (isCorrect: boolean) => void;
  isSubmitted: boolean;
  hasPassed: boolean | null;
}

// Canvas dimensions
const CANVAS_WIDTH = 340;
const CANVAS_HEIGHT = 340;
const HEX_RADIUS = 34;

// Calculate 7 honeycomb target centers (1 center + 6 surrounding)
// Base center: (170, 170)
const CENTER_X = 170;
const CENTER_Y = 170;

const dx = Math.sqrt(3) * HEX_RADIUS; // ~58.89
const dy = 1.5 * HEX_RADIUS;          // 51.0
const hdx = (Math.sqrt(3) / 2) * HEX_RADIUS; // ~29.44

export const HONEYCOMB_TARGETS = [
  { index: 0, x: CENTER_X, y: CENTER_Y, label: 'Center' },
  { index: 1, x: CENTER_X + dx, y: CENTER_Y, label: 'Right' },
  { index: 2, x: CENTER_X + hdx, y: CENTER_Y + dy, label: 'Bottom-Right' },
  { index: 3, x: CENTER_X - hdx, y: CENTER_Y + dy, label: 'Bottom-Left' },
  { index: 4, x: CENTER_X - dx, y: CENTER_Y, label: 'Left' },
  { index: 5, x: CENTER_X - hdx, y: CENTER_Y - dy, label: 'Top-Left' },
  { index: 6, x: CENTER_X + hdx, y: CENTER_Y - dy, label: 'Top-Right' }
];

// Initial staging positions for the 7 loose pieces below working canvas
const INITIAL_PIECES: Piece[] = [
  { id: 'hex-1', x: 35, y: 300, snappedTargetIndex: null },
  { id: 'hex-2', x: 80, y: 300, snappedTargetIndex: null },
  { id: 'hex-3', x: 125, y: 300, snappedTargetIndex: null },
  { id: 'hex-4', x: 170, y: 300, snappedTargetIndex: null },
  { id: 'hex-5', x: 215, y: 300, snappedTargetIndex: null },
  { id: 'hex-6', x: 260, y: 300, snappedTargetIndex: null },
  { id: 'hex-7', x: 305, y: 300, snappedTargetIndex: null }
];

export const HoneycombCanvasQ10: React.FC<HoneycombCanvasQ10Props> = ({
  onEvaluate,
  isSubmitted,
  hasPassed
}) => {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [activePieceId, setActivePieceId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [validationCriteria, setValidationCriteria] = useState<{
    pieceCountValid: boolean;
    centerOccupied: boolean;
    surroundingOccupied: boolean;
    allTargetsFilled: boolean;
  } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, piece: Piece) => {
    if (isSubmitted) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    // Find click position relative to canvas bounding box
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    setActivePieceId(piece.id);
    setDragOffset({
      x: clickX - piece.x,
      y: clickY - piece.y
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activePieceId || isSubmitted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const currX = e.clientX - rect.left - dragOffset.x;
    const currY = e.clientY - rect.top - dragOffset.y;

    // Clamp within working canvas bounds
    const clampedX = Math.max(25, Math.min(CANVAS_WIDTH - 25, currX));
    const clampedY = Math.max(25, Math.min(CANVAS_HEIGHT - 25, currY));

    // Check snapping to nearby targets (within 30px distance)
    let snappedIdx: number | null = null;
    let finalX = clampedX;
    let finalY = clampedY;

    for (const target of HONEYCOMB_TARGETS) {
      const dist = Math.hypot(clampedX - target.x, clampedY - target.y);
      if (dist <= 30) {
        snappedIdx = target.index;
        finalX = target.x;
        finalY = target.y;
        break;
      }
    }

    setPieces((prev) =>
      prev.map((p) =>
        p.id === activePieceId
          ? { ...p, x: finalX, y: finalY, snappedTargetIndex: snappedIdx }
          : p
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!activePieceId) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setActivePieceId(null);
  };

  const handleReset = () => {
    if (isSubmitted) return;
    setPieces(INITIAL_PIECES);
    setValidationCriteria(null);
  };

  const handleSubmit = () => {
    // Evaluate placement criteria programmatically using target coordinates
    const totalPieces = pieces.length; // 7
    const occupiedTargetIndices = new Set(
      pieces
        .filter((p) => p.snappedTargetIndex !== null)
        .map((p) => p.snappedTargetIndex)
    );

    const centerOccupied = occupiedTargetIndices.has(0);
    const surroundingOccupiedCount = [1, 2, 3, 4, 5, 6].filter((idx) =>
      occupiedTargetIndices.has(idx)
    ).length;

    const pieceCountValid = totalPieces === 7;
    const surroundingOccupied = surroundingOccupiedCount === 6;
    const allTargetsFilled = occupiedTargetIndices.size === 7;

    const isCorrect = pieceCountValid && centerOccupied && surroundingOccupied && allTargetsFilled;

    setValidationCriteria({
      pieceCountValid,
      centerOccupied,
      surroundingOccupied,
      allTargetsFilled
    });

    onEvaluate(isCorrect);
  };

  // Helper to get SVG polygon points string for a hexagon at given center (cx, cy)
  const getHexPoints = (cx: number, cy: number, r: number = HEX_RADIUS) => {
    const pts = getPolygonPoints(6, r, { x: cx, y: cy }, 0, true);
    return pointsToSvgPointsString(pts);
  };

  return (
    <div className="space-y-4">
      {/* Side-by-side Layout: Reference vs Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Box: Reference Design */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-4 flex flex-col items-center justify-between space-y-2 shadow-xs">
          <div className="text-center">
            <span className="bg-amber-500 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Reference Pattern
            </span>
            <h4 className="text-sm font-extrabold text-amber-950 mt-1">Honeycomb Cluster</h4>
            <p className="text-xs text-amber-800">1 Central + 6 Surrounding Regular Hexagons</p>
          </div>

          <div className="relative w-[260px] h-[240px] flex items-center justify-center bg-white/80 rounded-2xl border border-amber-200 shadow-inner">
            <svg width="260" height="240" viewBox="0 0 340 340" className="drop-shadow-xs">
              {HONEYCOMB_TARGETS.map((t) => (
                <polygon
                  key={`ref-${t.index}`}
                  points={getHexPoints(t.x, t.y)}
                  fill={t.index === 0 ? '#10b981' : '#3b82f6'}
                  fillOpacity="0.85"
                  stroke="#1e3a8a"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              ))}
            </svg>
          </div>

          <p className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Target: Exactly 7 hexagons in place!
          </p>
        </div>

        {/* Right Box: Interactive Canvas */}
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 border-2 border-indigo-200 rounded-3xl p-4 flex flex-col items-center space-y-3">
          <div className="flex items-center justify-between w-full">
            <span className="bg-indigo-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Working Canvas
            </span>
            <button
              disabled={isSubmitted}
              onClick={handleReset}
              className="text-xs font-extrabold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Pieces
            </button>
          </div>

          {/* Interactive Working Canvas */}
          <div
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-[300px] sm:w-[320px] h-[320px] bg-white rounded-2xl border-2 border-indigo-200 shadow-inner overflow-hidden select-none touch-none"
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />

            <svg width="100%" height="100%" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} className="absolute inset-0">
              {/* Target Guides (Faint outline overlays) */}
              {HONEYCOMB_TARGETS.map((t) => (
                <polygon
                  key={`guide-${t.index}`}
                  points={getHexPoints(t.x, t.y)}
                  fill="none"
                  stroke="#a5b4fc"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Draggable Regular Hexagon Pieces */}
              {pieces.map((piece) => {
                const isSelected = activePieceId === piece.id;
                const isSnapped = piece.snappedTargetIndex !== null;

                return (
                  <g
                    key={piece.id}
                    onPointerDown={(e) => handlePointerDown(e, piece)}
                    className="cursor-grab active:cursor-grabbing transition-transform duration-75"
                    style={{ transformOrigin: `${piece.x}px ${piece.y}px` }}
                  >
                    <polygon
                      points={getHexPoints(piece.x, piece.y)}
                      fill={isSnapped ? '#10b981' : '#3b82f6'}
                      fillOpacity={isSelected ? 0.95 : 0.85}
                      stroke={isSelected ? '#f59e0b' : '#1e3a8a'}
                      strokeWidth={isSelected ? '4' : '3'}
                      strokeLinejoin="round"
                    />
                    {/* Visual Center Snap Dot */}
                    <circle
                      cx={piece.x}
                      cy={piece.y}
                      r="3"
                      fill={isSnapped ? '#ffffff' : '#93c5fd'}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Criteria Status and Action Controls */}
      <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-semibold text-slate-600 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            {pieces.filter((p) => p.snappedTargetIndex !== null).length} of 7 hexagons snapped into position
          </span>
        </div>

        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-amber-950 font-black text-sm rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-950" />
            <span>SUBMIT DESIGN</span>
          </button>
        )}
      </div>

      {/* Feedback Display when Submitted */}
      {isSubmitted && (
        <div
          className={`p-5 rounded-3xl border-3 flex flex-col sm:flex-row items-center gap-4 transition-all animate-bounce-subtle ${
            hasPassed
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-rose-50 border-rose-400 text-rose-950'
          }`}
        >
          <PikoMascot mood={hasPassed ? 'celebrating' : 'thinking'} size="md" />

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              {hasPassed ? (
                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full">
                  <Check className="w-4 h-4 stroke-[3]" /> CORRECT! (+1 Mark)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full">
                  <X className="w-4 h-4 stroke-[3]" /> NOT QUITE RIGHT (0 Marks)
                </span>
              )}
            </div>

            <p className="font-extrabold text-sm sm:text-base leading-snug">
              {hasPassed
                ? 'Excellent! You recreated the honeycomb using 7 regular hexagons.'
                : 'Your honeycomb is not complete yet. Check the number and positions of the hexagons.'}
            </p>

            {/* Detailed Criteria Status Checklist */}
            {validationCriteria && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs font-extrabold">
                <div className={validationCriteria.pieceCountValid ? 'text-emerald-700' : 'text-rose-700'}>
                  {validationCriteria.pieceCountValid ? '✓' : '✗'} 7 Hexagon pieces used
                </div>
                <div className={validationCriteria.centerOccupied ? 'text-emerald-700' : 'text-rose-700'}>
                  {validationCriteria.centerOccupied ? '✓' : '✗'} Central position occupied
                </div>
                <div className={validationCriteria.surroundingOccupied ? 'text-emerald-700' : 'text-rose-700'}>
                  {validationCriteria.surroundingOccupied ? '✓' : '✗'} 6 Surrounding positions occupied
                </div>
                <div className={validationCriteria.allTargetsFilled ? 'text-emerald-700' : 'text-rose-700'}>
                  {validationCriteria.allTargetsFilled ? '✓' : '✗'} Full honeycomb alignment satisfied
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
