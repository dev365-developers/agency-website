// lib/api/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { apiClient } from './client';
import { 
  WebsiteRequest,
  Website,
  CreateWebsiteRequestDTO, 
  ApiResponse, 
  CheckLimitResponse, 
  CreateSupportRequestDTO,
  SupportRequestsResponse,
  SupportRequestResponse
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
    byPlan: (plan: string) => ['websites', 'plan', plan] as const,
  },
  support: {
    all: ['support'] as const,
    byId: (id: string) => ['support', id] as const,
    byWebsite: (websiteId: string) => ['support', 'website', websiteId] as const,
    byStatus: (status: string) => ['support', 'status', status] as const,
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

// Fetch websites by plan
export function useWebsitesByPlan(plan: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.websites.byPlan(plan),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: ApiResponse<Website[]> = await apiClient.websites.getByPlan(token, plan);
      return response.data || [];
    },
    enabled: !!plan,
  });
}

/**
 * Fetch all user's support requests
 */
export function useSupportRequests(filters?: {
  status?: string;
  websiteId?: string;
  category?: string;
}) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: filters 
      ? ['support', filters] 
      : queryKeys.support.all,
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: SupportRequestsResponse = await apiClient.support.getAll(token, filters);
      return response.data || [];
    },
    enabled: true,
  });
}

/**
 * Fetch single support request
 */
export function useSupportRequest(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.support.byId(id),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: SupportRequestResponse = await apiClient.support.getById(token, id);

      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Fetch support requests for a specific website
 */
export function useSupportRequestsByWebsite(websiteId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.support.byWebsite(websiteId),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      const response: SupportRequestsResponse = await apiClient.support.getByWebsite(token, websiteId);
      return response.data || [];
    },
    enabled: !!websiteId,
  });
}

/**
 * Create support request mutation
 */
export function useCreateSupportRequest() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSupportRequestDTO) => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      
      return apiClient.support.create(token, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.support.all });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.support.byWebsite(variables.websiteId) 
      });
    },
  });
}