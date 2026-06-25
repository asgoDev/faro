import React, { useState } from 'react';
import TopAppBar from './TopAppBar';

export default function PublicLayout({
  children,
  search,
  setSearch,
}) {
  const [showDevInfo, setShowDevInfo] = useState(false);

  return (
    <div className="bg-[#004a99] text-white min-h-screen flex flex-col font-montserrat">
      {/* Top Header */}
      <TopAppBar search={search} setSearch={setSearch} />

      {/* Main Content Area */}
      <main className="pt-16 pb-0 flex-1 flex flex-col">{children}</main>

      {/* Improved Footer */}
      <footer className="w-full bg-black/40 text-white/80 text-xs flex flex-col items-center py-10 px-6 text-center gap-6 border-t border-white/10 shrink-0">
        <div className="max-w-md w-full space-y-4">
          <h2 className="text-lg text-[#fecb00] font-bold uppercase tracking-wide font-montserrat">
            Faro de Venezuela
          </h2>

          <p className="leading-relaxed text-white/70">
            <strong>Aviso de Seguridad:</strong> Esta plataforma es un canal alternativo para difundir reportes comunitarios. Si sospechas de una desaparición o riesgo inmediato, realiza la denuncia oficial ante las autoridades u organismos policiales de inmediato.
          </p>

          {/* Contact Numbers */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center w-full">
            <div>
              <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Emergencia Nacional</p>
              <p className="text-sm font-extrabold text-[#fecb00]">📞 911 / 171 (VEN)</p>
            </div>

          </div>

          {/* Developer Support section */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              onClick={() => setShowDevInfo(!showDevInfo)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] uppercase font-bold tracking-wider text-[#fecb00] transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-xs">code</span>
              {showDevInfo ? "Ocultar Creador" : "Información de Soporte"}
            </button>

            {showDevInfo && (
              <div className="glass-card p-4 rounded-xl text-left border border-white/10 mt-1 animate-fade-in-up w-full">
                <p className="text-white/90 leading-relaxed">
                  Desarrollado por AsgoDev con fines humanitarios para la unificación familiar. Brindando soporte técnico y apoyo solidario desde el <strong>Estado Falcón, Venezuela</strong> 🇻🇪.
                </p>
              </div>
            )}
          </div>

          <p className="text-[10px] text-white/40 pt-4 border-t border-white/5">
            © 2026 Faro de Venezuela. Iniciativa ciudadana sin fines de lucro.
          </p>
        </div>
      </footer>
    </div>
  );
}