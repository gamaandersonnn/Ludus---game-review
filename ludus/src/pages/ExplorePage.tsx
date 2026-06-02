import Header from "../components/Header.js";
import { getTrendingGames } from "../services/gameService.js";
import springApi from "../services/springApi.js";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  name: string;
  background_image: string;
}

interface Status {
  type: "success" | "error";
  message: string;
}

function ExplorePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      const data = await getTrendingGames(1);
      setGames(data.results);
      setHasMore(!!data.next);
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  async function handleLoadMore() {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    const data = await getTrendingGames(nextPage);
    setGames((prev) => [...prev, ...data.results]);
    setHasMore(!!data.next);
    setPage(nextPage);
    setIsLoadingMore(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Explorar
          </p>
          <h1 className="text-4xl font-black leading-none tracking-tight text-white md:text-5xl">
            Jogos Populares
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Os títulos mais adicionados nos últimos 30 dias — encontre seu
            próximo favorito.
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-amber-400/40 via-white/5 to-transparent" />
        </div>

        {isLoading ? (
          <ExploreGridSkeleton />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {games.map((game, index) => (
                <ExploreGameCard key={game.id} game={game} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400/30 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isLoadingMore ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                      Carregando...
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4 text-amber-400 transition-transform duration-300 group-hover:translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Carregar mais jogos
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ── ExploreGameCard com modal de avaliação ── */

interface ExploreGameCardProps {
  game: Game;
  index: number;
}

function ExploreGameCard({ game, index }: ExploreGameCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | null>(null);

  function handleClose() {
    setIsOpen(false);
    setRating(0);
    setComment("");
    setStatus(null);
  }

  async function handleSaveReview() {
    if (rating === 0) {
      setStatus({ type: "error", message: "Por favor, selecione uma nota." });
      return;
    }
    setIsSaving(true);
    setStatus(null);
    try {
      await springApi.post("/reviews", {
        name: game.name,
        rating,
        comment,
        backgroundImg: game.background_image,
      });
      setStatus({ type: "success", message: "Avaliação salva com sucesso!" });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Ocorreu um erro ao salvar sua avaliação.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden rounded-2xl bg-[#13131a] text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
      >
        <div className="absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-amber-400 backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={game.background_image}
            alt={game.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-[#13131a]/40 to-transparent" />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-tr from-amber-400/5 via-transparent to-amber-400/10" />
        </div>

        <div className="px-4 py-4">
          <h3 className="text-sm font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-amber-400">
            {game.name}
          </h3>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-600">
              Avaliar
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60">
            <div className="relative h-36 overflow-hidden">
              <img
                src={game.background_image}
                alt={game.name}
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                Avaliar jogo
              </p>
              <h3 className="mt-1 text-xl font-black text-white leading-tight">
                {game.name}
              </h3>

              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Sua nota
                  </p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all duration-200 ${
                          star <= rating
                            ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30 scale-110"
                            : "bg-white/[0.06] text-slate-600 hover:bg-white/10 hover:text-slate-400"
                        }`}
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
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    placeholder="Deixe sua opinião sobre o jogo..."
                    className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm text-white placeholder-slate-600 outline-none transition focus:border-amber-400/40 focus:bg-white/[0.06] resize-none"
                  />
                  <span className="text-[10px] text-slate-500">
                    {comment.length}/1000
                  </span>
                </div>

                {status && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      status.type === "success"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-2xl border border-white/10 bg-transparent py-3 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    disabled={isSaving || status?.type === "success"}
                    className="flex-1 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
                  >
                    {isSaving ? "Salvando..." : "Salvar avaliação"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Skeleton ── */

function ExploreGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-[#13131a]">
          <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
          <div className="px-4 py-4 space-y-2.5">
            <div className="relative h-3.5 w-3/4 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="skeleton-shimmer absolute inset-0" />
            </div>
            <div className="relative h-3 w-1/2 overflow-hidden rounded-full bg-white/[0.04]">
              <div className="skeleton-shimmer absolute inset-0" />
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.06) 40%, rgba(251,191,36,0.12) 50%, rgba(251,191,36,0.06) 60%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default ExplorePage;
