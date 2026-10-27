import React, { useState } from 'react';
import type { GameStage } from '../types/game';
import { audioSystem } from '../utils/audio';
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Flower2,
  Search,
  Palette,
  ShieldCheck,
  Trophy,
  User,
  HelpCircle,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Brain
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
  shortLabel: string;
  number: number;
  icon: React.ReactNode;
}> = [
  { id: 'name_entry', label: 'Start', shortLabel: 'Name', number: 1, icon: <User className="w-3.5 h-3.5" /> },
  { id: 'home', label: 'Home', shortLabel: 'Home', number: 2, icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'pre_test', label: 'Pre-Test', shortLabel: 'Pre-Test', number: 3, icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'pre_test_results', label: 'Pre Score', shortLabel: 'Pre Score', number: 4, icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { id: 'video', label: 'Video', shortLabel: 'Video', number: 5, icon: <PlayCircle className="w-3.5 h-3.5" /> },
  { id: 'meet', label: 'Garden', shortLabel: 'Garden', number: 6, icon: <Flower2 className="w-3.5 h-3.5" /> },
  { id: 'memory', label: 'Memory', shortLabel: 'Memory', number: 7, icon: <Brain className="w-3.5 h-3.5" /> },
  { id: 'explore', label: 'Discovery', shortLabel: 'Discovery', number: 8, icon: <Search className="w-3.5 h-3.5" /> },
  { id: 'workshop', label: 'Workshop', shortLabel: 'Workshop', number: 9, icon: <Palette className="w-3.5 h-3.5" /> },
  { id: 'post_test', label: 'Post-Test', shortLabel: 'Post-Test', number: 10, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'results', label: 'Results', shortLabel: 'Results', number: 11, icon: <Trophy className="w-3.5 h-3.5" /> }
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

  const isUnlocked = (stageId: GameStage, index: number) => {
    if (stageId === 'name_entry' || stageId === 'home') return true;
    if (completedStages.includes(stageId)) return true;
    // Stage is unlocked if all previous stages in sequence have been completed
    return STAGES.slice(0, index).every((prev) => completedStages.includes(prev.id));
  };

  return (
    <header className="bg-white border-b-2 border-indigo-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
        {/* Brand & Explorer Name Badge */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div
            onClick={() => {
              audioSystem.playSfx('click');
              onNavigate('home');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wide block leading-none">
                POLYGON EXPLORER
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-indigo-600 tracking-wider uppercase block">
                THE ADVENTURE OF POLYGONIA
              </span>
            </div>
          </div>

          {/* Name Display + Audio Toggles + Teacher Guide */}
          <div className="flex items-center gap-1.5 sm:gap-2">
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
              <div className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Explorer:</span>
                <span className="font-extrabold text-indigo-700 max-w-[80px] sm:max-w-none truncate">{studentName}</span>
                <button
                  onClick={() => {
                    audioSystem.playSfx('click');
                    onChangeName();
                  }}
                  className="text-[10px] text-indigo-500 hover:text-indigo-800 underline font-bold ml-0.5 cursor-pointer"
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
              className="p-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 rounded-full transition-colors cursor-pointer shrink-0"
              title="Teacher Guide"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Visual Map / Stage Flow Navigation */}
        <nav className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max py-0.5">
            {STAGES.map((stage, idx) => {
              const active = currentStage === stage.id;
              const completed = completedStages.includes(stage.id);
              const unlocked = isUnlocked(stage.id, idx);

              let btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed';
              if (active) {
                btnStyle = 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300 font-black';
              } else if (completed) {
                btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 cursor-pointer font-bold';
              } else if (unlocked) {
                btnStyle = 'bg-white text-slate-800 border-slate-300 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer font-bold';
              }

              return (
                <button
                  key={stage.id}
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
                  className={`px-3 py-1.5 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 ${btnStyle}`}
                >
                  <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md ${
                    active ? 'bg-indigo-700 text-white' : completed ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {stage.number}
                  </span>
                  <span>{stage.label}</span>
                  {completed && !active && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};
