import { useEffect, useState } from "react";
import Header from "../components/Header.js";
import ReviewCard from "../components/ReviewCard.js";
import ReviewCardSkeleton from "../components/ReviewCardSkeleton.js";
import springApi from "../services/springApi.js";

interface Review {
  id: number;
  gameName: string;
  gameBackgroundImage: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  picture: string;
  totalReviews: number;
  averageRating: number;
}

function ProfilePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profile] = useState<UserProfile>({
    name: "Anderson",
    picture: "https://i.pravatar.cc/150?img=3",
    totalReviews: 0,
    averageRating: 0,
  });

  useEffect(() => {
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
  }, []);

  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Profile hero */}
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={profile.picture}
                alt={profile.name}
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
                {profile.name}
              </h1>
            </div>
          </div>

          {/* Stats */}
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
                    className={`text-base ${
                      s <= Math.round(averageRating)
                        ? "text-amber-400"
                        : "text-white/10"
                    }`}
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
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 via-white/5 to-transparent" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600">
            Minhas avaliações
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <ReviewCardSkeleton />
        ) : reviews.length === 0 ? (
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
              Explore jogos em alta e deixe sua opinião para ela aparecer aqui.
            </p>
          </div>
        ) : (
          <ReviewCard reviews={reviews} onReviewsChange={setReviews} />
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
