import React, { useState, useRef } from 'react';
import type { WorkshopShape } from '../types/game';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { PikoMascot } from './PikoMascot';
import { toPng } from 'html-to-image';
import {
  Palette,
  RotateCw,
  RotateCcw,
  Trash2,
  Download,
  Plus,
  ArrowRight,
  Grid,
  Eye,
  Play,
  Copy,
  Layers,
  MoveUp,
  MoveDown,
  X,
  Sparkles
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
    id: 'honeycomb',
    name: 'Example 1 — Honeycomb Cluster',
    description: 'A neat, attractive geometric cluster built with 1 central regular hexagon surrounded by 6 matching regular hexagons in a balanced honeycomb structure!',
    shapes: [
      { type: 'hexagon', x: 250, y: 150, color: '#f59e0b', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 250, y: 70, color: '#10b981', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 318, y: 110, color: '#3b82f6', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 318, y: 190, color: '#8b5cf6', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 250, y: 230, color: '#ef4444', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 182, y: 190, color: '#06b6d4', rotation: 0, scale: 1 },
      { type: 'hexagon', x: 182, y: 110, color: '#84cc16', rotation: 0, scale: 1 }
    ]
  },
  {
    id: 'flower',
    name: 'Example 2 — Polygon Flower',
    description: 'An attractive flower composition with 1 central regular hexagon surrounded symmetrically by 6 regular pentagons rotated radially!',
    shapes: [
      { type: 'hexagon', x: 250, y: 150, color: '#f59e0b', rotation: 0, scale: 1.1 },
      { type: 'pentagon', x: 250, y: 65, color: '#ec4899', rotation: 0, scale: 0.95 },
      { type: 'pentagon', x: 325, y: 110, color: '#3b82f6', rotation: 60, scale: 0.95 },
      { type: 'pentagon', x: 325, y: 195, color: '#8b5cf6', rotation: 120, scale: 0.95 },
      { type: 'pentagon', x: 250, y: 235, color: '#ef4444', rotation: 180, scale: 0.95 },
      { type: 'pentagon', x: 175, y: 195, color: '#10b981', rotation: 240, scale: 0.95 },
      { type: 'pentagon', x: 175, y: 110, color: '#06b6d4', rotation: 300, scale: 0.95 }
    ]
  },
  {
    id: 'robot',
    name: 'Example 3 — Polygon Robot',
    description: 'A cute geometric robot built using a regular hexagon for the head, an octagon for the body, and pentagons for the hands and feet!',
    shapes: [
      { type: 'hexagon', x: 250, y: 60, color: '#06b6d4', rotation: 0, scale: 1 },
      { type: 'octagon', x: 250, y: 160, color: '#3b82f6', rotation: 0, scale: 1.2 },
      { type: 'pentagon', x: 160, y: 160, color: '#f59e0b', rotation: 270, scale: 0.8 },
      { type: 'pentagon', x: 340, y: 160, color: '#f59e0b', rotation: 90, scale: 0.8 },
      { type: 'pentagon', x: 210, y: 260, color: '#10b981', rotation: 180, scale: 0.85 },
      { type: 'pentagon', x: 290, y: 260, color: '#10b981', rotation: 180, scale: 0.85 },
      { type: 'heptagon', x: 250, y: 10, color: '#8b5cf6', rotation: 0, scale: 0.6 }
    ]
  },
  {
    id: 'butterfly',
    name: 'Example 4 — Polygon Butterfly',
    description: 'A beautiful, symmetrical butterfly design with a central polygon body column and matching pentagon, hexagon, heptagon, and octagon wings!',
    shapes: [
      { type: 'hexagon', x: 250, y: 120, color: '#10b981', rotation: 0, scale: 0.8 },
      { type: 'octagon', x: 250, y: 180, color: '#8b5cf6', rotation: 0, scale: 0.9 },
      { type: 'heptagon', x: 170, y: 100, color: '#3b82f6', rotation: 30, scale: 1.1 },
      { type: 'heptagon', x: 330, y: 100, color: '#3b82f6', rotation: 330, scale: 1.1 },
      { type: 'pentagon', x: 180, y: 200, color: '#ef4444', rotation: 45, scale: 1 },
      { type: 'pentagon', x: 320, y: 200, color: '#ef4444', rotation: 315, scale: 1 }
    ]
  }
];

