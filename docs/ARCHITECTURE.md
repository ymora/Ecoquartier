# 🏗️ Architecture de l'Application - Les Haies de Bessancourt

## Vue d'ensemble

Application web de planification paysagère pour l'écoquartier de Bessancourt, développée avec React 18, Vite 6, Fabric.js (2D) et Three.js (3D).

## 🎯 Fonctionnalités Principales

### ✅ Fonctionnalités Implémentées
- **12 espèces documentées** (6 arbres + 6 arbustes)
- **Fiches détaillées** avec 7 onglets complets
- **Mode comparaison** avec 20 critères
- **Planificateur 2D** avec validation temps réel
- **Vue 3D** immersive avec ombres et saisons
- **Simulation croissance** (0-20 ans)
- **Validation réglementaire** (Code Civil Art. 671)
- **Synchronisation 2D↔3D** bidirectionnelle
- **Drag & Drop 3D** pour déplacer les objets
- **Types de toits** pour les maisons (plan, monopente, deux-pentes)
- **Composition du sol** interactive avec 3 couches
- **Export/Import JSON** pour sauvegarder les plans

## 🏗️ Architecture Technique

### Stack Technologique
- **Frontend** : React 18 + Vite 6
- **2D Canvas** : Fabric.js v6
- **3D Rendering** : Three.js + React Three Fiber
- **Styling** : CSS Modules + Inline Styles
- **Build** : Vite avec optimisations avancées

### Structure du Projet (État Actuel)
```
client/src/
├── components/          # Composants React
│   ├── 3d/             # Composants 3D (14 fichiers)
│   │   ├── Arbre3D.jsx
│   │   ├── Maison3D.jsx
│   │   ├── Citerne3D.jsx
│   │   └── ...
│   ├── ArbusteDetail.jsx        # Fiche détaillée espèce
│   ├── CanvasTerrain.jsx        # Canvas 2D (1104 lignes)
│   ├── CanvasTerrain3D.jsx      # Canvas 3D
│   ├── Comparateur.jsx          # Mode comparaison
│   ├── PanneauLateral.jsx       # Panneau contrôles (2247 lignes)
│   └── ...
├── hooks/              # Hooks personnalisés (5 fichiers)
│   ├── useCanvasInit.js         # Init canvas Fabric.js
│   ├── useCanvasEvents.js       # Gestion événements
│   ├── useTimelineSync.js       # Sync timeline
│   ├── useLODSystem.js          # Level of detail 3D
│   └── useObjectProperties.js   # Props objets
├── utils/              # Utilitaires
│   ├── canvas/         # 23 fichiers Fabric.js
│   │   ├── creerObjets.js       # Création objets 2D
│   │   ├── actionsCanvas.js     # Actions canvas
│   │   ├── canvasValidation.js  # Validation distances
│   │   ├── exportImport.js      # Export/Import JSON
│   │   └── ...
│   ├── validation/     # 3 fichiers validation
│   ├── logger.js
│   └── notifications.js
├── config/             # Configuration (6 fichiers)
│   ├── constants.js             # Constantes globales (UTILISÉ)
│   ├── colors.js
│   ├── icons.js
│   ├── modeles3D.js
│   └── debug.js
├── data/               # Données
│   └── arbustesData.js          # 12 espèces (6 arbres + 6 arbustes)
└── styles/             # Styles CSS (7 fichiers)
    └── theme-unified.css         # Thème principal
```

**Note :** Les composants sont monolithiques et nécessiteraient un refactoring pour améliorer la maintenabilité.

## 🔄 Système de Synchronisation 2D↔3D

### Architecture de Synchronisation
```javascript
// État partagé entre 2D et 3D
const [planDataSync, setPlanDataSync] = useState(null);

// 2D → 3D : Extraction throttled
syncCanvasTo3D() {
  const data = canvas.getObjects().filter(...);
  setPlanDataSync(data);
}

// 3D → 2D : Callback position
handleObjetPositionChange3D(dragData) {
  const objet = canvas.find(o => o.left ≈ dragData.oldPosition);
  objet.set({ left: dragData.newPosition.x * 30 });
  canvas.requestRenderAll();
}
```

### Échelle et Coordonnées
- **Échelle** : 30 pixels = 1 mètre
- **Dimensions** : 30m × 30m par défaut
- **Origine** : Centre pour objets (originX/Y: 'center')

