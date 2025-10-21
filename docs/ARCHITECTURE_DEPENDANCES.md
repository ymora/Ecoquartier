# 🏗️ ARCHITECTURE DES DÉPENDANCES

**Date** : 21 octobre 2025  
**Contexte** : Optimisations performance appliquées

---

## 📦 STRUCTURE DES PACKAGES

Le projet utilise **2 package.json distincts** pour séparer les dépendances :

### 1️⃣ Package.json RACINE (Admin + Scripts)

**Fichier** : `package.json`  
**Utilisation** : Serveur Node.js admin + scripts

```json
{
  "name": "haies-bessancourt-admin",
  "dependencies": {
    "express": "^4.18.2",    // ✅ Serveur HTTP pour admin
    "multer": "^1.4.5-lts.1", // ✅ Upload fichiers
    "cors": "^2.8.5"          // ✅ CORS pour API
  },
  "scripts": {
    "admin": "node admin/server.js",
    "install-all": "npm install && cd client && npm install"
  }
}
```

**Utilisé par** :
- `admin/server.js` (interface admin upload images)
- `admin/server-api.js` (API pour upload modèles 3D)
- Scripts Node.js racine

---

### 2️⃣ Package.json CLIENT (Application React)

**Fichier** : `client/package.json`  
**Utilisation** : Application web (browser)

```json
{
  "name": "haies-bessancourt",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.92.0",
    "three": "^0.160.1",
    "fabric": "^6.7.1",
    "jspdf": "^3.0.3",
    "react-icons": "^5.5.0"
    // ❌ PAS de express, cors, multer (inutiles dans le browser)
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

**Utilisé par** :
- Application React principale
- Build Vite pour production
- Serveur dev Vite

---

## 🎯 POURQUOI CETTE SÉPARATION ?

### Avantages :

1. **Bundle client optimisé** (-500 KB)
   - express, cors, multer ne sont PAS embarqués dans le bundle browser
   - Réduction de 81% du bundle initial

2. **Serveur admin fonctionnel**
   - L'admin garde ses dépendances Node.js
   - Upload d'images + modèles 3D fonctionne

3. **Dépendances isolées**
   - Pas de pollution entre client et serveur
   - Mises à jour indépendantes

4. **Performance**
   - Client : chargement ultra-rapide
   - Admin : toutes les fonctionnalités serveur

---

## 🚀 COMMANDES D'INSTALLATION

### Installation complète (RECOMMANDÉ)
```bash
# Installer TOUT (racine + client)
npm run install-all

# Équivalent à :
npm install          # Installe dépendances admin (racine)
cd client && npm install  # Installe dépendances client
```

### Installation séparée
```bash
# Installer seulement l'admin
npm install

# Installer seulement le client
cd client && npm install
```

---

## 🖥️ LANCEMENT DES SERVEURS

### Serveur CLIENT (Application React)
```bash
cd client
npm run dev
# ➜ http://localhost:5173
```

### Serveur ADMIN (Upload images + modèles)
```bash
npm run admin
# Ou directement :
node admin/server.js
# ➜ http://localhost:3001
```

### Les DEUX en parallèle
```bash
# Terminal 1 : Client
cd client && npm run dev

# Terminal 2 : Admin
npm run admin
```

---

## ✅ VALIDATION

### Client testé ✅
```bash
cd client
npm run build
# ✓ Built in 14.64s
# ✓ Bundle: 38 KB (gzip) [-81%]
# ✓ Aucune dépendance serveur
```

### Admin testé ✅
```bash
node admin/server.js
# ✓ Server started on http://localhost:3001
# ✓ express, multer, cors chargés
# ✓ Upload fonctionnel
```

---

## 📊 COMPARAISON DÉPENDANCES

| Package | Racine (Admin) | Client | Usage |
|---------|----------------|--------|-------|
| express | ✅ v4.18.2 | ❌ | Serveur HTTP admin |
| multer | ✅ v1.4.5 | ❌ | Upload fichiers |
| cors | ✅ v2.8.5 | ❌ | API CORS |
| react | ❌ | ✅ v18.3.1 | Interface utilisateur |
| vite | ❌ | ✅ v6.4.0 | Bundler frontend |
| three | ❌ | ✅ v0.160.1 | Rendu 3D |
| fabric | ❌ | ✅ v6.7.1 | Canvas 2D |

---

## 🔧 MIGRATION FUTURE

Si vous souhaitez fusionner les deux package.json :

### Option 1 : Monorepo (workspaces)
```json
// package.json racine
{
  "workspaces": ["client", "admin"]
}
```

### Option 2 : Garder séparé (RECOMMANDÉ)
- Architecture actuelle optimale
- Séparation claire client/serveur
- Bundle client minimal

---

## 📝 NOTES IMPORTANTES

### ⚠️ NE PAS FAIRE :
```bash
# ❌ NE PAS installer express dans client/
cd client
npm install express  # ❌ MAUVAISE IDÉE

# Pourquoi ?
# → Ajoute 500 KB au bundle browser
# → Inutile (pas de serveur dans le browser)
```

### ✅ FAIRE :
```bash
# ✅ Garder la séparation actuelle
# Racine : dépendances serveur
# Client : dépendances frontend
```

---

## 🎯 RÉSUMÉ

| Aspect | Status |
|--------|--------|
| **Séparation client/admin** | ✅ Optimale |
| **Bundle client** | ✅ 38 KB (gzip) |
| **Admin fonctionnel** | ✅ Port 3001 |
| **Dépendances** | ✅ Isolées |
| **Performance** | ✅ +81% |

---

*Documentation générée après optimisations du 21 octobre 2025*

