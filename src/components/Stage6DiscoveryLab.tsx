import React, { useState } from 'react';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { PikoMascot } from './PikoMascot';
import { getPolygonPoints, pointsToSvgPointsString } from '../utils/geometry';
import { ArrowRight, CheckCircle2, Microscope, RotateCw, Check, X, Search } from 'lucide-react';

interface Stage6DiscoveryLabProps {
  onCompleteDiscovery: () => void;
}

export const Stage6DiscoveryLab: React.FC<Stage6DiscoveryLabProps> = ({
  onCompleteDiscovery
}) => {
  const [activeTab, setActiveTab] = useState<'count' | 'classify' | 'rotate' | 'detective'>('count');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  // Activity A state
  const [countShapeIndex, setCountShapeIndex] = useState(0);
  const countShapes: Array<{
    key: string;
    name: string;
    prompt: string;
    type: 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';
    targetCount: number;
    mode: 'vertices' | 'sides';
  }> = [
    { key: 'p1', name: 'Pentagon', prompt: 'How many straight sides does this regular pentagon have?', type: 'pentagon', targetCount: 5, mode: 'sides' },
    { key: 'p2', name: 'Hexagon', prompt: 'Tap each vertex (corner dot) of this regular hexagon to count them!', type: 'hexagon', targetCount: 6, mode: 'vertices' },
    { key: 'p3', name: 'Heptagon', prompt: 'How many vertices can you count in this regular heptagon?', type: 'heptagon', targetCount: 7, mode: 'vertices' },
    { key: 'p4', name: 'Octagon', prompt: 'Which number matches the total straight sides of this octagon?', type: 'octagon', targetCount: 8, mode: 'sides' }
  ];
  const [clickedElements, setClickedElements] = useState<number[]>([]);
  const [countFeedback, setCountFeedback] = useState<string>('');
  const [countState, setCountState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');

  // Activity B state
  const [classifyIndex, setClassifyIndex] = useState(0);
  const classifyShapes = [
    {
      id: 'c1',
      title: 'Shape A',
      type: 'hexagon' as const,
      isRegular: true,
      prompt: 'Is this polygon a Regular Hexagon or an Irregular Polygon?',
      explanation: 'All 6 sides are straight and equal in length, so it is a Regular Hexagon!'
    },
    {
      id: 'c2',
      title: 'Shape B',
      type: 'irregular_hexagon' as const,
      isRegular: false,
      prompt: 'Is this polygon Regular or Irregular?',
      explanation: 'Look carefully! The sides have unequal lengths, so it is an Irregular Hexagon!'
    },
    {
      id: 'c3',
      title: 'Shape C',
      type: 'pentagon' as const,
      isRegular: true,
      prompt: 'Does this pentagon meet the rule for a Regular Polygon?',
      explanation: 'Yes! All 5 sides are straight and equal in length.'
    },
    {
      id: 'c4',
      title: 'Shape D',
      type: 'irregular_pentagon' as const,
      isRegular: false,
      prompt: 'Tap the classification for this pentagon with unequal sides:',
      explanation: 'The sides are unequal in length, so it is an Irregular Polygon!'
    }
  ];
  const [selectedClass, setSelectedClass] = useState<boolean | null>(null);
  const [classifyState, setClassifyState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');
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
      prompt: 'Which shape is still a regular pentagon after turning?',
      options: ['Pentagon (5 sides)', 'Hexagon (6 sides)', 'Octagon (8 sides)'],
      explanation: 'Turning a pentagon around does not change its 5 sides. It is still a Pentagon!'
    },
    {
      id: 'r2',
      title: 'Rotated Shape 2',
      type: 'rotated_heptagon' as const,
      rotation: 90,
      correctName: 'Heptagon',
      prompt: 'Did the number of sides change when this polygon was rotated?',
      options: ['Hexagon (6 sides)', 'Heptagon (7 sides)', 'Octagon (8 sides)'],
      explanation: 'Rotating a shape does not change its number of sides. It still has 7 sides!'
    },
    {
      id: 'r3',
      title: 'Rotated Shape 3',
      type: 'rotated_octagon' as const,
      rotation: 67.5,
      correctName: 'Octagon',
      prompt: 'Find the octagon shown in a different position:',
      options: ['Heptagon (7 sides)', 'Octagon (8 sides)', 'Pentagon (5 sides)'],
      explanation: 'Orientation does not affect polygon properties. It has 8 sides, so it is an Octagon!'
    }
  ];
  const [rotateSelected, setRotateSelected] = useState<string | null>(null);
  const [rotateState, setRotateState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');
  const [rotateFeedback, setRotateFeedback] = useState<string>('');

  // Activity D — Polygon Detective State
  const [detectiveIndex, setDetectiveIndex] = useState(0);
  const detectiveClues = [
    {
      id: 'd1',
      clue: '“I have 5 straight sides of equal length and 5 vertices. Who am I?”',
      correctKey: 'pentagon',
      options: [
        { key: 'pentagon', name: 'Regular Pentagon', sides: 5 },
        { key: 'hexagon', name: 'Regular Hexagon', sides: 6 },
        { key: 'octagon', name: 'Regular Octagon', sides: 8 }
      ],
      explanation: 'A regular polygon with 5 equal straight sides is a Pentagon!'
    },
    {
      id: 'd2',
      clue: '“I have 7 vertices (corners). Which regular polygon am I?”',
      correctKey: 'heptagon',
      options: [
        { key: 'hexagon', name: 'Regular Hexagon', sides: 6 },
        { key: 'heptagon', name: 'Regular Heptagon', sides: 7 },
        { key: 'octagon', name: 'Regular Octagon', sides: 8 }
      ],
      explanation: 'A polygon with 7 vertices is a Heptagon!'
    },
    {
      id: 'd3',
      clue: '“I have 8 straight sides of equal length. Find me!”',
      correctKey: 'octagon',
      options: [
        { key: 'pentagon', name: 'Regular Pentagon', sides: 5 },
        { key: 'heptagon', name: 'Regular Heptagon', sides: 7 },
        { key: 'octagon', name: 'Regular Octagon', sides: 8 }
      ],
      explanation: 'A polygon with 8 equal straight sides is an Octagon!'
    },
    {
      id: 'd4',
      clue: '“Which regular polygon has MORE sides: a Pentagon (5) or a Hexagon (6)?”',
      correctKey: 'hexagon',
      options: [
        { key: 'pentagon', name: 'Pentagon (5 sides)', sides: 5 },
        { key: 'hexagon', name: 'Hexagon (6 sides)', sides: 6 }
      ],
      explanation: 'A Hexagon has 6 sides, which is more than a Pentagon (5 sides)!'
    }
  ];
  const [detectiveChoice, setDetectiveChoice] = useState<string | null>(null);
  const [detectiveState, setDetectiveState] = useState<'neutral' | 'correct' | 'incorrect'>('neutral');
  const [detectiveFeedback, setDetectiveFeedback] = useState<string>('');

  // Activity A Element Click Handler
  const handleElementClick = (idx: number) => {
    if (countState !== 'neutral') return;
    if (clickedElements.includes(idx)) {
      setClickedElements(clickedElements.filter((i) => i !== idx));
    } else {
      setClickedElements([...clickedElements, idx]);
    }
  };

  const verifyCount = () => {
    const currentShape = countShapes[countShapeIndex];
    if (clickedElements.length === currentShape.targetCount) {
      setCountState('correct');
      setCountFeedback(`Correct! Excellent job! You counted all ${currentShape.targetCount} ${currentShape.mode} correctly!`);
    } else {
      setCountState('incorrect');
      setCountFeedback(`Notice: A ${currentShape.name} has exactly ${currentShape.targetCount} ${currentShape.mode}.`);
    }

    if (!completedActivities.includes('count')) {
      setCompletedActivities([...completedActivities, 'count']);
    }
  };

  const handleNextCountShape = () => {
    if (countShapeIndex < countShapes.length - 1) {
      setCountShapeIndex(countShapeIndex + 1);
      setClickedElements([]);
      setCountFeedback('');
      setCountState('neutral');
    }
  };

  // Activity B Classification Handler — SINGLE ATTEMPT WITH IMMEDIATE FEEDBACK
  const handleClassifyChoice = (choiceIsRegular: boolean) => {
    if (classifyState !== 'neutral') return;
    const current = classifyShapes[classifyIndex];
    setSelectedClass(choiceIsRegular);

    if (choiceIsRegular === current.isRegular) {
      setClassifyState('correct');
      setClassifyFeedback(`Correct! ${current.explanation}`);
    } else {
      setClassifyState('incorrect');
      const correctName = current.isRegular ? 'Regular Polygon' : 'Irregular Polygon';
      setClassifyFeedback(`Incorrect. The correct answer is ${correctName}. ${current.explanation}`);
    }

    if (!completedActivities.includes('classify')) {
      setCompletedActivities([...completedActivities, 'classify']);
    }
  };

  const handleNextClassify = () => {
    if (classifyIndex < classifyShapes.length - 1) {
      setClassifyIndex(classifyIndex + 1);
      setSelectedClass(null);
      setClassifyState('neutral');
      setClassifyFeedback('');
    }
  };

  // Activity C Rotation Choice Handler — SINGLE ATTEMPT WITH IMMEDIATE FEEDBACK
  const handleRotateChoice = (opt: string) => {
    if (rotateState !== 'neutral') return;
    const current = rotateShapes[rotateIndex];
    setRotateSelected(opt);

    const isCorrect = opt.toLowerCase().includes(current.correctName.toLowerCase());

    if (isCorrect) {
      setRotateState('correct');
      setRotateFeedback(`Correct! Excellent! ${current.explanation}`);
    } else {
      setRotateState('incorrect');
      setRotateFeedback(`Incorrect. The correct answer is ${current.correctName}. ${current.explanation}`);
    }

    if (!completedActivities.includes('rotate')) {
      setCompletedActivities([...completedActivities, 'rotate']);
    }
  };

  const handleNextRotate = () => {
    if (rotateIndex < rotateShapes.length - 1) {
      setRotateIndex(rotateIndex + 1);
      setRotateSelected(null);
      setRotateState('neutral');
      setRotateFeedback('');
    }
  };

  // Activity D Detective Handler — SINGLE ATTEMPT WITH IMMEDIATE FEEDBACK
  const handleDetectiveChoice = (key: string) => {
    if (detectiveState !== 'neutral') return;
    const current = detectiveClues[detectiveIndex];
    setDetectiveChoice(key);

    const isCorrect = key === current.correctKey;

    if (isCorrect) {
      setDetectiveState('correct');
      setDetectiveFeedback(`Correct! Great Detective Work! ${current.explanation}`);
    } else {
      setDetectiveState('incorrect');
      const correctOptName = current.options.find((o) => o.key === current.correctKey)?.name || current.correctKey;
      setDetectiveFeedback(`Incorrect. The correct shape is ${correctOptName}. ${current.explanation}`);
    }

    if (!completedActivities.includes('detective')) {
      setCompletedActivities([...completedActivities, 'detective']);
    }
  };

  const handleNextDetective = () => {
    if (detectiveIndex < detectiveClues.length - 1) {
      setDetectiveIndex(detectiveIndex + 1);
      setDetectiveChoice(null);
      setDetectiveState('neutral');
      setDetectiveFeedback('');
    }
  };

  const allLabComplete = ['count', 'classify', 'rotate', 'detective'].every((act) => completedActivities.includes(act));

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
            {completedActivities.length} / 4 Completed
          </span>
        </div>
      </div>

      {/* Activity Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border-2 border-purple-200 shadow-sm">
        <button
          onClick={() => setActiveTab('count')}
          className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'count'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>A. Count Properties</span>
          {completedActivities.includes('count') && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab('classify')}
          className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'classify'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>B. Regular or Irregular</span>
          {completedActivities.includes('classify') && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab('rotate')}
          className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'rotate'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>C. Rotated Shapes</span>
          {completedActivities.includes('rotate') && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>

        <button
          onClick={() => setActiveTab('detective')}
          className={`flex-1 min-w-[130px] py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'detective'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-purple-50'
          }`}
        >
          <span>D. Polygon Detective</span>
          {completedActivities.includes('detective') && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
        </button>
      </div>

      {/* ACTIVITY A — Interactive Side / Vertex Counting */}
      {activeTab === 'count' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <span className="text-xs font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full">
                Activity A — Property Exploration
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {countShapes[countShapeIndex].prompt}
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-500">
              Question {countShapeIndex + 1} of {countShapes.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* SVG Canvas */}
            <div className="flex flex-col items-center justify-center bg-purple-50/50 p-6 rounded-3xl border-2 border-purple-100">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {(() => {
                  const size = 240;
                  const center = { x: 120, y: 120 };
                  const radius = 98;
                  const sides = countShapes[countShapeIndex].targetCount;
                  const points = getPolygonPoints(sides, radius, center, 0, true);
                  const pointsString = pointsToSvgPointsString(points);

                  return (
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-md">
                      <polygon
                        points={pointsString}
                        fill="#8b5cf6"
                        fillOpacity="0.85"
                        stroke="#4c1d95"
                        strokeWidth="4"
                        strokeLinejoin="round"
                      />

                      {/* Vertices perfectly centered on actual corner coordinates */}
                      {points.map((p, idx) => {
                        const isClicked = clickedElements.includes(idx);
                        return (
                          <g
                            key={idx}
                            onClick={() => handleElementClick(idx)}
                            className="cursor-pointer group"
                          >
                            <circle cx={p.x} cy={p.y} r="18" fill="transparent" />
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={isClicked ? "13" : "9"}
                              fill={isClicked ? "#f59e0b" : "#ffffff"}
                              stroke={isClicked ? "#78350f" : "#6d28d9"}
                              strokeWidth={isClicked ? "3" : "2.5"}
                              className="transition-all duration-150 group-hover:scale-110"
                            />
                            {isClicked ? (
                              <text
                                x={p.x}
                                y={p.y + 4}
                                textAnchor="middle"
                                fill="#78350f"
                                fontSize="11"
                                fontWeight="900"
                              >
                                {idx + 1}
                              </text>
                            ) : (
                              <circle cx={p.x} cy={p.y} r="2.5" fill="#6d28d9" />
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>

              <div className="mt-4 bg-white px-5 py-2 rounded-2xl border border-purple-200 text-center shadow-xs">
                <span className="text-xs text-slate-500 font-bold block">Count Registered</span>
                <span className="text-2xl font-black text-purple-700">
                  {clickedElements.length} / {countShapes[countShapeIndex].targetCount}
                </span>
              </div>
            </div>

            {/* Verification and Mascot Feedback */}
            <div className="space-y-4">
              <PikoMascot
                mood={countState === 'correct' ? 'celebrating' : countState === 'incorrect' ? 'thinking' : 'happy'}
                size="md"
                message={countFeedback || `Tap each corner dot carefully. A ${countShapes[countShapeIndex].name.toLowerCase()} has ${countShapes[countShapeIndex].targetCount} ${countShapes[countShapeIndex].mode}!`}
              />

              {countState !== 'neutral' && (
                <div
                  className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 font-extrabold text-xs sm:text-sm ${
                    countState === 'correct'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-rose-50 border-rose-400 text-rose-950'
                  }`}
                >
                  {countState === 'correct' ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 stroke-[3]" />
                      <span>Correct! Well done!</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-rose-600 shrink-0 stroke-[3]" />
                      <span>Incorrect. Total target: {countShapes[countShapeIndex].targetCount} {countShapes[countShapeIndex].mode}.</span>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                {countState === 'neutral' ? (
                  <button
                    onClick={verifyCount}
                    className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-base rounded-2xl shadow-md transition-all cursor-pointer"
                  >
                    CHECK MY ANSWER
                  </button>
                ) : countShapeIndex < countShapes.length - 1 ? (
                  <button
                    onClick={handleNextCountShape}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>NEXT QUESTION ➔</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('classify')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ACTIVITY A COMPLETE! NEXT ACTIVITY ➔</span>
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
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {classifyShapes[classifyIndex].prompt}
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

            {/* Selection Buttons and Single-Attempt Immediate Feedback */}
            <div className="space-y-4">
              <PikoMascot
                mood={classifyState === 'correct' ? 'celebrating' : classifyState === 'incorrect' ? 'thinking' : 'happy'}
                size="md"
                message={classifyFeedback || "Remember: Regular polygons have all straight sides EQUAL in length!"}
              />

              <div className="grid grid-cols-2 gap-3">
                {/* Regular Polygon Button */}
                {(() => {
                  const isCorrectAnswer = classifyShapes[classifyIndex].isRegular === true;
                  const isUserSelected = selectedClass === true;

                  let btnStyle = 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-800';
                  if (classifyState !== 'neutral') {
                    if (isCorrectAnswer) {
                      btnStyle = 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md ring-2 ring-emerald-400 font-black';
                    } else if (isUserSelected && !isCorrectAnswer) {
                      btnStyle = 'border-rose-600 bg-rose-100 text-rose-950 shadow-md';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50 opacity-60';
                    }
                  }

                  return (
                    <button
                      disabled={classifyState !== 'neutral'}
                      onClick={() => handleClassifyChoice(true)}
                      className={`p-4 rounded-2xl border-3 font-extrabold text-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-1">
                        {classifyState !== 'neutral' && isCorrectAnswer && <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />}
                        {classifyState !== 'neutral' && isUserSelected && !isCorrectAnswer && <X className="w-6 h-6 text-rose-600 stroke-[3]" />}
                        {classifyState === 'neutral' && <Check className="w-6 h-6 text-emerald-600" />}
                      </div>
                      <span>REGULAR POLYGON</span>
                      <span className="text-[10px] text-slate-500 font-normal">(Equal side lengths)</span>
                    </button>
                  );
                })()}

                {/* Irregular Polygon Button */}
                {(() => {
                  const isCorrectAnswer = classifyShapes[classifyIndex].isRegular === false;
                  const isUserSelected = selectedClass === false;

                  let btnStyle = 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50 text-slate-800';
                  if (classifyState !== 'neutral') {
                    if (isCorrectAnswer) {
                      btnStyle = 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md ring-2 ring-emerald-400 font-black';
                    } else if (isUserSelected && !isCorrectAnswer) {
                      btnStyle = 'border-rose-600 bg-rose-100 text-rose-950 shadow-md';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50 opacity-60';
                    }
                  }

                  return (
                    <button
                      disabled={classifyState !== 'neutral'}
                      onClick={() => handleClassifyChoice(false)}
                      className={`p-4 rounded-2xl border-3 font-extrabold text-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-1">
                        {classifyState !== 'neutral' && isCorrectAnswer && <Check className="w-6 h-6 text-emerald-600 stroke-[3]" />}
                        {classifyState !== 'neutral' && isUserSelected && !isCorrectAnswer && <X className="w-6 h-6 text-rose-600 stroke-[3]" />}
                        {classifyState === 'neutral' && <X className="w-6 h-6 text-amber-600" />}
                      </div>
                      <span>IRREGULAR POLYGON</span>
                      <span className="text-[10px] text-slate-500 font-normal">(Unequal side lengths)</span>
                    </button>
                  );
                })()}
              </div>

              {classifyState !== 'neutral' && (
                classifyIndex < classifyShapes.length - 1 ? (
                  <button
                    onClick={handleNextClassify}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>NEXT SHAPE ➔</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('rotate')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ACTIVITY B COMPLETE! NEXT ACTIVITY ➔</span>
                  </button>
                )
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
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                {rotateShapes[rotateIndex].prompt}
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

            {/* Answer Options with Single-Attempt Immediate Feedback */}
            <div className="space-y-4">
              <PikoMascot
                mood={rotateState === 'correct' ? 'celebrating' : rotateState === 'incorrect' ? 'thinking' : 'happy'}
                size="md"
                message={rotateFeedback || "Count the straight sides! Rotating a polygon does NOT change its name or number of sides!"}
              />

              <div className="space-y-2">
                {rotateShapes[rotateIndex].options.map((opt) => {
                  const isCorrectOpt = opt.toLowerCase().includes(rotateShapes[rotateIndex].correctName.toLowerCase());
                  const isSelectedOpt = rotateSelected === opt;

                  let btnStyle = 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 text-slate-800';
                  if (rotateState !== 'neutral') {
                    if (isCorrectOpt) {
                      btnStyle = 'border-emerald-600 bg-emerald-100 text-emerald-950 shadow-md ring-2 ring-emerald-400 font-black';
                    } else if (isSelectedOpt && !isCorrectOpt) {
                      btnStyle = 'border-rose-600 bg-rose-100 text-rose-950 shadow-md';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt}
                      disabled={rotateState !== 'neutral'}
                      onClick={() => handleRotateChoice(opt)}
                      className={`w-full p-4 rounded-2xl border-3 text-left font-extrabold text-base transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {rotateState !== 'neutral' && isCorrectOpt && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
                      {rotateState !== 'neutral' && isSelectedOpt && !isCorrectOpt && <X className="w-5 h-5 text-rose-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {rotateState !== 'neutral' && (
                rotateIndex < rotateShapes.length - 1 ? (
                  <button
                    onClick={handleNextRotate}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>NEXT SHAPE ➔</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('detective')}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ACTIVITY C COMPLETE! NEXT ACTIVITY ➔</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY D — Polygon Detective (Clue-Based Riddles) */}
      {activeTab === 'detective' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 pb-4">
            <div>
              <span className="text-xs font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-purple-600" /> Activity D — Polygon Detective
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                Solve Piko's Clue Riddle!
              </h2>
            </div>
            <span className="text-sm font-bold text-slate-500">
              Clue {detectiveIndex + 1} of {detectiveClues.length}
            </span>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border-2 border-purple-200 shadow-xs flex items-center gap-4">
            <PikoMascot mood="thinking" size="sm" />
            <div>
              <span className="text-[11px] font-black text-purple-900 bg-purple-200 px-2 py-0.5 rounded-full uppercase">
                Detective Clue
              </span>
              <p className="text-base sm:text-lg font-black text-slate-800 italic mt-1">
                {detectiveClues[detectiveIndex].clue}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700">
              Tap the correct polygon that matches the clue:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {detectiveClues[detectiveIndex].options.map((opt) => {
                const isCorrectOpt = opt.key === detectiveClues[detectiveIndex].correctKey;
                const isSelectedOpt = detectiveChoice === opt.key;

                let cardStyle = 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50';
                if (detectiveState !== 'neutral') {
                  if (isCorrectOpt) {
                    cardStyle = 'border-emerald-600 bg-emerald-50 shadow-lg ring-4 ring-emerald-300 font-black';
                  } else if (isSelectedOpt && !isCorrectOpt) {
                    cardStyle = 'border-rose-600 bg-rose-50 shadow-md';
                  } else {
                    cardStyle = 'border-slate-200 bg-slate-50 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    disabled={detectiveState !== 'neutral'}
                    onClick={() => handleDetectiveChoice(opt.key)}
                    className={`p-4 rounded-3xl border-3 text-center transition-all flex flex-col items-center justify-between gap-3 cursor-pointer relative ${cardStyle}`}
                  >
                    {detectiveState !== 'neutral' && isCorrectOpt && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                    {detectiveState !== 'neutral' && isSelectedOpt && !isCorrectOpt && (
                      <div className="absolute top-2 right-2 bg-rose-500 text-white rounded-full p-1 shadow-xs">
                        <X className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}

                    <PolygonSvgPreview type={opt.key as any} size={85} />
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{opt.name}</h4>
                      <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200 inline-block mt-1">
                        {opt.sides} Sides
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {detectiveFeedback && (
              <p
                className={`p-3 border-2 rounded-2xl text-xs sm:text-sm font-extrabold text-center ${
                  detectiveState === 'correct'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {detectiveFeedback}
              </p>
            )}

            {detectiveState !== 'neutral' && (
              detectiveIndex < detectiveClues.length - 1 ? (
                <button
                  onClick={handleNextDetective}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>NEXT CLUE ➔</span>
                </button>
              ) : (
                <p className="text-xs font-bold text-emerald-700 text-center bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  ★ All Discovery Lab activities complete! Use the banner below to go to the Pattern Workshop!
                </p>
              )
            )}
          </div>
        </div>
      )}

      {/* Lab Completion Banner */}
      {allLabComplete && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-subtle">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-black">DISCOVERY LAB COMPLETE! LET'S CREATE PATTERNS!</h3>
            <p className="text-purple-100 text-sm font-medium">
              You understand polygon characteristics and solved all detective clues! Ready for the studio?
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
