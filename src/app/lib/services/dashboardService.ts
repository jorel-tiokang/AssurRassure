import { api } from '../api';

export interface DashboardStats {
  feuillesEnAttente: number;
  montantRembourse: number;
  repartitionPaiement: {
    VIREMENT: number;
    CASH: number;
  };
  repartitionMedecins: {
    GENERALISTE: number;
    SPECIALISTE: number;
  };
}

export interface Notification {
  id: number;
  medecinId: number;
  message: string;
  date: string;
  lu: boolean;
}

export const dashboardService = {
  getStats: (): Promise<DashboardStats> => {
    return api.get('/dashboard/stats');
  },
  getNotifications: (): Promise<Notification[]> => {
    return api.get('/notifications');
  }
};
