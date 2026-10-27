import React, { useState } from 'react';
import { PolygonSvgPreview } from './PolygonSvgPreview';
import { PikoMascot } from './PikoMascot';
import { audioSystem } from '../utils/audio';
import {
  Brain,
  Volume2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Stage7MemoryCornerProps {
  onCompleteMemoryCorner: () => void;
}

const MNEMONIC_ITEMS = [
  { word: 'PURPLE', shape: 'pentagon' as const, name: 'Pentagon', sides: 5, color: '#ec4899', desc: '5 straight sides & 5 vertices' },
  { word: 'HIPPOS', shape: 'hexagon' as const, name: 'Hexagon', sides: 6, color: '#f59e0b', desc: '6 straight sides & 6 vertices' },
  { word: 'HOP', shape: 'heptagon' as const, name: 'Heptagon', sides: 7, color: '#10b981', desc: '7 straight sides & 7 vertices' },
  { word: 'OUT!', shape: 'octagon' as const, name: 'Octagon', sides: 8, color: '#3b82f6', desc: '8 straight sides & 8 vertices' }
];

export const Stage7MemoryCorner: React.FC<Stage7MemoryCornerProps> = ({
  onCompleteMemoryCorner
}) => {
  const [selectedMnemonic, setSelectedMnemonic] = useState<number | null>(0);
  const [activeChantIndex, setActiveChantIndex] = useState<number | null>(null);
  const [isChanting, setIsChanting] = useState<boolean>(false);

  // Quick Memory Match State
  const [matches, setMatches] = useState<Record<string, number>>({});
  const [matchStatus, setMatchStatus] = useState<string>('');

  const handlePlayChant = () => {
    if (isChanting) return;
    setIsChanting(true);
    audioSystem.playSfx('select');

    const chantLines = [
      "Five — Pentagon!",
      "Six — Hexagon!",
      "Seven — Heptagon!",
      "Eight — Octagon!",
      "Purple Hippos Hop Out!"
    ];

    let lineIdx = 0;
    const speakNextLine = () => {
      if (lineIdx < chantLines.length) {
        setActiveChantIndex(lineIdx < 4 ? lineIdx : 4);
        audioSystem.speakText(chantLines[lineIdx], () => {
          lineIdx++;
          setTimeout(speakNextLine, 300);
        });
      } else {
        setIsChanting(false);
        setActiveChantIndex(null);
        audioSystem.playSfx('complete');
      }
    };

    speakNextLine();
  };

  const handleMatchSelect = (shapeName: string, sideCount: number) => {
    audioSystem.playSfx('click');
    setMatches((prev) => ({
      ...prev,
      [shapeName]: sideCount
    }));

    const correctSides: Record<string, number> = {
      Pentagon: 5,
      Hexagon: 6,
      Heptagon: 7,
      Octagon: 8
    };

    if (correctSides[shapeName] === sideCount) {
      audioSystem.playSfx('correct');
      setMatchStatus(`✓ Correct! ${shapeName} has ${sideCount} sides!`);
    } else {
      audioSystem.playSfx('incorrect');
      setMatchStatus(`Try again! Count the sides of ${shapeName} carefully.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Brain className="w-4 h-4 text-purple-200" /> Stage 7: Memory Corner
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">POLYGON MEMORY CORNER</h1>
          <p className="text-purple-100 text-sm sm:text-base mt-1 font-medium">
            Remember polygon names easily with our super fun memory chant!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <PikoMascot mood="excited" size="md" />
        </div>
      </div>

      {/* SECTION A: VISUAL MNEMONIC - PURPLE HIPPOS HOP OUT! */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6 bg-purple-50 p-6 rounded-3xl border-2 border-purple-200">
          {/* Cute Purple Hippo Visual */}
          <div className="w-32 h-32 bg-purple-200 rounded-3xl flex items-center justify-center text-5xl shadow-inner shrink-0 relative overflow-hidden">
            🦛
            <div className="absolute top-1 right-1 bg-purple-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              P-H-H-O
            </div>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-black text-purple-600 uppercase tracking-widest block">
              Piko's Magic Memory Trick
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              “PURPLE HIPPOS HOP OUT!”
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Remember the first letters <span className="font-extrabold text-purple-700">P - H - H - O</span> to recall <span className="font-bold text-slate-800">Pentagon, Hexagon, Heptagon, Octagon</span> in order from 5 to 8 sides!
            </p>
          </div>
        </div>

        {/* 4 Mnemonic Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MNEMONIC_ITEMS.map((item, idx) => {
            const isSelected = selectedMnemonic === idx;
            const isChantActive = activeChantIndex === idx;

            return (
              <div
                key={item.word}
                onClick={() => {
                  setSelectedMnemonic(idx);
                  audioSystem.playSfx('select');
                }}
                className={`p-5 rounded-3xl border-3 transition-all cursor-pointer text-center space-y-3 ${
                  isChantActive
                    ? 'border-amber-400 bg-amber-50 ring-4 ring-amber-300 scale-105'
                    : isSelected
                    ? 'border-purple-500 bg-purple-50/80 shadow-md scale-102'
                    : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50'
                }`}
              >
                <div className="inline-block px-3 py-1 bg-purple-600 text-white font-black text-xs rounded-full uppercase tracking-wider">
                  {item.word}
                </div>

                <div className="flex justify-center my-2">
                  <PolygonSvgPreview type={item.shape} size={70} fillColor={item.color} />
                </div>

                <div>
                  <h3 className="font-black text-lg text-slate-800">{item.name}</h3>
                  <p className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {item.sides} Straight Sides
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION B: RHYTHMIC MEMORY CHANT */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase">
            <Sparkles className="w-4 h-4 text-amber-200" /> Rhythmic Memory Chant
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">LISTEN & CHANT ALONG!</h3>
          <p className="text-amber-100 text-sm font-medium max-w-lg">
            “Five — Pentagon! Six — Hexagon! Seven — Heptagon! Eight — Octagon! Purple Hippos Hop Out!”
          </p>
        </div>

        <button
          onClick={handlePlayChant}
          disabled={isChanting}
          className={`py-4 px-8 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center gap-3 shrink-0 cursor-pointer ${
            isChanting
              ? 'bg-amber-300 text-amber-950 animate-pulse'
              : 'bg-white hover:bg-amber-100 text-amber-950 hover:scale-105 active:scale-95'
          }`}
        >
          <Volume2 className="w-6 h-6 text-amber-600" />
          <span>{isChanting ? 'CHANTING...' : 'PLAY MEMORY CHANT 🎵'}</span>
        </button>
      </div>

      {/* SECTION C & D: QUICK MEMORY MATCH */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-purple-200 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-purple-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800">QUICK MEMORY MATCH</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Match each polygon name with its correct number of sides!
            </p>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-black rounded-full">
            Practice Activity
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MNEMONIC_ITEMS.map((item) => {
            const currentSelectedSide = matches[item.name];

            return (
              <div
                key={item.name}
                className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <PolygonSvgPreview type={item.shape} size={45} fillColor={item.color} />
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">How many sides?</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {[5, 6, 7, 8].map((side) => {
                    const isSelected = currentSelectedSide === side;
                    const isCorrect = item.sides === side && isSelected;

                    return (
                      <button
                        key={side}
                        onClick={() => handleMatchSelect(item.name, side)}
                        className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer border-2 ${
                          isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                            : isSelected
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-400'
                        }`}
                      >
                        {side}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {matchStatus && (
          <p className="text-xs font-extrabold text-center text-purple-800 bg-purple-50 p-3 rounded-2xl border border-purple-200">
            {matchStatus}
          </p>
        )}
      </div>

      {/* Complete Memory Corner & Navigate */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            audioSystem.playSfx('complete');
            onCompleteMemoryCorner();
          }}
          className="py-4 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
        >
          <span>CONTINUE TO DISCOVERY LAB</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
