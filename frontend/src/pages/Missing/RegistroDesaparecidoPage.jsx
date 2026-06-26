import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { registerMissingSchema } from '../../validations/missing';
import { useCreateMissing } from '../../hooks/useMissingQueries';
import venezuelaData from '../../utils/venezuela.json';

// Función para redimensionar y comprimir imágenes en el cliente usando Canvas API
const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Conversión de Canvas a Blob falló'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function RegistroDesaparecidoPage() {
  const navigate = useNavigate();
  const createMissingMutation = useCreateMissing();

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enviandoForm, setEnviandoForm] = useState(false);

  // Pre-calentar el backend en Render
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
    const healthUrl = apiBaseUrl.endsWith('/') ? `${apiBaseUrl}health` : `${apiBaseUrl}/health`;
    axios.get(healthUrl).catch(() => { });
  }, []);

  // Ubicación selectores dinámicos
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [selectedParroquia, setSelectedParroquia] = useState('');

  const municipiosDisponibles = selectedEstado
    ? venezuelaData.find((e) => e.estado === selectedEstado)?.municipios || []
    : [];

  const parroquiasDisponibles = selectedEstado && selectedMunicipio
    ? municipiosDisponibles.find((m) => m.municipio === selectedMunicipio)?.parroquias || []
    : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerMissingSchema),
  });

  const onSubmit = async (data) => {
    setEnviandoForm(true);

    // Concatenar ubicación de forma ordenada
    const parts = [];
    if (selectedEstado) parts.push(`Estado ${selectedEstado}`);
    if (selectedMunicipio) parts.push(`Municipio ${selectedMunicipio}`);
    if (selectedParroquia) parts.push(`Parroquia ${selectedParroquia}`);
    if (data.ultimaUbicacion) parts.push(data.ultimaUbicacion);

    const fullUbicacion = parts.join(', ');

    let uploadedFotoUrl = null;

    if (foto) {
      let fotoAEnviar = foto;
      try {
        // Redimensionar a max 800px y comprimir a calidad 80% antes de subir
        fotoAEnviar = await compressImage(foto, 800, 800, 0.8);
      } catch (compressionError) {
        console.warn('Fallo al comprimir imagen en cliente, se enviará la original:', compressionError);
      }

      const uploadData = new FormData();
      uploadData.append('file', fotoAEnviar);
      uploadData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

      try {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvereebux';
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, uploadData);
        let rawUrl = response.data.secure_url;

        // Optimizar la imagen usando transformaciones en la URL de Cloudinary para que sea ligera al recuperar
        if (rawUrl && rawUrl.includes('/upload/')) {
          uploadedFotoUrl = rawUrl.replace('/upload/', '/upload/f_auto,q_auto,w_800,c_limit/');
        } else {
          uploadedFotoUrl = rawUrl;
        }
      } catch (uploadError) {
        console.error('Error al subir imagen a Cloudinary:', uploadError.response?.data || uploadError);
        const detail = uploadError.response?.data?.error?.message;
        const msg = detail ? `Error al subir la foto: ${detail}` : 'Error al subir la foto a los servidores. Intente nuevamente.';
        toast.error(msg);
        setEnviandoForm(false);
        return;
      }
    }

    const payload = {
      ...data,
      ultimaUbicacion: fullUbicacion,
      fotoUrl: uploadedFotoUrl
    };

    try {
      await createMissingMutation.mutateAsync(payload);
      toast.success('Registro completado exitosamente.');
      reset();
      setFoto(null);
      setPreview(null);
      setSelectedEstado('');
      setSelectedMunicipio('');
      setSelectedParroquia('');
      navigate('/resumen');
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error('Solo se permite un registro por minuto. Por favor espere un momento.');
      } else {
        const msg = error.response?.data?.message || 'Error al procesar el registro.';
        toast.error(msg);
      }
    } finally {
      setEnviandoForm(false);
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



            {/* Dirección Específica */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-white/90 uppercase tracking-wide mb-1.5">
                Dirección Específica / Detalle <span className="text-[#fecb00]">*</span>
              </label>
              <input
                {...register('ultimaUbicacion')}
                className={`w-full px-4 py-2.5 bg-white/10 border ${errors.ultimaUbicacion ? 'border-red-400' : 'border-white/20'
                  } rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#fecb00] focus:border-transparent transition-all text-sm`}
                placeholder="Ej. Calle Principal, Sector 4, casa N° 12"
              />
              <p className="mt-1 text-[10px] text-white/50">Describe calles, sectores, puntos de referencia, o datos específicos de la ubicación.</p>
              {errors.ultimaUbicacion && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  {errors.ultimaUbicacion.message}
                </p>
              )}
            </div>
            {/* Venezuela Location Selectors */}

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="col-span-1 sm:col-span-3 pb-1 border-b border-white/15">
                <span className="text-[10px] font-bold text-[#fecb00] uppercase tracking-wider">Ubicación Geográfica (Opcional)</span>
              </div>

              {/* Estado Select */}
              <div>
                <label className="block text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                  Estado
                </label>
                <select
                  value={selectedEstado}
                  onChange={(e) => {
                    setSelectedEstado(e.target.value);
                    setSelectedMunicipio('');
                    setSelectedParroquia('');
                  }}
                  className="w-full px-3 py-2 bg-[#00346f] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#fecb00] cursor-pointer text-xs"
                >
                  <option value="" className="bg-[#00346f] text-white/50">Seleccione Estado</option>
                  {venezuelaData.map((e) => (
                    <option key={e.id_estado} value={e.estado} className="bg-[#00346f] text-white">
                      {e.estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Municipio Select */}
              <div>
                <label className="block text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                  Municipio
                </label>
                <select
                  value={selectedMunicipio}
                  disabled={!selectedEstado}
                  onChange={(e) => {
                    setSelectedMunicipio(e.target.value);
                    setSelectedParroquia('');
                  }}
                  className="w-full px-3 py-2 bg-[#00346f] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#fecb00] cursor-pointer text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-[#00346f] text-white/50">Seleccione Municipio</option>
                  {municipiosDisponibles.map((m) => (
                    <option key={m.municipio} value={m.municipio} className="bg-[#00346f] text-white">
                      {m.municipio}
                    </option>
                  ))}
                </select>
              </div>

              {/* Parroquia Select */}
              <div>
                <label className="block text-[10px] font-bold text-white/80 uppercase tracking-wider mb-1">
                  Parroquia
                </label>
                <select
                  value={selectedParroquia}
                  disabled={!selectedMunicipio}
                  onChange={(e) => setSelectedParroquia(e.target.value)}
                  className="w-full px-3 py-2 bg-[#00346f] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#fecb00] cursor-pointer text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="" className="bg-[#00346f] text-white/50">Seleccione Parroquia</option>
                  {parroquiasDisponibles.map((p) => (
                    <option key={p} value={p} className="bg-[#00346f] text-white">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
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
              disabled={createMissingMutation.isPending || enviandoForm}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-[#6e5700] bg-[#fecb00] hover:bg-[#ffe08b] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fecb00] disabled:opacity-50 transition-all cursor-pointer"
            >
              {createMissingMutation.isPending || enviandoForm ? (
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

