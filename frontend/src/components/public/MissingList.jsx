import React from 'react';
import PersonCard from './PersonCard';

export default function MissingList({
  persons,
  isLoading,
  total,
  page,
  pages,
  onPageChange,
  onPersonClick,
  estado,
  setEstado,
  sexo,
  setSexo,
  isError,
  error,
}) {
  return (
    <section className="px-4 py-8 flex flex-col gap-4 w-full max-w-xl mx-auto">
      {/* Title & Total Count */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-headline-md text-lg sm:text-xl text-white font-bold font-montserrat uppercase tracking-tight">
          Casos Reportados
        </h3>
        <span className="text-xs text-[#fecb00] font-bold font-montserrat bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          Total: {isLoading ? '...' : `${total}`}
        </span>
      </div>

      {/* Filter Selectors Bar */}
      <div className="glass-card p-3 rounded-2xl flex gap-3.5 w-full border border-white/10 shadow-lg">
        

        <div className="flex-1">
          <label className="text-[9px] text-white/50 uppercase font-extrabold tracking-wider mb-1 block">
            Filtrar por Sexo
          </label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all cursor-pointer"
          >
            <option value="" className="bg-[#00346f] text-white font-semibold">Todos</option>
            <option value="M" className="bg-[#00346f] text-white font-semibold">Masculino</option>
            <option value="F" className="bg-[#00346f] text-white font-semibold">Femenino</option>
            <option value="Otro" className="bg-[#00346f] text-white font-semibold">Otro</option>
          </select>
        </div>
      </div>

      {/* Cards List Container */}
      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* Rate Limit Error Banner */}
        {isError && error?.response?.status === 429 && (
          <div className="glass-card border-red-500/30 bg-red-500/10 p-4 rounded-xl flex items-start gap-3 text-red-200 text-xs font-bold uppercase tracking-wide animate-pulse">
            <span className="material-symbols-outlined text-red-400 shrink-0 mt-0.5">warning</span>
            <div className="flex-1">
              <p className="font-extrabold text-red-300">Límite de Consultas Excedido</p>
              <p className="text-[10px] text-white/70 font-semibold lowercase first-letter:uppercase mt-0.5 leading-normal">
                {error.response?.data?.message || 'Has realizado demasiadas búsquedas o consultas de forma consecutiva. Por favor, espera un momento antes de continuar.'}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          // Portrait skeleton loaders matching the new PersonCard design
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="glass-card p-3 rounded-xl flex items-center gap-4 animate-pulse">
              {/* Portrait Image Skeleton */}
              <div className="w-16 h-20 bg-white/10 rounded-lg shrink-0 border border-white/5"></div>

              {/* Information Area Skeleton */}
              <div className="flex-1 space-y-2.5 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-3.5 bg-white/15 rounded-full w-12 shrink-0"></div>
                </div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
                {/* Badges Skeleton */}
                <div className="flex gap-1.5 mt-2">
                  <div className="h-3 bg-white/10 rounded-full w-12"></div>
                  <div className="h-3 bg-white/10 rounded-full w-10"></div>
                </div>
              </div>
            </div>
          ))
        ) : persons.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl px-4 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-white/40">person_search</span>
            <p className="text-white/80 font-bold font-montserrat">No se encontraron reportes activos</p>
            <p className="text-white/60 text-xs font-montserrat">
              Prueba cambiando los filtros o la búsqueda por nombre.
            </p>
          </div>
        ) : (
          persons.map((person) => (
            <PersonCard
              key={person._id}
              person={person}
              onClick={() => onPersonClick(person)}
            />
          ))
        )}
      </div>

      {/* Pagination controls */}
      {!isLoading && pages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2 py-3 glass-card rounded-xl">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="flex items-center justify-center p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <span className="text-xs font-montserrat font-semibold text-white/80">
            Pág. {page} de {pages}
          </span>

          <button
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
            className="flex items-center justify-center p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </section>
  );
}

