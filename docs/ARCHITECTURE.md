# 🏗️ ARCHITECTURE DU PROJET

Documentation technique complète de l'architecture du code.

**Dernière mise à jour** : 18 octobre 2025

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
│   ├── placementAlgorithm.js        🎯 AUTO-PLACEMENT
│   ├── logging.js                   📝 SYSTÈME DE LOGS
│   ├── onboarding.js                🎓 TUTORIEL INTERACTIF
│   ├── zonesContraintes.js          🎨 ZONES VISUELLES
│   ├── ombrePortee.js               🌤️ OMBRES SOLAIRES
│   └── diagnosticCanvas.js          🔬 OUTIL DIAGNOSTIC
│
├── components/
│   ├── CanvasTerrain.jsx            🎨 CANVAS PRINCIPAL (3500+ lignes)
│   ├── CanvasTerrain.css
│   ├── DashboardTerrain.jsx         📊 STATISTIQUES
│   ├── DashboardTerrain.css
│   ├── PlanificateurTerrain.jsx     🏗️ MODAL CONTENEUR
│   ├── PlanificateurTerrain.css
│   ├── Comparateur.jsx              ⚖️ COMPARAISON PLANTES
│   ├── ArbusteDetail.jsx            📝 FICHE DÉTAILLÉE
│   └── ...
│
├── data/
│   └── arbustesData.js              🌳 DONNÉES BOTANIQUES CENTRALISÉES (2100+ lignes)
│
└── App.jsx                          🚪 POINT D'ENTRÉE
```

---

## 🌳 ARCHITECTURE DES DONNÉES

### ✅ Centralisation Complète (17 octobre 2025)

**UN SEUL FICHIER** : `arbustesData.js` contient TOUTES les données

**Avant (❌ Problème) :**
- 3 fichiers dispersés : `arbustesData.js`, `reglementationData.js`, `informationsComplementaires.js`
- Risque d'oubli lors de l'ajout d'une espèce → onglets vides

**Après (✅ Solution) :**
- 1 seul fichier avec structure complète et cohérente
- 0 risque d'oubli
- Maintenance simplifiée

### Structure d'une Plante

```javascript
{
  id: 'prunus-kanzan',
  name: 'Cerisier du Japon Kanzan',
  
  // ========== DONNÉES DE BASE ==========
  nomScientifique: 'Prunus serrulata \'Kanzan\'',
  famille: 'Rosaceae',
  type: 'arbre',
  tailleMaturite: '6-10 m',
  envergure: '4-6 m',
  floraison: { periode: '...', couleur: '...', parfum: '...' },
  fructification: { ... },
  feuillage: { ... },
  rameaux: { ... },
  plantation: { ... },
  sol: { ... },
  exposition: '...',
  arrosage: '...',
  rusticite: '...',
  croissance: '...',
  taille: { ... },
  calendrierAnnuel: [ ... ],
  maladies: [ ... ],
  biodiversite: { ... },
  toxicite: { ... },
  utilisations: [ ... ],
  anecdote: '...',
  
  // ========== RÉGLEMENTATION ==========
  reglementation: {
    systemeRacinaire: {
      type: 'pivotant',
      profondeur: '1-1.5 m',
      etalement: '4-6 m',
      agressivite: 'Modérée',
      description: '...'
    },
    risques: ['Fondations si < 5m', 'Canalisations si < 3m'],
    distancesLegales: {
      voisinage: { distance: '2 m', reference: 'Code Civil Art. 671' },
      espacesPublics: { trottoir: '1.5 m', route: '3 m' },
      entreArbres: { distance: '5-6 m' },
      infrastructures: {
        fondations: '5 m',
        canalisations: '3 m',
        piscine: '4 m',
        terrasse: '3 m'
      }
    },
    conseils: '...'
  },
  
  // ========== INFORMATIONS COMPLÉMENTAIRES ==========
  informationsComplementaires: {
    pollinisation: { ... },
    dangersEtPrecautions: {
      taille: { ... },
      reglementationTaille: { ... }
    },
    allergies: { niveau: 'Faible', description: '...' },
    animauxDomestiques: { toxicite: 'Non', précisions: '...' },
    protectionHivernale: { necessaire: false, methode: '...' },
    fertilisation: { besoins: 'Modérés', periode: '...', type: '...' },
    sujetsForums: ['URL1', 'URL2']
  }
}
```

### Checklist pour Ajouter une Espèce

✅ **1 SEUL fichier à modifier** : `client/src/data/arbustesData.js`

1. Copier la structure d'une plante existante
2. Remplir TOUTES les sections (base, réglementation, informations complémentaires)
3. Ajouter les images dans `client/public/images/{id-plante}/`
4. Build & Test → **TERMINÉ !**

**Plus besoin** de modifier 3 fichiers différents ✅

---

## 🎨 CanvasTerrain.jsx - Composant Principal

### Structure du Fichier (3500+ lignes)

#### 1. IMPORTS & CONFIGURATION (lignes 1-30)
- Imports React, Fabric.js, composants
- 17 states pour gérer l'interface
- Refs (canvas, tooltip, menu contextuel)
- Constante `echelle = 40` (40px = 1m)

#### 2. INITIALISATION CANVAS (lignes 31-350)
- `useEffect` principal : création du canvas Fabric.js
- Calcul dimensions (viewport - header - timeline)
- Événements canvas :
  - `object:moving` → Snap-to-grid + snap magnétique
  - `object:modified` → Consolidé (guides, export, validation)
  - `object:scaling` → Mesures live
  - `selection:created/updated/cleared` → Menu + panneau validation
  - `mouse:dblclick` → Points intermédiaires lignes

#### 3. TIMELINE & CROISSANCE (lignes 351-460)
- `useEffect` anneeProjection
- Redimensionnement arbres selon âge (0-20 ans)
- Accès `_objects[]` pour ellipse, emoji, labels

#### 4. DRAG & DROP PANNEAUX (lignes 461-560)
- Menu contextuel déplaçable
- Panneau validation déplaçable
- EventListeners mousedown/move/up

#### 5. AFFICHAGE & VALIDATION (lignes 561-1200)
- `afficherMenuContextuel()` → Bulle lock/delete
- `afficherTooltipValidation()` → Panneau latéral avec infos arbre
- `afficherCercleTronc()` → Cercle rouge tronc pendant drag
- `afficherLignesMesure()` → Lignes rouges pointillées vers obstacles

#### 6. ACTIONS UTILISATEUR (lignes 1201-1400)
- `supprimerObjetActif()` → Delete key
- `supprimerSelection()` → Bouton poubelle
- `verrouillerSelection()` / `deverrouillerTout()`
- `exporterPlan()` → PNG haute résolution
- `sauvegarder()` / `charger()` → localStorage

#### 7. AJOUT OBJETS (lignes 1401-2200)
- `ajouterMaison()`, `ajouterCanalisation()`, `ajouterCiterne()`, etc.
- `ajouterArbreAuCanvas()` → Ellipse + emoji + labels
- Auto-placement intelligent si première fois

#### 8. VALIDATION RÉGLEMENTAIRE (lignes 2201-2800)
- `validerArbre()` → Vérifie TOUTES les distances
- `calculerDistance()` → Géométrie pure
- `mettreAJourCouleurArbre()` → Vert/Orange/Rouge

#### 9. ZONES CONTRAINTES (lignes 2801-3000)
- `dessinerZonesContraintes()` → Halos colorés
- Toggle on/off avec bouton 👁️
- Recalcul dynamique

#### 10. OMBRE PORTÉE (lignes 3001-3200)
- `dessinerOmbres()` → Projection selon angle solaire
- Changement saison (été/hiver) dans Timeline
- Ellipse projetée + opacité

#### 11. UTILS & HELPERS (lignes 3201-3500)
- `pixelsVersMetres()` / `metresVersPixels()`
- `obtenirCouleurValidation()`
- `afficherGuidesCentre()` → Lignes rouges temporaires

---

## ⚙️ Configuration Centralisée

### `config/planificateurConfig.js`

**UN SEUL fichier** pour ajuster TOUS les paramètres :

```javascript
// Échelles et mesures
export const ECHELLE = 40; // 40px = 1m

