# cinema-al-nodejs


## Commandes 

Avant toute commande, la base de données et Minio doivent être démarrés

### Lancement de l'appli

```bash
npm run start:dev
```

### Création d'une migration PostgreSQL

### Lancement de l'appli

```bash
npm run migration:generate src/infrastructure/adapters/persistence/sql/migrations/NOM_DE_LA_MIGRATION
npm run migration:run
```

