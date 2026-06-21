const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom mock route for authentication
server.post('/api/auth/login', (req, res) => {
  const { email, identifiant } = req.body;
  // If "agent" is in the email, mock an Agent login
  if (email && email.includes('agent')) {
    return res.json({ token: 'fake-jwt-token-agent', userId: 1, nom: 'Agent', prenom: 'Admin', role: 'AGENT' });
  } 
  // Otherwise, mock a Medecin login
  return res.json({ token: 'fake-jwt-token-medecin', userId: 1, nom: 'Dupont', prenom: 'Jean', role: 'MEDECIN' });
});

// Custom mock route for fetching a patient's consultations
server.get('/api/consultations/patient/:patientId', (req, res) => {
  const db = router.db;
  const patientId = Number(req.params.patientId);
  const consultations = db.get('consultations').filter({ patientId }).value();
  res.json(consultations);
});

// Custom mock route for dashboard stats
server.get('/api/dashboard/stats', (req, res) => {
   const db = router.db;
   const feuilles = db.get('feuilles').value() || [];
   const medecins = db.get('medecins').value() || [];

   // 1. Feuilles en attente
   const feuillesEnAttente = feuilles.filter(f => f.statut === 'Non remboursé').length;

   // 2. Montant remboursé (hebdomadaire)
   const now = new Date();
   const sevenDaysAgo = new Date();
   sevenDaysAgo.setDate(now.getDate() - 7);

   const feuillesRemboursees = feuilles.filter(f => f.statut === 'Remboursé');
   
   const montantRembourse = feuillesRemboursees.reduce((sum, f) => {
     if (f.dateRemboursement) {
       const dateR = new Date(f.dateRemboursement);
       if (dateR >= sevenDaysAgo && dateR <= now) {
         return sum + (f.montantRembourse || 0);
       }
     }
     return sum;
   }, 0);

   // 3. Répartition Paiement
   const virementCount = feuillesRemboursees.filter(f => f.modePaiement === 'VIREMENT').length;
   const cashCount = feuillesRemboursees.filter(f => f.modePaiement === 'CASH').length;

   // 4. Derniers remboursements (top 3)
   const sortedRemboursements = [...feuillesRemboursees].sort((a, b) => {
     return new Date(b.dateRemboursement).getTime() - new Date(a.dateRemboursement).getTime();
   });

   const derniersRemboursements = sortedRemboursements.slice(0, 3).map(f => {
     // Format date appropriately (Aujourd'hui, Hier, or Date)
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

   // 5. Médecins consultés (Généralistes / Spécialistes)
   let generalisteCount = 0;
   let specialisteCount = 0;

   feuilles.forEach(f => {
     const medecin = medecins.find(m => m.id === f.medecinId);
     if (medecin) {
       if (medecin.type === 'SPECIALISTE') specialisteCount++;
       else generalisteCount++; // Defaults to generaliste
     }
   });

   res.json({ 
       feuillesEnAttente, 
       montantRembourse, 
       repartitionPaiement: { VIREMENT: virementCount, CASH: cashCount }, 
       repartitionMedecins: { GENERALISTE: generalisteCount, SPECIALISTE: specialisteCount },
       derniersRemboursements
   });
});

// Custom mock route for remboursement
server.post('/api/remboursements', (req, res) => {
  const { consultationId, modePaiement, compteDestinataire } = req.body;
  const db = router.db;
  
  // Find the corresponding feuille
  const feuille = db.get('feuilles').find({ consultationId: Number(consultationId) }).value();
  
  if (!feuille) {
    return res.status(404).json({ message: "Feuille de maladie introuvable pour cette consultation" });
  }

  // Fetch tarifs to determine rate
  const tarifs = db.get('tarifs').value();
  let tauxRemboursement = 0.80; // Default 80%
  if (tarifs && feuille.montantSoins === tarifs.generaliste) {
    tauxRemboursement = 1.0; // 100% for generaliste
  }
  
  const montantRembourse = (feuille.montantSoins || 0) * tauxRemboursement;

  // Update the feuille
  const updatedFeuille = db.get('feuilles')
    .find({ consultationId: Number(consultationId) })
    .assign({
      statut: 'Remboursé',
      modePaiement,
      numeroCompte: compteDestinataire,
      dateRemboursement: new Date().toISOString(),
      tauxRemboursement,
      montantRembourse
    })
    .write();

  res.status(200).json(updatedFeuille);
});

// Rewrite rule to remove '/api' prefix for all other standard CRUD routes
server.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    req.url = req.url.replace('/api/', '/');
  }
  next();
});

// Intercept responses to create side-effects
router.render = (req, res) => {
  const data = res.locals.data;
  
  // If a consultation was successfully created
  if (req.method === 'POST' && (req.url === '/consultations' || req.originalUrl === '/api/consultations')) {
    const db = router.db;
    
    // Fetch patient info to embed in the feuille
    const assure = db.get('assures').find({ id: Number(data.patientId) }).value();
    
    // Create the associated feuille de maladie
    const newFeuille = {
      id: Date.now(), // Generate a unique ID
      consultationId: data.id,
      date: data.date,
      symptome: data.symptome,
      diagnostic: data.diagnostic,
      patientId: data.patientId,
      nomAssure: assure ? `${assure.nom} ${assure.prenom}` : "Inconnu",
      nssAssure: assure ? assure.nss : "Inconnu",
      medecinId: data.medecinId,
      montantSoins: data.montantSoins || 0,
      statut: 'Non remboursé'
    };
    
    // Save it to the db
    db.get('feuilles').push(newFeuille).write();
  }
  
  // Send the normal response
  res.json(data);
};

server.use(router);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`\n========================================================`);
  console.log(`✨ Serveur API Mock (json-server) lancé sur le port ${PORT}`);
  console.log(`   Vite proxy (/api) est maintenant intercepté avec succès !`);
  console.log(`========================================================\n`);
});