## 🎨 Système de Rendu 3D

### Composants 3D
- **Maison3D** : Rendu des maisons avec types de toits
- **Arbre3D** : Rendu des arbres avec croissance temporelle
- **Citerne3D** : Rendu des citernes enterrées
- **Canalisation3D** : Rendu des canalisations
- **Sol3D** : Rendu des couches de sol
- **ObjetDraggable3D** : Wrapper pour le drag & drop 3D

### Modes de Vue
1. **Perspective** : Vue d'ensemble (20, 15, 20)
2. **Dessus** : Vue de dessus (0, 30, 0)
3. **Côté** : Vue de côté (30, 5, 0)
4. **Coupe** : Vue en coupe (0, 5, 25)

## ✅ Validation et Contraintes

### Distances Vérifiées
- 🏠 **Fondations** : 5m minimum
- 🚰 **Canalisations** : 4m minimum
- ⚖️ **Voisinage** (Code Civil) : 2m minimum
- 💧 **Citernes** : 6m minimum
- 🌳 **Entre arbres** : 5m minimum
- 🟩 **Pavés/Terrasses** : 3-4m minimum (selon racines)

### Paliers de Validation
- 🟢 **Vert (100%)** : Conforme
- 🟡 **Jaune (80-99%)** : Attention
- 🟠 **Orange (50-79%)** : Respect minimum
- 🔴 **Rouge (<50%)** : Non conforme

## 🎮 Interactions Utilisateur

### Navigation 2D
- **Zoom** : Molette (50%-300%)
- **Pan** : Alt+Clic / Clic droit / Clic molette
- **Sélection** : Clic sur objet
- **Rotation** : Poignées de rotation

### Navigation 3D
- **Rotation caméra** : Clic gauche + drag
- **Zoom** : Molette
- **Pan** : Clic droit + drag
- **Mode déplacement** : Toggle pour déplacer objets

### Drag & Drop 3D
- **Activation** : Bouton "Mode déplacement"
- **Déplacement** : Clic + drag sur objet
- **Validation** : Collision maison détectée
- **Synchronisation** : Position mise à jour en 2D

## 📊 Performance et Optimisations

### Optimisations Implémentées
- **Bundle splitting** : Three.js chargé seulement si nécessaire
- **Lazy loading** : Composants 3D chargés à la demande
- **Mémorisation** : `useMemo` pour calculs coûteux
- **Throttling** : Synchronisation 2D→3D limitée à 100ms
- **Cache** : Géométries et matériaux mis en cache

### Métriques de Performance
- **Bundle 2D** : ~535kB (gzip)
- **Bundle 3D** : ~851kB (gzip) - lazy loaded
- **Temps de chargement** : <2s
- **FPS 3D** : 60fps stable

## 🔧 Configuration et Déploiement

### Variables d'Environnement
```bash
VITE_APP_TITLE="Les Haies de l'Écocartier de Bessancourt"
VITE_APP_VERSION="2.19.2"
VITE_DEBUG_MODE=false
```

### Scripts Disponibles
```bash
npm run dev          # Développement
npm run build        # Production
npm run preview      # Aperçu build
npm run admin        # Interface admin
```

### Déploiement Render
1. Connecter le repository GitHub
2. Configurer le build : `npm run build`
3. Déployer automatiquement

## 📚 Documentation Associée

- **README.md** : Guide utilisateur principal
- **ADMIN_README.md** : Guide interface admin
- **docs/ARCHITECTURE.md** : Ce document (architecture technique)
- **docs/CHANGELOG.md** : Historique des versions
- **docs/GUIDE_DEVELOPPEMENT.md** : Guide pour développeurs

## 🎯 Roadmap Future

### Améliorations Prévues
- [ ] **Authentification** : Système de comptes utilisateurs
- [ ] **Collaboration** : Partage de plans en temps réel
- [ ] **Mobile** : Version mobile responsive
- [ ] **API** : Backend pour sauvegarde cloud
- [ ] **Analytics** : Suivi d'utilisation

---

**Version** : 2.5.0  
**Dernière mise à jour** : 2 novembre 2025  
**Statut** : ✅ Production Ready

## 📝 Note Importante

Cette documentation reflète l'état ACTUEL du code en production. Pour le guide de développement complet, voir `GUIDE_DEVELOPPEMENT.md`.

