# 💻 Guide de Développement
## Les Haies de l'Écocartier de Bessancourt

**Version :** 2.5.0  
**Date :** 2 novembre 2025  
**Pour développeurs :** Installation, architecture, conventions et contribution

---

## 📋 Table des Matières

1. [Installation](#installation)
2. [Structure du Projet](#structure-du-projet)
3. [Architecture Technique](#architecture-technique)
4. [Conventions de Code](#conventions-de-code)
5. [Développement](#développement)
6. [Tests](#tests)
7. [Déploiement](#déploiement)
8. [Contribution](#contribution)

---

## 🚀 Installation

### Prérequis
- **Node.js** : v18 ou supérieur
- **npm** : v8 ou supérieur
- **Git** : Pour cloner le repository

### Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/YOUR-REPO/haies-bessancourt.git
cd haies-bessancourt

# Installer les dépendances racine
npm install

# Installer les dépendances client
cd client
npm install

# Lancer en développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Installation Interface Admin

```bash
# Depuis la racine du projet
npm run admin
```

L'interface admin sera disponible sur `http://localhost:3001`

---

## 📁 Structure du Projet

```
haies-bessancourt/
├── README.md                    # Guide utilisateur principal
├── ADMIN_README.md              # Guide interface admin
├── render.yaml                  # Configuration Render.com
│
├── admin/                       # Interface admin (upload images)
│   ├── index.html              # Page principale admin
│   ├── server.js               # Serveur Express
│   └── models.html             # Gestion modèles 3D
│
├── client/                      # Application React principale
│   ├── public/                 # Assets statiques
│   │   ├── images/            # Images des espèces
│   │   ├── models/            # Modèles 3D GLB
│   │   └── images.json        # Index des images
│   │
│   ├── src/                    # Code source
│   │   ├── components/        # Composants React
│   │   │   ├── 3d/           # Composants 3D (Three.js)
│   │   │   ├── ArbusteDetail.jsx
│   │   │   ├── CanvasTerrain.jsx  # Canvas 2D
│   │   │   ├── CanvasTerrain3D.jsx # Canvas 3D
│   │   │   ├── Comparateur.jsx
│   │   │   ├── PanneauLateral.jsx
│   │   │   └── ...
│   │   │
│   │   ├── hooks/             # Hooks personnalisés
│   │   │   ├── useCanvasInit.js
│   │   │   ├── useCanvasEvents.js
│   │   │   ├── useTimelineSync.js
│   │   │   └── ...
│   │   │
│   │   ├── utils/             # Fonctions utilitaires
│   │   │   ├── canvas/       # Utilitaires Fabric.js
│   │   │   ├── validation/   # Validation distances
│   │   │   ├── logger.js
│   │   │   └── notifications.js
│   │   │
│   │   ├── config/            # Configuration
│   │   │   ├── constants.js  # Constantes globales
│   │   │   ├── colors.js
│   │   │   └── icons.js
│   │   │
│   │   ├── data/              # Données
│   │   │   └── arbustesData.js  # 12 espèces
│   │   │
│   │   ├── styles/            # Styles CSS
│   │   │   └── theme-unified.css
│   │   │
│   │   ├── App.jsx            # Composant racine
│   │   └── main.jsx           # Point d'entrée
│   │
│   ├── vite.config.js         # Configuration Vite
│   └── package.json
│
└── docs/                       # Documentation
    ├── ARCHITECTURE.md        # Architecture détaillée
    ├── CHANGELOG.md           # Historique versions
    └── GUIDE_DEVELOPPEMENT.md # Ce fichier
```

---

## 🏗️ Architecture Technique

### Stack Technologique

#### Frontend
- **React 18** : Framework UI
- **Vite 6** : Build tool ultra-rapide
- **Fabric.js v6** : Canvas 2D interactif
- **Three.js** : Rendu 3D
- **React Three Fiber** : Wrapper React pour Three.js

#### Styling
- **CSS Variables** : Thème unifié
- **CSS Modules** : Styles scopés

#### Build & Optimisations
- **Code Splitting** : Three.js chargé en lazy
- **Bundle Compression** : Brotli
- **Tree Shaking** : Imports optimisés

### Composants Principaux

#### 1. CanvasTerrain.jsx (1104 lignes)
**Responsabilité** : Canvas 2D interactif avec Fabric.js

**Hooks utilisés :**
- `useCanvasInit` : Initialisation canvas
- `useCanvasEvents` : Gestion événements
- `useTimelineSync` : Synchronisation timeline

**Actions principales :**
- Création objets (maison, citerne, clôture, arbres)
- Validation distances temps réel
- Export/Import JSON
- Synchronisation avec 3D

#### 2. CanvasTerrain3D.jsx
**Responsabilité** : Rendu 3D avec Three.js

**Fonctionnalités :**
- Conversion données 2D → 3D
- Drag & drop objets en 3D
- 4 modes de vue
- Validation profondeurs
- Synchronisation bidirectionnelle

#### 3. PanneauLateral.jsx (2247 lignes)
**Responsabilité** : Interface de contrôle

**Sections :**
- ⚙️ Config (dimensions, orientation, sol)
- 🛠️ Outils (ajout objets)
- 📊 Stats (statistiques terrain)

**⚠️ Note :** Ce composant sera bientôt refactorisé en sous-composants

### Système de Synchronisation 2D↔3D

**Échelle Unifiée :** 30 pixels = 1 mètre

**2D → 3D :**
```javascript
syncCanvasTo3D() {
  const data = canvas.getObjects().filter(...);
  const data3D = convertir2DTo3D(data);
  setPlanDataSync(data3D);
}
```

**3D → 2D :**
```javascript
handleObjetPositionChange3D(dragData) {
  const objet = canvas.find(o => o.left ≈ dragData.oldPosition);
  objet.set({ left: dragData.newPosition.x * 30 });
  canvas.requestRenderAll();
}
```

---

## 📐 Conventions de Code

### Structure Fichiers

#### Composants React
```javascript
// Imports
import { useState, useEffect } from 'react';
import './MonComposant.css';

// Composant
function MonComposant({ prop1, prop2 }) {
  // États
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div className="mon-composant">
      {/* JSX */}
    </div>
  );
}

export default MonComposant;
```

#### Utilitaires
```javascript
/**
 * Description de la fonction
 * @param {type} param - Description
 * @returns {type} Description
 */
export function maFonction(param) {
  // Implementation
}
```

### Nommage

#### Fichiers
- **Composants** : PascalCase (ex: `ArbusteDetail.jsx`)
- **Hooks** : camelCase avec prefix use (ex: `useCanvasInit.js`)
- **Utilitaires** : camelCase (ex: `canvasHelpers.js`)
- **Constantes** : camelCase (ex: `constants.js`)

#### Variables
- **Composants** : PascalCase (ex: `MyComponent`)
- **Fonctions** : camelCase (ex: `handleClick`)
- **Constantes** : SCREAMING_SNAKE_CASE (ex: `ECHELLE_PIXELS_PAR_METRE`)
- **État** : camelCase (ex: `isOpen`, `selectedId`)

### Commentaires

```javascript
// ========== SECTION PRINCIPALE ==========

// Description courte d'une action
const result = doSomething();

/**
 * Description détaillée fonction complexe
 * @param {Canvas} canvas - Canvas Fabric.js
 * @param {number} echelle - Échelle pixels/mètre
 * @returns {Object} Données extraites
 */
export function complexFunction(canvas, echelle) {
  // ...
}
```

### CSS

```css
/* Variables globales */
:root {
  --primary: #1976d2;
  --spacing-md: 1rem;
}

/* Classe composant */
.mon-composant {
  padding: var(--spacing-md);
  color: var(--primary);
}

/* Modificateurs */
.mon-composant--active {
  /* ... */
}

/* Éléments */
.mon-composant__title {
  /* ... */
}
```

---

## 🛠️ Développement

### Scripts Disponibles

```bash
# Client (React)
cd client
npm run dev          # Développement (port 5173)
npm run build        # Production
npm run preview      # Aperçu build
npm run lint         # Linter ESLint
npm run check-images # Vérifier images

# Admin (Express)
npm run admin        # Interface admin (port 3001)

# Installation complète
npm run install-all  # Installe client + admin
```

### Variables d'Environnement

Créer `.env` dans `client/` :
```bash
VITE_APP_TITLE="Les Haies de l'Écocartier de Bessancourt"
VITE_APP_VERSION="2.5.0"
VITE_DEBUG_MODE=false
```

### Ajouter une Espèce

1. **Ajouter les images** via interface admin (http://localhost:3001)
2. **Ajouter les données** dans `client/src/data/arbustesData.js` :

```javascript
{
  id: 'mon-arbre',
  nom: 'Mon Arbre',
  type: 'arbre',
  hauteurMature: 8,
  envergu reMature: 6,
  vitesseCroissance: 'moyenne',
  systemeRacinaire: 'Modérée',
  // ... autres propriétés
}
```

3. **Ajouter les entrées** dans `public/images.json` :
```json
{
  "mon-arbre": {
    "habitat": ["mon-arbre-habitat-1.jpg"],
    "feuillage": ["mon-arbre-feuillage-1.jpg"],
    // ...
  }
}
```

### Ajouter un Modèle 3D

1. **Format** : GLB (optimisé Three.js)
2. **Placer** dans `client/public/models/mon-arbre/`
3. **Référencer** dans `client/src/config/modeles3D.js` :

```javascript
export const MODELES_3D = {
  'mon-arbre': {
    printemps: '/models/mon-arbre/printemps.glb',
    ete: '/models/mon-arbre/ete.glb',
    // ...
  }
};
```

### Debug

#### Activer les logs
Dans `client/src/config/debug.js` :
```javascript
export const DEBUG = true; // false en production
```

#### Logger personnalisé
```javascript
import logger from './utils/logger';

logger.info('Canvas', 'Objet ajouté', objet);
logger.warn('Validation', 'Distance insuffisante', distance);
logger.error('Canvas', 'Erreur création objet', error);
```

---

## 🧪 Tests

### Tests Manuels

**Checklist avant commit :**
- [ ] Mode 2D fonctionne
- [ ] Mode 3D fonctionne
- [ ] Basculement 2D↔3D fluide
- [ ] Validation distances correcte
- [ ] Export/Import JSON ok
- [ ] Aucune erreur console
- [ ] Build production réussit

### Tests Utilisateur

1. **Créer un plan** :
   - Ajouter maison
   - Ajouter clôtures
   - Placer arbres
   - Vérifier validation

2. **Timeline** :
   - Tester 0-20 ans
   - Vérifier croissance
   - Tester saisons

3. **3D** :
   - Passer en 3D
   - Déplacer objets
   - Vérifier sync 2D

### Performance

```bash
# Analyser bundle
cd client
npm run build
npx vite-bundle-visualizer
```

**Métriques cibles :**
- Bundle 2D : < 600 KB (gzip)
- Bundle 3D : < 900 KB (gzip, lazy)
- FPS 3D : 60fps stable
- Temps chargement : < 2s

---

## 🚀 Déploiement

### Render.com (Recommandé)

1. **Créer compte** sur [render.com](https://render.com)
2. **New + → Static Site**
3. **Connecter repository GitHub**
4. **Configuration** :
   ```yaml
   Build Command: cd client && npm install && npm run build
   Publish Directory: client/dist
   ```
5. **Déployer** : Deploy

### Build Local

```bash
cd client
npm run build
```

Fichiers dans `client/dist/` :
- `index.html`
- `assets/` (JS, CSS, images)
- Prêt pour hébergement statique

### Variables Production

Dans `render.yaml` :
```yaml
services:
  - type: web
    name: haies-bessancourt
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
    headers:
      - path: /*
        name: Cache-Control
        value: public, max-age=31536000
```

---

## 🤝 Contribution

### Workflow Git

1. **Créer branche** :
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

2. **Développer et tester**

3. **Commit** :
   ```bash
   git add .
   git commit -m "feat: ajout de ma fonctionnalité"
   ```

4. **Push** :
   ```bash
   git push origin feature/ma-fonctionnalite
   ```

5. **Pull Request** sur GitHub

### Conventions Commits

Format : `type: description`

**Types :**
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction bug
- `refactor:` Refactorisation
- `docs:` Documentation
- `style:` Style/formatage
- `perf:` Performance
- `test:` Tests

**Exemples :**
```bash
git commit -m "feat: ajout mode 3D"
git commit -m "fix: correction validation distances"
git commit -m "refactor: découpage PanneauLateral"
git commit -m "docs: mise à jour ARCHITECTURE.md"
```

### Code Review

**Critères :**
- ✅ Code fonctionne
- ✅ Aucune régression
- ✅ Conventions respectées
- ✅ Pas de console.log debug
- ✅ Documentation à jour

---

## 📚 Ressources

### Documentation
- [React 18](https://react.dev/)
- [Vite 6](https://vite.dev/)
- [Fabric.js](http://fabricjs.com/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)

### Projet
- **Repository** : [GitHub](https://github.com/YOUR-REPO)
- **Issues** : [GitHub Issues](https://github.com/YOUR-REPO/issues)
- **Démo** : [haies-bessancourt.onrender.com](https://haies-bessancourt.onrender.com)

---

## ❓ FAQ Développeurs

### Comment ajouter un nouveau type d'objet 2D ?

1. Créer fonction dans `utils/canvas/creerObjets.js`
2. Ajouter constantes dans `config/constants.js`
3. Ajouter bouton dans `PanneauLateral.jsx`
4. Ajouter gestion dans `CanvasTerrain.jsx`

### Comment optimiser les performances ?

- Utiliser `useMemo` pour calculs coûteux
- Utiliser `useCallback` pour fonctions
- Lazy load composants lourds
- Limiter re-renders avec `memo()`

### Comment débugger canvas 2D ?

```javascript
// Voir tous les objets
console.log(canvas.getObjects());

// Logger objet
import { logAllCanvasObjects } from './utils/canvas/completeObjectLogger';
logAllCanvasObjects(canvas, 30);

// Exporter pour debug
import { exportCompleteData } from './utils/canvas/completeObjectLogger';
exportCompleteData(canvas, 30);
```

### Comment vérifier la synchronisation 2D/3D ?

1. Placer objet en 2D à position connue (ex: 15m, 15m)
2. Basculer en 3D
3. Vérifier position 3D : doit être (15, 0, 15)
4. Déplacer en 3D
5. Basculer en 2D : doit être synchronisé

---

**Version :** 2.5.0  
**Dernière mise à jour :** 2 novembre 2025  
**Maintenu par :** Équipe Écoquartier Bessancourt

