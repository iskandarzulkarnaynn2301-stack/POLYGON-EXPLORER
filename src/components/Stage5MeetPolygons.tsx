import React, { useState } from 'react';
import { POLYGON_INFO } from '../utils/geometry';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { PikoMascot } from './PikoMascot';
import { ArrowRight, CheckCircle2, Flower2, Info, Eye } from 'lucide-react';

interface Stage5MeetPolygonsProps {
  exploredPolygons: string[];
  onPolygonExplored: (polygonKey: string) => void;
  onCompleteMeetStage: () => void;
}

export const Stage5MeetPolygons: React.FC<Stage5MeetPolygonsProps> = ({
  exploredPolygons,
  onPolygonExplored,
  onCompleteMeetStage
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('pentagon');
  const [highlightMode, setHighlightMode] = useState<'sides' | 'vertices' | 'both'>('both');

  const polygonKeys = ['pentagon', 'hexagon', 'heptagon', 'octagon'];
  const currentPoly = POLYGON_INFO[selectedKey];

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    onPolygonExplored(key);
  };

  const allExplored = polygonKeys.every((k) => exploredPolygons.includes(k));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Flower2 className="w-4 h-4 text-emerald-200" /> Stage 5: Polygon Garden
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">MEET THE POLYGONS</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Learning Standard 7.3.1 — Pentagon, Hexagon, Heptagon & Octagon
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-xs uppercase text-emerald-200 font-bold block">Explored</span>
          <span className="text-xl font-black">
            {exploredPolygons.length} / 4 Shapes
          </span>
        </div>
      </div>

      {/* General Learning Explanation Box */}
      <div className="bg-amber-50 rounded-3xl p-5 border-3 border-amber-300 shadow-sm flex items-start gap-4">
        <div className="p-2 bg-amber-400 text-amber-950 rounded-2xl shrink-0 mt-1">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-amber-950 text-base sm:text-lg mb-1">
            What is a Regular Polygon?
          </h3>
          <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
            “A regular polygon has straight sides of equal length. Let's explore the shapes and discover how their sides and vertices help us identify them!”
          </p>
        </div>
      </div>

      {/* Grid of 4 Interactive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {polygonKeys.map((key) => {
          const info = POLYGON_INFO[key];
          const isSelected = selectedKey === key;
          const isExplored = exploredPolygons.includes(key);

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`p-4 rounded-3xl border-3 text-center transition-all flex flex-col items-center justify-between gap-3 cursor-pointer relative ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105 ring-4 ring-emerald-200'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              {isExplored && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <PolygonSvgPreview
                type={key as any}
                size={90}
                fillColor={info.color}
              />

              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{info.name}</h3>
                <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 inline-block mt-1">
                  {info.sides} Sides & Vertices
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Inspector for Selected Polygon */}
      {currentPoly && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-300 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* SVG Shape Inspection Display */}
          <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Interactive Polygon Inspector
              </span>
            </div>

            <PolygonSvgPreview
              type={selectedKey as any}
              size={220}
              fillColor={currentPoly.color}
              highlightSides={highlightMode === 'sides' || highlightMode === 'both'}
              highlightVertices={highlightMode === 'vertices' || highlightMode === 'both'}
            />

            {/* Inspection Controls Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setHighlightMode('sides')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  highlightMode === 'sides'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                Highlight Sides
              </button>
              <button
                onClick={() => setHighlightMode('vertices')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  highlightMode === 'vertices'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                Highlight Vertices
              </button>
              <button
                onClick={() => setHighlightMode('both')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  highlightMode === 'both'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                Show Both
              </button>
            </div>
          </div>

          {/* Polygon Details & Mascot Feedback */}
          <div className="space-y-6">
            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-300">
                {currentPoly.badge}
              </span>
              <h2 className="text-3xl font-black text-slate-800 mt-2">
                Regular {currentPoly.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 text-center">
                <span className="text-3xl font-black text-amber-600 block">{currentPoly.sides}</span>
                <span className="text-xs font-bold text-amber-900 uppercase">Straight Sides</span>
              </div>
              <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-300 text-center">
                <span className="text-3xl font-black text-rose-600 block">{currentPoly.vertices}</span>
                <span className="text-xs font-bold text-rose-900 uppercase">Vertices (Corners)</span>
              </div>
            </div>

            <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {currentPoly.description}
            </p>

            <PikoMascot
              mood="excited"
              size="md"
              message={`Notice how a regular ${currentPoly.name.toLowerCase()} has ${currentPoly.sides} equal straight sides and ${currentPoly.vertices} vertices!`}
            />
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {allExplored && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-subtle">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-black">GREAT EXPLORING! LET'S DISCOVER THE PROPERTIES!</h3>
            <p className="text-emerald-100 text-sm font-medium">
              You have met all 4 polygon families in the garden!
            </p>
          </div>

          <button
            onClick={onCompleteMeetStage}
            className="py-4 px-8 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>CONTINUE TO DISCOVERY LAB</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
