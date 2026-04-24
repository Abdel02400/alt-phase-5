-- =============================================================================
-- Système de calcul des redevances - Groupe d'édition
-- SGBD cible : PostgreSQL 13+
-- Auteur     : Abdel - Test technique Phase 5
--
-- Exécution  : psql -U postgres -f schema.sql
-- =============================================================================

-- Nettoyage idempotent pour pouvoir rejouer le script
DROP TABLE IF EXISTS redevance        CASCADE;
DROP TABLE IF EXISTS vente_mensuelle  CASCADE;
DROP TABLE IF EXISTS contrat          CASCADE;
DROP TABLE IF EXISTS livre            CASCADE;
DROP TABLE IF EXISTS auteur           CASCADE;
DROP TABLE IF EXISTS editeur          CASCADE;
DROP TABLE IF EXISTS type_ouvrage     CASCADE;

-- =============================================================================
-- TABLE : type_ouvrage
-- Table de référence extensible (ajout de nouveaux types sans migration)
-- =============================================================================
CREATE TABLE type_ouvrage (
    id_type      SERIAL       PRIMARY KEY,
    libelle      VARCHAR(50)  NOT NULL UNIQUE,
    description  TEXT
);

-- =============================================================================
-- TABLE : editeur
-- =============================================================================
CREATE TABLE editeur (
    id_editeur   SERIAL        PRIMARY KEY,
    nom          VARCHAR(150)  NOT NULL,
    siret        CHAR(14)      NOT NULL UNIQUE,
    adresse      VARCHAR(255),
    telephone    VARCHAR(20),
    email        VARCHAR(150),
    CONSTRAINT chk_editeur_siret_numeric CHECK (siret ~ '^[0-9]{14}$')
);

-- =============================================================================
-- TABLE : auteur
-- =============================================================================
CREATE TABLE auteur (
    id_auteur       SERIAL        PRIMARY KEY,
    nom             VARCHAR(100)  NOT NULL,
    prenom          VARCHAR(100)  NOT NULL,
    email           VARCHAR(150)  NOT NULL UNIQUE,
    iban            VARCHAR(34),
    date_naissance  DATE,
    nationalite     VARCHAR(50),
    CONSTRAINT chk_auteur_naissance_passee CHECK (date_naissance <= CURRENT_DATE)
);

-- =============================================================================
-- TABLE : livre
-- =============================================================================
CREATE TABLE livre (
    id_livre          SERIAL         PRIMARY KEY,
    isbn              CHAR(13)       NOT NULL UNIQUE,
    titre             VARCHAR(255)   NOT NULL,
    date_publication  DATE           NOT NULL,
    prix_public_ttc   NUMERIC(8,2)   NOT NULL,
    nb_pages          INTEGER,
    id_type           INTEGER        NOT NULL,
    id_editeur        INTEGER        NOT NULL,
    CONSTRAINT fk_livre_type
        FOREIGN KEY (id_type)    REFERENCES type_ouvrage(id_type) ON DELETE RESTRICT,
    CONSTRAINT fk_livre_editeur
        FOREIGN KEY (id_editeur) REFERENCES editeur(id_editeur)   ON DELETE RESTRICT,
    CONSTRAINT chk_livre_prix_positif CHECK (prix_public_ttc >= 0),
    CONSTRAINT chk_livre_pages_positives CHECK (nb_pages IS NULL OR nb_pages > 0),
    CONSTRAINT chk_livre_isbn_numeric CHECK (isbn ~ '^[0-9]{13}$')
);

CREATE INDEX idx_livre_editeur ON livre(id_editeur);
CREATE INDEX idx_livre_type    ON livre(id_type);

-- =============================================================================
-- TABLE : contrat  (association AUTEUR <-> LIVRE)
-- Clé primaire composite : un couple (auteur, livre) = 1 contrat
-- =============================================================================
CREATE TABLE contrat (
    id_auteur                INTEGER       NOT NULL,
    id_livre                 INTEGER       NOT NULL,
    pourcentage_contribution NUMERIC(5,2)  NOT NULL,
    taux_redevance           NUMERIC(5,2)  NOT NULL,
    date_signature           DATE          NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT pk_contrat PRIMARY KEY (id_auteur, id_livre),
    CONSTRAINT fk_contrat_auteur
        FOREIGN KEY (id_auteur) REFERENCES auteur(id_auteur) ON DELETE RESTRICT,
    CONSTRAINT fk_contrat_livre
        FOREIGN KEY (id_livre)  REFERENCES livre(id_livre)   ON DELETE CASCADE,
    CONSTRAINT chk_contrat_pourcentage
        CHECK (pourcentage_contribution BETWEEN 0 AND 100),
    CONSTRAINT chk_contrat_taux
        CHECK (taux_redevance BETWEEN 0 AND 100)
);

