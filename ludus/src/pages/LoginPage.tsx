const error =
  "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.";
const status =
  "Use sua conta google para acessar o Ludus. Se for seu primeiro acesso, uma conta será criada automaticamente.";

function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto mt-40 max-w-3xl rounded-4xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/60">
        <div className="space-y-6 text-center">
          <span className="inline-flex rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
            Login
          </span>
          <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">
            Faça login para acessar o Ludus
          </h1>
        </div>

        <div className="mt-10 space-y-4">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-3xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <span className="text-xl">
              <img src="/google.svg" alt="Google" width={24} height={24} />
            </span>
            Entrar com Google
          </button>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
              {status}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
