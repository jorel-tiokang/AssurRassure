import { api } from '../api';

export interface FeuilleMaladie {
  id: number;
  consultationId: number;
  montantSoins: number;
  statut: 'ENREGISTREE' | 'REMBOURSEE';
  dateRemboursement?: string;
  montantRembourse?: number;
  tauxRemboursement?: number;
  modePaiement?: 'VIREMENT' | 'CASH';
}

export const feuilleMaladieService = {
  getFeuilles: (assureId?: number, statut?: string): Promise<FeuilleMaladie[]> => {
    const params = new URLSearchParams();
    if (statut) params.append('statut', statut);
    
    // Si l'endpoint final gère l'assureId dans le chemin :
    if (assureId) {
      return api.get(`/feuilles/assure/${assureId}?${params.toString()}`);
    }
    // S'il y a un endpoint global (à confirmer avec le backend)
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
