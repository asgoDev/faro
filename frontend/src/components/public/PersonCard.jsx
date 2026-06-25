import React from 'react';

export default function PersonCard({ person, onClick }) {
  return (
    <div
      onClick={onClick}
      className="glass-card p-4 rounded-xl flex items-center gap-3.5 active:bg-white/20 transition-all cursor-pointer hover:border-white/40"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-white font-montserrat truncate text-base">
            {person.nombreCompleto}
          </h4>
          <span
            className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full tracking-wider shrink-0 ${person.estado === 'ENCONTRADO'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
          >
            {person.estado === 'ENCONTRADO' ? 'Encontrado' : 'Activo'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-white/70 text-sm mt-1.5">
          <span className="material-symbols-outlined text-xs shrink-0">location_on</span>
          <span className="truncate">{person.ultimaUbicacion}</span>
        </div>
      </div>

      <span className="material-symbols-outlined text-white/40 shrink-0">chevron_right</span>
    </div>
  );
}
