import React, { useState } from 'react';
import type { TestResult } from '../types/game';
import { POST_TEST_QUESTIONS } from '../data/postTestQuestions';
import { HoneycombCanvasQ10 } from './HoneycombCanvasQ10';
import { PikoMascot } from './PikoMascot';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { ArrowRight, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

interface Stage8PostTestProps {
  studentName: string;
  onCompletePostTest: (result: TestResult) => void;
}

export const Stage8PostTest: React.FC<Stage8PostTestProps> = ({
  studentName,
  onCompletePostTest
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [submittedCurrent, setSubmittedCurrent] = useState(false);
  const [q10Passed, setQ10Passed] = useState<boolean | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentQ = POST_TEST_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === POST_TEST_QUESTIONS.length - 1;

  const handleSelectOption = (optionId: string) => {
    if (submittedCurrent) return;
    setSelectedOption(optionId);
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    setSubmittedCurrent(true);
  };

  const handleQ10Evaluation = (isCorrect: boolean) => {
    setQ10Passed(isCorrect);
    setSubmittedCurrent(true);
    setAnswers((prev) => ({
      ...prev,
      10: isCorrect ? 'honeycomb-pass' : 'honeycomb-fail'
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(answers[POST_TEST_QUESTIONS[nextIdx].id] || '');
      setSubmittedCurrent(false);
    } else {
      setShowCompletionModal(true);
    }
  };

  const handleFinalSubmit = () => {
    let score = 0;
    POST_TEST_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctOptionId) {
        score += 1;
      }
    });

    const result: TestResult = {
      score,
      total: POST_TEST_QUESTIONS.length,
      answers,
      completedAt: new Date()
    };

    onCompletePostTest(result);
  };

  const isCurrentCorrect = selectedOption === currentQ.correctOptionId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-200" /> Stage 8: Post-Test Assessment
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">POST-TEST: POLYGON CHALLENGE</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Show your polygon master knowledge, Explorer {studentName}!
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-xs uppercase text-emerald-200 font-bold block">Progress</span>
          <span className="text-2xl font-black">
            {currentIndex + 1} / {POST_TEST_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden p-0.5 border border-slate-300">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / POST_TEST_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Main Question Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-200 shadow-md space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
              Q{currentQ.id}. {currentQ.question}
            </h2>
            {currentQ.id === 10 && (
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                Instruction: Look at the reference picture. Use 7 regular hexagons to recreate the same honeycomb pattern on your canvas.
              </p>
            )}
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase border border-emerald-200 shrink-0">
            {currentQ.type}
          </span>
        </div>

        {/* Q10 Interactive Honeycomb Canvas Task */}
        {currentQ.id === 10 ? (
          <HoneycombCanvasQ10
            onEvaluate={handleQ10Evaluation}
            isSubmitted={submittedCurrent}
            hasPassed={q10Passed}
          />
        ) : (
          <>
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

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              {currentQ.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt = opt.id === currentQ.correctOptionId;

                let btnStyle = 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50';
                if (submittedCurrent) {
                  if (isCorrectOpt) {
                    btnStyle = 'border-emerald-600 bg-emerald-100 ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrectOpt) {
                    btnStyle = 'border-rose-500 bg-rose-100';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-emerald-600 bg-emerald-50 shadow-md scale-[1.02]';
                }

                return (
                  <button
                    key={opt.id}
                    disabled={submittedCurrent}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-4 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      {opt.svgType && (
                        <PolygonSvgPreview type={opt.svgType} size={50} />
                      )}
                      <span className="font-bold text-slate-800 text-sm sm:text-base">{opt.text}</span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Short Corrective Feedback Panel post-submission */}
            {submittedCurrent && (
              <div
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 animate-bounce-subtle ${
                  isCurrentCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                {isCurrentCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-extrabold text-sm sm:text-base">
                    {isCurrentCorrect ? 'Correct! Well done!' : 'Keep learning! Here is why:'}
                  </p>
                  <p className="text-xs sm:text-sm font-medium mt-0.5">
                    {currentQ.explanation}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-200">
          <p className="text-xs text-slate-500 font-medium">
            {submittedCurrent
              ? 'Answer checked'
              : currentQ.id === 10
              ? 'Snap all 7 hexagons onto the target grid, then click SUBMIT DESIGN'
              : selectedOption
              ? 'Click CHECK ANSWER below'
              : 'Select an answer'}
          </p>

          {currentQ.id !== 10 && !submittedCurrent && (
            <button
              disabled={!selectedOption}
              onClick={handleSubmitAnswer}
              className={`py-3 px-6 rounded-2xl font-black text-lg transition-all flex items-center gap-2 cursor-pointer ${
                selectedOption
                  ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>CHECK ANSWER</span>
            </button>
          )}

          {submittedCurrent && (
            <button
              onClick={handleNext}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{isLastQuestion ? 'VIEW MY RESULTS' : 'NEXT QUESTION'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Completion Confirmation Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 border-4 border-emerald-400 shadow-2xl animate-bounce-subtle">
            <PikoMascot mood="celebrating" size="md" />
            <h3 className="text-2xl font-black text-slate-800">POST-TEST COMPLETED!</h3>
            <p className="text-slate-600 text-sm font-medium">
              Congratulations, Explorer <span className="font-extrabold text-emerald-600">{studentName}</span>! You have finished your adventure in Polygonia! Let's view your Hall of Achievements!
            </p>

            <button
              onClick={handleFinalSubmit}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              ENTER HALL OF ACHIEVEMENTS ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
