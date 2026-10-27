import React, { useState, useRef } from 'react';
import type { WorkshopShape } from '../types/game';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { PikoMascot } from './PikoMascot';
import { toPng } from 'html-to-image';
import {
  Palette,
  RotateCw,
  Trash2,
  Download,
  RotateCcw,
  Plus,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface Stage7PatternWorkshopProps {
  shapes: WorkshopShape[];
  onUpdateShapes: (shapes: WorkshopShape[]) => void;
  onCompleteWorkshop: () => void;
}

const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // green
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16'  // lime
];

export const Stage7PatternWorkshop: React.FC<Stage7PatternWorkshopProps> = ({
  shapes,
  onUpdateShapes,
  onCompleteWorkshop
}) => {
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
  const [history, setHistory] = useState<WorkshopShape[][]>([]);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string>('');

  const canvasRef = useRef<HTMLDivElement>(null);

  const missions = [
    {
      id: 1,
      title: 'Mission 1 — Rainbow Pattern',
      instruction: 'Arrange at least three regular polygons to make a colourful design.',
      verify: (s: WorkshopShape[]) => s.length >= 3,
      hint: 'Add 3 or more polygons to the canvas and make them colorful!'
    },
    {
      id: 2,
      title: 'Mission 2 — Polygon Flower',
      instruction: 'Combine regular polygons to create a flower-inspired geometric design.',
      verify: (s: WorkshopShape[]) => s.length >= 4,
      hint: 'Combine 4 or more shapes (like pentagons or hexagons around a center)!'
    },
    {
      id: 3,
      title: 'Mission 3 — My Own Polygon Design',
      instruction: 'Create an original pattern using at least two different types of regular polygons.',
      verify: (s: WorkshopShape[]) => {
        const types = new Set(s.map((shape) => shape.type));
        return s.length >= 4 && types.size >= 2;
      },
      hint: 'Use at least 2 different shape types (e.g. Hexagon + Octagon)!'
    }
  ];

  const currentMission = missions[activeMissionIndex];
  const isMissionPassed = currentMission.verify(shapes);

  const saveToHistory = (newShapes: WorkshopShape[]) => {
    setHistory((prev) => [...prev, shapes]);
    onUpdateShapes(newShapes);
  };

  const addShape = (type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon') => {
    const newShape: WorkshopShape = {
      id: `shape_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      x: 150 + Math.random() * 80,
      y: 150 + Math.random() * 80,
      color: selectedColor,
      rotation: 0,
      scale: 1
    };
    const updated = [...shapes, newShape];
    saveToHistory(updated);
    setSelectedShapeId(newShape.id);
  };

  const updateSelectedShape = (updater: (s: WorkshopShape) => WorkshopShape) => {
    if (!selectedShapeId) return;
    const updated = shapes.map((s) => (s.id === selectedShapeId ? updater(s) : s));
    saveToHistory(updated);
  };

  const removeSelectedShape = () => {
    if (!selectedShapeId) return;
    const updated = shapes.filter((s) => s.id !== selectedShapeId);
    saveToHistory(updated);
    setSelectedShapeId(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    onUpdateShapes(previous);
  };

  const handleReset = () => {
    saveToHistory([]);
    setSelectedShapeId(null);
  };

  const handleSaveImage = async () => {
    if (!canvasRef.current) return;
    try {
      setSaveStatusMsg('Generating image preview...');
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `my_polygon_pattern_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setSaveStatusMsg('✓ Pattern image downloaded successfully!');
      setTimeout(() => setSaveStatusMsg(''), 4000);
    } catch (err) {
      setSaveStatusMsg('Image export not supported on this browser. Screenshot saved instead.');
      setTimeout(() => setSaveStatusMsg(''), 4000);
    }
  };

  // Canvas Tap/Click to move shape to tapped position
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedShapeId && e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 50;
      const y = e.clientY - rect.top - 50;
      updateSelectedShape((s) => ({ ...s, x: Math.max(10, x), y: Math.max(10, y) }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Palette className="w-4 h-4 text-amber-200" /> Stage 7: Creative Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">PATTERN WORKSHOP</h1>
          <p className="text-amber-100 text-sm mt-1">
            Learning Standard 7.3.2 — Create patterns based on regular polygons
          </p>
        </div>

        <PikoMascot mood="excited" size="sm" />
      </div>

      {/* Guided Mission Bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-800 text-lg">
              {currentMission.title}
            </h3>
          </div>
          <div className="flex gap-2">
            {missions.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActiveMissionIndex(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeMissionIndex === idx
                    ? 'bg-amber-500 text-amber-950 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mission {m.id}
              </button>
            ))}
          </div>
        </div>

        <p className="text-slate-700 text-sm sm:text-base font-semibold">
          {currentMission.instruction}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold">
          <span>💡 Hint: {currentMission.hint}</span>
          {isMissionPassed ? (
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 font-extrabold">
              <CheckCircle2 className="w-4 h-4" /> Mission Goal Met!
            </span>
          ) : (
            <span className="bg-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold">
              In Progress ({shapes.length} shapes)
            </span>
          )}
        </div>
      </div>

      {/* Workshop Main Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-1 space-y-5 bg-white p-5 rounded-3xl border-3 border-amber-200 shadow-md">
          {/* Add Shapes Palette */}
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" /> Add Polygons
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'pentagon' as const, label: 'Pentagon' },
                { type: 'hexagon' as const, label: 'Hexagon' },
                { type: 'heptagon' as const, label: 'Heptagon' },
                { type: 'octagon' as const, label: 'Octagon' }
              ].map((p) => (
                <button
                  key={p.type}
                  onClick={() => addShape(p.type)}
                  className="p-2.5 bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-400 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer group"
                >
                  <PolygonSvgPreview type={p.type} size={45} fillColor={selectedColor} />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-amber-900">
                    + {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <h4 className="font-extrabold text-slate-800 text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-600" /> Select Color
            </h4>
            <div className="flex flex-wrap gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedColor(c);
                    if (selectedShapeId) {
                      updateSelectedShape((s) => ({ ...s, color: c }));
                    }
                  }}
                  style={{ backgroundColor: c }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                    selectedColor === c ? 'scale-125 border-slate-900 shadow-md' : 'border-white hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Selected Shape Controls */}
          {selectedShapeId ? (
            <div className="space-y-3 bg-amber-50 p-4 rounded-2xl border-2 border-amber-300">
              <h4 className="font-extrabold text-amber-950 text-xs uppercase tracking-wider">
                Shape Controls
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateSelectedShape((s) => ({ ...s, rotation: (s.rotation + 30) % 360 }))}
                  className="p-2 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 text-slate-700 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate 30°
                </button>

                <button
                  onClick={() => updateSelectedShape((s) => ({ ...s, scale: Math.min(2, s.scale + 0.2) }))}
                  className="p-2 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 text-slate-700 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> Scale +
                </button>

                <button
                  onClick={() => updateSelectedShape((s) => ({ ...s, scale: Math.max(0.6, s.scale - 0.2) }))}
                  className="p-2 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 text-slate-700 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" /> Scale -
                </button>

                <button
                  onClick={removeSelectedShape}
                  className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Tap any shape on the grid to select & adjust it!
            </p>
          )}

          {/* Global Controls */}
          <div className="pt-2 flex flex-col gap-2 border-t border-slate-200">
            <div className="flex gap-2">
              <button
                disabled={history.length === 0}
                onClick={handleUndo}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-bold text-xs rounded-xl flex items-center justify-center gap-1 text-slate-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Undo
              </button>

              <button
                onClick={handleReset}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 text-slate-700 cursor-pointer"
              >
                Clear Grid
              </button>
            </div>

            <button
              onClick={handleSaveImage}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> SAVE MY DESIGN (PNG)
            </button>
            {saveStatusMsg && (
              <p className="text-[11px] font-bold text-teal-800 text-center bg-teal-50 p-2 rounded-xl">
                {saveStatusMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right Design Workspace Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="relative w-full h-[420px] bg-slate-50 rounded-3xl border-4 border-amber-300 shadow-inner overflow-hidden cursor-crosshair"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          >
            {shapes.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                <Layers className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-slate-500 font-bold text-base">Your Pattern Canvas is Empty!</p>
                <p className="text-slate-400 text-xs mt-1 max-w-sm">
                  Click "+ Pentagon", "+ Hexagon", etc. on the left panel to place shapes here and create your design!
                </p>
              </div>
            ) : (
              shapes.map((shape) => {
                const isSelected = selectedShapeId === shape.id;
                const size = 100 * shape.scale;

                return (
                  <div
                    key={shape.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedShapeId(shape.id);
                    }}
                    style={{
                      left: `${shape.x}px`,
                      top: `${shape.y}px`,
                      transform: `rotate(${shape.rotation}deg)`,
                      width: `${size}px`,
                      height: `${size}px`
                    }}
                    className={`absolute cursor-grab active:cursor-grabbing transition-transform duration-100 ${
                      isSelected ? 'ring-4 ring-amber-400 rounded-2xl z-20 shadow-xl' : 'z-10 hover:scale-105'
                    }`}
                  >
                    <PolygonSvgPreview
                      type={shape.type}
                      size={size}
                      fillColor={shape.color}
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Completion Banner */}
          {isMissionPassed && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-subtle">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-2xl font-black">AMAZING CREATION! YOU ARE READY FOR THE POLYGON CHALLENGE!</h3>
                <p className="text-amber-100 text-sm font-medium">
                  You have created a wonderful regular polygon pattern design!
                </p>
              </div>

              <button
                onClick={onCompleteWorkshop}
                className="py-4 px-8 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-lg rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>TAKE POST-TEST CHALLENGE</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
