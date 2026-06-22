import { api } from '../api';

export interface Assure {
  id: number;
  nom: string;
  prenom: string;
  nss: string;
  dateNaissance: string;
  sexe: 'Masculin' | 'Féminin';
  adresse: string;
  telephone?: string;
  groupeSanguin: string;
  allergies: string;
  taille?: number;
  poids?: number;
  numeroCompte?: string;
  medecinTraitantId?: number;
  deletedAt?: string;
}

export const assureService = {
  getAssures: (search?: string): Promise<Assure[]> => {
    return api.get(`/assures${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },
  getAssureById: (id: number): Promise<Assure> => {
    return api.get(`/assures/${id}`);
  },
  createAssure: (data: Omit<Assure, 'id'>): Promise<Assure> => {
    return api.post('/assures', data);
  },
  updateAssure: (id: number, data: Partial<Assure>): Promise<Assure> => {
    return api.put(`/assures/${id}`, data);
  },
  deleteAssure: (id: number): Promise<void> => {
    return api.delete(`/assures/${id}`);
  }
};
