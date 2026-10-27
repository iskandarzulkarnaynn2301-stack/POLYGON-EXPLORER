import React, { useState } from 'react';
import type { TestResult } from '../types/game';
import { PRE_TEST_QUESTIONS } from '../data/preTestQuestions';
import { PikoMascot } from './PikoMascot';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { ArrowRight, Compass, HelpCircle, Sparkles, Check } from 'lucide-react';

interface Stage3PreTestProps {
  studentName: string;
  onCompletePreTest: (result: TestResult) => void;
}

export const Stage3PreTest: React.FC<Stage3PreTestProps> = ({
  studentName,
  onCompletePreTest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentQ = PRE_TEST_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === PRE_TEST_QUESTIONS.length - 1;

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (!isLastQuestion) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(answers[PRE_TEST_QUESTIONS[nextIdx].id] || '');
    } else {
      setShowCompletionModal(true);
    }
  };

  const handleFinalSubmit = () => {
    // Calculate total score automatically
    let score = 0;
    PRE_TEST_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });

    const result: TestResult = {
      score,
      total: PRE_TEST_QUESTIONS.length,
      answers,
      completedAt: new Date()
    };

    onCompletePreTest(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4">
      {/* Playful Explorer Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-indigo-600 text-white p-4 sm:p-5 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
        {/* Subtle decorative background polygons */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 95,38 78,90 22,90 5,38" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block shrink-0">
            <PikoMascot mood="happy" size="sm" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5 text-amber-300" /> Stage 3: Polygon Challenge
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">PRE-TEST: THE STARTING CHALLENGE</h1>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">
              Welcome, Explorer <span className="font-extrabold text-amber-300 underline">{studentName}</span>! Let's see what shapes you recognise!
            </p>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase text-blue-200 font-bold block">Question</span>
          <span className="text-xl font-black text-amber-300">
            {currentIndex + 1} <span className="text-xs text-blue-200 font-normal">/ {PRE_TEST_QUESTIONS.length}</span>
          </span>
        </div>
      </div>

      {/* Progress Indicator Bar */}
      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border border-slate-300 shadow-inner">
        <div
          className="bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / PRE_TEST_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-3 border-indigo-200 shadow-md space-y-5 relative">
        <div className="flex items-center justify-between gap-3 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
              {currentQ.id}
            </span>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {currentQ.type === 'pattern' ? 'Pattern Challenge' : 'Polygon Challenge'}
            </span>
          </div>

          <span className="text-xs font-extrabold text-slate-400">
            {currentIndex + 1} of {PRE_TEST_QUESTIONS.length}
          </span>
        </div>

        {/* Question Title Text */}
        <h2 className="text-lg sm:text-2xl font-extrabold text-slate-800 leading-snug">
          {currentQ.question}
        </h2>

        {/* Visual Illustration Panel if present */}
        {currentQ.illustrationType && (
          <div className="flex justify-center my-3 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 p-4 rounded-2xl border border-indigo-100 shadow-xs">
            <PolygonSvgPreview
              type={currentQ.illustrationType}
              rotation={currentQ.rotationDegrees || 0}
              size={160}
            />
          </div>
        )}

        {/* Pattern completion item visualization */}
        {currentQ.type === 'pattern' && currentQ.patternData && (
          <div className="space-y-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 p-4 rounded-2xl border-2 border-indigo-200">
            <h3 className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-600" /> Complete the Pattern Sequence:
            </h3>

            {/* Sequence Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-1">
              {currentQ.patternData.sequence.map((item, idx) => {
                const isMissing = idx === currentQ.patternData?.missingIndex;
                const isSelected = selectedOption !== '';
                const selectedOptObj = currentQ.patternData?.options.find((o) => o.id === selectedOption);

                return (
                  <div key={item.id} className="flex items-center gap-1.5">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center p-1.5 border-3 transition-all ${
                        isMissing
                          ? 'border-dashed border-amber-400 bg-amber-50/90 shadow-md animate-pulse-glow'
                          : 'border-indigo-200 bg-white shadow-xs'
                      }`}
                    >
                      {isMissing ? (
                        isSelected && selectedOptObj ? (
                          <PolygonSvgPreview type={selectedOptObj.polygon} size={42} fillColor={selectedOptObj.color} />
                        ) : (
                          <span className="text-xl font-black text-amber-500">[ ? ]</span>
                        )
                      ) : (
                        <PolygonSvgPreview type={item.polygon} size={42} fillColor={item.color} />
                      )}
                    </div>
                    {idx < currentQ.patternData!.sequence.length - 1 && (
                      <span className="text-indigo-400 font-bold text-sm">➔</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Answer Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {currentQ.type === 'pattern' && currentQ.patternData
            ? currentQ.patternData.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/90 shadow-md scale-[1.02] ring-2 ring-indigo-300'
                        : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <PolygonSvgPreview type={opt.polygon} size={50} fillColor={opt.color} />
                      <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{opt.label}</span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })
            : currentQ.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/90 shadow-md scale-[1.02] ring-2 ring-indigo-300'
                        : 'border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.svgType && (
                        <PolygonSvgPreview type={opt.svgType} size={45} />
                      )}
                      <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{opt.text}</span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
        </div>

        {/* Footer Navigation Controls */}
        <div className="pt-3 flex items-center justify-between border-t border-slate-200">
          <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            {selectedOption ? (
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Choice registered!
              </span>
            ) : (
              'Select an answer to unlock Next'
            )}
          </p>

          <button
            disabled={!selectedOption}
            onClick={handleNext}
            className={`py-3 px-6 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer ${
              selectedOption
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isLastQuestion ? 'FINISH CHALLENGE' : 'NEXT QUESTION'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Confirmation Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 border-4 border-indigo-400 shadow-2xl animate-bounce-subtle">
            <PikoMascot mood="celebrating" size="md" />
            <h3 className="text-2xl font-black text-slate-800">CHALLENGE COMPLETED!</h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              Great effort, Explorer <span className="font-extrabold text-indigo-600">{studentName}</span>! Your pre-test responses are saved. Now let's watch the learning video together!
            </p>

            <button
              onClick={handleFinalSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              CONTINUE TO LEARNING VIDEO ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
