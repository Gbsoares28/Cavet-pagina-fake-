import React from 'react';
import { StarRating } from './StarRating';
import { ReviewComment } from './ReviewComment';
import { GoogleReviewButton } from './GoogleReviewButton';
import { CheckCircle } from 'lucide-react';

interface BusinessCardProps {
  rating: number | null;
  onRatingChange: (rating: number) => void;
  comment: string;
  onCommentChange: (comment: string) => void;
  onOpenPrivateFeedback: () => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  rating,
  onRatingChange,
  comment,
  onCommentChange,
  onOpenPrivateFeedback,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden transition-all duration-300">
      {/* Main interactive evaluation body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Google User Representation Banner (matching Google review modal look) */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            G
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-slate-800">
                Avaliação pública para o Google
              </p>
              <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              Sua avaliação ajuda a orientar outros tutores e famílias de pets no Rio.
            </p>
          </div>
        </div>

        {/* Section: Star Rating */}
        <StarRating
          value={rating}
          onChange={onRatingChange}
        />

        {/* Section: Comment Field */}
        <ReviewComment
          value={comment}
          onChange={onCommentChange}
          maxLength={1000}
        />

        {/* Section: Main Action */}
        <div className="pt-2 flex flex-col items-center space-y-3">
          {/* Main Google Review Button */}
          <GoogleReviewButton
            currentRating={rating}
            comment={comment}
          />

          {/* Discreet link for private feedback */}
          <button
            type="button"
            onClick={onOpenPrivateFeedback}
            className="text-xs text-slate-400 hover:text-[#0B4C8C] hover:underline transition-colors pt-2 cursor-pointer"
          >
            Prefere enviar um feedback privado à equipe?
          </button>
        </div>
      </div>
    </div>
  );
};
