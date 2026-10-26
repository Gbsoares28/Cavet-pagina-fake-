import React, { useState } from 'react';
import { Send, Shield, AlertCircle, CheckCircle2, RefreshCw, X, User, Phone, Heart } from 'lucide-react';
import { RATING_OPTIONS } from '../constants/config';
import { StarRating } from './StarRating';

interface PrivateFeedbackFormProps {
  initialRating: number | null;
  initialComment: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmitted?: () => void;
}

export const PrivateFeedbackForm: React.FC<PrivateFeedbackFormProps> = ({
  initialRating,
  initialComment,
  isOpen,
  onClose,
  onSuccessSubmitted,
}) => {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [petName, setPetName] = useState('');
  const [contactConsent, setContactConsent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    id?: string;
    message?: string;
  } | null>(null);

  // Sync if parent updates when reopening
  React.useEffect(() => {
    if (isOpen) {
      if (initialRating !== null && rating === null) {
        setRating(initialRating);
      }
      if (initialComment && !comment) {
        setComment(initialComment);
      }
    }
  }, [isOpen, initialRating, initialComment]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validation
    if (!comment.trim() && rating === null) {
      setServerError('Por favor, informe ao menos uma classificação por estrelas ou escreva um comentário.');
      return;
    }

    if (contactConsent && !contact.trim()) {
      setServerError('Você marcou a opção de consentimento para contato. Por favor, forneça seu e-mail ou telefone.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          clientName: clientName.trim(),
          contact: contact.trim(),
          petName: petName.trim(),
          contactConsent,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Falha no envio (Código ${response.status}). Verifique sua conexão e tente novamente.`);
      }

      setSubmissionResult({
        success: true,
        id: data?.record?.id || data?.id,
        message: data?.message || 'Feedback enviado com sucesso para a diretoria do CAVET.',
      });

      if (onSuccessSubmitted) {
        onSuccessSubmitted();
      }
    } catch (err: unknown) {
      console.error('Falha ao enviar feedback privado:', err);
      const msg = err instanceof Error ? err.message : 'Não foi possível conectar ao servidor de feedback da CAVET.';
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmissionResult(null);
    setServerError(null);
    setComment('');
    setClientName('');
    setContact('');
    setPetName('');
    setContactConsent(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-private-feedback-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#0B4C8C] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-cyan-300" aria-hidden="true" />
            <div>
              <h2 id="modal-private-feedback-title" className="text-base sm:text-lg font-bold leading-tight">
                Feedback Privado à Diretoria
              </h2>
              <p className="text-xs text-blue-100">
                CAVET — Hospital Veterinário Tijuca 24h
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-blue-100 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Fechar formulário de feedback privado"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {submissionResult?.success ? (
            /* Real Server Confirmation State */
            <div className="py-6 text-center flex flex-col items-center animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                Feedback Recebido!
              </h3>

              <p className="text-sm text-slate-600 mt-2 max-w-md">
                {submissionResult.message}
              </p>

              {submissionResult.id && (
                <div className="mt-3 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-500 font-mono">
                  Protocolo: <span className="font-semibold text-slate-700">{submissionResult.id}</span>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-4 max-w-sm">
                Nossa equipe de coordenação e qualidade do atendimento analisa todos os relatos para aprimorar continuamente o cuidado aos animais.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-[#0B4C8C] hover:bg-[#083664] text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  Concluir e Fechar
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
                >
                  Enviar Outro
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-slate-600">
                <p>
                  Esta mensagem é enviada <strong>exclusivamente</strong> para a administração e diretoria clínica da CAVET Tijuca. Não será publicada no Google nem tornada pública.
                </p>
              </div>

              {/* Star rating selection within private modal */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
                  <span>Classificação da sua experiência:</span>
                  {rating && (
                    <span className="font-bold text-[#0B4C8C]">
                      {RATING_OPTIONS[rating]?.label}
                    </span>
                  )}
                </div>
                <StarRating
                  idPrefix="private-rating"
                  value={rating}
                  onChange={(val) => setRating(val)}
                  className="scale-90 origin-top"
                />
              </div>

              {/* Comment text */}
              <div>
                <label
                  htmlFor="private-feedback-comment"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Seu relato ou sugestão <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="private-feedback-comment"
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Descreva com detalhes o que aconteceu durante o atendimento na CAVET Tijuca..."
                  className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-xl focus:border-[#0B4C8C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all resize-y"
                  maxLength={2000}
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Opiniões, elogios, dúvidas ou críticas são bem-vindos.</span>
                  <span className="tabular-nums">{comment.length} / 2000</span>
                </div>
              </div>

              {/* Client Name & Pet Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="private-feedback-name"
                    className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <User className="w-3 h-3 text-slate-400" />
                    Seu Nome (opcional)
                  </label>
                  <input
                    id="private-feedback-name"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Gabriel Silva"
                    className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:border-[#0B4C8C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="private-feedback-pet"
                    className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 text-slate-400" />
                    Nome do Pet (opcional)
                  </label>
                  <input
                    id="private-feedback-pet"
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ex: Thor (Cão) ou Mimi (Gato)"
                    className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:border-[#0B4C8C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Contact (Email or phone) */}
              <div>
                <label
                  htmlFor="private-feedback-contact"
                  className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-slate-400" />
                  E-mail ou Telefone de contato (opcional)
                </label>
                <input
                  id="private-feedback-contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Ex: (21) 98765-4321 ou tutor@email.com"
                  className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-white border border-slate-300 rounded-lg focus:border-[#0B4C8C] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                />
              </div>

              {/* Consent checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="private-feedback-consent"
                  type="checkbox"
                  checked={contactConsent}
                  onChange={(e) => setContactConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0B4C8C] focus:ring-[#0B4C8C]"
                />
                <label
                  htmlFor="private-feedback-consent"
                  className="text-xs text-slate-600 leading-normal cursor-pointer select-none"
                >
                  Autorizo a equipe da CAVET a entrar em contato comigo a respeito deste relato, se necessário para esclarecimentos ou providências.
                </label>
              </div>

              {/* Server Error Warning */}
              {serverError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Erro ao enviar:</span> {serverError}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="order-2 sm:order-1 px-4 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="order-1 sm:order-2 flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0B4C8C] hover:bg-[#083664] disabled:bg-slate-400 text-white font-bold rounded-xl text-sm shadow-sm transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Transmitindo para a diretoria...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Diretamente à CAVET</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
