# 👨‍💼 Guide Administration - Interface Admin

Documentation complète de l'interface d'administration pour la gestion des images.

---

## 🚀 Démarrage Rapide

```bash
npm run admin
# Ouvrir http://localhost:3001
```

---

## ⚡ Actions Principales

### 1️⃣ **Ajouter une Image**
```
1. Glisser-déposer image dans la zone
2. Sélectionner espèce + type
3. Cliquer 🚀
→ Image uploadée avec numérotation automatique +1
```

### 2️⃣ **Supprimer des Images**
```
1. Filtrer par espèce/type
2. Cocher les images ☑
3. Cliquer 🗑️ dans le header
→ Suppression confirmée
```

### 3️⃣ **Changer le Numéro**
```
1. Input numéro → taper nouveau numéro
2. Confirmer permutation
→ Swap automatique (ex: #03 ↔ #01)
```

### 4️⃣ **Modifier Espèce/Type**
```
1. Changer select Espèce ou Type
2. Bouton 💾 devient orange
3. Cliquer 💾
→ Image renommée et déplacée
```

---

## 🖥️ Interface Détaillée

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 FILTRES                                               │
│ [Espèce ▼] [Type ▼] [🔄 Réinitialiser]                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📷 IMAGES EXISTANTES                                     │
│ 0 sélectionnée(s) [🗑️ Supprimer] [💾 Sauvegarder tout]  │
│                                                          │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                │
│ │☑ #1   │ │☐ #2   │ │☐ #3   │ │☐ #4   │                │
│ │[img]  │ │[img]  │ │[img]  │ │[img]  │                │
│ │💾 🗑️  │ │💾 🗑️  │ │💾 🗑️  │ │💾 🗑️  │                │
│ └───────┘ └───────┘ └───────┘ └───────┘                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📤 AJOUTER IMAGES                                        │
│ [📁 Glisser-déposer ou cliquer]                         │
│                                                          │
│ Queue d'upload :                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ [img] photo.jpg                                     │  │
│ │       [Espèce ▼] [Type ▼]  [→ #05] [🚀] [🗑️]       │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ [🚀 Envoyer toutes] [🗑️ Vider]                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Workflows Complets

### Workflow 1 : Visualiser

1. Sélectionner **espèce** dans filtre
2. Sélectionner **type** dans filtre
3. ✅ Images s'affichent automatiquement

### Workflow 2 : Ajouter Une Image

1. **Glisser-déposer** image
2. Image apparaît dans **queue d'upload**
3. **Sélectionner espèce** (auto-détection si nom contient espèce)
4. **Sélectionner type** (auto-détection si nom contient type)
5. Badge affiche **→ #05** (numéro automatique)
6. **Cliquer 🚀**
7. ✅ Image uploadée + commit Git + push automatique

### Workflow 3 : Ajouter Plusieurs Images

1. **Glisser-déposer 10 images**
2. Toutes apparaissent dans la **queue**
3. **Configurer chaque image** (espèce/type)
4. **Cliquer "🚀 Envoyer toutes"**
5. ✅ Upload séquentiel + commit unique

### Workflow 4 : Supprimer

1. **Filtrer** par espèce/type
2. **Cocher** les images à supprimer (☑)
3. Header affiche "**5 sélectionnée(s)**"
4. **Cliquer 🗑️** dans header
5. **Confirmer** suppression
6. ✅ Supprimées + commit Git + push

### Workflow 5 : Réorganiser Numéros

```
Situation actuelle :
#01 → Photo floue
#02 → Photo moyenne
#03 → Photo PARFAITE ★★★

Action :
Input #03 → taper "1"
Confirmation : "Permuter #03 ↔ #01 ?"

Résultat :
#01 → Photo PARFAITE ★★★ (ancien #03)
#02 → Photo moyenne
#03 → Photo floue (ancien #01)
```

**Swap automatique en 3 étapes** :
1. Renommer #01 → temp
2. Renommer #03 → #01
3. Renommer temp → #03

### Workflow 6 : Modifier Plusieurs Images

1. Changer **espèce/type/numéro** sur 10 images
2. Boutons 💾 deviennent **orange** et pulsent
3. Header affiche "**Sauvegarder 10 modification(s)**"
4. **Cliquer 💾** dans header
5. ✅ Toutes sauvegardées en séquence + commit unique

---

## 🎯 Fonctionnalités Avancées

### Numérotation Automatique +1

Le système **compte automatiquement** les images existantes et propose le prochain numéro :

```javascript
Images existantes : kanzan_fleurs_01.jpg, kanzan_fleurs_02.jpg
Nouvelle image : → Badge affiche "#03"
Upload : kanzan_fleurs_03.jpg ✅
```

### Détection Automatique

Si le nom de fichier contient l'espèce ou le type, ils sont **pré-sélectionnés** :

```
Fichier : "kanzan_fleurs_printemps.jpg"
→ Espèce auto : "Cerisier Kanzan"
→ Type auto : "Fleurs"
```

### Modal Zoom Plein Écran

- **Clic sur miniature** → Modal plein écran
- Navigation **← →** entre images
- **Échap** pour fermer
- Affiche nom complet et métadonnées

### Logs en Temps Réel

Zone de logs en bas affiche :
- ✅ Succès (vert)
- ⚠️ Warnings (orange)
- ❌ Erreurs (rouge)

---

## 🔄 Synchronisation Automatique

### Comment ça marche ?

**Chaque action admin synchronise automatiquement le site web.**

```
Vous uploadez une image
    ↓
server.js : /upload-image
    ↓
Fichier enregistré localement
    ↓
gitCommitAndPush("Upload: image.jpg")
    ├─ generateImagesJson() ← Régénère images.json
    ├─ git add images/ + images.json
    ├─ git commit -m "Upload: image.jpg"
    └─ git push → Déclenche Render
    ↓
✅ Site web affiche la nouvelle image (2-3 min)
```

### Actions Synchronisées

| Action | Synchronisation |
|--------|-----------------|
| 📤 Upload image | ✅ Auto |
| 🗑️ Suppression | ✅ Auto |
| 🔄 Changement numéro | ✅ Auto |
| ↔️ Permutation | ✅ Auto |
| ✏️ Modification espèce/type | ✅ Auto |

**Délai** : 2-3 minutes (build Render)

### Fonction Centrale : `gitCommitAndPush()`

```javascript
async function gitCommitAndPush(message) {
  // 1. Régénérer images.json automatiquement
  await generateImagesJson();  // ← CRUCIAL !
  
  // 2. Git add
  await execPromise('git add client/public/images/ client/public/images.json');
  
  // 3. Git commit
  await execPromise(`git commit -m "${message}"`);
  
  // 4. Git push (arrière-plan)
  execPromise('git push');  // → Déclenche Render
}
```

**Appelée par** : upload, delete, rename, swap, change-species/type

---

## 🛠️ Scripts Disponibles

### Interface Admin (Principal)

```bash
npm run admin
# Lance serveur Node.js sur port 3001
# Interface web complète
```

**Usage quotidien** : ⭐⭐⭐⭐⭐ **RECOMMANDÉ**

### Script Python (Occasionnel)

```bash
python telecharger_toutes_images.py
# Télécharge images en masse depuis URLs
```

**Quand l'utiliser** :
- Récupérer 20-50 images depuis ChatGPT
- Réinstallation complète du projet

**Usage** : ⭐⭐ **RARE**

---

## 📦 Fichiers de Configuration

### `images.json`

Généré automatiquement par `generateImagesJson()` :

```json
{
  "prunus-kanzan": {
    "fleurs": ["01.jpg", "02.jpg", "03.jpg"],
    "vue_generale": ["01.jpg", "02.jpg"]
  }
}
```

**MAI ÉDITER À LA MAIN** - Régénéré automatiquement à chaque action admin

### `images_completes.json`

Pour script Python uniquement :

```json
{
  "prunus-kanzan": {
    "fleurs_01": "https://pexels.com/photo/...",
    "fleurs_02": "https://unsplash.com/photo/..."
  }
}
```

**Usage** : Téléchargement massif d'images

---

## 🎨 Interface Moderne

### Glassmorphism Design

- Arrière-plan dégradé animé
- Cartes avec effet verre
- Animations fluides
- Thème sombre élégant

### Feedback Visuel

- ✅ **Succès** : Bordure verte + animation
- ⚠️ **Attention** : Bouton orange pulsant
- ❌ **Erreur** : Bordure rouge + message
- 🔄 **Loading** : Spinner animé

---

## 🚨 Troubleshooting

### "Port 3001 already in use"

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

### "Git push failed"

```bash
# Vérifier statut Git
git status
git log --oneline -5

# Forcer sync
git pull --rebase
git push
```

### "Images n'apparaissent pas sur le site"

1. Vérifier que le push Git a réussi (logs admin)
2. Attendre 2-3 minutes (build Render)
3. Vider cache navigateur (Ctrl + F5)
4. Vérifier console Render : https://dashboard.render.com

### "Numérotation incorrecte"

Le système compte **automatiquement** :
- Filtre sur espèce + type voulu
- Vérifie numéros existants
- Suggère numéro suivant

Si erreur : renommer manuellement via input numéro + 💾

---

## ✅ Checklist Upload Image

- [ ] Image de bonne qualité (min 800px)
- [ ] Nom de fichier clair (espèce_type_description.jpg)
- [ ] Espèce sélectionnée
- [ ] Type sélectionné
- [ ] Badge numéro vérifié
- [ ] Clic 🚀
- [ ] Attendre confirmation verte
- [ ] Vérifier sur site après 2-3 min

---

## 📊 Statistiques Interface

| Métrique | Valeur |
|----------|--------|
| **Temps moyen upload** | 2-3 sec/image |
| **Images traitables** | Illimité |
| **Formats supportés** | JPG, JPEG, PNG, WebP |
| **Taille max** | 5 MB/image |
| **Auto-détection** | Espèce + Type |
| **Numérotation** | Automatique +1 |
| **Sync Git** | Automatique |

---

**Développé avec 💚 pour une gestion d'images sans friction**