export const Stage7PatternWorkshop: React.FC<Stage7PatternWorkshopProps> = ({
  shapes,
  onUpdateShapes,
  onCompleteWorkshop
}) => {
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
  const [history, setHistory] = useState<WorkshopShape[][]>([]);
  const [saveStatusMsg, setSaveStatusMsg] = useState<string>('');
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [previewExample, setPreviewExample] = useState<GalleryExample | null>(null);

  // Drag interaction state ref to avoid unnecessary re-renders during smooth mouse/touch drag
  const dragRef = useRef<{
    isDragging: boolean;
    shapeId: string | null;
    startPointerX: number;
    startPointerY: number;
    startShapeX: number;
    startShapeY: number;
  }>({
    isDragging: false,
    shapeId: null,
    startPointerX: 0,
    startPointerY: 0,
    startShapeX: 0,
    startShapeY: 0
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const saveToHistory = (newShapes: WorkshopShape[]) => {
    setHistory((prev) => [...prev, shapes]);
    onUpdateShapes(newShapes);
  };

  const addShape = (type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon') => {
    const newShape: WorkshopShape = {
      id: `shape_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      x: 180 + Math.random() * 60,
      y: 130 + Math.random() * 60,
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

  const duplicateSelectedShape = () => {
    if (!selectedShapeId) return;
    const target = shapes.find((s) => s.id === selectedShapeId);
    if (!target) return;

    const dup: WorkshopShape = {
      ...target,
      id: `shape_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      x: Math.min(target.x + 30, 480),
      y: Math.min(target.y + 30, 320)
    };
    saveToHistory([...shapes, dup]);
    setSelectedShapeId(dup.id);
  };

  const removeSelectedShape = () => {
    if (!selectedShapeId) return;
    const updated = shapes.filter((s) => s.id !== selectedShapeId);
    saveToHistory(updated);
    setSelectedShapeId(null);
  };

  const bringToFront = () => {
    if (!selectedShapeId) return;
    const target = shapes.find((s) => s.id === selectedShapeId);
    if (!target) return;
    const filtered = shapes.filter((s) => s.id !== selectedShapeId);
    saveToHistory([...filtered, target]);
  };

  const sendToBack = () => {
    if (!selectedShapeId) return;
    const target = shapes.find((s) => s.id === selectedShapeId);
    if (!target) return;
    const filtered = shapes.filter((s) => s.id !== selectedShapeId);
    saveToHistory([target, ...filtered]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    onUpdateShapes(previous);
  };

  const handleReset = () => {
    if (shapes.length > 0 && window.confirm('Are you sure you want to clear all shapes from your canvas?')) {
      saveToHistory([]);
      setSelectedShapeId(null);
    }
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

  // High-performance Pointer Event Dragging
  const handlePointerDown = (e: React.PointerEvent, shape: WorkshopShape) => {
    e.stopPropagation();
    setSelectedShapeId(shape.id);

    // Capture pointer to guarantee dragging continues even if finger/cursor moves fast
    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      isDragging: true,
      shapeId: shape.id,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startShapeX: shape.x,
      startShapeY: shape.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging || !dragRef.current.shapeId || !canvasRef.current) return;

    const dx = e.clientX - dragRef.current.startPointerX;
    const dy = e.clientY - dragRef.current.startPointerY;

    // Calculate candidate positions
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const targetShape = shapes.find((s) => s.id === dragRef.current.shapeId);
    if (!targetShape) return;

    const shapeSize = 100 * targetShape.scale;
    const maxX = Math.max(10, canvasBounds.width - shapeSize);
    const maxY = Math.max(10, canvasBounds.height - shapeSize);

    const newX = Math.max(0, Math.min(maxX, dragRef.current.startShapeX + dx));
    const newY = Math.max(0, Math.min(maxY, dragRef.current.startShapeY + dy));

    // Direct state update for smooth 60fps movement
    onUpdateShapes(
      shapes.map((s) => (s.id === dragRef.current.shapeId ? { ...s, x: newX, y: newY } : s))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragRef.current.isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore if pointer capture already lost
      }
      setHistory((prev) => [...prev, shapes]);
      dragRef.current.isDragging = false;
      dragRef.current.shapeId = null;
    }
  };

  const activeShape = shapes.find((s) => s.id === selectedShapeId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Palette className="w-4 h-4 text-amber-200" /> Stage 7: Creative Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">MY CREATIVE POLYGON STUDIO</h1>
          <p className="text-amber-100 text-sm mt-1">
            Choose your shapes, explore your ideas and create something amazing!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGalleryModal(true)}
            className="py-2.5 px-4 bg-white hover:bg-amber-100 text-amber-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4 text-amber-600" />
            <span>PATTERN INSPIRATION GALLERY</span>
          </button>
          <PikoMascot mood="excited" size="sm" />
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
                Clear Canvas
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
          {/* Active Shape Editing Toolbar */}
          {activeShape && (
            <div className="bg-amber-50 border-2 border-amber-300 p-3 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-2 animate-bounce-subtle">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-black text-amber-950 uppercase">
                  Editing {activeShape.type}:
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => updateSelectedShape((s) => ({ ...s, rotation: (s.rotation - 15 + 360) % 360 }))}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-700 cursor-pointer"
                  title="Rotate Counterclockwise"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Rotate Left
                </button>

                <button
                  onClick={() => updateSelectedShape((s) => ({ ...s, rotation: (s.rotation + 15) % 360 }))}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-700 cursor-pointer"
                  title="Rotate Clockwise"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Rotate Right
                </button>

                <button
                  onClick={duplicateSelectedShape}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-700 cursor-pointer"
                  title="Duplicate Shape"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>

                <button
                  onClick={bringToFront}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-700 cursor-pointer"
                  title="Bring to Front"
                >
                  <MoveUp className="w-3.5 h-3.5" /> Bring to Front
                </button>

                <button
                  onClick={sendToBack}
                  className="px-2.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1 text-slate-700 cursor-pointer"
                  title="Send to Back"
                >
                  <MoveDown className="w-3.5 h-3.5" /> Send to Back
                </button>

                <button
                  onClick={removeSelectedShape}
                  className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  title="Delete Shape"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

                <button
                  onClick={() => setSelectedShapeId(null)}
                  className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  title="Deselect Shape"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div
            ref={canvasRef}
            onClick={() => setSelectedShapeId(null)}
            className="relative w-full h-[420px] bg-slate-50 rounded-3xl border-4 border-amber-300 shadow-inner overflow-hidden select-none"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              touchAction: 'none' // Prevent scrolling on touch devices during drag
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
                    onPointerDown={(e) => handlePointerDown(e, shape)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{
                      left: `${shape.x}px`,
                      top: `${shape.y}px`,
                      width: `${size}px`,
                      height: `${size}px`,
                      transform: `rotate(${shape.rotation}deg)`,
                      willChange: 'transform, left, top',
                      touchAction: 'none'
                    }}
                    className={`absolute cursor-grab active:cursor-grabbing select-none ${
                      isSelected
                        ? 'z-30 drop-shadow-xl ring-2 ring-amber-400 ring-offset-2 rounded-xl'
                        : 'z-10 hover:scale-105'
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
          {shapes.length >= 3 && (
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
                  onUpdateShapes([]);
                  setSelectedShapeId(null);
                  setShowGalleryModal(false);
                }}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                CREATE MY OWN (BLANK CANVAS)
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
