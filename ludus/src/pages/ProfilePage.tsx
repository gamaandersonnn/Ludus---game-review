import Header from "../components/Header.js";

function ProfilePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Perfil
          </p>
          <h1 className="text-4xl font-semibold text-slate-950">
            Suas Avaliações:
          </h1>
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
