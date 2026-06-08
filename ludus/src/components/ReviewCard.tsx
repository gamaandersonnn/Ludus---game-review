import { useState } from "react";
import springApi from "../services/springApi.js";

type GameStatus = "JOGANDO" | "ZERADO" | "COMPLETO" | "ADIADO" | "DROPADO";

const statusOptions: { value: GameStatus; label: string; emoji: string }[] = [
  { value: "JOGANDO", label: "Jogando", emoji: "🎮" },
  { value: "ZERADO", label: "Zerado", emoji: "✅" },
  { value: "COMPLETO", label: "Completo", emoji: "🏆" },
  { value: "ADIADO", label: "Adiado", emoji: "⏸️" },
  { value: "DROPADO", label: "Dropado", emoji: "❌" },
];

const statusConfig: Record<
  GameStatus,
  { label: string; emoji: string; color: string }
> = {
  JOGANDO: {
    label: "Jogando",
    emoji: "🎮",
    color: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  ZERADO: {
    label: "Zerado",
    emoji: "✅",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  COMPLETO: {
    label: "Completo",
    emoji: "🏆",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  ADIADO: {
    label: "Adiado",
    emoji: "⏸️",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  DROPADO: {
    label: "Dropado",
    emoji: "❌",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
  },
};

interface Review {
  id: number;
  name: string;
  backgroundImg: string;
  rating: number;
  comment: string;
  status: GameStatus;
  favorite: boolean;
  createdAt: string;
}

interface ReviewCardProps {
  reviews: Review[];
  onReviewsChange: (reviews: Review[]) => void;
}

type ModalMode = "view" | "edit" | "confirmDelete";

function ReviewCard({ reviews, onReviewsChange }: ReviewCardProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>("view");
  const [editRating, setEditRating] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>("");
  const [editStatus, setEditStatus] = useState<GameStatus | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  function handleOpen(review: Review) {
    setSelectedReview(review);
    setModalMode("view");
  }

  function handleClose() {
    setSelectedReview(null);
    setModalMode("view");
    setEditRating(0);
    setEditComment("");
    setEditStatus(null);
  }

  function handleStartEdit() {
    if (!selectedReview) return;
    setEditRating(selectedReview.rating);
    setEditComment(selectedReview.comment);
    setEditStatus(selectedReview.status);
    setModalMode("edit");
  }

  async function handleToggleFavorite(review: Review, e: React.MouseEvent) {
    e.stopPropagation(); // evita abrir o modal ao clicar na estrela
    try {
      await springApi.patch(`/reviews/${review.id}/favorite`);
      onReviewsChange(
        reviews.map((r) =>
          r.id === review.id ? { ...r, favorite: !r.favorite } : r,
        ),
      );
      if (selectedReview?.id === review.id) {
        setSelectedReview({
          ...selectedReview,
          favorite: !selectedReview.favorite,
        });
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    }
  }

  async function handleSaveEdit() {
    if (!selectedReview || !editStatus) return;
    try {
      setIsSaving(true);
      await springApi.put(`/reviews/${selectedReview.id}`, {
        name: selectedReview.name,
        rating: editRating,
        comment: editComment,
        backgroundImg: selectedReview.backgroundImg,
        status: editStatus,
        favorite: selectedReview.favorite,
      });
      const updated = reviews.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              rating: editRating,
              comment: editComment,
              status: editStatus,
            }
          : r,
      );
      onReviewsChange(updated);
      setSelectedReview({
        ...selectedReview,
        rating: editRating,
        comment: editComment,
        status: editStatus,
      });
      setModalMode("view");
    } catch (error) {
      console.error("Erro ao atualizar review:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedReview) return;
    try {
      setIsDeleting(true);
      await springApi.delete(`/reviews/${selectedReview.id}`);
      onReviewsChange(reviews.filter((r) => r.id !== selectedReview.id));
      handleClose();
    } catch (error) {
      console.error("Erro ao apagar review:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="py-2">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {reviews.map((review, index) => {
          const s = statusConfig[review.status];
          return (
            <button
              key={review.id}
              type="button"
              onClick={() => handleOpen(review)}
              className="group relative overflow-hidden rounded-2xl bg-[#13131a] text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
            >
              {/* Index badge */}
              <div className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-amber-400 backdrop-blur-sm">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Favorite button */}
              <button
                type="button"
                onClick={(e) => handleToggleFavorite(review, e)}
                className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition hover:scale-110"
              >
                <span
                  className={`text-sm transition-all ${review.favorite ? "text-amber-400" : "text-white/30 hover:text-white/60"}`}
                >
                  ★
                </span>
              </button>

              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={review.backgroundImg}
                  alt={review.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-[#13131a]/40 to-transparent" />
              </div>

              <div className="px-4 py-4">
                <h3 className="text-sm font-bold leading-snug text-white line-clamp-1 transition-colors group-hover:text-amber-400">
                  {review.name}
                </h3>
                {s && (
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${s.color}`}
                  >
                    {s.emoji} {s.label}
                  </span>
                )}
                <div className="mt-2 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xs ${star <= review.rating ? "text-amber-400" : "text-white/10"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
                    Ver review
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60">
            <div className="relative h-44 overflow-hidden">
              <img
                src={selectedReview.backgroundImg}
                alt={selectedReview.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#13131a]" />
              {/* Favorite no modal */}
              <button
                type="button"
                onClick={(e) => handleToggleFavorite(selectedReview, e)}
                className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition hover:bg-black/70"
              >
                <span
                  className={`text-lg transition-all ${selectedReview.favorite ? "text-amber-400" : "text-white/40"}`}
                >
                  ★
                </span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
              {/* VIEW MODE */}
              {modalMode === "view" && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                    Minha avaliação
                  </p>
                  <h3 className="mt-1 text-xl font-black text-white leading-tight">
                    {selectedReview.name}
                  </h3>

                  {selectedReview.status &&
                    (() => {
                      const s = statusConfig[selectedReview.status];
                      return (
                        <span
                          className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${s.color}`}
                        >
                          {s.emoji} {s.label}
                        </span>
                      );
                    })()}

                  <div className="mt-4 space-y-5">
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Sua nota
                      </p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${star <= selectedReview.rating ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30 scale-110" : "bg-white/[0.06] text-slate-700"}`}
                          >
                            ★
                          </div>
                        ))}
                        <span className="ml-2 text-sm font-bold text-amber-400">
                          {selectedReview.rating}/5
                        </span>
                      </div>
                    </div>

                    {selectedReview.comment && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Comentário
                        </p>
                        <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm text-slate-300 leading-relaxed break-words max-h-40 overflow-y-auto">
                          {selectedReview.comment}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setModalMode("confirmDelete")}
                        className="flex items-center justify-center gap-1.5 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 px-4 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Apagar
                      </button>
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
                      >
                        Editar review
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* EDIT MODE */}
              {modalMode === "edit" && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                    Editar avaliação
                  </p>
                  <h3 className="mt-1 text-xl font-black text-white leading-tight">
                    {selectedReview.name}
                  </h3>

                  <div className="mt-6 space-y-5">
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Status
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {statusOptions.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setEditStatus(opt.value)}
                            className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                              editStatus === opt.value
                                ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30"
                                : "bg-white/[0.06] text-slate-400 hover:bg-white/10"
                            }`}
                          >
                            <span className="text-base">{opt.emoji}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Nova nota
                      </p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all duration-200 ${star <= editRating ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30 scale-110" : "bg-white/[0.06] text-slate-600 hover:bg-white/10 hover:text-slate-400"}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Comentário
                      </label>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        maxLength={1000}
                        rows={4}
                        placeholder="Deixe sua opinião sobre o jogo..."
                        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400/40 focus:bg-white/[0.06] resize-none"
                      />
                      <span className="text-[10px] text-slate-500">
                        {editComment.length}/1000
                      </span>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setModalMode("view")}
                        className="flex-1 rounded-2xl border border-white/10 bg-transparent py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={isSaving || editRating === 0 || !editStatus}
                        className="flex-1 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
                      >
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* CONFIRM DELETE MODE */}
              {modalMode === "confirmDelete" && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-red-400">
                    Apagar avaliação
                  </p>
                  <h3 className="mt-1 text-xl font-black text-white leading-tight">
                    {selectedReview.name}
                  </h3>
                  <div className="mt-6 space-y-5">
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Tem certeza que deseja apagar essa avaliação? Essa ação
                        não pode ser desfeita.
                      </p>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setModalMode("view")}
                        className="flex-1 rounded-2xl border border-white/10 bg-transparent py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
                      >
                        {isDeleting ? "Apagando..." : "Sim, apagar"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
