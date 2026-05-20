import { useState } from "react";
import springApi from "../services/springApi.js";

interface Review {
  id: number;
  name: string;
  backgroundImg: string;
  rating: number;
  comment: string;
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
  }

  function handleStartEdit() {
    if (!selectedReview) return;
    setEditRating(selectedReview.rating);
    setEditComment(selectedReview.comment);
    setModalMode("edit");
  }

  async function handleSaveEdit() {
    if (!selectedReview) return;
    try {
      setIsSaving(true);
      await springApi.put(`/reviews/${selectedReview.id}`, {
        name: selectedReview.name,
        rating: editRating,
        comment: editComment,
        backgroundImg: selectedReview.backgroundImg,
      });
      const updated = reviews.map((r) =>
        r.id === selectedReview.id
          ? { ...r, rating: editRating, comment: editComment }
          : r,
      );
      onReviewsChange(updated);
      setSelectedReview({
        ...selectedReview,
        rating: editRating,
        comment: editComment,
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
        {reviews.map((review, index) => (
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

            {/* Rating badge */}
            <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-amber-400">
                {review.rating}
              </span>
              <span className="text-[10px] text-amber-400">★</span>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={review.backgroundImg}
                alt={review.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-[#13131a]/40 to-transparent" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-tr from-amber-400/5 via-transparent to-amber-400/10" />
            </div>

            <div className="px-4 py-4">
              <h3 className="text-sm font-bold leading-snug text-white line-clamp-1 transition-colors group-hover:text-amber-400">
                {review.name}
              </h3>
              <div className="mt-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs transition-colors ${star <= review.rating ? "text-amber-400" : "text-white/10"}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-[10px] text-slate-600 line-clamp-1 flex-1">
                  {review.comment}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
                  Ver review
                </span>
                <svg
                  className="h-3 w-3 text-slate-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60">
            {/* Image header */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={selectedReview.backgroundImg}
                alt={selectedReview.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#13131a]" />
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

            <div className="px-6 pb-6">
              {/* ── VIEW MODE ── */}
              {modalMode === "view" && (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                    Minha avaliação
                  </p>
                  <h3 className="mt-1 text-xl font-black text-white leading-tight">
                    {selectedReview.name}
                  </h3>

                  <div className="mt-6 space-y-5">
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

                    {selectedReview.createdAt && (
                      <p className="text-[10px] text-slate-600">
                        Avaliado em{" "}
                        {new Date(selectedReview.createdAt).toLocaleDateString(
                          "pt-BR",
                          { day: "2-digit", month: "long", year: "numeric" },
                        )}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setModalMode("confirmDelete")}
                        className="flex items-center justify-center gap-1.5 rounded-2xl border border-red-500/20 bg-red-500/10 py-3 px-4 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Editar review
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── EDIT MODE ── */}
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
                        disabled={isSaving || editRating === 0}
                        className="flex-1 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
                      >
                        {isSaving ? "Salvando..." : "Salvar alterações"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── CONFIRM DELETE MODE ── */}
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
