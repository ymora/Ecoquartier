# 🏗️ ARCHITECTURE TECHNIQUE

Documentation de l'architecture du code (Version 2.1.1).

---

## 📁 STRUCTURE

```
client/src/
├── components/ .................. Composants React
│   ├── CanvasTerrain.jsx ........ Canvas 2D (486 lignes)
│   ├── CanvasTerrain3D.jsx ...... Canvas 3D (302 lignes)
│   ├── PanneauLateral.jsx ....... Outils + Stats (167 lignes)
│   ├── DashboardTerrain.jsx ..... Statistiques terrain
│   ├── PlanificateurTerrain.jsx . Modal principal
│   ├── Comparateur.jsx .......... Comparaison arbres
│   ├── ArbusteDetail.jsx ........ Fiche détaillée
│   ├── Navigation.jsx ........... Menu navigation
│   ├── ... ...................... Autres composants UI
│   └── 3d/ ...................... 7 composants 3D
│       ├── Arbre3D.jsx
│       ├── Maison3D.jsx
│       ├── Sol3D.jsx
│       ├── Canalisation3D.jsx
│       ├── Citerne3D.jsx
│       ├── Cloture3D.jsx
│       └── ZonesValidation3D.jsx
│
├── hooks/ ....................... Hooks personnalisés
│   ├── useCanvasInit.js ......... Init canvas (55 lignes)
│   ├── useCanvasEvents.js ....... Event listeners (256 lignes)
│   ├── useTimelineSync.js ....... Timeline (100 lignes)
│   └── useArbresPlacement.js .... Placement arbres (130 lignes)
│
├── utils/ ....................... Utilitaires
│   ├── logger.js ................ Système logs
│   └── canvas/ .................. Utils canvas (9 fichiers)
│       ├── affichage.js ......... Zones, ombres, guides (254L)
│       ├── canvasValidation.js .. Validation positions (306L)
│       ├── creerObjets.js ....... Création objets (420L)
│       ├── croissance.js ........ Calculs croissance (104L)
│       ├── canvasHelpers.js ..... Helpers math (140L)
│       ├── menuContextuel.js .... Menu contextuel (150L)
│       ├── tooltipValidation.js . Tooltips (140L)
│       ├── exportImport.js ...... Export/Import (280L)
│       └── actionsCanvas.js ..... Actions globales (280L)
│
└── data/
    └── arbustesData.js .......... 64 arbustes (2100 lignes)
```

---

## 🧩 CANVASTERRAIN.JSX (486 lignes)

**Responsabilités** :
- ✅ Coordonner les hooks
- ✅ Gérer les états (zoom, ombre, validation, etc.)
- ✅ Adapter les signatures des utils
- ✅ Afficher le JSX

**Structure** :
```javascript
import hooks + utils + components

function CanvasTerrain({ props }) {
  // Refs (7)
  // States (7)
  // Wrappers pour utils (40 fonctions)
  // Hooks personnalisés (4)
  // Effects simples (3)
  // JSX (panneau + canvas + timeline)
}
```

---

## 🪝 HOOKS PERSONNALISÉS

| Hook | Responsabilité |
|------|----------------|
| **useCanvasInit** | Init canvas + zoom/pan |
| **useCanvasEvents** | Event listeners complets |
| **useTimelineSync** | Redimensionnement arbres |
| **useArbresPlacement** | Placement intelligent |

---

## 🛠️ UTILS CANVAS

| Fichier | Responsabilité |
|---------|----------------|
| **affichage.js** | Zones, ombres, guides |
| **canvasValidation.js** | Validation distances |
| **creerObjets.js** | Création objets Fabric.js |
| **croissance.js** | Calculs croissance |
| **canvasHelpers.js** | Helpers mathématiques |
| **menuContextuel.js** | Menu contextuel |
| **tooltipValidation.js** | Tooltips validation |
| **exportImport.js** | Sauvegarde/chargement |
| **actionsCanvas.js** | Actions globales |

---

## 🎯 PRINCIPES

✅ **Single Responsibility** : 1 fichier = 1 rôle  
✅ **DRY** : Pas de duplication  
✅ **Modularité** : Fonctions réutilisables  
✅ **Clean Code** : Lisible et maintenable  

---

## 📊 MÉTRIQUES

- **Build** : ~3s
- **Bundle** : 149kB (gzip)
- **Fichiers** : 20 modules
- **Erreurs** : 0
- **Qualité** : ⭐⭐⭐⭐⭐

---

## 🛠️ TECHNOLOGIES

- React 18 + Vite 6
- Fabric.js 6 (Canvas 2D)
- React Three Fiber 8 (Canvas 3D)
- Three.js 0.160

---

**Version** : 2.1.1  
**État** : Production-ready
