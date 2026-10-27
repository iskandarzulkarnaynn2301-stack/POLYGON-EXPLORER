import React, { useState } from 'react';
import type { TestResult } from '../types/game';
import { PRE_TEST_QUESTIONS } from '../data/preTestQuestions';
import { PikoMascot } from './PikoMascot';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300" /> Stage 3: Assessment
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">PRE-TEST: THE STARTING CHALLENGE</h1>
          <p className="text-blue-100 text-sm mt-1">
            Let's see what you already know, Explorer {studentName}! Do your best!
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-xs uppercase text-blue-200 font-bold block">Progress</span>
          <span className="text-2xl font-black">
            {currentIndex + 1} / {PRE_TEST_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / PRE_TEST_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Main Question Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-indigo-200 shadow-md space-y-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
            Q{currentQ.id}. {currentQ.question}
          </h2>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase border border-indigo-200 shrink-0">
            {currentQ.type}
          </span>
        </div>

        {/* Visual Illustration if present */}
        {currentQ.illustrationType && (
          <div className="flex justify-center my-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <PolygonSvgPreview
              type={currentQ.illustrationType}
              rotation={currentQ.rotationDegrees || 0}
              size={180}
            />
          </div>
        )}

        {/* Pattern completion item visualization */}
        {currentQ.type === 'pattern' && currentQ.patternData && (
          <div className="space-y-4 bg-indigo-50/60 p-5 rounded-2xl border-2 border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" /> Pattern Sequence:
            </h3>

            {/* Sequence Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-2">
              {currentQ.patternData.sequence.map((item, idx) => {
                const isMissing = idx === currentQ.patternData?.missingIndex;
                const isSelected = selectedOption !== '';
                const selectedOptObj = currentQ.patternData?.options.find((o) => o.id === selectedOption);

                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center p-2 border-3 transition-all ${
                        isMissing
                          ? 'border-dashed border-amber-400 bg-amber-50 shadow-md animate-pulse-glow'
                          : 'border-indigo-200 bg-white shadow-sm'
                      }`}
                    >
                      {isMissing ? (
                        isSelected && selectedOptObj ? (
                          <PolygonSvgPreview type={selectedOptObj.polygon} size={50} fillColor={selectedOptObj.color} />
                        ) : (
                          <span className="text-2xl font-black text-amber-500">[ ? ]</span>
                        )
                      ) : (
                        <PolygonSvgPreview type={item.polygon} size={50} fillColor={item.color} />
                      )}
                    </div>
                    {idx < currentQ.patternData!.sequence.length - 1 && (
                      <span className="text-indigo-400 font-bold text-lg">➔</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
          {currentQ.type === 'pattern' && currentQ.patternData
            ? currentQ.patternData.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-2xl border-3 text-left transition-all flex items-center gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <PolygonSvgPreview type={opt.polygon} size={60} fillColor={opt.color} />
                    <span className="font-bold text-slate-800 text-sm sm:text-base">{opt.label}</span>
                  </button>
                );
              })
            : currentQ.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.svgType && (
                        <PolygonSvgPreview type={opt.svgType} size={50} />
                      )}
                      <span className="font-bold text-slate-800 text-sm sm:text-base">{opt.text}</span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-200">
          <p className="text-xs text-slate-500 font-medium">
            {selectedOption ? '✓ Answer selected' : 'Please select an answer to continue'}
          </p>

          <button
            disabled={!selectedOption}
            onClick={handleNext}
            className={`py-3 px-6 rounded-2xl font-black text-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedOption
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isLastQuestion ? 'FINISH TEST' : 'NEXT QUESTION'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Completion Confirmation Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 border-4 border-indigo-400 shadow-2xl animate-bounce-subtle">
            <PikoMascot mood="celebrating" size="md" />
            <h3 className="text-2xl font-black text-slate-800">PRE-TEST COMPLETED!</h3>
            <p className="text-slate-600 text-sm font-medium">
              Great effort, Explorer <span className="font-extrabold text-indigo-600">{studentName}</span>! Your responses have been saved. Now let's start your learning video adventure!
            </p>

            <button
              onClick={handleFinalSubmit}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              CONTINUE TO LEARNING VIDEO ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
