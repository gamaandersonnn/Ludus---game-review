import Header from "./components/Header.js";
import GameCard from "./components/GameCard.js";
import GameCardSkeleton from "./components/GameCardSkeleton.js";
import { getTrendingGames } from "./services/gameService.js";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  name: string;
  background_image: string;
}

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const buscar = async () => {
      setIsLoading(true);
      const data = await getTrendingGames();
      setGames(data.results);
      setIsLoading(false);
    };
    buscar();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Em destaque
          </p>
          <h1 className="text-4xl font-black leading-none tracking-tight text-white md:text-5xl">
            Jogos em Alta
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Os títulos mais jogados da semana — avalie e compartilhe sua
            opinião.
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-amber-400/40 via-white/5 to-transparent" />
        </div>

        {isLoading ? <GameCardSkeleton /> : <GameCard games={games} />}
      </main>
    </div>
  );
}

export default App;
