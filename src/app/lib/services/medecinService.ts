import { api } from '../api';

export interface Medecin {
  id: number;
  nom: string;
  prenom: string;
  identifiant: string;
  rpps: string;
  specialite: string;
  type: 'GENERALISTE' | 'SPECIALISTE';
  clinique: string;
  estAssure: boolean;
  deletedAt?: string;
}

export const medecinService = {
  getMedecins: (search?: string): Promise<Medecin[]> => {
    return api.get(`/medecins${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },
  getMedecinById: (id: number): Promise<Medecin> => {
    // Assuming this endpoint exists, even if not explicitly defined in the initial contract
    return api.get(`/medecins/${id}`);
  },
  createMedecin: (data: Omit<Medecin, 'id' | 'identifiant'>): Promise<Medecin> => {
    return api.post('/medecins', data);
  },
  deleteMedecin: (id: number): Promise<void> => {
    return api.delete(`/medecins/${id}`);
  }
};
