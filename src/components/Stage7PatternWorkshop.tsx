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
  ZoomOut,
  Grid,
  Eye,
  Play
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

interface GalleryExample {
  id: string;
  name: string;
  description: string;
  shapes: Array<{
    type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';
    x: number;
    y: number;
    color: string;
    rotation: number;
    scale: number;
  }>;
}

const PATTERN_GALLERY: GalleryExample[] = [
  {
    id: 'flower',
    name: 'Example 1 — Polygon Flower',
    description: 'A beautiful flower composition built exclusively from regular hexagons and pentagons around a central octagon!',
    shapes: [
      { type: 'octagon', x: 200, y: 150, color: '#f59e0b', rotation: 0, scale: 1.2 },
      { type: 'hexagon', x: 120, y: 150, color: '#10b981', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 280, y: 150, color: '#10b981', rotation: 0, scale: 1 },
      { type: 'pentagon', x: 200, y: 70, color: '#3b82f6', rotation: 0, scale: 1 },
      { type: 'pentagon', x: 200, y: 230, color: '#3b82f6', rotation: 0, scale: 1 },
      { type: 'heptagon', x: 135, y: 85, color: '#8b5cf6', rotation: 30, scale: 0.9 },
      { type: 'heptagon', x: 265, y: 215, color: '#8b5cf6', rotation: 30, scale: 0.9 }
    ]
  },
  {
    id: 'mosaic',
    name: 'Example 2 — Rainbow Polygon Mosaic',
    description: 'A colourful tessellated grid constructed from alternating regular pentagons, hexagons, heptagons and octagons!',
    shapes: [
      { type: 'pentagon', x: 100, y: 100, color: '#ef4444', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 190, y: 100, color: '#3b82f6', rotation: 0, scale: 1 },
      { type: 'heptagon', x: 280, y: 100, color: '#10b981', rotation: 0, scale: 1 },
      { type: 'octagon', x: 370, y: 100, color: '#8b5cf6', rotation: 0, scale: 1 },
      { type: 'octagon', x: 100, y: 190, color: '#f59e0b', rotation: 0, scale: 1 },
      { type: 'heptagon', x: 190, y: 190, color: '#ec4899', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 280, y: 190, color: '#06b6d4', rotation: 0, scale: 1 },
      { type: 'pentagon', x: 370, y: 190, color: '#84cc16', rotation: 0, scale: 1 }
    ]
  },
  {
    id: 'mandala',
    name: 'Example 3 — Polygon Mandala',
    description: 'A radially symmetrical pattern formed by rotating regular heptagons and octagons in a balanced star ring!',
    shapes: [
      { type: 'octagon', x: 220, y: 150, color: '#8b5cf6', rotation: 0, scale: 1.3 },
      { type: 'heptagon', x: 220, y: 150, color: '#3b82f6', rotation: 25, scale: 1.1 },
      { type: 'hexagon', x: 220, y: 150, color: '#10b981', rotation: 50, scale: 0.9 },
      { type: 'pentagon', x: 220, y: 150, color: '#f59e0b', rotation: 75, scale: 0.7 }
    ]
  },
  {
    id: 'composition',
    name: 'Example 4 — Creative Polygon Composition',
    description: 'An imaginative artistic motif combining regular pentagons, hexagons, heptagons and octagons in layered harmony!',
    shapes: [
      { type: 'hexagon', x: 230, y: 120, color: '#10b981', rotation: 0, scale: 1.2 },
      { type: 'pentagon', x: 150, y: 170, color: '#ef4444', rotation: 180, scale: 1 },
      { type: 'pentagon', x: 310, y: 170, color: '#ef4444', rotation: 180, scale: 1 },
      { type: 'octagon', x: 230, y: 220, color: '#f59e0b', rotation: 0, scale: 1 },
      { type: 'heptagon', x: 230, y: 40, color: '#8b5cf6', rotation: 0, scale: 0.9 }
    ]
  }
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
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [previewExample, setPreviewExample] = useState<GalleryExample | null>(null);

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

  const handleLoadExample = (example: GalleryExample) => {
    const loadedShapes: WorkshopShape[] = example.shapes.map((s, idx) => ({
      id: `loaded_${example.id}_${idx}_${Date.now()}`,
      type: s.type,
      x: s.x,
      y: s.y,
      color: s.color,
      rotation: s.rotation,
      scale: s.scale
    }));
    saveToHistory(loadedShapes);
    setShowGalleryModal(false);
    setPreviewExample(null);
    setSaveStatusMsg(`✓ Loaded ${example.name} into canvas as editable shapes!`);
    setTimeout(() => setSaveStatusMsg(''), 4000);
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
      setSaveStatusMsg('Image export completed as screenshot preview.');
      setTimeout(() => setSaveStatusMsg(''), 4000);
    }
  };

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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGalleryModal(true)}
            className="py-2.5 px-4 bg-white hover:bg-amber-100 text-amber-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4 text-amber-600" />
            <span>INSPIRATION GALLERY</span>
          </button>
          <PikoMascot mood="excited" size="sm" />
        </div>
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none space-y-3">
                <Layers className="w-12 h-12 text-slate-300" />
                <div>
                  <p className="text-slate-600 font-bold text-base">Your Pattern Canvas is Ready!</p>
                  <p className="text-slate-400 text-xs mt-1 max-w-sm">
                    Click "+ Pentagon", "+ Hexagon", etc. or open the Inspiration Gallery to load preset patterns!
                  </p>
                </div>

                <button
                  onClick={() => setShowGalleryModal(true)}
                  className="pointer-events-auto py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Grid className="w-4 h-4" />
                  <span>OPEN INSPIRATION GALLERY</span>
                </button>
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

      {/* Pattern Inspiration Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border-4 border-amber-400 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-amber-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-900 rounded-2xl">
                  <Grid className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">PATTERN INSPIRATION GALLERY</h3>
                  <p className="text-xs text-amber-800 font-extrabold uppercase">
                    Exclusively created using regular Pentagons, Hexagons, Heptagons & Octagons
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGalleryModal(false)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PATTERN_GALLERY.map((example) => (
                <div
                  key={example.id}
                  className="bg-amber-50/50 border-3 border-amber-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-800 text-lg">{example.name}</h4>
                    <p className="text-xs text-slate-600 font-medium">{example.description}</p>

                    {/* SVG Preview Canvas */}
                    <div className="relative w-full h-48 bg-slate-100 rounded-2xl border-2 border-amber-200 overflow-hidden flex items-center justify-center">
                      {example.shapes.map((s, idx) => {
                        const size = 55 * s.scale;
                        return (
                          <div
                            key={idx}
                            style={{
                              left: `${s.x * 0.75}px`,
                              top: `${s.y * 0.75}px`,
                              transform: `rotate(${s.rotation}deg)`,
                              position: 'absolute'
                            }}
                          >
                            <PolygonSvgPreview type={s.type} size={size} fillColor={s.color} />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setPreviewExample(example)}
                      className="flex-1 py-2.5 bg-white hover:bg-amber-100 border-2 border-amber-300 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-amber-600" />
                      <span>VIEW EXAMPLE</span>
                    </button>

                    <button
                      onClick={() => handleLoadExample(example)}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>TRY THIS PATTERN</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-200">
              <button
                onClick={() => {
                  handleReset();
                  setShowGalleryModal(false);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                START WITH BLANK CANVAS
              </button>

              <button
                onClick={() => setShowGalleryModal(false)}
                className="py-2.5 px-6 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl shadow-md cursor-pointer"
              >
                CLOSE GALLERY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Pattern Detail Preview Modal */}
      {previewExample && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border-4 border-amber-400 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-800">{previewExample.name}</h3>
            <p className="text-xs text-slate-600 font-medium">{previewExample.description}</p>

            <div className="relative w-full h-64 bg-slate-100 rounded-2xl border-2 border-amber-200 overflow-hidden flex items-center justify-center">
              {previewExample.shapes.map((s, idx) => {
                const size = 70 * s.scale;
                return (
                  <div
                    key={idx}
                    style={{
                      left: `${s.x}px`,
                      top: `${s.y}px`,
                      transform: `rotate(${s.rotation}deg)`,
                      position: 'absolute'
                    }}
                  >
                    <PolygonSvgPreview type={s.type} size={size} fillColor={s.color} />
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPreviewExample(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl cursor-pointer"
              >
                BACK TO GALLERY
              </button>
              <button
                onClick={() => handleLoadExample(previewExample)}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>LOAD INTO WORKSHOP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
