import React from 'react';
import { PikoMascot } from './PikoMascot';
import { Sparkles, Play, Award, Shapes, Layers } from 'lucide-react';

interface Stage2HomeProps {
  studentName: string;
  onStartAdventure: () => void;
  onChangeName: () => void;
}

export const Stage2Home: React.FC<Stage2HomeProps> = ({
  studentName,
  onStartAdventure,
  onChangeName
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Polygon accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" /> Welcome to Polygonia
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              POLYGON EXPLORER
            </h1>
            <p className="text-emerald-100 italic text-base sm:text-lg font-medium">
              Discover Shapes, Explore Properties, Create Amazing Patterns!
            </p>

            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-base sm:text-lg font-semibold leading-relaxed">
                “Welcome, <span className="text-amber-300 underline underline-offset-4 font-extrabold">{studentName}</span>! Piko needs your help to discover the amazing shapes of Polygonia. Are you ready for an adventure?”
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onStartAdventure}
                className="py-4 px-8 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xl rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer group"
              >
                <Play className="w-6 h-6 fill-amber-950" />
                <span>START MY ADVENTURE</span>
              </button>

              <button
                onClick={onChangeName}
                className="py-3 px-5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-colors text-sm flex items-center gap-2 cursor-pointer"
              >
                Not {studentName}? Change Name
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <PikoMascot mood="excited" size="xl" />
          </div>
        </div>
      </div>

      {/* Polygon Family Preview Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Shapes className="w-7 h-7 text-emerald-600" /> Regular Polygon Families
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              name: 'Pentagon',
              sides: 5,
              color: 'from-blue-400 to-blue-600',
              bg: 'bg-blue-50 border-blue-200',
              points: '50,10 90,40 75,90 25,90 10,40'
            },
            {
              name: 'Hexagon',
              sides: 6,
              color: 'from-emerald-400 to-emerald-600',
              bg: 'bg-emerald-50 border-emerald-200',
              points: '50,10 90,30 90,70 50,90 10,70 10,30'
            },
            {
              name: 'Heptagon',
              sides: 7,
              color: 'from-purple-400 to-purple-600',
              bg: 'bg-purple-50 border-purple-200',
              points: '50,10 85,25 98,60 78,92 22,92 2,60 15,25'
            },
            {
              name: 'Octagon',
              sides: 8,
              color: 'from-amber-400 to-amber-600',
              bg: 'bg-amber-50 border-amber-200',
              points: '30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30'
            }
          ].map((poly) => (
            <div
              key={poly.name}
              className={`p-4 rounded-2xl border-3 ${poly.bg} flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}
            >
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-sm mb-2">
                <polygon
                  points={poly.points}
                  className="fill-current text-white stroke-slate-700 stroke-[3]"
                />
              </svg>
              <h3 className="font-extrabold text-slate-800 text-lg">{poly.name}</h3>
              <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200 mt-1">
                {poly.sides} Straight Sides
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Learning Goals */}
      <div className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-md">
        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" /> Your 3 Adventure Goals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-3 items-start bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Identify Polygons</h4>
              <p className="text-xs text-slate-600 mt-1">
                Name regular pentagons, hexagons, heptagons and octagons by counting sides and vertices.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-teal-50 p-4 rounded-2xl border border-teal-200">
            <div className="w-8 h-8 rounded-full bg-teal-500 text-white font-black flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Explore Characteristics</h4>
              <p className="text-xs text-slate-600 mt-1">
                Distinguish regular from irregular polygons and recognise them when rotated.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start bg-cyan-50 p-4 rounded-2xl border border-cyan-200">
            <div className="w-8 h-8 rounded-full bg-cyan-500 text-white font-black flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Create Patterns</h4>
              <p className="text-xs text-slate-600 mt-1">
                Design beautiful geometric patterns in the Pattern Workshop studio!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Adventure Journey Map Overview */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border-3 border-amber-200">
        <h2 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <Layers className="w-6 h-6 text-amber-600" /> Adventure Map Stages
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Complete each stage to earn your Polygon Master explorer badge!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-center text-xs font-bold">
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">1. Pre-Test</div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">2. Video</div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">3. Garden</div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">4. Discovery Lab</div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">5. Workshop</div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">6. Post-Test</div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-slate-700">7. Results</div>
        </div>
      </div>
    </div>
  );
};
