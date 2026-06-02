import Header from "./components/Header.js";
import GameCard from "./components/GameCard.js";
import GameCardSkeleton from "./components/GameCardSkeleton.js";
import { getRandomGames } from "./services/gameService.js";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  name: string;
  background_image: string;
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  async function fetchRandom() {
    setIsLoading(true);
    const data = await getRandomGames();
    setGames(data.results);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRandom();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Descoberta
            </p>
            <h1 className="text-4xl font-black leading-none tracking-tight text-white md:text-5xl">
              Jogos Aleatórios
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Uma seleção surpresa do universo de jogos — sorteie novamente para
              descobrir mais.
            </p>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-amber-400/40 via-white/5 to-transparent" />
        </div>

        {isLoading ? <GameCardSkeleton /> : <GameCard games={games} />}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={fetchRandom}
            disabled={isLoading}
            className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-amber-400/30 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              className={`h-4 w-4 text-amber-400 transition-transform duration-500 ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`}
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
            Sortear novamente
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
