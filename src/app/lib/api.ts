import { useAuthStore } from './authStore';
import { mockDatabase } from './mockDatabase';

const BASE_URL = '/api'; // Adjust this if your backend is hosted elsewhere

interface RequestOptions extends RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

async function fetchWithAuth(endpoint: string, options: RequestOptions = {}) {
  const { token, logout } = useAuthStore.getState();
  
  if (import.meta.env.PROD) {
    try {
      return await mockDatabase.handleRequest(endpoint, options.method || 'GET', options.data);
    } catch (error: any) {
      if (error.message === 'Non autorisé ou session expirée') {
        logout();
        window.location.href = '/login';
      }
      throw error;
    }
  }

  const headers = new Headers(options.headers || {});
  
  // Set Content-Type if we have JSON data and it's not FormData
  if (options.data && !(options.data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.data);
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Unauthorized, maybe token expired
    logout();
    // Redirect to login (assuming the route is /login)
    window.location.href = '/login';
    throw new Error('Non autorisé ou session expirée');
  }

  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue';
    try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
    } catch (e) {
        // Not JSON
    }
    throw new Error(errorMessage);
  }
  
  // Return null for 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  get: (endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: (endpoint: string, data: any, options?: Omit<RequestOptions, 'method' | 'data'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'POST', data }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: (endpoint: string, data: any, options?: Omit<RequestOptions, 'method' | 'data'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'PUT', data }),
  delete: (endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
