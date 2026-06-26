import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useReportPersonFound } from '../../hooks/useMissingQueries';

export default function PersonDetailModal({ person, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [informanteName, setInformanteName] = useState('');
  const [informanteEmail, setInformanteEmail] = useState('');
  const [compromisoChecked, setCompromisoChecked] = useState(false);

  const reportMutation = useReportPersonFound();

  if (!person) return null;

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!informanteName || !informanteEmail || !compromisoChecked) {
      toast.error('Por favor complete todos los campos y acepte la declaración.');
      return;
    }

    reportMutation.mutate(
      {
        id: person._id,
        nombre: informanteName.trim(),
        email: informanteEmail.trim(),
      },
      {
        onSuccess: () => {
          toast.success('¡Reporte guardado! Gracias por tu civismo y solidaridad.');
          onClose(); // Cerrar el modal principal
        },
        onError: (err) => {
          const errMsg = err.response?.data?.message || 'Error al enviar el reporte. Por favor intente de nuevo.';
          toast.error(errMsg);
        },
      }
    );
  };

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
          className="absolute top-4 right-4 z-30 bg-black/60 text-[#fecb00] rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-all border border-white/10 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>

        {/* Large Header Image Area */}
        <div className="relative h-64 sm:h-72 w-full bg-gradient-to-b from-transparent to-black/85 overflow-hidden flex items-end justify-center shrink-0">
          {person.fotoUrl ? (
            <img
              src={person.fotoUrl}
              alt={person.nombreCompleto}
              onClick={() => setIsZoomed(true)}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in hover:scale-105 "
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
              {person.estado === 'ENCONTRADO' ? 'Encontrado' : 'Encontrado'}
            </span>
          </div>

          {/* Click to expand hint overlay */}
          {person.fotoUrl && (
            <div className="absolute top-4 right-14 z-10 bg-black/40 text-white/95 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-white/10 backdrop-blur-sm pointer-events-none select-none">
              <span className="material-symbols-outlined text-xs">zoom_in</span>
              Ampliar
            </div>
          )}

          {/* Text/Identity overlay */}
          <div className="relative z-10 p-5 text-center w-full bg-gradient-to-t from-black/95 via-black/50 to-transparent">
            <h3 className="text-xl sm:text-2xl font-black font-montserrat text-white uppercase tracking-tight">
              {person.nombreCompleto}
            </h3>
            <div className="flex gap-2 mt-1.5 justify-center text-[10px] font-bold tracking-wider text-[#fecb00]">
              <span className="bg-white/10 px-3 py-0.5 rounded-full uppercase">{person.edad} AÑOS</span>
              <span className="bg-white/10 px-3 py-0.5 rounded-full uppercase">
                {person.sexo === 'M' ? 'MASCULINO' : person.sexo === 'F' ? 'FEMENINO' : 'OTRO'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area - Frosted Card Slots */}
        <div className="p-5 space-y-3.5 max-h-[35vh] overflow-y-auto custom-scrollbar bg-[#00346f]/50">
          {/* Last Location */}
          <div className="glass-card p-4 rounded-2xl flex gap-3.5 items-start hover:border-white/20 transition-colors">
            <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-xl mt-0.5">location_on</span>
            <div className="min-w-0 flex-1">
              <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Última Ubicación</h5>
              <p className="text-sm text-white/90 mt-0.5 leading-normal font-medium">{person.ultimaUbicacion}</p>
            </div>
          </div>

          {/* Particular Features */}
          {person.rasgosParticulares && (
            <div className="glass-card p-4 rounded-2xl flex gap-3.5 items-start hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-xl mt-0.5">visibility</span>
              <div className="min-w-0 flex-1">
                <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Rasgos Particulares</h5>
                <p className="text-sm text-white/90 mt-0.5 leading-relaxed font-medium whitespace-pre-wrap">
                  {person.rasgosParticulares}
                </p>
              </div>
            </div>
          )}

          {/* Registered and Phone Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Phone */}
            <div className="glass-card p-4 rounded-2xl flex gap-3.5 items-start hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-xl">call</span>
              <div className="min-w-0 flex-1">
                <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Teléfono</h5>
                <a
                  href={`tel:${person.telefonoContacto}`}
                  className="text-xs text-white hover:text-[#fecb00] font-bold mt-0.5 block truncate underline"
                >
                  {person.telefonoContacto}
                </a>
              </div>
            </div>

            {/* Date Registered */}
            <div className="glass-card p-4 rounded-2xl flex gap-3.5 items-start hover:border-white/20 transition-colors">
              <span className="material-symbols-outlined text-[#fecb00] shrink-0 text-xl">calendar_month</span>
              <div className="min-w-0 flex-1">
                <h5 className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Reportado el</h5>
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

        {/* Footer Area - Replaced call button with Report as Found button */}
        <div className="p-4 border-t border-white/10 bg-[#002d60] flex gap-2">
          
        </div>

        {/* Report Overlay Form */}
        {showReportForm && (
          <div className="absolute inset-0 z-40 bg-[#002244] flex flex-col p-5 overflow-y-auto animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4 shrink-0">
              <h4 className="font-bold text-white font-montserrat text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">favorite</span>
                Reportar Hallazgo
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowReportForm(false);
                  setInformanteName('');
                  setInformanteEmail('');
                  setCompromisoChecked(false);
                }}
                className="text-white/60 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="flex-1 flex flex-col gap-3.5">
              <p className="text-xs text-white/80 leading-normal font-medium">
                Ingresa tus datos cívicos para completar el reporte y retirar la alerta de búsqueda.
              </p>

              <div>
                <label className="text-[9px] text-white/50 uppercase font-extrabold tracking-wider mb-1 block">
                  Tu Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={informanteName}
                  onChange={(e) => setInformanteName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="text-[9px] text-white/50 uppercase font-extrabold tracking-wider mb-1 block">
                  Tu Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={informanteEmail}
                  onChange={(e) => setInformanteEmail(e.target.value)}
                  placeholder="Ej: juan.perez@gmail.com"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Solemn Pledge Box */}
              <div className="bg-emerald-950/40 border border-emerald-500/25 p-3.5 rounded-xl text-[10px] text-emerald-200 font-medium tracking-wide leading-relaxed space-y-1.5 mt-1">
                <p className="font-extrabold text-[#fecb00] uppercase tracking-wider flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-sm">balance</span>
                  Compromiso Moral y Cívico
                </p>
                <p>
                  Bajo mi conciencia moral, civil y espiritual, juro solemnemente y doy fe de que la información que estoy proporcionando es absolutamente verídica y que esta persona ha sido localizada sana y salva.
                </p>
                <p className="font-bold text-white/90">
                  Entiendo que emitir un reporte de localización falso constituye una falta grave al honor, sabotea la búsqueda de personas reales y perjudica a familias en momentos de angustia.
                </p>
              </div>

              {/* Pledge Checkbox */}
              <label className="flex items-start gap-2.5 text-[10px] text-white/80 select-none cursor-pointer mt-1 font-medium leading-tight">
                <input
                  type="checkbox"
                  required
                  checked={compromisoChecked}
                  onChange={(e) => setCompromisoChecked(e.target.checked)}
                  className="mt-0.5 accent-emerald-500 rounded border-white/20 bg-white/10 shrink-0 cursor-pointer"
                />
                <span>Juro bajo mi honor cívico la veracidad del hallazgo y asumo la responsabilidad moral del reporte.</span>
              </label>

              {/* Submit / Cancel Actions */}
              <div className="mt-auto pt-4 flex gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportForm(false);
                    setInformanteName('');
                    setInformanteEmail('');
                    setCompromisoChecked(false);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-white/90 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer text-center border border-white/5 active:scale-95"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={!informanteName || !informanteEmail || !compromisoChecked || reportMutation.isPending}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-35 disabled:pointer-events-none text-white py-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer text-center border border-emerald-400/20 active:scale-95 flex items-center justify-center gap-1.5 shadow-md font-montserrat"
                >
                  {reportMutation.isPending ? 'ENVIANDO...' : 'CONFIRMAR HALLAZGO'}
                </button>
              </div>
            </form>
          </div>
        )}
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
