function GameResultsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-white/[0.04] bg-[#13131a]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>

          <div className="p-5 space-y-3">
            <div className="relative h-3.5 w-3/4 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="skeleton-shimmer absolute inset-0" />
            </div>
            <div className="relative h-3 w-1/3 overflow-hidden rounded-full bg-white/[0.04]">
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

export default GameResultsSkeleton;
