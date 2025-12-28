// lib/api/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from './client';
import { 
  WebsiteRequest,
  Website,
  CreateWebsiteRequestDTO, 
  ApiResponse, 
  CheckLimitResponse 
} from './types';

// Query Keys
export const queryKeys = {
  requests: {
    all: ['requests'] as const,
    byId: (id: string) => ['requests', id] as const,
    limit: ['requests', 'limit'] as const,
  },
  websites: {
    all: ['websites'] as const,
    byId: (id: string) => ['websites', id] as const,
  },
};

// ============================================
// REQUEST HOOKS
// ============================================

// Fetch all requests
export function useRequests() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.requests.all,
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: ApiResponse<WebsiteRequest[]> = await apiClient.requests.getAll(token);
      return response.data || [];
    },
    enabled: true,
  });
}

// Fetch single request
export function useRequest(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.requests.byId(id),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: ApiResponse<WebsiteRequest> = await apiClient.requests.getById(token, id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Check submission limit
export function useCheckLimit() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.requests.limit,
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: CheckLimitResponse = await apiClient.requests.checkLimit(token);
      return response;
    },
  });
}

// Create request mutation
export function useCreateRequest() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWebsiteRequestDTO) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      return apiClient.requests.create(token, data);
    },
    onSuccess: () => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.limit });
    },
  });
}

// Update request mutation
export function useUpdateRequest() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateWebsiteRequestDTO> }) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      return apiClient.requests.update(token, id, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific request
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.byId(variables.id) });
    },
  });
}

// ============================================
// WEBSITE HOOKS
// ============================================

// Fetch all user websites
export function useWebsites() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.websites.all,
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: ApiResponse<Website[]> = await apiClient.websites.getAll(token);
      return response.data || [];
    },
    enabled: true,
  });
}

// Fetch single website
export function useWebsite(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.websites.byId(id),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: ApiResponse<Website> = await apiClient.websites.getById(token, id);
      return response.data;
    },
    enabled: !!id,
  });
}