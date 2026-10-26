import React, { useState } from 'react';
import { Star, ImagePlus, Info, Check, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { GOOGLE_REVIEW_URL } from '../constants/config';

interface GoogleReviewModalProps {
  onOpenPrivateFeedback?: () => void;
}

const DEFAULT_SERVICES = [
  'Dermatologista veterinário',
  'Cardiologia veterinária',
  'Farmácia veterinária',
  'Cirurgia veterinária',
  'Oncologia veterinária',
];

const EXTRA_SERVICES = [
  'Emergência 24h',
  'Internação veterinária',
  'Exames laboratoriais',
  'Ultrassonografia',
  'Raio-X digital',
  'Vacinação',
  'Odontologia veterinária',
  'Neurologia veterinária',
  'Oftalmologia veterinária',
  'Anestesiologia veterinária',
  'Endocrinologia veterinária',
];

export const GoogleReviewModal: React.FC<GoogleReviewModalProps> = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...filesArray]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (rating === 0) {
      setValidationError('Selecione uma classificação por estrelas antes de postar.');
      return;
    }

    setValidationError(null);

    // Build complete comment text including selected services
    let fullText = comment.trim();
    if (selectedServices.length > 0) {
      const servicesText = `\n\nServiços utilizados: ${selectedServices.join(', ')}.`;
      fullText += servicesText;
    }

    // Save to backend database
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: fullText,
          contactConsent: false,
        }),
      });
    } catch {
      // Background save attempt
    }

    setSubmittedRating(rating);
    setIsSubmitted(true);

    // Conditional routing:
    // Only 4 and 5 stars redirect to official Google Review page
    if (rating >= 4) {
      if (fullText.trim().length > 0) {
        try {
          navigator.clipboard.writeText(fullText.trim());
        } catch {
          // Clipboard fallback
        }
      }
      // Open official Google link in a new tab
      window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener,noreferrer');
    }
    // For 1, 2, 3 stars: only the standard Google feedback screen is displayed without opening external Google link
  };

  const handleClear = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setSelectedServices([]);
    setPhotos([]);
    setIsSubmitted(false);
    setSubmittedRating(null);
    setValidationError(null);
  };

  const displayedRating = hoverRating || rating;

  // Standard Google Confirmation Feedback Screen
  if (isSubmitted) {
    return (
      <div className="w-full max-w-[530px] bg-[#282a2c] text-[#e8eaed] rounded-[28px] shadow-2xl border border-[#3c4043] overflow-hidden font-sans p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-[#8ab4f8]/15 text-[#8ab4f8] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#8ab4f8]/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="text-xl font-medium text-[#e8eaed] mb-2">
          Agradecemos pelo seu feedback!
        </h2>

        <p className="text-[14px] text-[#9aa0a6] max-w-sm mx-auto leading-relaxed mb-6">
          {submittedRating && submittedRating >= 4
            ? 'A página oficial de avaliação do Google foi aberta em uma nova aba para concluir a publicação pública.'
            : 'Sua contribuição foi registrada com sucesso e ajuda a aprimorar o atendimento da nossa equipe.'}
        </p>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleClear}
            className="px-8 py-2.5 rounded-lg text-[13px] font-semibold bg-[#8ab4f8] hover:bg-[#a6c8ff] text-[#001d36] transition-colors cursor-pointer"
          >
            Concluído
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[530px] bg-[#282a2c] text-[#e8eaed] rounded-[28px] shadow-2xl border border-[#3c4043] overflow-hidden font-sans">
      {/* Top Title Bar */}
      <div className="pt-5 pb-3 px-6 text-center border-b border-[#3c4043]/60">
        <h1 className="text-[15px] sm:text-base font-medium text-[#e8eaed] tracking-wide">
          CAVET - Hospital Veterinário Tijuca 24h
        </h1>
      </div>

      <div className="p-6 space-y-5">
        {/* User profile row - WITHOUT Gabriel's name and photo */}
        <div className="flex items-center gap-3.5">
          {/* Generic Google Account Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#3c4043] border border-[#5f6368] flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-[#9aa0a6]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <div className="flex-1 text-left min-w-0">
            <p className="text-[14px] font-medium text-[#e8eaed] leading-tight">
              Sua Conta Google
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#9aa0a6] mt-0.5">
              <span>As postagens são públicas nos produtos Google</span>
              <Info className="w-3.5 h-3.5 inline opacity-70" />
            </div>
          </div>
        </div>

        {/* 5 Outline / Gold Stars */}
        <div>
          <div
            role="radiogroup"
            aria-label="Classificação por estrelas"
            className="flex items-center justify-center gap-2 py-1"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = displayedRating >= star;
              return (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
                  onClick={() => {
                    setRating(star);
                    setValidationError(null);
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  className="p-1 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab4f8]"
                >
                  <Star
                    className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors duration-150 ${
                      isFilled
                        ? 'fill-[#fbbc04] text-[#fbbc04]'
                        : 'fill-transparent text-[#9aa0a6] hover:text-[#bdc1c6]'
                    }`}
                    strokeWidth={1.4}
                  />
                </button>
              );
            })}
          </div>

          {validationError && (
            <p className="text-center text-xs text-[#ea4335] mt-1.5 animate-in fade-in">
              {validationError}
            </p>
          )}
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi sua experiência neste lugar"
            className="w-full bg-transparent border border-[#5f6368] rounded-xl px-4 py-3 text-[14px] text-[#e8eaed] placeholder-[#9aa0a6] focus:border-[#8ab4f8] focus:ring-1 focus:ring-[#8ab4f8] focus:outline-none transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Add photos and videos button */}
        <div>
          <label className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#37393b] hover:bg-[#434548] active:bg-[#4f5155] text-[#e8eaed] font-medium text-[13px] rounded-full cursor-pointer transition-colors border border-[#484a4d]">
            <ImagePlus className="w-4 h-4 text-[#8ab4f8]" />
            <span>Adicionar fotos e vídeos</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>

          {/* Uploaded photos preview */}
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {photos.map((file, idx) => (
                <div
                  key={idx}
                  className="relative group w-14 h-14 rounded-lg overflow-hidden border border-[#5f6368] bg-[#202124]"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-black text-white p-0.5 rounded-full"
                    title="Remover foto"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Services Box ("Quais serviços você recebeu?") */}
        <div className="bg-[#202124] rounded-2xl p-4 border border-[#3c4043]/80 space-y-2.5 text-left">
          <div>
            <h3 className="text-[14px] font-medium text-[#e8eaed]">
              Quais serviços você recebeu?
            </h3>
            <p className="text-[12px] text-[#9aa0a6]">
              Selecione todas as opções relevantes. (Beta)
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {DEFAULT_SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service);
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-[#8ab4f8]/20 border-[#8ab4f8] text-[#8ab4f8] font-medium'
                      : 'bg-[#282a2c] border-[#3c4043] text-[#e8eaed] hover:bg-[#343639]'
                  }`}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  {service}
                </button>
              );
            })}

            {showAllServices &&
              EXTRA_SERVICES.map((service) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-[#8ab4f8]/20 border-[#8ab4f8] text-[#8ab4f8] font-medium'
                        : 'bg-[#282a2c] border-[#3c4043] text-[#e8eaed] hover:bg-[#343639]'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {service}
                  </button>
                );
              })}

            <button
              type="button"
              onClick={() => setShowAllServices((prev) => !prev)}
              className="text-[12px] px-3 py-1.5 rounded-lg border border-[#3c4043] bg-[#282a2c] text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-[#343639] transition-colors"
            >
              {showAllServices ? 'Menos' : `+${EXTRA_SERVICES.length}`}
            </button>
          </div>
        </div>

        {/* Action Buttons: Cancelar & Postar */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2.5 rounded-lg text-[13px] font-medium text-[#8ab4f8] hover:bg-[#8ab4f8]/10 transition-colors cursor-pointer border border-[#5f6368]/60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handlePost}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-[13px] font-semibold bg-[#8ab4f8] hover:bg-[#a6c8ff] active:bg-[#729ee2] text-[#001d36] transition-colors shadow-sm cursor-pointer"
          >
            <span>Postar</span>
            {rating >= 4 && <ExternalLink className="w-3.5 h-3.5 opacity-80" />}
          </button>
        </div>
      </div>
    </div>
  );
};
