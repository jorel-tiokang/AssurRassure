import { api } from '../api';

export interface Consultation {
  id: number;
  date: string;
  symptome: string;
  diagnostic: string;
  patientId: number;
  medecinId: number;
  montantSoins: number;
}

export const consultationService = {
  getConsultationsPatient: (patientId: number): Promise<Consultation[]> => {
    return api.get(`/consultations/patient/${patientId}`);
  },
  getConsultations: (): Promise<Consultation[]> => {
    return api.get('/consultations');
  },
  createConsultation: (data: Omit<Consultation, 'id'>): Promise<Consultation> => {
    return api.post('/consultations', data);
  }
};
