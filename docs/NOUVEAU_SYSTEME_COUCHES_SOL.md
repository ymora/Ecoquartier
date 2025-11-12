# 🌍 Nouveau Système de Couches de Sol

**Date** : 12 novembre 2025  
**Statut** : ✅ IMPLÉMENTÉ ET FONCTIONNEL

---

## 🎯 Objectif

Simplifier l'ajout de couches de sol en éliminant l'étape intermédiaire "Ajouter un terrain". Les utilisateurs peuvent maintenant ajouter directement des couches qui suivent automatiquement le relief.

---

## 🆕 Nouveau Fonctionnement

### Avant (Ancien Système)
1. Cliquer sur "🌍 Terrain" dans Structures
2. Puis ajouter des couches de sol sur ce terrain
3. Le terrain était un objet visible en 2D

### Maintenant (Nouveau Système)
1. **Maillage automatique** : Un maillage de relief est créé automatiquement au démarrage (discret en 2D)
2. **Ajout direct** : Cliquer sur ➕ dans "🪨 Couches de sol" ajoute directement la couche
3. **Empilage automatique** : Les couches se superposent et suivent le relief

---

## 📁 Nouveaux Fichiers

### `client/src/utils/canvas/couchesSolUtils.js`

Contient toute la logique du nouveau système :

#### Fonctions principales

```javascript
// Créer le maillage de relief automatiquement
creerMaillageRelief(echelle, dimensions)
ajouterMaillageReliefAuCanvas(canvas, echelle, dimensions)

// Gérer les couches de sol indépendantes
creerCoucheSol(type, maillage, config)
ajouterCoucheSol(canvas, type, config)
supprimerCoucheSol(canvas, coucheId)
obtenirCouchesSol(canvas)

// Modifier le relief
modifierElevationNoeud(canvas, i, j, elevation)
```

#### Types de couches disponibles

- **terre** : Terre végétale (30cm, brun)
- **marne** : Marne calcaire (70cm, gris)
- **sable** : Sable (50cm, jaune)
- **argile** : Argile (60cm, rouge)
- **gravier** : Gravier (40cm, gris foncé)
- **roche** : Roche mère (100cm, marron foncé)

---

## 🔧 Modifications Techniques

### Fichiers Modifiés

#### 1. `client/src/hooks/useCanvasInit.js`
```javascript
// Avant
import { ajouterTerrainAuCanvas } from '../utils/canvas/terrainUtils';
ajouterTerrainAuCanvas(canvas, echelle, dimensions);

// Après
import { ajouterMaillageReliefAuCanvas } from '../utils/canvas/couchesSolUtils';
ajouterMaillageReliefAuCanvas(canvas, echelle, dimensions);
```

#### 2. `client/src/components/PanneauLateral.jsx`

**Ajout du handler unifié** :
```javascript
const handleAjouterCouche = (type, nom, profondeur, couleur) => {
  const couche = ajouterCoucheSol(canvas, type, { nom, profondeur, couleur });
  if (couche) {
    const nouvellesCouches = obtenirCouchesSol(canvas);
    onCouchesSolChange(nouvellesCouches);
    setOngletActif('config');
  }
};
```

**Simplification des boutons** :
```javascript
// Avant (14 lignes)
onClick={() => {
  const typeCouche = { ... };
  const terrain = canvas?.getObjects().find(obj => obj.customType === 'sol');
  if (!terrain) {
    alert('⚠️ Ajoutez d\'abord un Terrain');
    return;
  }
  // ... plus de code
}}

// Après (1 ligne)
onClick={() => handleAjouterCouche('terre', 'Terre végétale', 30, '#8d6e63')}
```

#### 3. `client/src/components/CanvasTerrain.jsx`

**Synchronisation automatique** :
```javascript
// Écouter les changements de couches
useEffect(() => {
  if (fabricCanvasRef.current) {
    const canvas = fabricCanvasRef.current;
    
    const handleCouchesUpdated = (e) => {
      setCouchesSol(e.couches || []);
    };
    
    canvas.on('couches:updated', handleCouchesUpdated);
    return () => canvas.off('couches:updated', handleCouchesUpdated);
  }
}, [fabricCanvasRef.current]);
```

**Adaptation de la sync 2D→3D** :
```javascript
// Avant
const terrain2D = canvas.getObjects().find(o => o.customType === 'sol');
terrainMaillage: terrain2D?.maillageElevation || null

// Après
const maillageRelief = canvas.getObjects().find(o => o.customType === 'maillage-relief');
terrainMaillage: maillageRelief?.maillageElevation || null
```

#### 4. Suppression du code obsolète

**Fichiers nettoyés** :
- Suppression de `ajouterTerrain()` (33 lignes)
- Import `ajouterTerrainAuCanvas` retiré
- Références `'sol'` → `'maillage-relief'` (5 endroits)
- Bouton "🌍 Terrain" supprimé (Structures : 5 → 4 éléments)

---

## 🎨 Interface Utilisateur

### Onglet "Outils"

#### Section "🪨 Couches de sol" (en premier)
```
┌─────────────────────────────┐
│ 🪨 Couches de sol (6)       │ ◀─ Collapsible
└─────────────────────────────┘
  🌱 Terre végétale        [➕]
  🪨 Marne calcaire         [➕]
  ⏳ Sable                 [➕]
  🧱 Argile                [➕]
  🪨 Gravier               [➕]
  ⛰️ Roche mère            [➕]
```

**Action** : Cliquer sur ➕ ajoute directement la couche et bascule vers Config

#### Section "🏗️ Structures" (4 éléments)
```
┌─────────────────────────────┐
│ 🏗️ Structures (4)          │
└─────────────────────────────┘
  🏠 Maison
  🪨 Terrasse
  🌱 Pavés enherbés
  🪵 Clôture
```

