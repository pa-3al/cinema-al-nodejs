# Absolute Cinema

Projet final de la matière Node JS.\
ESGI 2025-2026 - Promotion Architecture des logiciels

Projet proposé par : 
- Erwan LUCE--GUEDON
- Racim ADJIRI
- Rémy THIBAUT

Ce document présente le projet, les commandes à effectuer pour pouvoir le lancer ainsi que l'ensemble des fonctionnalités intégrées dans ce dernier.

## Commandes 

Pour cloner ce repository : 

```bash
git clone git@github.com:pa-3al/cinema-al-nodejs.git
```

Ce projet utilise Docker et Docker Compose pour faire tourner les services tiers (PostgreSQL, Minio....).
Pour installer Docker / Docker Compose, la documentation se trouve [ici](https://docs.docker.com/engine/install/)

Pour lancer ce projet, voici les variables d'environnements à configurer :

```ini

# Configuration Docker pour PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=cinema_al_db
POSTGRES_USER=cinema_al
POSTGRES_PASSWORD=cinema_al_password

# Connexion NestJS à PostgreSQL
DATABASE_URL=postgresql://cinema_al:cinema_al_password@localhost:5432/cinema_al_db

# Configuration Docker pour Minio 
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ROOT_USER=minio_root
MINIO_ROOT_PASSWORD=minio_root_password
MINIO_BUCKET=cinema-al

# Configuration NestJS pour Minio
MINIO_ACCESS_KEY=cinemauser
MINIO_SECRET_KEY=cinemapassword

# Configuration JWT
JWT_ACCESS_SECRET=L1AqozX2Wwh9C2cn5li+/Npmtg6J9Vj25ISvZYGVtPs=
JWT_REFRESH_SECRET=SFEn/DpZXBGv1aLbDFHkkbZY2ud9X2fZHgcaf4MRu4k=

# Configuration Monitoring (Prometheus et Loki)
NESTJS_APP=absolute-cinema
LOKI_URL=http://localhost:3100
LOKI_TOKEN=

NODE_ENV=development
```

### Base de données (Migrations)

Générer une nouvelle migration :
```bash
npm run migration:generate src/infrastructure/adapters/persistence/sql/migrations/NOM_DE_LA_MIGRATION
```

Exécuter les migrations en attente :
```bash
npm run migration:run
```

### Lancement de l'application

Lancer l'application en mode développement :
```bash
npm run start:dev
```

### Tests & Qualité de code

Lancer les tests unitaires :
```bash
npm run test
```

---

## Fonctionnalités Implémentées

### Utilisateurs & Authentification
* Création de compte, authentification et déconnexion.
* Sécurité via Access Token (valide 5 min) et Refresh Token en base de données.
* Gestion des rôles : Client, Employé, Administrateur, Super Administrateur.
* Consultation globale des utilisateurs par les administrateurs et accès aux détails d'activité (historique, statistiques, films vus).

### Gestion des Salles
* Opérations CRUD complètes (réservées aux administrateurs).
* Paramétrage complet : nom, description, capacité (15 à 30 places), accès handicapé et type de projection.
* Mise en maintenance des salles (rendant les séances invisibles).
* Consultation du planning d'une salle spécifique par les utilisateurs sur une période choisie.

### Gestion des Films et Séances
* Opérations CRUD sur les films et les types de projection.
* Planification des séances avec contrôle strict des chevauchements horaires dans une même salle.
* Réservation automatique d'un créneau incluant la durée du film + 30 minutes de marge (publicité et nettoyage).
* Consultation publique (pour les utilisateurs authentifiés) du planning des films et des séances du cinéma.
* Suivi de l'affluence : visualisation du nombre précis de billets vendus par séance pour les administrateurs.

### Billetterie & Portefeuille
* Système de portefeuille virtuel : dépôt et retrait d'argent (en euros).
* Achat de billets unitaires ou de "Super Billets" valables pour 10 séances.
* Suivi par l'utilisateur de l'historique de ses achats et des billets consommés.
* Historique global des transactions financières accessible aux administrateurs.

### Statistiques
* Consultation de l'affluence quotidienne et hebdomadaire.
* Taux de fréquentation global ou ciblé par séance/salle sur des périodes spécifiques.

### Technique
* Documentation complète de l'API via Swagger/OpenAPI.
* Utilisation généralisée du format standardisé ISO-8601 pour les dates.
* Dockerisation de l'environnement complet.

---

## Fonctionnalités Bonus Implémentées

### Architecture & Code
* **Architecture Hexagonale / Clean Architecture :** Découpage strict en couches (Core/Domain, Application, Infrastructure, Adapters, Ports) garantissant l'isolation de la logique métier.

### Planning des Employés (Super Admin)
* Gestion des ressources humaines : affectation des employés sur des postes précis (Confiserie, Accueil, Projectionniste).
* Vérification automatique des conflits de planning pour empêcher les doublons d'affectation sur un même créneau horaire.

### Observabilité & Monitoring
* **Prometheus :** Exposition des métriques de l'application via un adapter dédié.
* **Grafana :** Visualisation des métriques.
* **Loki :** Centralisation et formatage des logs applicatifs structurés en JSON.

### Infrastructure Externe
* **MinIO (S3 Compatible) :** Intégration d'un système de stockage objet externe pour la gestion des fichiers lourds (comme les images des salles), séparant le stockage fichier de la base de données PostgreSQL.

### Mise en production 
* **Load Balancing :** Mise en place sur le serveur de production de Load Balancing avec Caddy
* **Mise en place d'une intégration continue :** Mise en place d'un Workflow Jenkins pour la mise en place de build