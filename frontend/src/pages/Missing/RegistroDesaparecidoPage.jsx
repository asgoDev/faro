import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerMissingSchema } from '../../validations/missing';
import { useCreateMissing } from '../../hooks/useMissingQueries';

export default function RegistroDesaparecidoPage() {
  const navigate = useNavigate();
  const createMissingMutation = useCreateMissing();

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerMissingSchema),
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    if (foto) {
      formData.append('foto', foto);
    }

    try {
      await createMissingMutation.mutateAsync(formData);
      toast.success('Registro completado exitosamente.');
      reset();
      setFoto(null);
      setPreview(null);
      navigate('/resumen');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al procesar el registro.';
      toast.error(msg);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[#004a99] text-white font-montserrat flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Back Button Container */}
      <div className="max-w-2xl w-full flex justify-start mb-4">
        <button
          onClick={() => navigate('/resumen')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-semibold cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver al listado
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-2xl w-full space-y-6 glass-card p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-fade-in-up">
        {/* Banner with flag colors */}
        <div className="absolute top-0 left-0 w-full h-1.5 flex">
          <span className="flex-1 bg-[#FCE300]"></span>
          <span className="flex-1 bg-[#0033A0]"></span>
          <span className="flex-1 bg-[#CE1126]"></span>
        </div>

        <div className="text-center pt-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase text-[#fecb00] flex items-center justify-center gap-2 font-montserrat">
            <span className="material-symbols-outlined text-2xl fill-icon">lightbulb</span>
            Faro de Venezuela
          </h1>
          <p className="mt-1 text-sm text-white/80 font-semibold uppercase tracking-wider">
            Reportar Persona Desaparecida
          </p>
          <p className="mt-2 text-xs text-white/60 max-w-md mx-auto leading-relaxed">
            La información suministrada será de carácter público para ayudar en la búsqueda y coordinación con rescatistas.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre Completo */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Nombre Completo <span className="text-[#fecb00]">*</span>
              </label>
              <input
                {...register('nombreCompleto')}
                className={`w-full px-4 py-2.5 bg-white/10 border ${errors.nombreCompleto ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all text-sm`}
                placeholder="Nombre y Apellidos del desaparecido"
              />
              {errors.nombreCompleto && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.nombreCompleto.message}
                </p>
              )}
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Sexo <span className="text-[#fecb00]">*</span>
              </label>
              <select
                {...register('sexo')}
                className={`w-full px-4 py-2.5 bg-[#00346f] border ${errors.sexo ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all cursor-pointer text-sm`}
              >
                <option value="" className="bg-[#00346f] text-white/70">Seleccione</option>
                <option value="M" className="bg-[#00346f] text-white">Masculino</option>
                <option value="F" className="bg-[#00346f] text-white">Femenino</option>
                <option value="Otro" className="bg-[#00346f] text-white">Otro</option>
              </select>
              {errors.sexo && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.sexo.message}
                </p>
              )}
            </div>

            {/* Edad */}
            <div>
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Edad Aproximada <span className="text-[#fecb00]">*</span>
              </label>
              <input
                type="number"
                {...register('edad')}
                className={`w-full px-4 py-2.5 bg-white/10 border ${errors.edad ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all text-sm`}
                placeholder="Ej. 35"
              />
              {errors.edad && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.edad.message}
                </p>
              )}
            </div>

            {/* Última Ubicación */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Última Ubicación Conocida <span className="text-[#fecb00]">*</span>
              </label>
              <input
                {...register('ultimaUbicacion')}
                className={`w-full px-4 py-2.5 bg-white/10 border ${errors.ultimaUbicacion ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all text-sm`}
                placeholder="Ej. Sector Centro, Calle 5, Maracaibo"
              />
              {errors.ultimaUbicacion && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.ultimaUbicacion.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Teléfono de Contacto <span className="text-[#fecb00]">*</span>
              </label>
              <input
                {...register('telefonoContacto')}
                className={`w-full px-4 py-2.5 bg-white/10 border ${errors.telefonoContacto ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all text-sm`}
                placeholder="Ej. +58 412 1234567"
              />
              <p className="mt-1 text-[10px] text-white/50">Puedes incluir código de área para que puedan contactarte con precisión.</p>
              {errors.telefonoContacto && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.telefonoContacto.message}
                </p>
              )}
            </div>

            {/* Rasgos Particulares */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Rasgos Particulares (Opcional)
              </label>
              <textarea
                {...register('rasgosParticulares')}
                rows="3"
                className={`w-full px-4 py-2.5 bg-white/10 border ${errors.rasgosParticulares ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all resize-none text-sm`}
                placeholder="Tatuajes, cicatrices, vestimenta, etc."
              ></textarea>
              {errors.rasgosParticulares && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.rasgosParticulares.message}
                </p>
              )}
            </div>

            {/* Foto */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Foto Reciente (Opcional)
              </label>
              {!preview ? (
                <label
                  htmlFor="foto-upload"
                  className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-white/20 border-dashed rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-4xl text-[#fecb00] mb-1">add_a_photo</span>
                  <div className="text-sm font-bold text-[#fecb00] hover:text-[#ffe08b]">
                    Subir una foto
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">Formatos JPG, PNG, WEBP hasta 5MB</p>
                  <input
                    id="foto-upload"
                    name="foto-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFotoChange}
                  />
                </label>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/20 border-dashed rounded-xl bg-white/5">
                  <div className="relative inline-block mt-2">
                    <img src={preview} alt="Previsualización" className="h-44 w-auto object-cover rounded-lg border border-white/20 shadow-md" />
                    <button
                      type="button"
                      onClick={() => { setFoto(null); setPreview(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={createMissingMutation.isPending}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-[#6e5700] bg-[#fecb00] hover:bg-[#ffe08b] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fecb00] disabled:opacity-50 transition-all cursor-pointer"
            >
              {createMissingMutation.isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Registrando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">send</span>
                  Registrar Desaparecido
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

