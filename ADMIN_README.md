# 🌳 INTERFACE ADMIN - HAIES BESSANCOURT

Interface d'administration pour gérer les images et modèles 3D du projet.

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Installer les dépendances
```bash
# À la racine du projet
npm install
```

### 2. Lancer le serveur admin
```bash
npm run admin
# Ou directement :
node admin/server.js
```

### 3. Ouvrir dans le navigateur
```
http://localhost:3001
```

---

## 📁 STRUCTURE

```
admin/
├── server.js           - Serveur Express principal (upload images)
├── server-api.js       - API pour modèles 3D
├── index.html          - Interface upload images
├── models.html         - Interface gestion modèles 3D
├── upload-model.html   - Upload modèles 3D
├── admin.js            - Logic upload images
├── admin.css           - Styles
├── models.js           - Logic modèles 3D
└── upload-model.js     - Logic upload modèles
```

---

## 🖼️ FONCTIONNALITÉS

### 1. Upload d'images
- **URL** : http://localhost:3001
- **Formats** : JPG, JPEG, PNG, WebP
- **Taille max** : 5 MB par image
- **Fonctionnalités** :
  - Glisser-déposer multiple
  - Nommage automatique (espèce_type_numéro)
  - Numérotation automatique
  - Git commit + push automatique
  - Aperçu avant upload

### 2. Gestion des images
- **Fonctionnalités** :
  - Lister toutes les images
  - Permuter deux images (swap)
  - Changer le numéro d'une image
  - Renommer/déplacer une image
  - Supprimer une image
  - Git commit automatique

### 3. Upload modèles 3D
- **URL** : http://localhost:3001/upload-model.html
- **Formats** : OBJ, MTL, GLB
- **Fonctionnalités** :
  - Upload fichiers 3D
  - Conversion OBJ → GLB automatique
  - Preview 3D (si GLB)

---

## 🔧 CONFIGURATION

### Dépendances (package.json racine)
```json
{
  "dependencies": {
    "express": "^4.18.2",    // Serveur HTTP
    "multer": "^1.4.5-lts.1", // Upload fichiers
    "cors": "^2.8.5"          // CORS
  }
}
```

### Port
- **Admin** : 3001
- **Client** : 5173

---

## 📝 API ENDPOINTS

### Images

#### Lister les images
```http
GET /list-images?espece=noisetier&type=fleurs
```

#### Upload images
```http
POST /upload
Content-Type: multipart/form-data
Body: images[] + configs[]
```

#### Permuter deux images
```http
POST /swap-images
Body: { image1: {...}, image2: {...} }
```

#### Changer le numéro
```http
POST /change-number
Body: { filename, espece, type, currentNumber, newNumber }
```

#### Renommer/déplacer
```http
POST /rename-image
Body: { oldFilename, oldEspece, newEspece, newType }
```

#### Supprimer
```http
POST /delete-image
Body: { espece, filename }
```

### Modèles 3D

#### Lister les modèles
```http
GET /api/models
```

#### Upload modèle
```http
POST /api/upload-model
Content-Type: multipart/form-data
```

---

## 🔒 SÉCURITÉ

### ⚠️ IMPORTANT
L'interface admin est **sans authentification** !

**Recommandations** :
- Utiliser uniquement en local (localhost)
- NE PAS exposer sur internet
- Limiter l'accès au réseau local

### Pour sécuriser (production) :
```javascript
// Ajouter dans server.js
const basicAuth = require('basic-auth');

app.use((req, res, next) => {
  const user = basicAuth(req);
  if (!user || user.name !== 'admin' || user.pass !== 'motdepasse') {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.status(401).send();
  }
  next();
});
```

---

## 🐛 DÉPANNAGE

### Erreur : "Cannot find module 'express'"
```bash
# Solution : Installer les dépendances
npm install
```

### Erreur : "Port 3001 already in use"
```bash
# Solution 1 : Tuer le processus
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill

# Solution 2 : Changer le port
# Éditer admin/server.js ligne 10
const PORT = 3002; // Nouveau port
```

### Les images ne s'uploadent pas
```bash
# Vérifier les permissions
chmod -R 755 client/public/images

# Vérifier l'espace disque
df -h
```

### Git push échoue
```bash
# Configurer Git (si première fois)
git config --global user.name "Votre Nom"
git config --global user.email "email@example.com"

# Vérifier le remote
git remote -v
```

---

## 📊 STATISTIQUES

### Utilisation actuelle
- **60 images** JPG (14.8 MB)
- **3 modèles** GLB cerisier
- **10 espèces** botaniques

### Limites
- **Taille max image** : 5 MB
- **Taille max modèle** : 10 MB (recommandé)
- **Formats acceptés** : JPG, PNG, WebP, GLB, OBJ

---

## 🎯 WORKFLOW TYPIQUE

### 1. Ajouter des images
```bash
# Lancer l'admin
npm run admin

# Ouvrir http://localhost:3001
# Glisser-déposer les images
# → Upload automatique + commit Git
```

### 2. Organiser les images
```bash
# Interface : http://localhost:3001
# Filtrer par espèce/type
# Permuter, renommer, supprimer
# → Commit Git automatique
```

### 3. Ajouter modèles 3D
```bash
# Ouvrir http://localhost:3001/upload-model.html
# Upload OBJ + MTL
# → Conversion GLB automatique
```

---

## 🔗 INTÉGRATION AVEC LE CLIENT

### L'admin modifie :
```
client/public/images/          ← Images uploadées ici
client/public/images.json      ← Inventaire généré automatiquement
client/public/models/          ← Modèles 3D
```

### Le client utilise :
```javascript
// client/src/data/arbustesData.js
// Référence les images par nom

// client/src/config/modeles3D.js
// Référence les modèles 3D
```

---

## ✅ CHECKLIST AVANT COMMIT

Avant de commiter manuellement :

- [ ] Tester l'upload d'image
- [ ] Vérifier que images.json est à jour
- [ ] Tester la permutation d'images
- [ ] Vérifier le rendu dans le client
- [ ] Tester le git push automatique

---

## 📚 RESSOURCES

### Documentation liée
- `docs/ARCHITECTURE_DEPENDANCES.md` - Architecture packages
- `OPTIMISATIONS_COMPLETEES.md` - Optimisations appliquées
- `client/scripts/README_WEBP.md` - Conversion WebP

### Support
- Issues GitHub : https://github.com/...
- Contact : [[memory:9963067]]

---

*Documentation mise à jour le 21 octobre 2025*

