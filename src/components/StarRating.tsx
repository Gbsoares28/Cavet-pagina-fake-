import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { RATING_OPTIONS } from '../constants/config';

interface StarRatingProps {
  value: number | null;
  onChange: (rating: number) => void;
  idPrefix?: string;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  idPrefix = 'star-rating',
  className = '',
}) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  const activeValue = hoveredValue !== null ? hoveredValue : value;
  const currentOption = activeValue ? RATING_OPTIONS[activeValue] : null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, starNumber: number) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(starNumber);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (starNumber < 5) onChange(starNumber + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (starNumber > 1) onChange(starNumber - 1);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        e.preventDefault();
        onChange(Number(e.key));
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Question prompt */}
      <h2 className="text-base sm:text-lg font-bold text-slate-800 text-center mb-3">
        Como foi sua experiência na CAVET?
      </h2>

      {/* Star Row - Accessible Radiogroup */}
      <div
        role="radiogroup"
        aria-label="Classificação de 1 a 5 estrelas da sua experiência"
        className="flex items-center justify-center gap-2 sm:gap-3 py-2"
        onMouseLeave={() => setHoveredValue(null)}
      >
        {[1, 2, 3, 4, 5].map((starNumber) => {
          const isFilled = activeValue !== null && starNumber <= activeValue;
          const isCurrentChoice = value === starNumber;
          const option = RATING_OPTIONS[starNumber];

          return (
            <button
              key={starNumber}
              id={`${idPrefix}-${starNumber}`}
              type="button"
              role="radio"
              aria-checked={isCurrentChoice}
              aria-label={`${starNumber} estrela${starNumber > 1 ? 's' : ''}: ${option.label}`}
              tabIndex={value === null && starNumber === 1 ? 0 : value === starNumber ? 0 : -1}
              onClick={() => onChange(starNumber)}
              onMouseEnter={() => setHoveredValue(starNumber)}
              onKeyDown={(e) => handleKeyDown(e, starNumber)}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0B4C8C] ${
                isFilled ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
              }`}
            >
              <Star
                className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors duration-150 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                    : 'fill-slate-100 text-slate-300 hover:text-slate-400'
                }`}
                strokeWidth={isFilled ? 1.5 : 1.25}
              />
            </button>
          );
        })}
      </div>

      {/* Dynamic Classification Label and Feedback Helper */}
      <div className="min-h-[52px] mt-2 flex flex-col items-center justify-center text-center px-4">
        {currentOption ? (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <span
              className={`inline-block font-extrabold text-base sm:text-lg tracking-tight ${
                currentOption.value >= 4
                  ? 'text-emerald-700'
                  : currentOption.value === 3
                  ? 'text-amber-700'
                  : 'text-rose-600'
              }`}
            >
              {currentOption.label}
            </span>
            <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
              {currentOption.description}
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-400 italic">
            Toque em uma das estrelas para avaliar
          </p>
        )}
      </div>
    </div>
  );
};
