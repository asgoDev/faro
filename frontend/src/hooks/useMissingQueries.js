import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMissing, getStats, registerMissing } from '../services/missingService';

export function useMissingList(params = {}) {
  return useQuery({
    queryKey: ['missingList', params],
    queryFn: () => getMissing(params),
    placeholderData: (previousData) => previousData, // maintains previous data when fetching next pages/filters in v5
    staleTime: 60000, // 1 minute stale time to prevent immediate refetching
  });
}

export function useMissingStats() {
  return useQuery({
    queryKey: ['missingStats'],
    queryFn: getStats,
    refetchInterval: 30000, // Refresh stats every 30 seconds
    staleTime: 15000,
  });
}

export function useCreateMissing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => registerMissing(formData),
    onSuccess: () => {
      // Invalidate both stats and list to force refetch when list or dashboard is shown
      queryClient.invalidateQueries({ queryKey: ['missingList'] });
      queryClient.invalidateQueries({ queryKey: ['missingStats'] });
    },
  });
}