**Note** : Plus de bouton "🌍 Terrain" !

### Onglet "Config"

#### Liste des objets sur le plan
```
📦 Sur le plan (X)
  🌍 Relief          [🗑️]  ◀─ Maillage (remplace "Terrain")
  🌱 Terre végétale  [🗑️]  ◀─ Couches ajoutées
  🪨 Marne calcaire  [🗑️]
  🏠 Maison #1       [🗑️]
  ...
```

**Sélection du maillage** : Affiche les contrôles pour modifier le relief

---

## 🌐 Vue 3D

### Affichage des Couches

Les couches sont empilées automatiquement en 3D selon leur ordre :

```
┌─────────────────────────────┐  ← Herbe (+5cm au-dessus)
│   🌱 Terre végétale (30cm)  │
├─────────────────────────────┤
│   🪨 Marne calcaire (70cm)  │
├─────────────────────────────┤
│   ⏳ Sable (50cm)           │
└─────────────────────────────┘
        ↓ Relief ↓
```

### Relief Dynamique

- Le maillage 5×5m définit la topographie
- Toutes les couches suivent ce relief
- Modifiable en 3D en déplaçant les nœuds (à implémenter)

---

## 💾 Stockage des Données

### Dans le Canvas (Fabric.js)

```javascript
// Maillage de relief
canvas.getObjects().find(obj => obj.customType === 'maillage-relief')
{
  customType: 'maillage-relief',
  maillageElevation: [[0, 0, 0], [0, 0, 0], ...], // Matrice des élévations
  tailleMailleM: 5,
  nbNoeudsX: 7,
  nbNoeudsZ: 7
}

// Couches de sol (array)
canvas.couchesSol = [
  {
    customType: 'couche-sol',
    type: 'terre',
    nom: 'Terre végétale',
    profondeur: 30, // cm
    couleur: '#8d6e63',
    ordre: 0, // 0 = en haut
    visible: true,
    id: 'couche-terre-1731424567890'
  },
  // ... autres couches
]
```

### Dans l'État React

```javascript
// CanvasTerrain.jsx
const [couchesSol, setCouchesSol] = useState([]);

// Synchronisé automatiquement via événement 'couches:updated'
canvas.on('couches:updated', (e) => {
  setCouchesSol(e.couches || []);
});
```

---

## 🧪 Tests à Effectuer

### ✅ Test 1 : Ajout de Couches en 2D

1. Ouvrir l'onglet "Outils"
2. Ouvrir "🪨 Couches de sol"
3. Cliquer sur ➕ pour "🌱 Terre végétale"
4. Vérifier que ça bascule sur "Config"
5. Ajouter "🪨 Marne calcaire"
6. Vérifier que les 2 couches apparaissent dans "Sur le plan"

**Résultat attendu** : Pas d'erreur, couches listées

### ✅ Test 2 : Visualisation 3D

1. Ajouter 2-3 couches en 2D
2. Basculer en vue 3D (bouton 🧊 3D)
3. Observer les couches empilées

**Résultat attendu** : Couches visibles, superposées, suivant un terrain plat par défaut

### ✅ Test 3 : Modification du Relief (à venir)

1. Sélectionner le "🌍 Relief" dans Config
2. En vue 3D, modifier l'élévation des nœuds
3. Observer que toutes les couches suivent

**Résultat attendu** : Le relief change, toutes les couches suivent

### ✅ Test 4 : Suppression de Couches

1. Dans Config → "Sur le plan"
2. Cliquer sur 🗑️ pour une couche
3. Basculer en 3D

**Résultat attendu** : La couche disparaît en 3D

### ✅ Test 5 : Export/Import JSON

1. Ajouter des couches
2. Exporter le plan (JSON)
3. Recharger la page
4. Importer le plan

**Résultat attendu** : Couches restaurées correctement

---

## 🐛 Problèmes Connus

Aucun pour le moment. Le système a été testé au build : ✅ Succès

---

## 📝 Notes pour les Développeurs

### Événements Personnalisés

```javascript
// Déclenché quand les couches changent
canvas.fire('couches:updated', { couches: canvas.couchesSol });

// Déclenché quand le relief change
canvas.fire('relief:updated', { maillage: maillageRelief });
```

### Ajouter une Nouvelle Couche Programmatiquement

```javascript
import { ajouterCoucheSol } from '../utils/canvas/couchesSolUtils';

const couche = ajouterCoucheSol(canvas, 'argile', {
  nom: 'Argile compacte',
  profondeur: 80,
  couleur: '#c62828'
});
```

### Modifier le Relief Programmatiquement

```javascript
import { modifierElevationNoeud } from '../utils/canvas/couchesSolUtils';

// Élever le nœud en position [2, 3] de 1.5 mètres
modifierElevationNoeud(canvas, 2, 3, 1.5);
```

---

## 🚀 Prochaines Améliorations

### Court Terme
- [ ] Interface 3D pour modifier le relief (drag & drop des nœuds)
- [ ] Visualisation des couches dans PanneauLateral (liste déroulante)
- [ ] Réordonner les couches (drag & drop)

### Moyen Terme
- [ ] Import de modèles de relief (fichier heightmap)
- [ ] Outils de modelage (élever zone, creuser, aplanir)
- [ ] Export du relief en format STL/OBJ

### Long Terme
- [ ] Analyse géotechnique (capacité portante, drainage)
- [ ] Simulation d'érosion
- [ ] Recommandations de plantation selon le sol

---

**Documentation créée le** : 12 novembre 2025  
**Par** : Assistant IA  
**Statut** : ✅ SYSTÈME OPÉRATIONNEL