// Angles solaires
export const ANGLES_SOLAIRES = {
  ete: 65,
  hiver: 20
};

// Zones de contraintes
export const ZONES_CONTRAINTES = {
  maison: {
    interdite: { distance: 5, couleur: 'rgba(255,0,0,0.2)' },
    attention: { distance: 6, couleur: 'rgba(255,165,0,0.15)' }
  },
  fossesSeptiques: {
    distance: 6,
    couleur: 'rgba(0,0,255,0.15)'
  }
  // ...
};

// Dashboard
export const DASHBOARD_CONFIG = {
  updateInterval: 100, // ms
  scoreWeights: {
    distance: 0.4,
    exposition: 0.2,
    sol: 0.15,
    espace: 0.15,
    harmonie: 0.1
  }
};
```

**Avantage** : Modifier un paramètre une seule fois, impact partout ✅

---

## 🛠️ Utilitaires Modulaires

### `utils/geometrie.js` - Calculs Purs

Fonctions **pures** (testables, réutilisables) :

```javascript
export function calculerDistance(x1, y1, x2, y2)
export function calculerDistanceRectangle(px, py, rect)
export function calculerDistanceLigne(px, py, ligne)
export function pointDansRectangle(px, py, rect)
export function calculerAireEllipse(rayonX, rayonY)
export function rectanglesChevauchent(rect1, rect2)
export function projetterRectangle(rect, angle, longueur) // Pour ombres
```

### `utils/validation.js` - Logique de Validation

```javascript
export function validerArbre(arbre, obstacles, autresArbres)
export function obtenirMessagesValidation(erreurs)
export function obtenirCouleurValidation(valide, proche)
export function verifierConformiteCodeCivil(arbre)
```

### `utils/zonesContraintes.js` - Zones Visuelles

```javascript
export function dessinerZonesContraintes(canvas, obstacles, config)
export function calculerZoneTampon(obstacle, distance)
export function creerHalo(centre, rayon, couleur, opacite)
```

### `utils/ombrePortee.js` - Calcul Ombres

```javascript
export function calculerOmbre(objet, angleSolaire, echelle)
export function projetterEllipse(ellipse, angle)
export function dessinerOmbreCanvas(canvas, ombre, opacite)
```

---

## 🎯 Flux de Données

```
Utilisateur
    ↓
