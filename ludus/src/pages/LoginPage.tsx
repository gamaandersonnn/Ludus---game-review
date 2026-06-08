const error =
  "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.";
const status =
  "Use sua conta google para acessar o Ludus. Se for seu primeiro acesso, uma conta será criada automaticamente.";

function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-amber-400/[0.04] blur-[120px]" />
      </div>

      <section className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-[0.25em] text-white">
              LUDUS
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          <div className="px-8 py-10 space-y-8">
            {/* Heading */}
            <div className="text-center space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                Acesso
              </p>
              <h1 className="text-3xl font-black leading-tight tracking-tight text-white">
                Faça login para
                <br />
                acessar o Ludus
              </h1>
            </div>

            <div className="space-y-3">
              {/* Google button */}
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-amber-400/30 hover:bg-white/[0.08]"
              >
                <img
                  src="/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="shrink-0"
                />
                <span className="flex-1 text-center">Entrar com Google</span>
                <svg
                  className="h-4 w-4 shrink-0 text-slate-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-amber-400"
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
              </button>

              {/* Status / Error */}
              {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <p className="text-xs leading-relaxed text-red-400">
                    {error}
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {status}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-[11px] text-slate-600">
          Ao entrar, você concorda com os{" "}
          <span className="cursor-pointer text-slate-500 underline underline-offset-2 transition-colors hover:text-amber-400">
            Termos de Uso
          </span>{" "}
          do Ludus.
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