CREATE INDEX idx_contrat_auteur ON contrat(id_auteur);
CREATE INDEX idx_contrat_livre  ON contrat(id_livre);

-- =============================================================================
-- TABLE : vente_mensuelle
-- Agrégat des ventes d'un livre par mois/année
-- =============================================================================
CREATE TABLE vente_mensuelle (
    id_vente            SERIAL          PRIMARY KEY,
    id_livre            INTEGER         NOT NULL,
    mois                SMALLINT        NOT NULL,
    annee               SMALLINT        NOT NULL,
    exemplaires_vendus  INTEGER         NOT NULL,
    chiffre_affaires    NUMERIC(12,2)   NOT NULL,
    CONSTRAINT fk_vente_livre
        FOREIGN KEY (id_livre) REFERENCES livre(id_livre) ON DELETE CASCADE,
    CONSTRAINT uq_vente_livre_mois UNIQUE (id_livre, mois, annee),
    CONSTRAINT chk_vente_mois   CHECK (mois BETWEEN 1 AND 12),
    CONSTRAINT chk_vente_annee  CHECK (annee BETWEEN 1900 AND 2100),
    CONSTRAINT chk_vente_exemplaires CHECK (exemplaires_vendus >= 0),
    CONSTRAINT chk_vente_ca     CHECK (chiffre_affaires >= 0)
);

CREATE INDEX idx_vente_periode ON vente_mensuelle(annee, mois);
CREATE INDEX idx_vente_livre   ON vente_mensuelle(id_livre);

-- =============================================================================
-- TABLE : redevance
-- Redevance calculée pour un couple (auteur, livre) sur un mois donné
-- =============================================================================
CREATE TABLE redevance (
    id_redevance     SERIAL          PRIMARY KEY,
    id_auteur        INTEGER         NOT NULL,
    id_livre         INTEGER         NOT NULL,
    mois             SMALLINT        NOT NULL,
    annee            SMALLINT        NOT NULL,
    montant_calcule  NUMERIC(10,2)   NOT NULL,
    date_calcul      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_redevance_auteur
        FOREIGN KEY (id_auteur) REFERENCES auteur(id_auteur) ON DELETE RESTRICT,
    CONSTRAINT fk_redevance_livre
        FOREIGN KEY (id_livre)  REFERENCES livre(id_livre)   ON DELETE CASCADE,
    CONSTRAINT uq_redevance_unique
        UNIQUE (id_auteur, id_livre, mois, annee),
    CONSTRAINT chk_redevance_mois    CHECK (mois BETWEEN 1 AND 12),
    CONSTRAINT chk_redevance_annee   CHECK (annee BETWEEN 1900 AND 2100),
    CONSTRAINT chk_redevance_montant CHECK (montant_calcule >= 0)
);

CREATE INDEX idx_redevance_auteur_periode ON redevance(id_auteur, annee, mois);
CREATE INDEX idx_redevance_livre          ON redevance(id_livre);


-- =============================================================================
-- DONNÉES D'EXEMPLE
-- =============================================================================

-- --- type_ouvrage --------------------------------------------------------------
INSERT INTO type_ouvrage (libelle, description) VALUES
    ('Roman',      'Œuvre de fiction narrative en prose'),
    ('Essai',      'Ouvrage de réflexion sur un sujet donné'),
    ('BD',         'Bande dessinée');

-- --- editeur -------------------------------------------------------------------
INSERT INTO editeur (nom, siret, adresse, telephone, email) VALUES
    ('Gallimard',   '77566965000013', '5 rue Sébastien-Bottin, 75007 Paris',   '0149544200', 'contact@gallimard.fr'),
    ('Actes Sud',   '31885821400026', 'Le Méjan, Place Nina-Berberova, 13200 Arles', '0490499001', 'contact@actes-sud.fr'),
    ('Dargaud',     '33200011800023', '57 rue Gaston Tessier, 75019 Paris',    '0153262626', 'contact@dargaud.fr');

-- --- auteur --------------------------------------------------------------------
INSERT INTO auteur (nom, prenom, email, iban, date_naissance, nationalite) VALUES
    ('Dupont',  'Jean',    'jean.dupont@example.com',  'FR7630001007941234567890185', '1975-06-12', 'Française'),
    ('Martin',  'Sophie',  'sophie.martin@example.com','FR7617569000403456789012378', '1982-03-25', 'Française'),
    ('Nakamura','Yuki',    'yuki.nakamura@example.com','FR7612345678901234567890123', '1990-11-02', 'Japonaise');

