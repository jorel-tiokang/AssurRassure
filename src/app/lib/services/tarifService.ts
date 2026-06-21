import { api } from '../api';

export interface Tarifs {
  generaliste: number;
  specialiste: number;
}

export const tarifService = {
  getTarifs: (): Promise<Tarifs> => {
    return api.get('/tarifs');
  },
  updateTarifs: (data: Tarifs): Promise<Tarifs> => {
    return api.put('/tarifs', data);
  }
};
