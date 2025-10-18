# 🏗️ ARCHITECTURE DU CODE - PLANIFICATEUR

Date : 18 octobre 2025  
Version : 2.0 MODULAIRE

---

## 📂 STRUCTURE DES FICHIERS

```
client/src/
├── config/
│   └── planificateurConfig.js       ⭐ CONFIGURATION CENTRALISÉE
│
├── utils/
│   ├── geometrie.js                 ⭐ CALCULS GÉOMÉTRIQUES
│   ├── validation.js                ⭐ LOGIQUE DE VALIDATION
│   └── placementAlgorithm.js        (existant)
│
├── components/
│   ├── CanvasTerrain.jsx            🎨 CANVAS PRINCIPAL
│   ├── CanvasTerrain.css
│   ├── DashboardTerrain.jsx         📊 STATISTIQUES
│   ├── DashboardTerrain.css
│   ├── PlanificateurTerrain.jsx     🏗️ MODAL CONTENEUR
│   ├── PlanificateurTerrain.css
│   ├── Comparateur.jsx              ⚖️ COMPARAISON PLANTES
│   └── ...
│
├── data/
│   ├── arbustesData.js              🌳 DONNÉES BOTANIQUES
│   ├── reglementationData.js        (obsolète - migré)
│   └── informationsComplementaires.js (obsolète - migré)
│
└── App.jsx                          🚪 POINT D'ENTRÉE
```

---

## ⭐ FICHIERS CLÉS (À MODIFIER EN PRIORITÉ)

### **1. `config/planificateurConfig.js`**
**Rôle :** Configuration centralisée de TOUS les paramètres

**Contenu :**
- ✅ Échelles et mesures (30px = 1m)
- ✅ Angles solaires par saison
- ✅ Valeurs par défaut des objets (maison, canalisation, etc.)
- ✅ Composition du sol
- ✅ Zones de contraintes (couleurs, offsets)
- ✅ Ombre portée (opacité, style)
- ✅ Dashboard (intervalles, scores)
- ✅ Validation (couleurs, messages)
- ✅ Raccourcis clavier
- ✅ Sauvegarde localStorage

**Pourquoi c'est important :**
- ✅ 1 SEUL fichier pour ajuster tous les paramètres
- ✅ Pas besoin de chercher dans 10 fichiers
- ✅ Cohérence garantie
- ✅ Facilite tests et évolutions

**Exemple de modification :**
```javascript
// Changer l'échelle du planificateur
export const ECHELLE = 40; // 40px = 1m (au lieu de 30)

// Ajuster l'angle solaire été
export const ANGLES_SOLAIRES = {
  ete: 70 // au lieu de 65
};
```

---

### **2. `utils/geometrie.js`**
**Rôle :** Tous les calculs géométriques purs

**Contenu :**
- ✅ `calculerDistance(x1, y1, x2, y2)`
- ✅ `calculerDistanceRectangle(px, py, rect)`
- ✅ `calculerDistanceLigne(px, py, ligne)`
- ✅ `distancePointSegment(...)`
- ✅ `trouverPointPlusProcheRectangle(...)`
- ✅ `trouverPointPlusProcheLigne(...)`
- ✅ `calculerAngle(...)`
- ✅ `pointDansRectangle(...)`
- ✅ `calculerAireEllipse(...)`
- ✅ `rectanglesChevauchent(...)`
- ✅ `creerZoneTamponLigne(...)`
- ✅ `projetterRectangle(...)` (pour ombre)

**Pourquoi c'est important :**
- ✅ Fonctions **pures** (testables)
- ✅ Réutilisables partout
- ✅ Pas de dépendances externes
- ✅ Faciles à debugger

**Exemple d'utilisation :**
```javascript
import { calculerDistance, calculerDistanceRectangle } from '../utils/geometrie';

const dist = calculerDistance(x1, y1, x2, y2);
const distMaison = calculerDistanceRectangle(arbre.x, arbre.y, maison);
```

---

### **3. `utils/validation.js`**
**Rôle :** Logique de validation centralisée

**Contenu :**
- ✅ `extraireDistances(arbre)` : distances légales
- ✅ `extraireProfondeurs(arbre)` : racines
- ✅ `validerFondations(...)` : validation 3D maison
- ✅ `validerCanalisations(...)` : validation 3D canalisations
- ✅ `validerVoisinage(...)` : distance légale Code Civil
- ✅ `validerCiterne(...)` : validation 3D fosse
- ✅ `validerSol(...)` : compatibilité sol/arbre
- ✅ `determinerStatut(...)` : ok/warning/error
- ✅ `genererResume(...)` : message final

