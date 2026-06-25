import React, { useState } from 'react';

export default function PersonDetailModal({ person, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!person) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm "
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[#00346f]/95 border border-white/20 rounded-3xl overflow-hidden shadow-2xl z-10 font-montserrat flex flex-col animate-fade-in-up">
        {/* Banner with flag colors */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex z-30">
          <span className="flex-1 bg-[#FCE300]"></span>
          <span className="flex-1 bg-[#0033A0]"></span>
          <span className="flex-1 bg-[#CE1126]"></span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-25 bg-black/40 text-[#fecb00] rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/60 transition-all border border-white/10 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>

        {/* Large Header Image Area (Clean & Unobstructed) */}
        <div className="relative h-80 sm:h-96 w-full bg-[#002d60] overflow-hidden flex items-center justify-center shrink-0">
          {person.fotoUrl ? (
            <img
              src={person.fotoUrl}
              alt={person.nombreCompleto}
              onClick={() => setIsZoomed(true)}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-all duration-300"
            />
          ) : (
            <div className="absolute inset-0 bg-[#004a99] flex flex-col items-center justify-center text-white/40">
              <span className="material-symbols-outlined text-7xl">person</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-md ${person.estado === 'ENCONTRADO'
                ? 'bg-green-500 text-white border border-green-400/30'
                : 'bg-red-500 text-white border border-red-400/30'
                }`}
            >
              {person.estado === 'ENCONTRADO' ? 'Encontrado' : 'Desaparecido'}
            </span>
          </div>

          {/* Click to expand hint overlay */}
          {person.fotoUrl && (
            <div className="absolute top-4 right-14 z-10 bg-black/40 text-white/95 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-white/10 backdrop-blur-sm pointer-events-none select-none">
              <span className="material-symbols-outlined text-xs">zoom_in</span>
              Ampliar
            </div>
          )}
        </div>

        {/* Text/Identity Header Section (Below Image) */}
        <div className="pt-4 pb-3 px-5 border-b border-white/10 bg-[#002d60]/50 text-center shrink-0">
          <h3 className="text-xl font-bold font-montserrat text-white uppercase tracking-tight">
            {person.nombreCompleto}
          </h3>
          <div className="flex gap-2 mt-1.5 justify-center text-[9px] font-bold tracking-wider text-[#fecb00]">
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full uppercase">{person.edad} AÑOS</span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full uppercase">
              {person.sexo === 'M' ? 'MASCULINO' : person.sexo === 'F' ? 'FEMENINO' : 'OTRO'}
            </span>
          </div>
        </div>

        {/* Content Area - Frosted Card Slots (Compact) */}
        <div className="p-4 space-y-2.5 max-h-[30vh] overflow-y-auto custom-scrollbar bg-[#00346f]/50">
          {/* Last Location */}
          <div className="glass-card p-3 rounded-xl flex gap-3 items-start hover:border-white/20 transition-colors">
            <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-lg mt-0.5">location_on</span>
            <div className="min-w-0 flex-1">
              <h5 className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Última Ubicación</h5>
              <p className="text-xs text-white/90 mt-0.5 leading-normal font-medium">{person.ultimaUbicacion}</p>
            </div>
          </div>

          {/* Particular Features */}
          {person.rasgosParticulares && (
            <div className="glass-card p-3 rounded-xl flex gap-3 items-start hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-lg mt-0.5">visibility</span>
              <div className="min-w-0 flex-1">
                <h5 className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Rasgos Particulares</h5>
                <p className="text-xs text-white/90 mt-0.5 leading-relaxed font-medium whitespace-pre-wrap">
                  {person.rasgosParticulares}
                </p>
              </div>
            </div>
          )}

          {/* Registered and Phone Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Phone */}
            <div className="glass-card p-3 rounded-xl flex gap-3 items-start hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-lg">call</span>
              <div className="min-w-0 flex-1">
                <h5 className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Teléfono</h5>
                <a
                  href={`tel:${person.telefonoContacto}`}
                  className="text-xs text-white hover:text-[#fecb00] font-bold mt-0.5 block truncate underline"
                >
                  {person.telefonoContacto}
                </a>
              </div>
            </div>

            {/* Date Registered */}
            <div className="glass-card p-3 rounded-xl flex gap-3 items-start hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-lg">calendar_month</span>
              <div className="min-w-0 flex-1">
                <h5 className="text-[9px] text-white/50 uppercase font-bold tracking-wider">Reportado el</h5>
                <p className="text-xs text-white/90 font-semibold mt-0.5">
                  {new Date(person.fechaRegistro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area with Call button */}
        <div className="p-4 border-t border-white/10 bg-[#002d60] flex gap-2">
          <a
            href={`tel:${person.telefonoContacto}`}
            className="w-full bg-[#fecb00] text-[#6e5700] py-3.5 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-[#ffe08b] active:scale-95 transition-transform text-sm tracking-wide shadow-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            LLAMAR A FAMILIAR
          </a>
        </div>
      </div>

      {/* Lightbox zoom overlay */}
      {isZoomed && person.fotoUrl && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={person.fotoUrl}
            alt={person.nombreCompleto}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/15"
          />
          <span className="text-white/60 text-xs mt-3 select-none font-semibold">Haz clic en cualquier parte para cerrar</span>
        </div>
      )}
    </div>
  );
}
