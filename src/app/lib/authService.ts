import { api } from './api';
import { useAuthStore } from './authStore';

export const authService = {
  login: async (credentials: { email?: string; identifiant?: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response && response.token) {
        useAuthStore.getState().setAuth(
          {
            userId: response.userId,
            nom: response.nom,
            prenom: response.prenom,
            role: response.role,
          },
          response.token
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    useAuthStore.getState().logout();
  }
};