**Pourquoi c'est important :**
- ✅ **Séparation des règles métier**
- ✅ Modification simple des critères
- ✅ Testable unitairement
- ✅ Messages cohérents

**Exemple de modification :**
```javascript
// Ajuster la tolérance
export const validerFondations = (...) => {
  if (distanceMetres < distances.fondations - 0.5) { // au lieu de < direct
    problemes.push(...);
  }
};
```

---

## 🎨 COMPOSANTS REACT

### **`CanvasTerrain.jsx`** (3000+ lignes)
**Rôle :** Cœur du planificateur interactif

**Sections :**
1. **États React** (lignes 1-30)
2. **Configuration** → **MIGRER VERS `config/`**
3. **Fonctions utilitaires géométriques** → **MIGRER VERS `utils/geometrie.js`**
4. **Fonctions de validation** → **MIGRER VERS `utils/validation.js`**
5. **Gestion canvas Fabric.js**
6. **Ajout d'objets** (maison, canalisation, etc.)
7. **Zones de contraintes**
8. **Ombre portée**
9. **Rendu JSX**

**À faire (refactoring) :**
```javascript
// AVANT (dans CanvasTerrain.jsx)
const echelle = 30;
const calculerDistance = (x1, y1, x2, y2) => { ... };

// APRÈS
import { ECHELLE } from '../config/planificateurConfig';
import { calculerDistance } from '../utils/geometrie';
```

---

### **`DashboardTerrain.jsx`** (200 lignes)
**Rôle :** Statistiques en temps réel

**Logique :**
- Scan du canvas toutes les 2 secondes
- Calculs : surfaces, biodiversité, arrosage, entretien
- Affichage scores avec barres graphiques

**Configuration :** → `DASHBOARD` dans `config/planificateurConfig.js`

---

### **`PlanificateurTerrain.jsx`** (50 lignes)
**Rôle :** Modal conteneur simplifié

**Responsabilités :**
- Gère `arbresPreselectionnes`
- Passe props à `CanvasTerrain`
- Bouton fermeture

---

## 📊 DONNÉES

### **`data/arbustesData.js`**
**Rôle :** Base de données botaniques complète

**Structure (par arbre) :**
```javascript
{
  id: 'prunus-kanzan',
  name: 'Cerisier du Japon Kanzan',
  type: 'arbre',
  tailleMaturite: '6-10 m',
  envergure: '4-8 m',
  croissance: 'Moyenne (30-40 cm/an)',
  
  // RÉGLEMENTATION (détaillée)
  reglementation: {
    systemeRacinaire: {
      type: 'Traçant et pivotant mixte',
      profondeur: '1-1.5 m',
      etalement: '8-12 m'
    },
    distancesLegales: {
      voisinage: {
        regle: 'Code Civil Article 671',
        distance: '2 m',
        sanction: 'Voisin peut exiger arrachage'
      },
      infrastructures: {
        fondations: '5-6 m',
        canalisations: '4-5 m',
        fossesSeptiques: '6 m'
      }
    },
    risques: [...]
  },
  
  // INFOS COMPLÉMENTAIRES (détaillées)
  informationsComplementaires: {
    pollinisation: {...},
    dangersEtPrecautions: {...},
    allergies: {...},
    animauxDomestiques: {...},
    fertilisation: {...}
  }
}
```

**Pour ajouter un arbre :**
1. Dupliquer un arbre existant
2. Modifier tous les champs
3. Vérifier réglementation complète
4. Tester dans comparateur + planificateur

---

## 🔄 FLUX DE DONNÉES

```
1. App.jsx
   ↓ (arbresData)
2. Comparateur.jsx
   ↓ (arbresSelectionnes)
3. PlanificateurTerrain.jsx
   ↓ (arbresPreselectionnes)
4. CanvasTerrain.jsx
   ↓ (ajouterArbres)
   ↓ (validerPosition)
5. utils/validation.js
   ↓ (extraireDistances, valider...)
6. config/planificateurConfig.js
   (lecture des constantes)
```

---

## 🧪 TESTABILITÉ

