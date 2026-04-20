function GameCardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 py-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-[#13131a]">
          <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>

          <div className="px-4 py-4 space-y-2.5">
            <div className="relative h-3.5 w-3/4 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="skeleton-shimmer absolute inset-0" />
            </div>
            <div className="relative h-3 w-1/2 overflow-hidden rounded-full bg-white/[0.04]">
              <div className="skeleton-shimmer absolute inset-0" />
            </div>
          </div>
        </div>
      ))}

      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(251, 191, 36, 0.06) 40%,
            rgba(251, 191, 36, 0.12) 50%,
            rgba(251, 191, 36, 0.06) 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default GameCardSkeleton;
