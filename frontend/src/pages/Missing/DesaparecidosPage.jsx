import React, { useState } from 'react';
import PublicLayout from '../../components/public/PublicLayout';
import HeroSection from '../../components/public/HeroSection';
import StatsSection from '../../components/public/StatsSection';
import MissingList from '../../components/public/MissingList';
import PersonDetailModal from '../../components/public/PersonDetailModal';
import { useMissingStore } from '../../stores/missingStore';
import { useMissingList, useMissingStats } from '../../hooks/useMissingQueries';

export default function DesaparecidosPage() {
  const {
    search,
    setSearch,
    page,
    setPage,
    activeTab,
    setActiveTab,
    estado,
    setEstado,
    sexo,
    setSexo,
  } = useMissingStore();
  
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Query para obtener las estadísticas (refrescadas cada 5 min de forma reactiva)
  const { data: statsData, isLoading: statsLoading } = useMissingStats();

  // Query para obtener el listado con filtros combinados y paginación
  const {
    data: missingData,
    isLoading: missingLoading,
    isError: missingError,
    error: fetchError,
  } = useMissingList({
    page,
    limit: 20, // 20 registros por página según el plan
    search,
    estado,
    sexo,
  });

  const persons = missingData?.items || [];
  const pagination = missingData?.pagination || { total: 0, page: 1, pages: 1 };
  const totalActivos = statsData?.desaparecidos ?? 0;

  return (
    <PublicLayout
      search={search}
      setSearch={setSearch}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'inicio' || activeTab === 'busqueda' ? (
        <>
          <HeroSection />
          <StatsSection stats={statsData} isLoading={statsLoading} />
          <MissingList
            persons={persons}
            isLoading={missingLoading}
            total={pagination.total || totalActivos}
            page={page}
            pages={pagination.pages}
            onPageChange={setPage}
            onPersonClick={(person) => setSelectedPerson(person)}
            estado={estado}
            setEstado={setEstado}
            sexo={sexo}
            setSexo={setSexo}
            isError={missingError}
            error={fetchError}
          />
        </>
      ) : activeTab === 'alertas' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto my-12 gap-4 animate-fade-in-up">
          <span className="material-symbols-outlined text-6xl text-[#fecb00] animate-bounce">notifications_active</span>
          <h3 className="text-2xl font-bold font-montserrat text-white uppercase tracking-tight">
            Alertas Nacionales
          </h3>
          <div className="glass-card p-6 rounded-2xl w-full text-left space-y-4">
            <div className="border-l-4 border-[#fecb00] pl-3">
              <h4 className="font-bold text-[#fecb00]">Alerta Activa: Búsqueda Nacional</h4>
              <p className="text-xs text-white/50">Reciente</p>
              <p className="text-sm mt-1 text-white/90">
                Comparte los reportes en tus redes para aumentar la probabilidad de hallazgo de los desaparecidos.
              </p>
            </div>
            <div className="border-l-4 border-white/20 pl-3">
              <h4 className="font-bold text-white/80">Canal de Emergencia Activo</h4>
              <p className="text-sm mt-1 text-white/95">
                Nuestra plataforma está sincronizada las 24 horas del día para recibir y reflejar los nuevos reportes públicos.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto my-12 gap-4 animate-fade-in-up">
          <span className="material-symbols-outlined text-6xl text-[#fecb00]">info</span>
          <h3 className="text-2xl font-bold font-montserrat text-white uppercase tracking-tight">
            Sobre el Faro
          </h3>
          <div className="glass-card p-6 rounded-2xl w-full text-left space-y-3 text-sm leading-relaxed text-white/90">
            <p>
              <strong>Faro de Venezuela</strong> es una plataforma pública y de libre acceso orientada a registrar y buscar personas desaparecidas a nivel nacional.
            </p>
            <p>
              Simplificamos al máximo el proceso: no se requieren cédulas de identidad ni cuentas de usuario para realizar un reporte. Es un servicio completamente descentralizado y de bien social.
            </p>
            <p className="font-semibold text-[#fecb00]">
              Si tienes información útil de alguna persona listada, puedes contactar al familiar directamente haciendo clic en el caso y utilizando el botón de llamada.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </PublicLayout>
  );
}

