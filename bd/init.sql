CREATE DATABASE IF NOT EXISTS gestion_ss_db;
USE gestion_ss_db;

-- 1. Table AGENT (Pour l'accès au tableau de bord Agent)
CREATE TABLE IF NOT EXISTS agent (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'AGENT'
);

-- 2. Table MEDECIN
CREATE TABLE IF NOT EXISTS medecin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    identifiant VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    rpps VARCHAR(255) UNIQUE NOT NULL,
    specialite VARCHAR(255),
    type VARCHAR(50) NOT NULL, -- 'GENERALISTE' ou 'SPECIALISTE'
    clinique VARCHAR(255),
    est_assure BOOLEAN DEFAULT FALSE,
    deleted_at DATETIME NULL
);

-- 3. Table ASSURE
CREATE TABLE IF NOT EXISTS assure (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    nss VARCHAR(255) UNIQUE NOT NULL,
    date_naissance DATE,
    adresse VARCHAR(255),
    telephone VARCHAR(50),
    groupe_sanguin VARCHAR(10),
    allergies TEXT,
    taille DOUBLE,
    poids DOUBLE,
    numero_compte VARCHAR(255),
    medecin_traitant_id BIGINT NULL,
    deleted_at DATETIME NULL,
    FOREIGN KEY (medecin_traitant_id) REFERENCES medecin(id) ON DELETE SET NULL
);

-- 4. Table CONSULTATION
CREATE TABLE IF NOT EXISTS consultation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    symptome TEXT,
    diagnostic TEXT,
    assure_id BIGINT NOT NULL,
    medecin_id BIGINT NOT NULL,
    montant_soins DOUBLE NOT NULL,
    FOREIGN KEY (assure_id) REFERENCES assure(id) ON DELETE CASCADE,
    FOREIGN KEY (medecin_id) REFERENCES medecin(id) ON DELETE CASCADE
);

-- 5. Table FEUILLE_MALADIE
CREATE TABLE IF NOT EXISTS feuille_maladie (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    consultation_id BIGINT NOT NULL,
    montant_soins DOUBLE NOT NULL,
    statut VARCHAR(50) DEFAULT 'ENREGISTREE', -- 'ENREGISTREE', 'REMBOURSEE'
    date_remboursement DATETIME NULL,
    montant_rembourse DOUBLE NULL,
    taux_remboursement DOUBLE NULL,
    mode_paiement VARCHAR(50) NULL, -- 'VIREMENT', 'CASH'
    FOREIGN KEY (consultation_id) REFERENCES consultation(id) ON DELETE CASCADE
);

-- 6. Table TARIF
CREATE TABLE IF NOT EXISTS tarif (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_consultation VARCHAR(50) UNIQUE NOT NULL, -- 'GENERALISTE', 'SPECIALISTE'
    montant DOUBLE NOT NULL
);

-- 7. Table NOTIFICATION
CREATE TABLE IF NOT EXISTS notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medecin_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    date DATETIME NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (medecin_id) REFERENCES medecin(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- INSERTION DES DONNÉES DE DÉMONSTRATION (MOCKS)
-- --------------------------------------------------------

-- Insérer un Agent (Mot de passe en clair pour test)
-- NB: Si ton backend utilise Spring Security (BCrypt), il faudra hacher ces mots de passe.
-- Pour l'instant, on utilise 'password' pour pouvoir tester simplement.
INSERT INTO agent (nom, prenom, email, mot_de_passe) VALUES 
('Admin', 'Agent', 'agent@assurrassure.com', 'password');

-- Insérer des Médecins
INSERT INTO medecin (nom, prenom, identifiant, mot_de_passe, rpps, specialite, type, clinique, est_assure) VALUES 
('Dupont', 'Jean', 'MED001', 'password', '10000000001', 'Généraliste', 'GENERALISTE', 'Clinique Centrale', TRUE),
('Martin', 'Sophie', 'MED002', 'password', '10000000002', 'Cardiologue', 'SPECIALISTE', 'Hôpital Nord', FALSE);

-- Insérer des Assurés
INSERT INTO assure (nom, prenom, nss, date_naissance, adresse, telephone, groupe_sanguin, allergies, taille, poids, numero_compte, medecin_traitant_id) VALUES 
('Durand', 'Pierre', '190010000000001', '1990-01-15', '10 rue de la Paix, Paris', '0600000001', 'A+', 'Pénicilline', 1.75, 70.5, 'FR7600000000000000000000001', 1),
('Lefebvre', 'Marie', '292020000000002', '1992-05-20', '5 avenue des Fleurs, Lyon', '0600000002', 'O-', 'Aucune', 1.65, 60.0, 'FR7600000000000000000000002', 1);

-- Insérer des Tarifs
INSERT INTO tarif (type_consultation, montant) VALUES 
('GENERALISTE', 25.0),
('SPECIALISTE', 50.0);

-- Insérer des Consultations
INSERT INTO consultation (date, symptome, diagnostic, assure_id, medecin_id, montant_soins) VALUES 
('2026-06-20 10:00:00', 'Fièvre et toux', 'Angine virale', 1, 1, 25.0),
('2026-06-21 14:30:00', 'Douleurs thoraciques', 'Tachycardie bénigne', 2, 2, 50.0);

-- Insérer des Feuilles de Maladie
INSERT INTO feuille_maladie (consultation_id, montant_soins, statut) VALUES 
(1, 25.0, 'ENREGISTREE'),
(2, 50.0, 'ENREGISTREE');

-- Insérer des Notifications
INSERT INTO notification (medecin_id, message, date, lu) VALUES 
(1, 'Bienvenue sur la plateforme AssurRassure.', '2026-06-20 09:00:00', FALSE);
