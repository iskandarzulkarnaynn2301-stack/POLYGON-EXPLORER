import React from 'react';
import type { GameStage } from '../types/game';
import { CheckCircle2, BookOpen, User } from 'lucide-react';

interface NavbarProps {
  studentName: string;
  currentStage: GameStage;
  completedStages: GameStage[];
  onNavigate: (stage: GameStage) => void;
  onOpenTeacherGuide: () => void;
  onChangeName: () => void;
}

const STAGES: { id: GameStage; label: string; number: number }[] = [
  { id: 'name_entry', label: 'Name', number: 1 },
  { id: 'home', label: 'Home', number: 2 },
  { id: 'pre_test', label: 'Pre-Test', number: 3 },
  { id: 'video', label: 'Video', number: 4 },
  { id: 'meet', label: 'Garden', number: 5 },
  { id: 'explore', label: 'Discovery', number: 6 },
  { id: 'workshop', label: 'Workshop', number: 7 },
  { id: 'post_test', label: 'Post-Test', number: 8 },
  { id: 'results', label: 'Results', number: 9 }
];

export const Navbar: React.FC<NavbarProps> = ({
  studentName,
  currentStage,
  completedStages,
  onNavigate,
  onOpenTeacherGuide,
  onChangeName
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b-4 border-emerald-300 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand logo & title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => studentName ? onNavigate('home') : onNavigate('name_entry')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                POLYGON EXPLORER
              </h1>
              <span className="text-xs font-medium text-emerald-600 tracking-wide uppercase">
                The Adventure of Polygonia
              </span>
            </div>
          </button>
        </div>

        {/* Pupil badge & actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {studentName ? (
            <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-sm text-emerald-900">{studentName}</span>
              <button
                onClick={onChangeName}
                title="Edit display name"
                className="text-xs text-emerald-600 hover:text-emerald-800 underline ml-1 cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : null}

          <button
            onClick={onOpenTeacherGuide}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-bold px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors cursor-pointer"
            title="Open Teacher Guide & Curriculum Info"
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>Teacher Guide</span>
          </button>
        </div>
      </div>

      {/* Interactive Progress Journey Map */}
      <div className="bg-emerald-50/80 border-t border-emerald-100 px-4 py-2 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between min-w-[680px] gap-1">
          {STAGES.map((s, idx) => {
            const isCurrent = currentStage === s.id;
            const isCompleted = completedStages.includes(s.id);
            const canNavigate = Boolean(studentName) && (isCompleted || isCurrent || s.id === 'home' || s.id === 'name_entry');

            return (
              <React.Fragment key={s.id}>
                <button
                  disabled={!canNavigate}
                  onClick={() => canNavigate && onNavigate(s.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600 text-white font-bold shadow-md scale-105'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-900 font-semibold hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <span>{s.number}</span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs whitespace-nowrap">{s.label}</span>
                </button>

                {idx < STAGES.length - 1 && (
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
