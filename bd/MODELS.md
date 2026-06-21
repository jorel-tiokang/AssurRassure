# Data Models - AssurRassure

## Assure

```typescript
interface Assure {
  id: number;
  nom: string;
  prenom: string;
  nss: string;
  dateNaissance: string;
  adresse: string;
  telephone: string;
  groupeSanguin: string;
  allergies: string;
  taille: number;
  poids: number;
  numeroCompte: string;
  medecinTraitantId?: number;
  deletedAt?: string;
}
```

## Medecin

```typescript
interface Medecin {
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
```

## Consultation

```typescript
interface Consultation {
  id: number;
  date: string;
  symptome: string;
  diagnostic: string;
  patientId: number;
  medecinId: number;
  montantSoins: number;
}
```

## PrescriptionMedicament

```typescript
interface PrescriptionMedicament {
  id: number;
  nomMedicament: string;
  posologie: string;
  consultationId: number;
}
```

## PrescriptionSpecialiste

```typescript
interface PrescriptionSpecialiste {
  id: number;
  specialite: string;
  motif: string;
  consultationId: number;
}
```

## FeuilleMaladie

```typescript
interface FeuilleMaladie {
  id: number;
  consultationId: number;
  montantSoins: number;
  statut: 'ENREGISTREE' | 'REMBOURSEE';
  dateRemboursement?: string;
  montantRembourse?: number;
  tauxRemboursement?: number;
  modePaiement?: 'VIREMENT' | 'CASH';
}
```

## RemboursementRequest

```typescript
interface RemboursementRequest {
  feuilleId: number;
  modePaiement: 'VIREMENT' | 'CASH';
}
```

## Notification

```typescript
interface Notification {
  id: number;
  medecinId: number;
  message: string;
  date: string;
  lu: boolean;
}
```

## Tarifs

```typescript
interface Tarifs {
  generaliste: number;
  specialiste: number;
}
```

## DashboardStats

```typescript
interface DashboardStats {
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
```