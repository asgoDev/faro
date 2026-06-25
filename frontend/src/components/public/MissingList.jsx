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
}) {
  return (
    <section className="px-4 py-8 flex flex-col gap-4 w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-headline-md text-lg sm:text-xl text-white font-bold font-montserrat">
          Casos Reportados
        </h3>
        <span className="text-xs text-white/60 font-semibold font-montserrat">
          Total: {isLoading ? '...' : `${total}`}
        </span>
      </div>

      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
        {isLoading ? (
          // Skeleton loaders
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="glass-card p-4 rounded-xl flex items-center gap-3.5 animate-pulse">
              <div className="flex-1 space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-3.5 bg-white/15 rounded-full w-12"></div>
                </div>
                <div className="h-3 bg-white/10 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : persons.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl px-4 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-4xl text-white/40">person_search</span>
            <p className="text-white/80 font-bold font-montserrat">No se encontraron reportes activos</p>
            <p className="text-white/60 text-xs font-montserrat">
              No hay registros aún.
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

