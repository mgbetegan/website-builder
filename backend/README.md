# Website Builder Backend API

Backend Node.js Express pour le Website Builder avec sauvegarde automatique et génération de projets Angular.

## Fonctionnalités

- ✅ **API REST** complète pour gérer les projets
- 💾 **Sauvegarde automatique** des designs en temps réel
- 🚀 **Génération de projets Angular** à partir des designs
- 📦 **Export HTML/CSS** standalone
- 📁 **Stockage sur le système de fichiers** (facilement extensible à une BDD)

## Installation

```bash
cd backend
npm install
```

## Démarrage

```bash
# Mode production
npm start

# Mode développement avec nodemon
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## Endpoints API

### Projects

- `GET /api/projects` - Récupérer tous les projets
- `GET /api/projects/:id` - Récupérer un projet spécifique
- `POST /api/projects` - Créer un nouveau projet
- `PUT /api/projects/:id` - Mettre à jour un projet
- `DELETE /api/projects/:id` - Supprimer un projet

### Auto-save

- `POST /api/projects/:id/autosave` - Sauvegarder automatiquement les éléments

### Export

- `GET /api/projects/:id/export/html` - Exporter le projet en HTML
- `GET /api/projects/:id/generate/angular` - Générer et télécharger un projet Angular (ZIP)

### Health Check

- `GET /health` - Vérifier l'état du serveur

## Structure du projet

```
backend/
├── src/
│   ├── controllers/     # Contrôleurs de routes
│   ├── models/          # Modèles de données
│   ├── routes/          # Définitions des routes
│   ├── services/        # Logique métier
│   └── server.js        # Point d'entrée
├── data/                # Fichiers de données (projets)
└── generated-projects/  # Projets Angular générés
```

## Configuration

Le serveur utilise par défaut le port 3000. Pour changer, définir la variable d'environnement `PORT`.

```bash
PORT=4000 npm start
```

## Format des données

### Project

```json
{
  "id": "uuid",
  "name": "Mon Projet",
  "description": "Description du projet",
  "elements": [],
  "createdAt": "2025-11-06T12:00:00.000Z",
  "updatedAt": "2025-11-06T12:00:00.000Z",
  "userId": "anonymous"
}
```

### Element

```json
{
  "id": "element-1",
  "type": "text",
  "content": "Hello World",
  "styles": {
    "position": "absolute",
    "top": "50px",
    "left": "50px",
    "width": "auto",
    "height": "auto"
  },
  "formAttributes": {},
  "children": []
}
```
