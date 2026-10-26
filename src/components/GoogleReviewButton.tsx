import React, { useState } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { GOOGLE_REVIEW_URL } from '../constants/config';

interface GoogleReviewButtonProps {
  currentRating?: number | null;
  comment?: string;
  className?: string;
}

export const GoogleReviewButton: React.FC<GoogleReviewButtonProps> = ({
  comment = '',
  className = '',
}) => {
  const [justClicked, setJustClicked] = useState(false);

  const handleClick = () => {
    // If the customer wrote a comment, copy to clipboard for convenient pasting on Google
    if (comment.trim().length > 0) {
      try {
        navigator.clipboard.writeText(comment);
      } catch {
        // clipboard access fallback
      }
    }

    setJustClicked(true);

    // Open exact official Google review link in new tab upon explicit action
    window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');

    // Reset notification after 6 seconds
    setTimeout(() => {
      setJustClicked(false);
    }, 6000);
  };

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Official Direct Action Button */}
      <button
        type="button"
        onClick={handleClick}
        className="w-full relative group inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:py-4 bg-[#1a73e8] hover:bg-[#1557b0] active:bg-[#10438a] text-white font-bold text-base sm:text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 cursor-pointer"
        aria-label="Avaliar no Google - abre em nova aba"
      >
        {/* Google Iconic Multicolor 'G' */}
        <div className="w-6 h-6 bg-white rounded-full p-1 flex items-center justify-center shrink-0 shadow-xs">
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.28 21.43 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.57H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.43l4.03-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.28 2.57 1.25 6.57l4.03 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
            />
          </svg>
        </div>

        <span className="tracking-normal">Avaliar no Google</span>

        <ExternalLink className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity ml-0.5" />
      </button>

      {/* Helpful notification if clicked */}
      {justClicked && (
        <div className="mt-2.5 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#0B4C8C] flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-left">
            <span className="font-bold">A página oficial do Google foi aberta em uma nova aba!</span>
            {comment.trim().length > 0 && (
              <span className="block mt-0.5 text-slate-600">
                Seu comentário foi copiado para a área de transferência. Basta colar (Ctrl+V ou botão direito) na caixa do Google.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
