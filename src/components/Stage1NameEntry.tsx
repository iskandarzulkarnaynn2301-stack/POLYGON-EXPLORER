import React, { useState } from 'react';
import { PikoMascot } from './PikoMascot';
import { ArrowRight, Compass } from 'lucide-react';

interface Stage1NameEntryProps {
  initialName: string;
  onSubmitName: (name: string) => void;
}

export const Stage1NameEntry: React.FC<Stage1NameEntryProps> = ({
  initialName,
  onSubmitName
}) => {
  const [name, setName] = useState(initialName);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your name first, Explorer!');
      return;
    }
    setErrorMsg('');
    onSubmitName(trimmed);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative Floating Polygon Shapes in Background */}
      <div className="absolute top-10 left-10 w-24 h-24 text-blue-200 opacity-60 animate-float pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,5 95,38 78,90 22,90 5,38" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-12 w-28 h-28 text-emerald-200 opacity-60 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" />
        </svg>
      </div>
      <div className="absolute top-20 right-20 w-20 h-20 text-purple-200 opacity-60 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,5 85,21 98,59 78,95 22,95 2,59 15,21" />
        </svg>
      </div>

      <div className="max-w-xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-10 border-4 border-emerald-300 shadow-2xl relative z-10 text-center">
        {/* Mascot welcoming */}
        <div className="mb-4">
          <PikoMascot
            mood="excited"
            size="lg"
            message="Hello! I'm Piko, your geometry guide! Welcome to Polygonia!"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" /> Stage 1: Explorer Registration
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 tracking-tight">
          WELCOME, YOUNG EXPLORER!
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mb-6 font-medium">
          “Who is exploring Polygonia today?”
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="explorer-name" className="block text-sm font-bold text-slate-700 mb-2">
              Enter Your Name
            </label>
            <input
              id="explorer-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Type your name here..."
              maxLength={25}
              className="w-full px-5 py-4 rounded-2xl border-3 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 text-slate-800 text-lg font-bold shadow-inner placeholder:text-slate-400 outline-none transition-all"
            />
            {errorMsg && (
              <p className="mt-2 text-sm font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center justify-center gap-2 animate-bounce-subtle">
                ⚠️ {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-black text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span>LET'S EXPLORE!</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400 font-medium">
          🔒 Safe for pupils: No login, password or personal data stored online.
        </p>
      </div>
    </div>
  );
};
