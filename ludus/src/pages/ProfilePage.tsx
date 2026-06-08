import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header.js";
import ReviewCard from "../components/ReviewCard.js";
import ReviewCardSkeleton from "../components/ReviewCardSkeleton.js";
import springApi from "../services/springApi.js";
import { useAuth } from "../hooks/useAuth.js";
import { loginWithGoogle } from "../services/firebase.js";

type GameStatus =
  | "FAVORITOS"
  | "JOGANDO"
  | "ZERADO"
  | "COMPLETO"
  | "ADIADO"
  | "DROPADO";
type TabStatus = "TODOS" | "FAVORITOS" | GameStatus;

const tabs = [
  { value: "TODOS", label: "Todos", emoji: "🗂️" },
  { value: "FAVORITOS", label: "Favoritos", emoji: "⭐" }, // <- novo
  { value: "JOGANDO", label: "Jogando", emoji: "🎮" },
  { value: "ZERADO", label: "Zerado", emoji: "✅" },
  { value: "COMPLETO", label: "Completo", emoji: "🏆" },
  { value: "ADIADO", label: "Adiado", emoji: "⏸️" },
  { value: "DROPADO", label: "Dropado", emoji: "❌" },
];

interface Review {
  id: number;
  name: string;
  backgroundImg: string;
  rating: number;
  comment: string;
  status: GameStatus;
  createdAt: string;
}

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabStatus>("TODOS");

  useEffect(() => {
    if (!user) return;
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const { data } = await springApi.get<Review[]>("/reviews");
        setReviews(data);
      } catch (error) {
        console.error("Erro ao buscar reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [user]);

  const filteredReviews =
    activeTab === "TODOS"
      ? reviews
      : activeTab === "FAVORITOS"
        ? reviews.filter((r) => r.favorite)
        : reviews.filter((r) => r.status === activeTab);

  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-slate-500 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl font-bold">Você não está logado</p>
        <button
          onClick={loginWithGoogle}
          className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-slate-900 hover:bg-amber-300"
        >
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Profile hero */}
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? undefined}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/10"
              />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-slate-900">
                ★
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                Perfil
              </p>
              <h1 className="mt-0.5 text-3xl font-black leading-none tracking-tight text-white md:text-4xl">
                {user.displayName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-[#13131a] px-5 py-4 text-center">
              <p className="text-2xl font-black text-white">{totalReviews}</p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Reviews
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#13131a] px-5 py-4 text-center">
              <p className="text-2xl font-black text-amber-400">
                {averageRating > 0 ? averageRating.toFixed(1) : "—"}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Média
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[#13131a] px-5 py-4 text-center">
              <div className="flex items-center justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`text-base ${s <= Math.round(averageRating) ? "text-amber-400" : "text-white/10"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                Nota geral
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 via-white/5 to-transparent" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600">
            Minhas avaliações
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const count =
              tab.value === "TODOS"
                ? reviews.length
                : tab.value === "FAVORITOS"
                  ? reviews.filter((r) => r.favorite).length
                  : reviews.filter((r) => r.status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.value
                    ? "bg-amber-400 text-slate-900"
                    : "bg-white/[0.06] text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.emoji} {tab.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === tab.value ? "bg-slate-900/30" : "bg-white/10"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {isLoading ? (
          <ReviewCardSkeleton />
        ) : filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/[0.04] text-3xl">
              🎮
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              Nada por aqui ainda
            </p>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Nenhuma avaliação
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              {activeTab === "TODOS"
                ? "Explore jogos em alta e deixe sua opinião."
                : `Você não tem jogos com status "${tabs.find((t) => t.value === activeTab)?.label}".`}
            </p>
          </div>
        ) : (
          <ReviewCard reviews={filteredReviews} onReviewsChange={setReviews} />
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