### **Fonctions pures (faciles à tester) :**
```javascript
// geometrie.js
test('calculerDistance', () => {
  expect(calculerDistance(0, 0, 3, 4)).toBe(5);
});

// validation.js
test('extraireDistances', () => {
  const arbre = { reglementation: { ... } };
  const distances = extraireDistances(arbre);
  expect(distances.fondations).toBe(5);
});
```

### **Composants React (snapshots) :**
```javascript
test('DashboardTerrain renders', () => {
  const { container } = render(<DashboardTerrain canvas={mockCanvas} />);
  expect(container).toMatchSnapshot();
});
```

---

## 🚀 ÉVOLUTIONS FUTURES

### **1. Ajouter une nouvelle validation**
**Fichier :** `utils/validation.js`

```javascript
export const validerNouvellRegle = (arbre, ...) => {
  const problemes = [];
  const avertissements = [];
  
  // Logique...
  
  return { problemes, avertissements };
};
```

Puis appeler dans `CanvasTerrain.jsx` :
```javascript
const resultNouveau = validerNouvellRegle(arbre, ...);
problemes.push(...resultNouveau.problemes);
```

---

### **2. Ajouter un nouveau type d'objet**
**Fichiers à modifier :**
1. `config/planificateurConfig.js` → `DEFAULTS.nouveauObjet`
2. `CanvasTerrain.jsx` → fonction `ajouterNouveauObjet()`
3. `CanvasTerrain.css` → styles si nécessaire
4. Palette → bouton `onClick={ajouterNouveauObjet}`

---

### **3. Modifier une couleur/taille**
**Fichier unique :** `config/planificateurConfig.js`

```javascript
export const ZONES_CONTRAINTES = {
  maison: {
    interdite: {
      fill: 'rgba(255, 0, 0, 0.15)', // Plus visible !
      stroke: '#ff0000'
    }
  }
};
```

---

### **4. Changer l'intervalle du dashboard**
**Fichier :** `config/planificateurConfig.js`

```javascript
export const DASHBOARD = {
  refreshInterval: 1000, // 1 sec au lieu de 2
  ...
};
```

Puis dans `DashboardTerrain.jsx` :
```javascript
import { DASHBOARD } from '../config/planificateurConfig';

const interval = setInterval(calculer, DASHBOARD.refreshInterval);
```

---

## 📝 CONVENTIONS DE CODE

### **Nommage :**
- `CONSTANTES_MAJUSCULES` : configuration
- `fonctionsCamelCase` : fonctions
- `ComposantsReact` : PascalCase
- `fichiers-kebab-case.js` : fichiers utils

### **Commentaires :**
```javascript
/**
 * Description de la fonction
 * @param {number} x - Coordonnée X
 * @returns {number} Distance calculée
 */
export const maFonction = (x) => { ... };
```

### **Imports :**
```javascript
// 1. React
import { useState, useEffect } from 'react';

// 2. Librairies externes
import * as fabric from 'fabric';

// 3. Config
import { ECHELLE, DEFAULTS } from '../config/planificateurConfig';

// 4. Utils
import { calculerDistance } from '../utils/geometrie';
import { validerFondations } from '../utils/validation';

// 5. Composants
import DashboardTerrain from './DashboardTerrain';

// 6. Styles
import './CanvasTerrain.css';
```

---

## 🎯 RÉSUMÉ : QUE MODIFIER ?

| Besoin | Fichier |
|--------|---------|
| Changer échelle, couleurs, tailles | `config/planificateurConfig.js` |
| Ajouter calcul géométrique | `utils/geometrie.js` |
| Modifier règle de validation | `utils/validation.js` |
| Ajouter un arbre | `data/arbustesData.js` |
| Modifier interface (UI) | `CanvasTerrain.jsx` + `.css` |
| Ajuster dashboard | `DashboardTerrain.jsx` + `config/` |

---

## ✅ AVANTAGES DE CETTE ARCHITECTURE

1. **Maintenabilité** : 1 fichier config pour tout
2. **Testabilité** : Fonctions pures séparées
3. **Évolutivité** : Ajouter features sans casser l'existant
4. **Lisibilité** : Code organisé logiquement
5. **Performance** : Réutilisation des fonctions
6. **Documentation** : Structure claire

---

**Date de dernière mise à jour :** 18 octobre 2025  
**Version :** 2.0 MODULAIRE

