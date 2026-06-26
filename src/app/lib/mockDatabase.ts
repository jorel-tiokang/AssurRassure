import initialData from '../../../db.json';

const MOCK_DB_KEY = 'assur_rassure_mock_db';

class MockDatabase {
  private getDb() {
    const db = localStorage.getItem(MOCK_DB_KEY);
    if (!db) {
      // Initialize DB on first run
      localStorage.setItem(MOCK_DB_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(db);
  }

  private saveDb(db: any) {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
  }

  // Handle various API routes simulating the mock-server.cjs behavior
  public async handleRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const db = this.getDb();
    
    // Simuler le délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    // 1. Auth Login (/auth/login)
    if (endpoint === '/auth/login' && method === 'POST') {
      const { email, identifiant } = data;
      if (email && email.includes('agent')) {
        return { token: 'fake-jwt-token-agent', userId: 1, nom: 'Agent', prenom: 'Admin', role: 'AGENT' };
      } 
      return { token: 'fake-jwt-token-medecin', userId: 1, nom: 'Dupont', prenom: 'Jean', role: 'MEDECIN' };
    }

    // 2. Dashboard Stats (/dashboard/stats)
    if (endpoint === '/dashboard/stats' && method === 'GET') {
      const feuilles = db.feuilles || [];
      const medecins = db.medecins || [];

      const feuillesEnAttente = feuilles.filter((f: any) => f.statut === 'Non remboursé').length;
      
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      const feuillesRemboursees = feuilles.filter((f: any) => f.statut === 'Remboursé');
      
      const montantRembourse = feuillesRemboursees.reduce((sum: number, f: any) => {
        if (f.dateRemboursement) {
          const dateR = new Date(f.dateRemboursement);
          if (dateR >= sevenDaysAgo && dateR <= now) {
            return sum + (f.montantRembourse || 0);
          }
        }
        return sum;
      }, 0);

      const virementCount = feuillesRemboursees.filter((f: any) => f.modePaiement === 'VIREMENT').length;
      const cashCount = feuillesRemboursees.filter((f: any) => f.modePaiement === 'CASH').length;

      const sortedRemboursements = [...feuillesRemboursees].sort((a, b) => {
        return new Date(b.dateRemboursement).getTime() - new Date(a.dateRemboursement).getTime();
      });

      const derniersRemboursements = sortedRemboursements.slice(0, 3).map(f => {
        let dateStr = "";
        const dateR = new Date(f.dateRemboursement);
        const diffDays = Math.floor((now.getTime() - dateR.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 0) dateStr = "Aujourd'hui";
        else if (diffDays === 1) dateStr = "Hier";
        else dateStr = dateR.toLocaleDateString('fr-FR');

        return {
          id: f.id,
          nom: f.nomAssure || 'Inconnu',
          date: dateStr,
          montant: new Intl.NumberFormat("fr-CM", { style: "decimal" }).format(f.montantRembourse || 0) + " FCFA",
          mode: f.modePaiement || 'Inconnu'
        };
      });

      let generalisteCount = 0;
      let specialisteCount = 0;
      feuilles.forEach((f: any) => {
        const medecin = medecins.find((m: any) => m.id === f.medecinId);
        if (medecin) {
          if (medecin.type === 'SPECIALISTE') specialisteCount++;
          else generalisteCount++;
        }
      });

      return { 
          feuillesEnAttente, 
          montantRembourse, 
          repartitionPaiement: { VIREMENT: virementCount, CASH: cashCount }, 
          repartitionMedecins: { GENERALISTE: generalisteCount, SPECIALISTE: specialisteCount },
          derniersRemboursements
      };
    }

    // 3. Remboursements (/remboursements)
    if (endpoint === '/remboursements' && method === 'POST') {
      const { consultationId, modePaiement, compteDestinataire } = data;
      const feuilleIndex = db.feuilles.findIndex((f: any) => f.consultationId === Number(consultationId));
      
      if (feuilleIndex === -1) {
        throw new Error("Feuille de maladie introuvable pour cette consultation");
      }

      const feuille = db.feuilles[feuilleIndex];
      const tarifs = db.tarifs;
      let tauxRemboursement = 0.80;
      if (tarifs && feuille.montantSoins === tarifs.generaliste) {
        tauxRemboursement = 1.0;
      }
      
      const montantRembourse = (feuille.montantSoins || 0) * tauxRemboursement;

      db.feuilles[feuilleIndex] = {
        ...feuille,
        statut: 'Remboursé',
        modePaiement,
        numeroCompte: compteDestinataire,
        dateRemboursement: new Date().toISOString(),
        tauxRemboursement,
        montantRembourse
      };

      this.saveDb(db);
      return db.feuilles[feuilleIndex];
    }

    // 4. GET Consultations by patient (/consultations/patient/:patientId)
    if (endpoint.startsWith('/consultations/patient/') && method === 'GET') {
      const patientId = Number(endpoint.split('/').pop());
      return db.consultations.filter((c: any) => c.patientId === patientId);
    }

    // 5. Standard Generic Routes
    const pathWithoutQuery = endpoint.split('?')[0];
    const parts = pathWithoutQuery.split('/').filter(Boolean);
    const resource = parts[0]; // e.g., 'consultations', 'feuilles', 'assures'
    const id = parts[1];

    if (!db[resource]) {
      // Ignore auth related non-found routes or throw error
      if(resource !== 'auth') throw new Error(`Resource ${resource} not found in mock DB`);
    }

    if (method === 'GET') {
      if (id) {
        const item = db[resource].find((i: any) => i.id === Number(id));
        if (!item) throw new Error("Not found");
        return item;
      }

      let results = db[resource];
      const queryString = endpoint.split('?')[1];
      if (queryString) {
        const params = new URLSearchParams(queryString);
        results = results.filter((item: any) => {
          let match = true;
          params.forEach((val, key) => {
            // we use soft equality because URL params are strings but db IDs might be numbers
            if (item[key] != val) {
              match = false;
            }
          });
          return match;
        });
      }
      
      return results;
    }

    if (method === 'POST') {
      const newItem = { ...data, id: Date.now() };
      db[resource].push(newItem);

      // SIDE EFFECT: Create feuille when a consultation is created
      if (resource === 'consultations') {
        const assure = db.assures?.find((a: any) => a.id === Number(newItem.patientId));
        const newFeuille = {
          id: Date.now() + 1,
          consultationId: newItem.id,
          date: newItem.date,
          symptome: newItem.symptome,
          diagnostic: newItem.diagnostic,
          patientId: newItem.patientId,
          nomAssure: assure ? `${assure.nom} ${assure.prenom}` : "Inconnu",
          nssAssure: assure ? assure.nss : "Inconnu",
          medecinId: newItem.medecinId,
          montantSoins: newItem.montantSoins || 0,
          statut: 'Non remboursé'
        };
        if(!db.feuilles) db.feuilles = [];
        db.feuilles.push(newFeuille);
      }

      this.saveDb(db);
      return newItem;
    }

    if (method === 'PUT') {
      if (!id) throw new Error("ID required for PUT");
      const index = db[resource].findIndex((i: any) => i.id === Number(id));
      if (index === -1) throw new Error("Not found");
      db[resource][index] = { ...db[resource][index], ...data, id: Number(id) };
      this.saveDb(db);
      return db[resource][index];
    }

    if (method === 'DELETE') {
      if (!id) throw new Error("ID required for DELETE");
      db[resource] = db[resource].filter((i: any) => i.id !== Number(id));
      this.saveDb(db);
      return null;
    }

    throw new Error(`Method ${method} not supported in mock DB for ${endpoint}`);
  }
}

export const mockDatabase = new MockDatabase();
