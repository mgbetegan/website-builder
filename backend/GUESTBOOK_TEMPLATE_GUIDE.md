# Guide des Templates de Livre d'Or

Ce guide explique comment créer et utiliser des templates DOCX pour générer des livres d'or personnalisés.

## 📝 Créer un Template DOCX

### Variables disponibles

Votre template peut utiliser les variables suivantes en les entourant d'accolades `{nom_variable}` :

#### Variables globales
- `{guestbook_name}` - Nom du livre d'or
- `{date}` - Date de génération du document
- `{total_entries}` - Nombre total d'entrées

#### Boucle sur les entrées

Pour afficher toutes les entrées, utilisez une boucle :

```
{#entries}
Nom: {nom}
Message: {message}
Date: {date}
{/entries}
```

### Exemple de Template Simple

```
═══════════════════════════════════════
        LIVRE D'OR - {guestbook_name}
═══════════════════════════════════════

Généré le: {date}
Nombre d'entrées: {total_entries}

───────────────────────────────────────

{#entries}
┌─────────────────────────────────────┐
│ Nom: {nom}
│ Email: {email}
│ Date de visite: {date_visite}
│
│ Message:
│ {message}
│
└─────────────────────────────────────┘

{/entries}

═══════════════════════════════════════
        Fin du Livre d'Or
═══════════════════════════════════════
```

### Exemple de Template Avancé

```
                LIVRE D'OR
         {guestbook_name}

═══════════════════════════════════════

📅 Date: {date}
📊 Total: {total_entries} entrées

───────────────────────────────────────

{#entries}
🙂 {nom} <{email}>
📅 {date_visite}

💬 "{message}"

⭐ Note: {note}/5
📍 Ville: {ville}

───────────────────────────────────────
{/entries}

Merci à tous nos visiteurs !
```

## 🎯 Utiliser le Template

### 1. Créer le template dans Word

1. Ouvrez Microsoft Word ou LibreOffice Writer
2. Créez votre mise en page
3. Insérez les variables entre accolades : `{nom}`, `{message}`, etc.
4. Sauvegardez en format `.docx`

### 2. Uploader le template via l'API

```bash
curl -X POST http://localhost:3000/api/guestbooks/{guestbook_id}/template \
  -F "template=@mon_template.docx"
```

### 3. Ajouter des entrées

```bash
curl -X POST http://localhost:3000/api/guestbooks/{guestbook_id}/entries \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "message": "Excellent séjour !",
    "date_visite": "2025-11-06",
    "note": "5",
    "ville": "Paris"
  }'
```

### 4. Générer le document

```bash
curl http://localhost:3000/api/guestbooks/{guestbook_id}/generate \
  --output livre_dor.docx
```

## 📋 Champs Personnalisés

Vous pouvez définir vos propres champs dans le template. Le système détecte automatiquement toutes les variables utilisées.

### Exemples de champs utiles:

**Pour un hôtel:**
- `{nom}`, `{email}`, `{telephone}`
- `{numero_chambre}`, `{date_arrivee}`, `{date_depart}`
- `{note_proprete}`, `{note_service}`, `{note_generale}`
- `{message}`

**Pour un restaurant:**
- `{nom}`, `{email}`
- `{date_visite}`, `{nombre_personnes}`
- `{plats_commandes}`
- `{note_cuisine}`, `{note_service}`, `{note_ambiance}`
- `{avis}`

**Pour un événement:**
- `{nom}`, `{prenom}`, `{entreprise}`
- `{fonction}`, `{email}`
- `{date_participation}`
- `{meilleur_moment}`, `{suggestions}`
- `{participerait_nouveau}`

## 🎨 Mise en Forme

Le template conserve toute la mise en forme Word :
- Polices, couleurs, tailles
- Gras, italique, souligné
- Tableaux
- Images (logos, en-têtes)
- En-têtes et pieds de page
- Bordures et encadrements

## ⚠️ Conseils et Bonnes Pratiques

1. **Testez votre template** avec quelques entrées d'abord
2. **Utilisez des noms de variables clairs** (ex: `date_visite` plutôt que `d1`)
3. **Vérifiez l'orthographe** des variables (sensible à la casse)
4. **Prévoyez de l'espace** pour les longs messages
5. **Ajoutez des sauts de page** si nécessaire entre les entrées

## 🔧 Dépannage

### Le document ne se génère pas
- Vérifiez que toutes les accolades sont fermées : `{nom}` ✅ `{nom` ❌
- Assurez-vous que la boucle `{#entries}...{/entries}` est correcte
- Vérifiez que le fichier est bien en format `.docx`

### Certaines variables n'apparaissent pas
- Vérifiez l'orthographe exacte des variables
- Assurez-vous que les données sont bien envoyées dans les entrées

### Mise en forme cassée
- Évitez de mettre les accolades au milieu d'un mot stylé
- Préférez : **Nom:** `{nom}` plutôt que **Nom: {nom}**

## 📚 Ressources

- [Documentation docxtemplater](https://docxtemplater.com/)
- API Endpoint: `POST /api/guestbooks/:id/template`
- API Endpoint: `GET /api/guestbooks/:id/generate`
