import Header from "../components/Header.js";
import { getGames } from "../services/gameService.js";
import { useEffect, useState } from "react";
import GameResults from "../components/GameResults.js";
import GameResultsSkeleton from "../components/GameResultsSkeleton.js";
import { useSearchParams } from "react-router-dom";

interface Game {
  id: number;
  name: string;
  background_image: string;
}

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let errorMessage: string | null = null;

  useEffect(() => {
    if (!query) return;

    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const data = await getGames(query);
        setGames(data.results);
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {query ? (
          errorMessage ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 px-8 py-14 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
                ⚠️
              </div>
              <h1 className="text-xl font-bold text-red-400">Erro na busca</h1>
              <p className="mt-3 text-sm leading-6 text-red-400/70">
                {errorMessage}
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-10">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                  Resultados
                </p>
                <h1 className="text-4xl font-black tracking-tight text-white">
                  "{query}"
                </h1>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-amber-400/40 via-white/5 to-transparent" />
              </div>
              {isLoading ? (
                <GameResultsSkeleton />
              ) : (
                <GameResults games={games} />
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.04] text-3xl">
              🎮
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Comece aqui
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Busque um jogo
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Digite o nome do jogo na barra de pesquisa e pressione Enter para
              ver os resultados.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
