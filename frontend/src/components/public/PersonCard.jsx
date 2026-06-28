import React, { useState } from 'react';
import { getThumbnailUrl } from '../../utils/cloudinary';

export default function PersonCard({ person, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const thumbnailUrl = getThumbnailUrl(person.fotoUrl);

  return (
    <div
      onClick={onClick}
      className="glass-card p-3 rounded-xl flex items-center gap-4 active:bg-white/20 transition-all cursor-pointer hover:border-white/40 "
    >
      {/* Portrait Image Container */}
      <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-white/10 flex items-center justify-center border border-white/15 shadow-inner">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={person.nombreCompleto}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'
              }`}
          />
        ) : (
          <span className="material-symbols-outlined text-white/30 text-3xl">person</span>
        )}
      </div>

      {/* Text Information Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-white font-montserrat truncate text-base capitalize">
            {person.nombreCompleto.toLowerCase()}
          </h4>
        </div>

        <div className="flex items-center gap-1 text-white/70 text-xs sm:text-sm mt-1.5">
          <span className="material-symbols-outlined text-xs shrink-0">location_on</span>
          <span className="truncate">{person.ultimaUbicacion}</span>
        </div>

        {/* Informative Badges (Age and Gender) */}
        <div className="flex items-center gap-1.5 mt-2">
          {person.edad && <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-white/80 font-bold uppercase tracking-wider">
            {person.edad} años
          </span>}
          {person.sexo && <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-white/80 font-bold uppercase tracking-wider">
            {person.sexo === 'M' ? 'Masculino' : person.sexo === 'F' ? 'Femenino' : 'Otro'}
          </span>}
        </div>
      </div>

      <span className="material-symbols-outlined text-white/40 shrink-0">chevron_right</span>
    </div>
  );
}
