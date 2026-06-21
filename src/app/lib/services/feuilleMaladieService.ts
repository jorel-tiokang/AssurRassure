import { api } from '../api';

export interface FeuilleMaladie {
  id: number;
  consultationId: number;
  date: string;
  symptome: string;
  diagnostic: string;
  patientId: number;
  nomAssure?: string;
  nssAssure?: string;
  medecinId: number;
  montantSoins: number;
  statut: 'Non remboursé' | 'Remboursé';
  dateRemboursement?: string;
  montantRembourse?: number;
  tauxRemboursement?: number;
  modePaiement?: 'VIREMENT' | 'CASH';
  numeroCompte?: string;
}

export const feuilleMaladieService = {
  getFeuilles: (assureId?: number, statut?: string): Promise<FeuilleMaladie[]> => {
    const params = new URLSearchParams();
    if (statut) params.append('statut', statut);
    if (assureId) params.append('patientId', assureId.toString());
    
    return api.get(`/feuilles?${params.toString()}`);
  },
  
  rembourser: (consultationId: number, modePaiement: 'VIREMENT' | 'CASH', compteDestinataire?: string): Promise<FeuilleMaladie> => {
    return api.post('/remboursements', {
      consultationId,
      modePaiement,
      compteDestinataire
    });
  },
  
  getFacturePdf: (id: number): Promise<Blob> => {
    // Assuming api.ts fetchWithAuth supports binary responses. If not, this might need a custom fetch.
    return api.get(`/feuilles/${id}/facture/pdf`); 
  }
};
