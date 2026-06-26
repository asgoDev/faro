import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ── Estrategia de caché agresiva para sistema público ──
      // Los datos se consideran frescos durante 5 minutos completos.
      // Mientras estén frescos, TanStack Query NUNCA hará un fetch a la API,
      // siempre servirá desde la memoria del cliente.
      staleTime: 5 * 60 * 1000,  // 5 minutos

      // Mantener los datos en memoria durante 30 minutos después de que
      // el último componente los deje de usar. Esto permite que al navegar
      // entre pestañas/páginas y volver, los datos sigan disponibles
      // sin necesidad de un nuevo fetch.
      gcTime: 30 * 60 * 1000,    // 30 minutos

      // No refrescar automáticamente al volver a enfocar la pestaña
      // ni al reconectar la red. Esto evita llamadas innecesarias
      // cuando el usuario simplemente cambia de ventana y vuelve.
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,

      // No refrescar automáticamente cuando el componente se monta
      // si los datos aún están frescos en caché.
      refetchOnMount: false,

      // Un solo reintento en caso de error de red
      retry: 1,

      // Intervalo entre reintentos: 3 segundos
      retryDelay: 3000,
    },
  },
});
