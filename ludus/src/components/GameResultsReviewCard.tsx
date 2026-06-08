import { useState } from "react";
import springApi from "../services/springApi.js";

type GameStatus =
  | "QUERO_JOGAR"
  | "JOGANDO"
  | "ZERADO"
  | "COMPLETO"
  | "ADIADO"
  | "DROPADO";

const statusOptions: { value: GameStatus; label: string; emoji: string }[] = [
  { value: "JOGANDO", label: "Jogando", emoji: "🎮" },
  { value: "ZERADO", label: "Zerado", emoji: "✅" },
  { value: "COMPLETO", label: "Completo", emoji: "🏆" },
  { value: "ADIADO", label: "Adiado", emoji: "⏸️" },
  { value: "DROPADO", label: "Dropado", emoji: "❌" },
];

interface Game {
  id: number;
  name: string;
  background_image: string;
}

interface Status {
  type: "success" | "error";
  message: string;
}

interface GameResultProps {
  games: Game[];
}

function GameResult({ games }: GameResultProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | null>(null);

  const stars = [1, 2, 3, 4, 5];

  function handleClose() {
    setSelectedGame(null);
    setRating(0);
    setComment("");
    setGameStatus(null);
    setStatus(null);
  }

  async function handleSaveReview() {
    if (rating === 0) {
      setStatus({ type: "error", message: "Por favor, selecione uma nota." });
      return;
    }
    if (!gameStatus) {
      setStatus({
        type: "error",
        message: "Por favor, selecione o status do jogo.",
      });
      return;
    }
    setIsSaving(true);
    setStatus(null);

    try {
      await springApi.post("/reviews", {
        name: selectedGame!.name,
        rating,
        comment,
        backgroundImg: selectedGame!.background_image,
        status: gameStatus,
        favorite: false,
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
    <div className="space-y-8">
      {!games || games.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl">
            🎮
          </div>
          <p className="text-sm font-medium text-slate-500">
            Não encontramos jogos para essa busca.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => {
                setSelectedGame(game);
                setStatus(null);
              }}
              className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#13131a] text-left transition-all duration-500 hover:-translate-y-1 hover:border-amber-400/20 hover:shadow-2xl hover:shadow-black/60"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src={game.background_image || "/placeholder-game.png"}
                  alt={game.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold leading-snug text-white line-clamp-2 transition-colors group-hover:text-amber-400">
                  {game.name}
                </h3>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600 transition-colors group-hover:text-amber-400/70">
                    Avaliar
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60">
            <div className="relative h-36 overflow-hidden">
              <img
                src={selectedGame.background_image}
                alt={selectedGame.name}
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

            <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                Avaliar jogo
              </p>
              <h3 className="mt-1 text-xl font-black text-white leading-tight">
                {selectedGame.name}
              </h3>

              <div className="mt-6 space-y-5">
                {/* Status */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGameStatus(opt.value)}
                        className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                          gameStatus === opt.value
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

                {/* Nota */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Sua nota
                  </p>
                  <div className="flex items-center gap-2">
                    {stars.map((star) => (
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

                {/* Comentário */}
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
                    className={`rounded-2xl border px-4 py-3 text-sm ${status.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-red-500/20 bg-red-500/10 text-red-400"}`}
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
    </div>
  );
}

export default GameResult;
