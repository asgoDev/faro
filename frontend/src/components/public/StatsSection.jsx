export default function StatsSection({ stats, isLoading }) {
  // Fallbacks in case stats are not loaded yet
  const total = stats?.total ?? 0;
  const encontrados = stats?.encontrados ?? 0;
  const desaparecidos = stats?.desaparecidos ?? 0;

  return (
    <section className="px-4 py-8 bg-white/5 border-y border-white/10">
      <div className=" max-w-lg mx-auto">
        <div className="flex flex-col items-center p-3 glass-card rounded-lg text-center">
          {isLoading ? (
            <div className="h-8 w-12 bg-white/10 animate-pulse rounded mb-1"></div>
          ) : (
            <span className="font-display-lg text-3xl sm:text-2xl text-[#fecb00] font-bold font-montserrat">
              {total.toLocaleString()}
            </span>
          )}
          <span className="font-label-sm text-[9px] sm:text-[10px] uppercase text-white/70 tracking-tight leading-tight">
            Venezolanos rescatados
          </span>
        </div>
      </div>
    </section>
  );
}
