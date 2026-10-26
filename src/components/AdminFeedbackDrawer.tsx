import React, { useEffect, useState } from 'react';
import { X, RefreshCw, Star, MessageSquare, Phone, User, Heart, Shield, CheckCircle } from 'lucide-react';
import { RATING_OPTIONS } from '../constants/config';

interface FeedbackItem {
  id: string;
  rating: number | null;
  comment: string;
  clientName?: string;
  contact?: string;
  contactConsent: boolean;
  petName?: string;
  createdAt: string;
}

interface AdminFeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshCount?: (count: number) => void;
}

export const AdminFeedbackDrawer: React.FC<AdminFeedbackDrawerProps> = ({
  isOpen,
  onClose,
  onRefreshCount,
}) => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/feedback');
      if (!res.ok) {
        throw new Error(`Erro ${res.status} ao obter registros de feedback.`);
      }
      const json = await res.json();
      const list: FeedbackItem[] = json.data || [];
      setFeedbacks(list);
      if (onRefreshCount) {
        onRefreshCount(list.length);
      }
    } catch (err: unknown) {
      console.error('Erro ao carregar feedbacks:', err);
      setError('Não foi possível sincronizar com o banco de feedbacks interno.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFeedbacks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = feedbacks.filter((item) => {
    if (filterRating === 'all') return true;
    return item.rating === filterRating;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Painel Interno de Feedbacks da CAVET"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#0B4C8C] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-300" />
            <div>
              <h2 className="text-base font-bold">Painel de Feedbacks Privados</h2>
              <p className="text-xs text-blue-100">CAVET Tijuca • Administração Interna</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchFeedbacks}
              disabled={isLoading}
              className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Atualizar lista"
              aria-label="Atualizar lista de feedbacks"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-slate-600 whitespace-nowrap">Filtrar por nota:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterRating('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterRating === 'all'
                  ? 'bg-[#0B4C8C] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Todos ({feedbacks.length})
            </button>
            {[5, 4, 3, 2, 1].map((r) => {
              const count = feedbacks.filter((f) => f.rating === r).length;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFilterRating(r)}
                  className={`px-2 py-1 rounded-md font-medium inline-flex items-center gap-1 transition-colors ${
                    filterRating === r
                      ? 'bg-[#0B4C8C] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{r}★</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* List content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          {isLoading && feedbacks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#0B4C8C]" />
              <span>Carregando feedbacks recebidos...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">Nenhum feedback encontrado nesta categoria.</p>
              <p className="text-xs text-slate-400 mt-1">
                Envie um relato pelo botão "Enviar feedback privado" para testar a recepção em tempo real.
              </p>
            </div>
          ) : (
            filtered.map((fb) => (
              <div
                key={fb.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {fb.rating ? (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{fb.rating} estrelas</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-medium text-slate-700">{RATING_OPTIONS[fb.rating]?.label}</span>
                      </div>
                    ) : (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        Sem nota
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(fb.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {fb.comment && (
                  <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-wrap">
                    "{fb.comment}"
                  </p>
                )}

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {fb.clientName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <strong>Tutor:</strong> {fb.clientName}
                    </span>
                  )}

                  {fb.petName && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <strong>Pet:</strong> {fb.petName}
                    </span>
                  )}

                  {fb.contact && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-500" />
                      {fb.contact}
                    </span>
                  )}

                  {fb.contactConsent && (
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Autorizou contato
                    </span>
                  )}
                </div>

                <div className="mt-1 text-[10px] text-slate-400 font-mono">
                  ID: {fb.id}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Dados sincronizados com o servidor Express local da aplicação
        </div>
      </div>
    </div>
  );
};