-- --- livre ---------------------------------------------------------------------
INSERT INTO livre (isbn, titre, date_publication, prix_public_ttc, nb_pages, id_type, id_editeur) VALUES
    ('9782070612345', 'Les Chemins de Traverse', '2023-05-15', 22.00, 320,
        (SELECT id_type FROM type_ouvrage WHERE libelle='Roman'),
        (SELECT id_editeur FROM editeur WHERE nom='Gallimard')),
    ('9782330098765', 'Réflexions sur l''IA',    '2024-01-20', 18.50, 210,
        (SELECT id_type FROM type_ouvrage WHERE libelle='Essai'),
        (SELECT id_editeur FROM editeur WHERE nom='Actes Sud')),
    ('9782205087654', 'Aventures Spatiales T.1', '2024-09-10', 14.95, 64,
        (SELECT id_type FROM type_ouvrage WHERE libelle='BD'),
        (SELECT id_editeur FROM editeur WHERE nom='Dargaud'));

-- --- contrat -------------------------------------------------------------------
-- "Les Chemins de Traverse" : écrit à 100% par Jean Dupont, 10% de redevance
-- "Réflexions sur l'IA"     : co-écrit 60/40 par Sophie Martin et Yuki Nakamura, 8%
-- "Aventures Spatiales T.1" : écrit 100% par Yuki Nakamura, 12%
INSERT INTO contrat (id_auteur, id_livre, pourcentage_contribution, taux_redevance, date_signature) VALUES
    ((SELECT id_auteur FROM auteur WHERE email='jean.dupont@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782070612345'),
     100.00, 10.00, '2023-03-01'),

    ((SELECT id_auteur FROM auteur WHERE email='sophie.martin@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782330098765'),
     60.00, 8.00, '2023-11-15'),

    ((SELECT id_auteur FROM auteur WHERE email='yuki.nakamura@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782330098765'),
     40.00, 8.00, '2023-11-15'),

    ((SELECT id_auteur FROM auteur WHERE email='yuki.nakamura@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782205087654'),
     100.00, 12.00, '2024-07-01');

-- --- vente_mensuelle -----------------------------------------------------------
INSERT INTO vente_mensuelle (id_livre, mois, annee, exemplaires_vendus, chiffre_affaires) VALUES
    ((SELECT id_livre FROM livre WHERE isbn='9782070612345'), 1, 2026, 1500, 33000.00),
    ((SELECT id_livre FROM livre WHERE isbn='9782330098765'), 1, 2026,  800, 14800.00),
    ((SELECT id_livre FROM livre WHERE isbn='9782205087654'), 1, 2026, 2200, 32890.00);

-- --- redevance -----------------------------------------------------------------
-- Calcul = CA × % contribution × taux_redevance / 10000
-- Ex.: Dupont sur "Les Chemins..." janvier 2026 = 33000 × 100% × 10%   = 3300
--      Martin sur "Réflexions..."                = 14800 × 60%  × 8%   = 710.40
--      Nakamura sur "Réflexions..."              = 14800 × 40%  × 8%   = 473.60
--      Nakamura sur "Aventures..."               = 32890 × 100% × 12%  = 3946.80
INSERT INTO redevance (id_auteur, id_livre, mois, annee, montant_calcule) VALUES
    ((SELECT id_auteur FROM auteur WHERE email='jean.dupont@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782070612345'),
     1, 2026, 3300.00),

    ((SELECT id_auteur FROM auteur WHERE email='sophie.martin@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782330098765'),
     1, 2026,  710.40),

    ((SELECT id_auteur FROM auteur WHERE email='yuki.nakamura@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782330098765'),
     1, 2026,  473.60),

    ((SELECT id_auteur FROM auteur WHERE email='yuki.nakamura@example.com'),
     (SELECT id_livre  FROM livre  WHERE isbn='9782205087654'),
     1, 2026, 3946.80);


-- =============================================================================
-- REQUÊTES D'EXEMPLE - Démonstration des 3 vues métier
-- =============================================================================

-- Vue ADMIN : catalogue complet avec éditeur et type
-- SELECT l.titre, t.libelle AS type, e.nom AS editeur, l.prix_public_ttc
-- FROM livre l
-- JOIN type_ouvrage t ON l.id_type = t.id_type
-- JOIN editeur e      ON l.id_editeur = e.id_editeur;

-- Vue COMPTABLE : total des redevances à verser pour un mois donné
-- SELECT a.nom, a.prenom, a.iban, SUM(r.montant_calcule) AS total_du
-- FROM redevance r
-- JOIN auteur a ON r.id_auteur = a.id_auteur
-- WHERE r.mois = 1 AND r.annee = 2026
-- GROUP BY a.id_auteur, a.nom, a.prenom, a.iban;

-- Vue AUTEUR : historique des redevances pour un auteur donné
-- SELECT l.titre, r.annee, r.mois, r.montant_calcule
-- FROM redevance r
-- JOIN livre l ON r.id_livre = l.id_livre
-- WHERE r.id_auteur = (SELECT id_auteur FROM auteur WHERE email='yuki.nakamura@example.com')
-- ORDER BY r.annee DESC, r.mois DESC;
