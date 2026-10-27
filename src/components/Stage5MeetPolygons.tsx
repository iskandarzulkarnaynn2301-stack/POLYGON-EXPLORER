import React, { useState } from 'react';
import { POLYGON_INFO } from '../utils/geometry';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { PikoMascot } from './PikoMascot';
import { ArrowRight, CheckCircle2, Flower2, Info, Eye, Check, X, Sparkles, HelpCircle } from 'lucide-react';

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

  // "Remember the Rules" activity state
  const [ruleAnswers, setRuleAnswers] = useState<Record<number, boolean | null>>({});
  const [ruleFeedback, setRuleFeedback] = useState<Record<number, string>>({});

  const polygonKeys = ['pentagon', 'hexagon', 'heptagon', 'octagon'];
  const currentPoly = POLYGON_INFO[selectedKey];

  const handleSelect = (key: string) => {
    setSelectedKey(key);
    onPolygonExplored(key);
  };

  const handleRuleChoice = (qIndex: number, choice: boolean, correctChoice: boolean, explanation: string) => {
    setRuleAnswers((prev) => ({ ...prev, [qIndex]: choice }));
    if (choice === correctChoice) {
      setRuleFeedback((prev) => ({ ...prev, [qIndex]: `✓ Correct! ${explanation}` }));
    } else {
      setRuleFeedback((prev) => ({ ...prev, [qIndex]: `Look carefully! ${explanation}` }));
    }
  };

  const allExplored = polygonKeys.every((k) => exploredPolygons.includes(k));

  const ruleQuestions = [
    {
      id: 0,
      question: 'Do all straight sides of a regular polygon have equal lengths?',
      correctChoice: true,
      explanation: 'All sides of a regular polygon are straight and equal in length!'
    },
    {
      id: 1,
      question: 'Does a regular polygon have curved sides?',
      correctChoice: false,
      explanation: 'Regular polygons NEVER have curved sides! They only have straight sides.'
    },
    {
      id: 2,
      question: 'Is a regular polygon a flat 2D shape?',
      correctChoice: true,
      explanation: 'Regular polygons are flat shapes with 1 flat surface.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
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

      {/* Prominent Textbook Learning Panel: WHAT MAKES A REGULAR POLYGON? */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
          <div className="p-3 bg-amber-400 text-amber-950 rounded-2xl shrink-0 shadow-sm">
            <Info className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
              Malaysian Year 3 Textbook Concept
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              WHAT MAKES A REGULAR POLYGON?
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Characteristic A: Equal Straight Sides */}
          <div className="bg-amber-50/80 p-5 rounded-2xl border-2 border-amber-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 font-black text-xs flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="font-extrabold text-slate-800 text-base">Equal Straight Sides</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Has 3 or more straight sides of equal length.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-amber-200 flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <PolygonSvgPreview type="hexagon" size={80} fillColor="#10b981" highlightSides={true} />
              </div>
              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                All sides straight & equal
              </span>
            </div>
          </div>

          {/* Characteristic B: One Flat Surface */}
          <div className="bg-teal-50/80 p-5 rounded-2xl border-2 border-teal-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="font-extrabold text-slate-800 text-base">One Flat Surface</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                A regular polygon is a flat 2D shape.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-teal-200 flex flex-col items-center text-center space-y-2">
              <PolygonSvgPreview type="pentagon" size={80} fillColor="#3b82f6" />
              <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                1 Flat Surface
              </span>
            </div>
          </div>

          {/* Characteristic C: No Curved Sides */}
          <div className="bg-rose-50/80 p-5 rounded-2xl border-2 border-rose-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="font-extrabold text-slate-800 text-base">No Curved Sides</h3>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Never contains curved or wavy boundaries.
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-rose-200 flex flex-col items-center text-center space-y-2">
              <PolygonSvgPreview type="octagon" size={80} fillColor="#f59e0b" />
              <span className="text-[11px] font-extrabold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full">
                Zero curved sides
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 4 Interactive Cards */}
      <div className="space-y-3">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" /> Tap a Shape to Explore Its Properties
        </h3>
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

          {/* Polygon Details & Textbook Matching Explanations */}
          <div className="space-y-5">
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
                <span className="text-xs font-bold text-amber-900 uppercase">Equal Straight Sides</span>
              </div>
              <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-300 text-center">
                <span className="text-3xl font-black text-rose-600 block">{currentPoly.vertices}</span>
                <span className="text-xs font-bold text-rose-900 uppercase">Vertices (Corners)</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
              <p className="font-bold text-slate-800">
                ✓ Meets all 3 Regular Polygon Textbook Rules:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Has <strong>{currentPoly.sides} straight sides</strong> of equal length.</li>
                <li>Has <strong>1 flat 2D surface</strong>.</li>
                <li>Contains <strong>zero curved sides</strong>.</li>
              </ul>
            </div>

            <PikoMascot
              mood="excited"
              size="md"
              message={`A regular ${currentPoly.name.toLowerCase()} has ${currentPoly.sides} equal straight sides and ${currentPoly.vertices} vertices!`}
            />
          </div>
        </div>
      )}

      {/* Interactive Quick Activity: "REMEMBER THE RULES" */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border-3 border-indigo-200 shadow-md space-y-5">
        <div className="flex items-center gap-3 border-b border-indigo-100 pb-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xs">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-2.5 py-0.5 rounded-full">
              Quick Practice
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">
              REMEMBER THE RULES!
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          Answer these 3 quick questions to test your textbook knowledge:
        </p>

        <div className="space-y-4">
          {ruleQuestions.map((q) => {
            const userChoice = ruleAnswers[q.id];
            const feedback = ruleFeedback[q.id];

            return (
              <div key={q.id} className="bg-white p-4 rounded-2xl border-2 border-indigo-100 space-y-3">
                <p className="font-extrabold text-slate-800 text-sm sm:text-base">
                  {q.id + 1}. {q.question}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleRuleChoice(q.id, true, q.correctChoice, q.explanation)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      userChoice === true
                        ? q.correctChoice === true
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-rose-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-100'
                    }`}
                  >
                    <Check className="w-4 h-4" /> YES / TRUE
                  </button>

                  <button
                    onClick={() => handleRuleChoice(q.id, false, q.correctChoice, q.explanation)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      userChoice === false
                        ? q.correctChoice === false
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-rose-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-100'
                    }`}
                  >
                    <X className="w-4 h-4" /> NO / FALSE
                  </button>
                </div>

                {feedback && (
                  <p
                    className={`text-xs font-bold p-2.5 rounded-xl border ${
                      userChoice === q.correctChoice
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}
                  >
                    {feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

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