Actions (clic, drag, etc.)
    ↓
CanvasTerrain.jsx (React State)
    ↓
Fabric.js Canvas (render)
    ↓
Utils (calculs, validation)
    ↓
Config (paramètres)
    ↓
Data (arbustesData.js)
```

---

## 🔄 Cycle de Vie d'un Arbre

1. **Sélection** : Utilisateur clique dans palette
2. **Auto-placement** : `placementAlgorithm.js` trouve position optimale
3. **Ajout Canvas** : `ajouterArbreAuCanvas()` crée ellipse + emoji + labels
4. **Validation** : `validerArbre()` vérifie toutes distances
5. **Coloration** : `mettreAJourCouleurArbre()` → Vert/Orange/Rouge
6. **Sauvegarde** : `localStorage` automatique à chaque modification

---

## 📊 Performance

### Optimisations Actuelles

✅ **Validation différée** : Seulement après `object:modified` (pas pendant drag)  
✅ **Calculs géométriques optimisés** : Fonctions pures natives JavaScript  
✅ **Canvas Fabric.js** : Hardware-accelerated rendering  
✅ **LocalStorage** : Sauvegarde locale (pas de serveur)  
✅ **Lazy loading** : Composants chargés à la demande  

### Métriques

- **Bundle final** : ~163 kB gzippé
- **FPS** : 60 fps constant (drag fluide)
- **Temps chargement** : < 2 secondes
- **Validation** : < 10ms par arbre

---

## 🧪 Tests & Débogage

### Outil Diagnostic Intégré

Bouton "🔬 Diagnostic" dans le planificateur :

```javascript
// Affiche :
- Dimensions canvas
- Nombre d'objets
- Arbres placés
- Validation globale
- LocalStorage size
```

### Logging Centralisé

```javascript
import { log } from '../utils/logging';

log.info('Arbre ajouté', { id: 'prunus-kanzan', x: 10, y: 15 });
log.warn('Validation échouée', { raison: 'Trop près maison' });
log.error('Canvas non initialisé');
```

Console groupée et colorée pour debug facile ✅

---

## 📚 Ressources Complémentaires

- **[PLANIFICATEUR.md](./PLANIFICATEUR.md)** : Fonctionnalités du planificateur
- **[GUIDE_AJOUT_NOUVEL_ARBRE.md](./GUIDE_AJOUT_NOUVEL_ARBRE.md)** : Procédure d'ajout
- **[VALIDATION_SOURCES.md](./VALIDATION_SOURCES.md)** : Sources des données
- **[CHANGELOG.md](./CHANGELOG.md)** : Historique des versions

---

**Développé avec 💚 pour la biodiversité locale**

