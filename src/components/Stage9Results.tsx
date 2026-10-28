import React, { useEffect, useState } from 'react';
import type { TestResult, GameStage } from '../types/game';
import { PikoMascot } from './PikoMascot';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  TrendingUp,
  RotateCcw,
  Home,
  BookOpen,
  Sparkles,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface Stage9ResultsProps {
  studentName: string;
  preTestResult: TestResult | null;
  postTestResult: TestResult | null;
  onRevisitActivities: (stage: GameStage) => void;
  onReturnHome: () => void;
  onRestartGame: () => void;
  onOpenTeacherGuide: () => void;
}

export const Stage9Results: React.FC<Stage9ResultsProps> = ({
  studentName,
  preTestResult,
  postTestResult,
  onRevisitActivities,
  onReturnHome,
  onRestartGame,
  onOpenTeacherGuide
}) => {
  const [showRestartModal, setShowRestartModal] = useState(false);

  const preScore = preTestResult ? preTestResult.score : 0;
  const postScore = postTestResult ? postTestResult.score : 0;
  const scoreDiff = postScore - preScore;

  // Trigger celebration confetti on view
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Fallback silently if canvas unavailable
    }
  }, []);

  let feedbackMessage = 'Wonderful effort, Explorer! Keep discovering polygons!';
  let mascotMood: 'celebrating' | 'happy' | 'excited' = 'happy';

  if (scoreDiff > 0) {
    feedbackMessage = `Fantastic progress, ${studentName}! You gained +${scoreDiff} points! Your polygon knowledge is growing!`;
    mascotMood = 'celebrating';
  } else if (postScore >= 8) {
    feedbackMessage = `Outstanding result, ${studentName}! You scored ${postScore}/10 and showed great mastery of regular polygons!`;
    mascotMood = 'celebrating';
  } else {
    feedbackMessage = `Every attempt helps you learn something new! Practise again to build your confidence!`;
    mascotMood = 'excited';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-amber-950 p-6 sm:p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-950/10 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-900" /> Stage 9: Hall of Achievements
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            HALL OF ACHIEVEMENTS
          </h1>
          <p className="text-amber-900 font-extrabold text-base sm:text-lg">
            Congratulations, Explorer <span className="underline decoration-2">{studentName}</span>!
          </p>
        </div>
      </div>

      {/* Score Comparison Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pre-Test Card */}
        <div className="bg-white p-6 rounded-3xl border-3 border-slate-200 shadow-md text-center space-y-2">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Pre-Test Score
          </span>
          <div className="text-4xl font-black text-slate-700">
            {preScore} <span className="text-xl text-slate-400">/ 10</span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">
            Starting Knowledge
          </span>
        </div>

        {/* Score Difference Badge */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border-3 border-emerald-300 shadow-md text-center space-y-2 flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-1 text-emerald-800 text-xs font-black uppercase tracking-wider bg-emerald-200/80 px-2.5 py-0.5 rounded-full">
            <TrendingUp className="w-3.5 h-3.5" /> Learning Score Difference
          </div>
          <div className="text-4xl font-black text-emerald-600">
            {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}
          </div>
          <span className="text-xs font-extrabold text-emerald-800">
            {scoreDiff > 0 ? '✓ Improvement Recorded!' : 'Maintained Solid Knowledge!'}
          </span>
        </div>

        {/* Post-Test Card */}
        <div className="bg-white p-6 rounded-3xl border-3 border-emerald-300 shadow-md text-center space-y-2">
          <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">
            Post-Test Score
          </span>
          <div className="text-4xl font-black text-emerald-600">
            {postScore} <span className="text-xl text-slate-400">/ 10</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 block">
            After Adventure Learning
          </span>
        </div>
      </div>

      {/* Visual Comparison Chart Bar */}
      <div className="bg-white rounded-3xl p-6 border-3 border-amber-200 shadow-md space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" /> Score Comparison Chart
        </h3>

        <div className="space-y-3">
          {/* Pre Test Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
              <span>Pre-Test</span>
              <span>{preScore} / 10 ({preScore * 10}%)</span>
            </div>
            <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-slate-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, (preScore / 10) * 100)}%` }}
              />
            </div>
          </div>

          {/* Post Test Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-emerald-700 mb-1">
              <span>Post-Test</span>
              <span>{postScore} / 10 ({postScore * 10}%)</span>
            </div>
            <div className="w-full bg-emerald-50 h-6 rounded-full overflow-hidden p-0.5 border border-emerald-200">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, (postScore / 10) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Encouragement & Mascot */}
      <div className="bg-amber-50/80 rounded-3xl p-6 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <PikoMascot mood={mascotMood} size="lg" />
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-400 text-amber-950 text-xs font-black rounded-full uppercase tracking-wider">
            Piko's Feedback
          </span>
          <p className="text-slate-800 text-lg font-extrabold leading-relaxed">
            “{feedbackMessage}”
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Remember: Learning geometry is a journey! You can revisit any polygon stage anytime.
          </p>
        </div>
      </div>

      {/* Navigation & Action Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <button
          onClick={() => onRevisitActivities('meet')}
          className="p-4 bg-white hover:bg-emerald-50 border-3 border-emerald-300 rounded-2xl font-black text-slate-800 hover:text-emerald-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 text-emerald-600" />
          <span>REVISIT GARDEN</span>
        </button>

        <button
          onClick={() => onRevisitActivities('workshop')}
          className="p-4 bg-white hover:bg-amber-50 border-3 border-amber-300 rounded-2xl font-black text-slate-800 hover:text-amber-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>REVISIT WORKSHOP</span>
        </button>

        <button
          onClick={onReturnHome}
          className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>RETURN TO HOME</span>
        </button>

        <button
          onClick={() => setShowRestartModal(true)}
          className="p-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-base rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>RESTART GAME</span>
        </button>
      </div>

      {/* Teacher Guide Link */}
      <div className="text-center pt-2">
        <button
          onClick={onOpenTeacherGuide}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Teacher Information & Evaluation Notes</span>
        </button>
      </div>

      {/* Restart Game Confirmation Modal */}
      {showRestartModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 border-4 border-rose-400 shadow-2xl animate-bounce-subtle">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Restart Adventure?</h3>
              <p className="text-slate-600 text-sm font-medium">
                Are you sure you want to start a brand new adventure? This will clear your current pre-test and post-test scores so a new student can explore Polygonia.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowRestartModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowRestartModal(false);
                  onRestartGame();
                }}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer"
              >
                YES, RESTART NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
