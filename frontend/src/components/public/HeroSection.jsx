import React from 'react';
import { useNavigate } from 'react-router-dom';
import bandera from '/bandera.webp';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden bg-[#004a99]">
      <div className="relative z-10 flex flex-col items-center">


        <h2 className="font-headline-lg-mobile text-2xl sm:text-3xl text-white font-extrabold uppercase tracking-tighter leading-tight font-montserrat">
          Rastreo de Desaparecidos
        </h2>

        <p className="mt-4 text-white/90 text-sm sm:text-base max-w-lg leading-relaxed font-medium  text-left">
          Cada reporte es una luz de esperanza que encendemos juntos. Creemos en la fuerza de la solidaridad y en el esfuerzo colectivo para reunir a cada persona con sus seres queridos. <br /><span className='font-black'>No perdamos la fe</span>.
        </p>

        <div className="mt-3 flex items-center gap-1.5 justify-center max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
          <span className="material-symbols-outlined text-[#fecb00] text-sm shrink-0">lock</span>
          <p className="text-[11px] text-white/70 text-left leading-normal">
            <strong>Compromiso de privacidad:</strong> Los datos suministrados serán utilizados únicamente para facilitar el contacto, búsqueda e información sobre la persona desaparecida.
          </p>
        </div>

        <button
          onClick={() => navigate('/registro')}
          className="mt-6 bg-[#fecb00] text-[#6e5700] px-8 py-4 font-bold rounded-xl shadow-lg active:scale-95 transition-transform hover:bg-[#ffe08b] flex items-center gap-2 font-montserrat text-sm cursor-pointer"
        >
          <span className="material-symbols-outlined">person_add</span>
          REGISTRAR DESAPARECIDO
        </button>
      </div>
    </section>
  );
}
