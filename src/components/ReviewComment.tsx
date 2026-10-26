import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { QUICK_TOPICS } from '../constants/config';

interface ReviewCommentProps {
  value: string;
  onChange: (text: string) => void;
  maxLength?: number;
  className?: string;
}

export const ReviewComment: React.FC<ReviewCommentProps> = ({
  value,
  onChange,
  maxLength = 1000,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleAddTopic = (topic: string) => {
    if (value.includes(topic)) return;
    const separator = value.trim().length > 0 ? (value.endsWith('.') || value.endsWith(',') ? ' ' : '. ') : '';
    const newText = `${value.trim()}${separator}${topic}`;
    if (newText.length <= maxLength) {
      onChange(newText);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="cavet-review-comment"
          className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4 text-[#0B4C8C]" />
          Conte como foi sua experiência
          <span className="text-xs font-normal text-slate-400">(opcional)</span>
        </label>

        {value.trim().length > 0 && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#0B4C8C] hover:text-[#083664] transition-colors bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md"
            title="Copie o texto para colar na avaliação do Google"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar texto</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          id="cavet-review-comment"
          rows={4}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Compartilhe sua experiência com nossa equipe..."
          className="w-full px-3.5 py-3 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-xl focus:border-[#0B4C8C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-y min-h-[96px]"
          aria-describedby="char-count-info"
        />

        {/* Counter and status */}
        <div
          id="char-count-info"
          className="flex items-center justify-between mt-1.5 text-xs text-slate-400 px-1"
        >
          <span className="text-[11px] text-slate-500">
            Você pode colar este texto no Google para agilizar sua avaliação.
          </span>
          <span className={`tabular-nums font-medium ${value.length >= maxLength ? 'text-rose-500 font-bold' : ''}`}>
            {value.length} / {maxLength}
          </span>
        </div>
      </div>

      {/* Quick suggest topics to help tutors write */}
      <div className="mt-3">
        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1.5">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Sugestões de tópicos para mencionar:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_TOPICS.map((topic) => {
            const isAdded = value.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => handleAddTopic(topic)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                  isAdded
                    ? 'bg-blue-50 border-blue-200 text-[#0B4C8C] font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {isAdded ? '✓ ' : '+ '}{topic}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
