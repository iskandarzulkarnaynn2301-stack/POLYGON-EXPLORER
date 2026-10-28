import React from 'react';
import { PikoMascot } from './PikoMascot';
import { ArrowRight, Play, ExternalLink, Film } from 'lucide-react';

interface Stage4LearningVideoProps {
  onCompleteVideo: () => void;
}

export const Stage4LearningVideo: React.FC<Stage4LearningVideoProps> = ({
  onCompleteVideo
}) => {
  const videoId = 'uRs2FDJqvKI';
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  const directUrl = `https://youtu.be/uRs2FDJqvKI?si=PVAVk2mb8C03oEO4`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Film className="w-4 h-4 text-rose-200" /> Stage 4: Video Discovery
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">WATCH AND DISCOVER</h1>
          <p className="text-rose-100 text-sm mt-1">
            MATEMATIK TAHUN 3 - POLIGON SEKATA
          </p>
        </div>

        <PikoMascot mood="happy" size="sm" />
      </div>

      {/* Intro Description */}
      <div className="bg-white rounded-3xl p-6 border-3 border-rose-200 shadow-md space-y-4">
        <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed">
          Watch this fun learning video to explore regular pentagons, hexagons, heptagons and octagons! When you are ready, click below to meet the polygons in the garden.
        </p>

        {/* Responsive Video Embed Container */}
        <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title="MATEMATIK TAHUN 3 - POLIGON SEKATA"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Fallback YouTube Direct Link */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 bg-rose-50 p-4 rounded-2xl border border-rose-200">
          <div className="flex items-center gap-2 text-rose-900 text-xs sm:text-sm font-semibold">
            <Play className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Having trouble loading the video embed?</span>
          </div>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-extrabold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <span>WATCH ON YOUTUBE</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Clean Navigation Button (No quizzes or checkpoints in video section) */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onCompleteVideo}
          className="py-4 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer group"
        >
          <span>NEXT: MEET THE POLYGONS</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
