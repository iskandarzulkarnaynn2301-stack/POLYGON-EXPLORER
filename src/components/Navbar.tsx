import React, { useState } from 'react';
import type { GameStage } from '../types/game';
import { audioSystem } from '../utils/audio';
import {
  CheckCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Bell,
  BellOff
} from 'lucide-react';

interface NavbarProps {
  currentStage: GameStage;
  completedStages: GameStage[];
  studentName: string;
  onNavigate: (stage: GameStage) => void;
  onOpenTeacherGuide: () => void;
  onChangeName: () => void;
}

const STAGES: Array<{
  id: GameStage;
  label: string;
  number: number;
}> = [
  { id: 'name_entry', label: 'Name', number: 1 },
  { id: 'home', label: 'Home', number: 2 },
  { id: 'pre_test', label: 'Pre-Test', number: 3 },
  { id: 'video', label: 'Video', number: 4 },
  { id: 'meet', label: 'Garden', number: 5 },
  { id: 'memory', label: 'Memory', number: 6 },
  { id: 'explore', label: 'Discovery', number: 7 },
  { id: 'workshop', label: 'Workshop', number: 8 },
  { id: 'post_test', label: 'Post-Test', number: 9 },
  { id: 'results', label: 'Results', number: 10 }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  completedStages,
  studentName,
  onNavigate,
  onOpenTeacherGuide,
  onChangeName
}) => {
  const [musicOn, setMusicOn] = useState<boolean>(audioSystem.isMusicOn());
  const [sfxOn, setSfxOn] = useState<boolean>(audioSystem.isSfxOn());

  const handleToggleMusic = () => {
    const next = !musicOn;
    setMusicOn(next);
    audioSystem.setMusicEnabled(next);
  };

  const handleToggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    audioSystem.setSfxEnabled(next);
    if (next) audioSystem.playSfx('click');
  };

  const activeStage = currentStage === 'pre_test_results' ? 'pre_test' : currentStage;

  const isUnlocked = (stageId: GameStage, index: number) => {
    if (stageId === 'name_entry' || stageId === 'home') return true;
    if (completedStages.includes(stageId)) return true;
    if (stageId === 'video' && completedStages.includes('pre_test')) return true;
    // Unlocked if all previous stages in STAGES array are completed
    return STAGES.slice(0, index).every((prev) => completedStages.includes(prev.id));
  };

  return (
    <header className="bg-white border-b-2 border-indigo-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 space-y-2.5">
        {/* ROW 1 — BRANDING AND USER CONTROLS */}
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Title */}
          <div
            onClick={() => {
              audioSystem.playSfx('click');
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <span className="font-black text-slate-800 text-sm sm:text-base tracking-wide block leading-none">
                POLYGON EXPLORER
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-indigo-600 tracking-wider uppercase block mt-0.5">
                THE ADVENTURE OF POLYGONIA
              </span>
            </div>
          </div>

          {/* User Controls & Audio Toggles */}
          <div className="flex items-center gap-2">
            {/* Audio Controls */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={handleToggleMusic}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  musicOn ? 'bg-amber-400 text-amber-950 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={musicOn ? 'Music On' : 'Music Off'}
              >
                {musicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleSfx}
                className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                  sfxOn ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={sfxOn ? 'Sound Effects On' : 'Sound Effects Off'}
              >
                {sfxOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>

            {studentName && (
              <div className="bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs sm:text-sm">
                <span className="text-slate-500 font-medium hidden sm:inline">Explorer:</span>
                <span className="font-extrabold text-indigo-700 max-w-[100px] sm:max-w-none truncate">{studentName}</span>
                <button
                  onClick={() => {
                    audioSystem.playSfx('click');
                    onChangeName();
                  }}
                  className="text-[10px] sm:text-xs text-indigo-500 hover:text-indigo-800 underline font-bold ml-1 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}

            <button
              onClick={() => {
                audioSystem.playSfx('click');
                onOpenTeacherGuide();
              }}
              className="p-2 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 rounded-2xl transition-colors cursor-pointer shrink-0"
              title="Teacher Guide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ROW 2 — STAGE NAVIGATION (Exactly 10 stages, spacious two-row design) */}
        <nav className="w-full overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-2">
          <div className="flex items-center justify-between min-w-max gap-1.5 sm:gap-2">
            {STAGES.map((stage, idx) => {
              const active = activeStage === stage.id;
              const completed = completedStages.includes(stage.id);
              const unlocked = isUnlocked(stage.id, idx);

              let btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed';
              if (active) {
                btnStyle = 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300 font-black';
              } else if (completed) {
                btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer font-bold';
              } else if (unlocked) {
                btnStyle = 'bg-white text-slate-800 border-slate-300 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer font-bold';
              }

              return (
                <React.Fragment key={stage.id}>
                  <button
                    disabled={!unlocked}
                    onClick={() => {
                      if (!unlocked) {
                        audioSystem.playSfx('incorrect');
                        return;
                      }
                      audioSystem.playSfx('click');
                      onNavigate(stage.id);
                    }}
                    title={!unlocked ? 'Complete the previous stage first!' : stage.label}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border-2 text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 ${btnStyle}`}
                  >
                    <span className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-lg ${
                      active ? 'bg-indigo-700 text-white' : completed ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {stage.number}
                    </span>
                    <span>{stage.label}</span>
                    {completed && !active && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>

                  {/* Connecting Line between stages */}
                  {idx < STAGES.length - 1 && (
                    <div
                      className={`h-0.5 w-2 sm:w-3 shrink-0 rounded-full ${
                        completed ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
