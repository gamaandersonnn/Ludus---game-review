import { useState } from "react";
import { Link, useNavigate } from "react-router";

interface User {
  name: string;
  picture: string;
}

function Header() {
  const isAuthenticated = true;
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const user: User = {
    name: "Anderson",
    picture: "https://i.pravatar.cc/150?img=3",
  };
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 shrink-0"
        >
          <span className="text-xl font-black tracking-[0.2em] text-white transition-all duration-300 group-hover:tracking-[0.3em]">
            LUDUS
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 transition-all duration-300 group-hover:scale-150" />
        </button>

        <form
          className="flex flex-1 max-w-xl items-center"
          onSubmit={handleSearchSubmit}
        >
          <div className="group flex w-full items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 transition-all duration-300 focus-within:border-amber-400/40 focus-within:bg-white/[0.08] hover:border-white/20">
            <svg
              className="h-4 w-4 shrink-0 text-slate-500 transition group-focus-within:text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 12.15 12.15z"
              />
            </svg>
            <input
              type="search"
              placeholder="Pesquisar jogos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate("/explore")}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            Explorar
          </button>

          {isAuthenticated ? (
            <div className="relative flex items-center gap-3">
              <span className="hidden text-sm font-medium text-slate-300 md:inline">
                {user?.name || "jogador"}
              </span>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/10 transition hover:ring-amber-400/60"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt="user"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-white">
                      👤
                    </div>
                  )}
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#13131a] shadow-2xl shadow-black/50">
                    <div className="p-1">
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <span className="text-base">👤</span> Perfil
                      </button>
                      <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
                        <span className="text-base">🚪</span> Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
            >
              👤
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
