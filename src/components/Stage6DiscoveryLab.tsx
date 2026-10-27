import React, { useState } from 'react';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { PikoMascot } from './PikoMascot';
import { getPolygonPoints } from '../utils/geometry';
import { ArrowRight, CheckCircle2, Microscope, RotateCw, Check, X } from 'lucide-react';

interface Stage6DiscoveryLabProps {
  onCompleteDiscovery: () => void;
}

export const Stage6DiscoveryLab: React.FC<Stage6DiscoveryLabProps> = ({
  onCompleteDiscovery
}) => {
  const [activeTab, setActiveTab] = useState<'count' | 'classify' | 'rotate'>('count');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  // Activity A state
  const [countShapeIndex, setCountShapeIndex] = useState(0);
  const countShapes: Array<{ key: string; name: string; sides: number; type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon' }> = [
    { key: 'p1', name: 'Pentagon', sides: 5, type: 'pentagon' },
    { key: 'p2', name: 'Hexagon', sides: 6, type: 'hexagon' },
    { key: 'p3', name: 'Octagon', sides: 8, type: 'octagon' }
  ];
  const [clickedElements, setClickedElements] = useState<number[]>([]);
  const [countFeedback, setCountFeedback] = useState<string>('');
  const [countSuccess, setCountSuccess] = useState(false);

  // Activity B state
  const [classifyIndex, setClassifyIndex] = useState(0);
  const classifyShapes = [
    {
      id: 'c1',
      title: 'Shape A',
      type: 'hexagon' as const,
      isRegular: true,
      explanation: 'All 6 sides are straight and equal in length, so it is a Regular Hexagon!'
    },
    {
      id: 'c2',
      title: 'Shape B',
      type: 'irregular_hexagon' as const,
      isRegular: false,
      explanation: 'Look carefully! The sides have unequal lengths, so it is an Irregular Hexagon!'
    },
    {
      id: 'c3',
      title: 'Shape C',
      type: 'pentagon' as const,
      isRegular: true,
      explanation: 'All 5 sides are straight and equal in length, so it is a Regular Pentagon!'
    },
    {
      id: 'c4',
      title: 'Shape D',
      type: 'irregular_pentagon' as const,
      isRegular: false,
      explanation: 'The sides are unequal in length, so it is an Irregular Pentagon!'
    }
  ];
  const [selectedClass, setSelectedClass] = useState<boolean | null>(null);
  const [classifyFeedback, setClassifyFeedback] = useState<string>('');

  // Activity C state
  const [rotateIndex, setRotateIndex] = useState(0);
  const rotateShapes = [
    {
      id: 'r1',
      title: 'Rotated Shape 1',
      type: 'rotated_pentagon' as const,
      rotation: 72,
      correctName: 'Pentagon',
      options: ['Pentagon (5 sides)', 'Hexagon (6 sides)', 'Octagon (8 sides)'],
      explanation: 'Correct! Turning a pentagon around does not change its 5 sides. It is still a Pentagon!'
    },
    {
      id: 'r2',
      title: 'Rotated Shape 2',
      type: 'rotated_heptagon' as const,
      rotation: 90,
      correctName: 'Heptagon',
      options: ['Hexagon (6 sides)', 'Heptagon (7 sides)', 'Octagon (8 sides)'],
      explanation: 'Correct! Rotating a shape does not change its number of sides. It still has 7 sides, so it is a Heptagon!'
    },
    {
      id: 'r3',
      title: 'Rotated Shape 3',
      type: 'rotated_octagon' as const,
      rotation: 67.5,
      correctName: 'Octagon',
      options: ['Heptagon (7 sides)', 'Octagon (8 sides)', 'Pentagon (5 sides)'],
      explanation: 'Correct! Orientation does not affect polygon properties. It has 8 sides, so it is an Octagon!'
    }
  ];
  const [rotateSelected, setRotateSelected] = useState<string | null>(null);
  const [rotateFeedback, setRotateFeedback] = useState<string>('');

  // Activity A Element Click Handler
  const handleElementClick = (idx: number) => {
    if (clickedElements.includes(idx)) {
      setClickedElements(clickedElements.filter((i) => i !== idx));
    } else {
      setClickedElements([...clickedElements, idx]);
    }
  };

  const verifyCount = () => {
    const currentShape = countShapes[countShapeIndex];
    if (clickedElements.length === currentShape.sides) {
      setCountSuccess(true);
      setCountFeedback(`Excellent! You counted all ${currentShape.sides} elements correctly!`);
      if (!completedActivities.includes('count')) {
        setCompletedActivities([...completedActivities, 'count']);
      }
    } else if (clickedElements.length < currentShape.sides) {
      setCountFeedback(`Almost there! You counted ${clickedElements.length}. Try to count all ${currentShape.sides} elements!`);
    } else {
      setCountFeedback(`You counted ${clickedElements.length}. Be careful to click each element only once!`);
    }
  };

  const handleNextCountShape = () => {
    if (countShapeIndex < countShapes.length - 1) {
      setCountShapeIndex(countShapeIndex + 1);
      setClickedElements([]);
      setCountFeedback('');
      setCountSuccess(false);
    }
  };

  // Activity B Classification Handler
  const handleClassifyChoice = (choiceIsRegular: boolean) => {
    const current = classifyShapes[classifyIndex];
    setSelectedClass(choiceIsRegular);

    if (choiceIsRegular === current.isRegular) {
      setClassifyFeedback(`Correct! ${current.explanation}`);
      if (!completedActivities.includes('classify')) {
        setCompletedActivities([...completedActivities, 'classify']);
      }
    } else {
      setClassifyFeedback(`Look carefully! ${current.explanation}`);
    }
  };

  const handleNextClassify = () => {
    if (classifyIndex < classifyShapes.length - 1) {
      setClassifyIndex(classifyIndex + 1);
      setSelectedClass(null);
      setClassifyFeedback('');
    }
  };

  // Activity C Rotation Choice Handler
  const handleRotateChoice = (opt: string) => {
    const current = rotateShapes[rotateIndex];
    setRotateSelected(opt);

    if (opt.toLowerCase().includes(current.correctName.toLowerCase())) {
      setRotateFeedback(`Great job! ${current.explanation}`);
      if (!completedActivities.includes('rotate')) {
        setCompletedActivities([...completedActivities, 'rotate']);
      }
    } else {
      setRotateFeedback(`Not quite! Count the straight sides carefully. ${current.explanation}`);
    }
  };

  const handleNextRotate = () => {
    if (rotateIndex < rotateShapes.length - 1) {
      setRotateIndex(rotateIndex + 1);
      setRotateSelected(null);
      setRotateFeedback('');
    }
  };

  const allLabComplete = ['count', 'classify', 'rotate'].every((act) => completedActivities.includes(act));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Microscope className="w-4 h-4 text-purple-200" /> Stage 6: Discovery Lab
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">EXPLORE THE PROPERTIES</h1>
          <p className="text-purple-100 text-sm mt-1">
            Understand Polygon Characteristics & Orientation Invariance
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-xs uppercase text-purple-200 font-bold block">Activities</span>
          <span className="text-xl font-black">
            {completedActivities.length} / 3 Completed
          </span>
        </div>
      </div>

      {/* Activity Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border-2 border-purple-200 shadow-sm">
        <button
          onClick={() => setActiveTab('count')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'count'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>A. Count Sides & Vertices</span>
          {completedActivities.includes('count') && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab('classify')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'classify'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>B. Regular or Irregular?</span>
          {completedActivities.includes('classify') && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab('rotate')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'rotate'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>C. Same Shape, Different Position</span>
          {completedActivities.includes('rotate') && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>
      </div>

      {/* ACTIVITY A — Interactive Side / Vertex Counting */}
      {activeTab === 'count' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <span className="text-xs font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full">
                Activity A — Interactive Counting
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                Count the Sides & Vertices of {countShapes[countShapeIndex].name}
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-500">
              Shape {countShapeIndex + 1} of {countShapes.length}
            </span>
          </div>

          <p className="text-slate-600 text-sm font-semibold">
            👇 Click on each vertex (dot) below to count them!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Interactive SVG vertices clickable canvas */}
            <div className="flex flex-col items-center justify-center bg-purple-50/50 p-6 rounded-3xl border-2 border-purple-100">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <PolygonSvgPreview
                  type={countShapes[countShapeIndex].type}
                  size={240}
                  fillColor="#8b5cf6"
                />

                {/* Overlay clickable vertex handles */}
                {(() => {
                  const pts = getPolygonPoints(countShapes[countShapeIndex].sides, 90, { x: 120, y: 120 }, 0, true);
                  return pts.map((p, idx) => {
                    const isClicked = clickedElements.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleElementClick(idx)}
                        style={{ left: `${p.x - 16}px`, top: `${p.y - 16}px` }}
                        className={`absolute w-8 h-8 rounded-full border-2 font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                          isClicked
                            ? 'bg-amber-400 text-amber-950 border-amber-600 scale-125 shadow-md'
                            : 'bg-white text-purple-700 border-purple-500 hover:scale-110'
                        }`}
                      >
                        {isClicked ? idx + 1 : '•'}
                      </button>
                    );
                  });
                })()}
              </div>

              <div className="mt-4 bg-white px-4 py-2 rounded-2xl border border-purple-200 text-center">
                <span className="text-xs text-slate-500 font-bold block">Vertices Counted</span>
                <span className="text-2xl font-black text-purple-700">
                  {clickedElements.length} / {countShapes[countShapeIndex].sides}
                </span>
              </div>
            </div>

            {/* Verification and Mascot Feedback */}
            <div className="space-y-4">
              <PikoMascot
                mood={countSuccess ? 'celebrating' : 'thinking'}
                size="md"
                message={countFeedback || `Count each corner carefully. A ${countShapes[countShapeIndex].name.toLowerCase()} should have ${countShapes[countShapeIndex].sides} vertices!`}
              />

              <div className="flex flex-col gap-3">
                <button
                  onClick={verifyCount}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-base rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  CHECK MY COUNT
                </button>

                {countSuccess && countShapeIndex < countShapes.length - 1 && (
                  <button
                    onClick={handleNextCountShape}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>NEXT SHAPE ➔</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY B — Regular or Irregular Classification */}
      {activeTab === 'classify' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <span className="text-xs font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full">
                Activity B — Regular vs Irregular
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                Is this a REGULAR or IRREGULAR Polygon?
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-500">
              {classifyIndex + 1} of {classifyShapes.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Polygon Visual */}
            <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 space-y-2">
              <PolygonSvgPreview
                type={classifyShapes[classifyIndex].type}
                size={200}
                fillColor={classifyShapes[classifyIndex].isRegular ? '#10b981' : '#f59e0b'}
              />
              <span className="text-sm font-bold text-slate-700">{classifyShapes[classifyIndex].title}</span>
            </div>

            {/* Selection Buttons and Explanation */}
            <div className="space-y-4">
              <PikoMascot
                mood={selectedClass !== null ? 'happy' : 'thinking'}
                size="md"
                message={classifyFeedback || "Remember: Regular polygons have all straight sides EQUAL in length!"}
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleClassifyChoice(true)}
                  className={`p-4 rounded-2xl border-3 font-extrabold text-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    selectedClass === true
                      ? 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-800'
                  }`}
                >
                  <Check className="w-6 h-6 text-emerald-600" />
                  <span>REGULAR POLYGON</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Equal side lengths)</span>
                </button>

                <button
                  onClick={() => handleClassifyChoice(false)}
                  className={`p-4 rounded-2xl border-3 font-extrabold text-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    selectedClass === false
                      ? 'border-amber-600 bg-amber-100 text-amber-950 shadow-md'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50 text-slate-800'
                  }`}
                >
                  <X className="w-6 h-6 text-amber-600" />
                  <span>IRREGULAR POLYGON</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Unequal side lengths)</span>
                </button>
              </div>

              {selectedClass !== null && classifyIndex < classifyShapes.length - 1 && (
                <button
                  onClick={handleNextClassify}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>NEXT SHAPE ➔</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY C — Same Shape, Different Position (Orientation Invariance) */}
      {activeTab === 'rotate' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <span className="text-xs font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full">
                Activity C — Orientation Invariance
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">
                Same Shape, Different Position!
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-500">
              {rotateIndex + 1} of {rotateShapes.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Rotated Shape Visual */}
            <div className="flex flex-col items-center justify-center bg-purple-50/50 p-6 rounded-3xl border-2 border-purple-100 space-y-3">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase">
                <RotateCw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} /> Rotated View
              </div>

              <PolygonSvgPreview
                type={rotateShapes[rotateIndex].type}
                rotation={rotateShapes[rotateIndex].rotation}
                size={200}
                fillColor="#6366f1"
              />

              <span className="text-xs font-semibold text-slate-500">
                Notice: The shape has been rotated!
              </span>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <PikoMascot
                mood={rotateSelected ? 'happy' : 'thinking'}
                size="md"
                message={rotateFeedback || "Count the straight sides! Rotating a polygon does NOT change its name or number of sides!"}
              />

              <div className="space-y-2">
                {rotateShapes[rotateIndex].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleRotateChoice(opt)}
                    className={`w-full p-4 rounded-2xl border-3 text-left font-extrabold text-base transition-all flex items-center justify-between cursor-pointer ${
                      rotateSelected === opt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span>{opt}</span>
                    {rotateSelected === opt && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>

              {rotateSelected && rotateIndex < rotateShapes.length - 1 && (
                <button
                  onClick={handleNextRotate}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>NEXT SHAPE ➔</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lab Completion Banner */}
      {allLabComplete && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-subtle">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-black">DISCOVERY LAB COMPLETE! LET'S CREATE PATTERNS!</h3>
            <p className="text-purple-100 text-sm font-medium">
              You understand polygon characteristics and orientations! Ready for the studio?
            </p>
          </div>

          <button
            onClick={onCompleteDiscovery}
            className="py-4 px-8 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>GO TO PATTERN WORKSHOP</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
