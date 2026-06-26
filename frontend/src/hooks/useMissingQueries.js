import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMissing, getStats, registerMissing } from '../services/missingService';

// ── Constantes de caché ──
// Intervalo de refresco automático: 5 minutos
const REFETCH_INTERVAL = 5 * 60 * 1000;
// Los datos se consideran frescos durante 4 min 30 seg.
// Esto deja un margen de 30 segundos antes del próximo refetchInterval
// para que no se acumule un fetch del staleTime + uno del interval.
const STALE_TIME = 4.5 * 60 * 1000;

/**
 * Hook para el listado de desaparecidos.
 * 
 * Estrategia de caché:
 * - Sirve datos desde memoria mientras estén frescos (4.5 min).
 * - Se refresca automáticamente cada 5 minutos en segundo plano.
 * - Al cambiar de página o filtros, muestra los datos previos mientras
 *   carga los nuevos (placeholderData).
 * - Al cambiar de pestaña y volver, muestra lo que está en memoria sin fetch.
 */
export function useMissingList(params = {}) {
  return useQuery({
    queryKey: ['missingList', params],
    queryFn: () => getMissing(params),
    staleTime: STALE_TIME,
    // Mostrar datos de la consulta anterior mientras carga nuevos parámetros
    // (paginación, búsqueda). Evita pantallazos vacíos al cambiar de página.
    placeholderData: (previousData) => previousData,
    // Refresco automático silencioso cada 5 minutos.
    // Solo se ejecuta si la pestaña está visible (comportamiento por defecto).
    refetchInterval: REFETCH_INTERVAL,
    // No refrescar al montar si los datos aún están frescos
    refetchOnMount: false,
  });
}

/**
 * Hook para las estadísticas públicas.
 * 
 * Estrategia de caché:
 * - Mismo ciclo de refresco de 5 minutos que el listado.
 * - Los contadores se actualizan en segundo plano sin interrumpir la UI.
 */
export function useMissingStats() {
  return useQuery({
    queryKey: ['missingStats'],
    queryFn: getStats,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnMount: false,
  });
}

/**
 * Hook para registrar una persona desaparecida.
 * 
 * Al completarse exitosamente, invalida las queries del listado y stats
 * para que se refresquen en la próxima lectura. Esto NO dispara un fetch
 * inmediato; solo marca los datos como stale para que se actualicen
 * cuando el usuario navegue a la vista del listado.
 */
export function useCreateMissing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => registerMissing(formData),
    onSuccess: () => {
      // Marcar como obsoletos para que al volver al listado se refresquen
      queryClient.invalidateQueries({ queryKey: ['missingList'] });
      queryClient.invalidateQueries({ queryKey: ['missingStats'] });
    },
  });
}
