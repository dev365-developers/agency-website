// lib/api/client.ts

import { CreateSupportRequestDTO } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(url: string, token: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  requests: {
    getAll: (token: string) =>
      fetchWithAuth(`${API_BASE_URL}/requests`, token),

    getById: (token: string, id: string) =>
      fetchWithAuth(`${API_BASE_URL}/requests/${id}`, token),

    create: (token: string, data: any) =>
      fetchWithAuth(`${API_BASE_URL}/requests`, token, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (token: string, id: string, data: any) =>
      fetchWithAuth(`${API_BASE_URL}/requests/${id}`, token, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    checkLimit: (token: string) =>
      fetchWithAuth(`${API_BASE_URL}/requests/check-limit`, token),
  },

  websites: {
    getAll: (token: string) =>
      fetchWithAuth(`${API_BASE_URL}/users/websites`, token),

    getById: (token: string, id: string) =>
      fetchWithAuth(`${API_BASE_URL}/users/websites/${id}`, token),

    getByPlan: (token: string, plan: string) =>
      fetchWithAuth(`${API_BASE_URL}/users/websites/plan?plan=${encodeURIComponent(plan)}`, token),
  },
  support: {
    // Get all user's support requests
    getAll: (token: string, params?: { status?: string; websiteId?: string; category?: string }) => {
      const queryString = params 
        ? '?' + new URLSearchParams(params as any).toString()
        : '';
      return fetchWithAuth(`${API_BASE_URL}/support${queryString}`, token);
    },

    // Get single support request
    getById: (token: string, id: string) =>
      fetchWithAuth(`${API_BASE_URL}/support/${id}`, token),

    // Get support requests for a specific website
    getByWebsite: (token: string, websiteId: string) =>
      fetchWithAuth(`${API_BASE_URL}/support/website/${websiteId}`, token),

    // Create support request
    create: (token: string, data: CreateSupportRequestDTO) =>
      fetchWithAuth(`${API_BASE_URL}/support`, token, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};

export { ApiError };