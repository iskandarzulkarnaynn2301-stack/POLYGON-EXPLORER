import React from 'react';

interface PikoProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'explaining';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

export const PikoMascot: React.FC<PikoProps> = ({
  mood = 'happy',
  size = 'md',
  message,
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-52 h-52'
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {/* Speech bubble if message provided */}
      {message && (
        <div className="relative mb-3 max-w-xs sm:max-w-md bg-white border-4 border-amber-400 rounded-2xl p-3 sm:p-4 shadow-lg text-slate-800 text-sm sm:text-base font-semibold leading-snug animate-bounce-subtle z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-amber-950 text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Piko says:
            </span>
          </div>
          <p>{message}</p>
          {/* Arrow */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-amber-400" />
        </div>
      )}

      {/* SVG Character */}
      <div className={`relative ${sizeMap[size]} transition-transform duration-300 hover:scale-105`}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
          {/* Background Glow */}
          <circle cx="100" cy="110" r="75" fill="#fef3c7" opacity="0.6" />

          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="55" ry="12" fill="#cbd5e1" opacity="0.7" />

          {/* Piko Body - Friendly Rounded Pentagon Shape Body */}
          <path
            d="M 100 45 L 155 85 L 140 160 L 60 160 L 45 85 Z"
            fill="url(#pikoGrad)"
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Gradient for body */}
          <defs>
            <linearGradient id="pikoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="hatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Explorer Hat */}
          <path
            d="M 40 48 Q 100 30 160 48 L 170 55 Q 100 45 30 55 Z"
            fill="#b45309"
            stroke="#78350f"
            strokeWidth="3"
          />
          <path
            d="M 60 48 Q 100 15 140 48 Q 100 42 60 48 Z"
            fill="url(#hatGrad)"
            stroke="#b45309"
            strokeWidth="3"
          />
          {/* Hat Badge / Star */}
          <circle cx="100" cy="36" r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          <polygon
            points="100,30 102,34 106,35 103,38 104,42 100,40 96,42 97,38 94,35 98,34"
            fill="#eab308"
          />

          {/* Eyes based on mood */}
          {mood === 'celebrating' || mood === 'excited' ? (
            <>
              {/* Happy squint eyes */}
              <path d="M 72 95 Q 82 82 92 95" fill="none" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
              <path d="M 108 95 Q 118 82 128 95" fill="none" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Thinking eyes looking up */}
              <circle cx="82" cy="90" r="10" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <circle cx="84" cy="86" r="5" fill="#1e293b" />
              <circle cx="118" cy="90" r="10" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <circle cx="120" cy="86" r="5" fill="#1e293b" />
            </>
          ) : (
            <>
              {/* Standard big friendly eyes */}
              <circle cx="82" cy="92" r="11" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <circle cx="84" cy="92" r="6" fill="#1e293b" />
              <circle cx="86" cy="89" r="2" fill="#ffffff" />

              <circle cx="118" cy="92" r="11" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <circle cx="120" cy="92" r="6" fill="#1e293b" />
              <circle cx="122" cy="89" r="2" fill="#ffffff" />
            </>
          )}

          {/* Rosy Cheeks */}
          <circle cx="68" cy="105" r="7" fill="#f43f5e" opacity="0.4" />
          <circle cx="132" cy="105" r="7" fill="#f43f5e" opacity="0.4" />

          {/* Mouth */}
          {mood === 'celebrating' || mood === 'excited' ? (
            <path d="M 85 115 Q 100 135 115 115 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          ) : mood === 'thinking' ? (
            <path d="M 88 118 Q 100 112 112 118" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          ) : (
            <path d="M 85 112 Q 100 128 115 112" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          )}

          {/* Explorer Magnifying Glass in hand */}
          <g transform="translate(135, 120) rotate(-20)">
            <rect x="18" y="22" width="8" height="24" rx="3" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="22" cy="14" r="14" fill="#e0f2fe" stroke="#0284c7" strokeWidth="4" fillOpacity="0.7" />
            <path d="M 14 10 A 10 10 0 0 1 26 10" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Little Explorer Arms */}
          <path d="M 50 115 Q 35 130 52 140" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" />
          <path d="M 150 115 Q 165 125 155 135" fill="none" stroke="#2563eb" strokeWidth="7" strokeLinecap="round" />

          {/* Cute Little Feet */}
          <ellipse cx="75" cy="165" rx="14" ry="7" fill="#1e293b" />
          <ellipse cx="125" cy="165" rx="14" ry="7" fill="#1e293b" />
        </svg>
      </div>
    </div>
  );
};
