import Header from "../components/Header.js";

function ExplorePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Explorar
          </p>
          <h1 className="text-4xl font-semibold text-slate-950">
            Trendings Games
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Confira os jogos mais populares do Ludus.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
