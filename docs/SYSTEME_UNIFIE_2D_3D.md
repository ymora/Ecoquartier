# Système Unifié 2D/3D - Principe DRY

## 🎯 **Problème résolu**

**AVANT** : Duplication massive entre 2D et 3D
- Objets 2D (Fabric.js) + Objets 3D (Three.js) séparés
- Logique de synchronisation complexe et fragile
- Contrôles dupliqués dans `PanneauLateral.jsx`
- Conversion manuelle 2D→3D dans `convertir2DTo3D()`

**APRÈS** : Un seul objet, deux représentations
- **UnifiedObject** : Modèle unique pour 2D/3D
- **useUnifiedObjectManager** : Gestionnaire centralisé
- **ObjectControls** : Contrôles unifiés
- **Synchronisation automatique** : Plus de conversion manuelle

## 🏗️ **Architecture unifiée**

### 1. **Modèle d'objet unifié** (`UnifiedObject.js`)
```javascript
const maison = ObjectFactory.createMaison({
  position: { x: 0, y: 0, z: 0 },
  dimensions: { largeur: 10, profondeur: 8, hauteur: 7 },
  material: { typeToit: 'deux-pentes' }
});

// Un seul objet, deux représentations
maison.setProperty('largeur', 12); // Met à jour 2D ET 3D automatiquement
```

### 2. **Gestionnaire centralisé** (`useUnifiedObjectManager.js`)
```javascript
const objectManager = useUnifiedObjectManager({
  canvas: fabricCanvas,
  echelle: 40,
  onSync: setSyncKey,
  onExport: exporterPlan
});

// Actions unifiées
objectManager.addObject(maison);
objectManager.selectObject(maison.id);
objectManager.updateObject(maison.id, { hauteur: 8 });
```

### 3. **Contrôles unifiés** (`ObjectControls.jsx`)
```javascript
<ObjectControls 
  objet={selectedObject}
  canvas={canvas}
  echelle={echelle}
  onSync={onSyncKeyChange}
  onExport={onExporterPlan}
/>
```

## 🔄 **Synchronisation automatique**

### Principe DRY appliqué :
1. **Un seul objet** : `UnifiedObject` contient toutes les données
2. **Deux représentations** : 2D (Fabric.js) et 3D (Three.js) sont des vues
3. **Synchronisation automatique** : Changement dans l'objet → Mise à jour des deux vues

### Flux de données :
```
UnifiedObject (source de vérité)
    ↓
    ├── Fabric.js (représentation 2D)
    └── Three.js (représentation 3D)
```

## 🎨 **Avantages du système unifié**

### ✅ **Principe DRY respecté**
- Plus de duplication de logique
- Un seul endroit pour gérer les propriétés d'objets
- Code plus maintenable et évolutif

### ✅ **Synchronisation automatique**
- Plus de conversion manuelle 2D→3D
- Changements instantanés dans les deux vues
- Pas de désynchronisation possible

### ✅ **Contrôles unifiés**
- Un seul composant `ObjectControls` pour tous les types
- Logique de validation centralisée
- Interface cohérente 2D/3D

### ✅ **Performance optimisée**
- Moins de calculs de conversion
- Synchronisation intelligente (seulement si nécessaire)
- Gestion mémoire optimisée

## 🚀 **Utilisation pratique**

### Ajouter un objet :
```javascript
const maison = ObjectFactory.createMaison({
  position: { x: 0, y: 0, z: 0 },
  dimensions: { largeur: 10, profondeur: 8, hauteur: 7 }
});

objectManager.addObject(maison);
// → Créé automatiquement en 2D ET 3D
```

### Modifier un objet :
```javascript
objectManager.updateObject(maison.id, { 
  dimensions: { largeur: 12, profondeur: 10 }
});
// → Met à jour automatiquement 2D ET 3D
```

### Sélectionner un objet :
```javascript
objectManager.selectObject(maison.id);
// → Sélectionne dans 2D ET 3D
```

## 📊 **Comparaison avant/après**

| Aspect | AVANT (Dupliqué) | APRÈS (Unifié) |
|--------|------------------|-----------------|
| **Objets** | 2 systèmes séparés | 1 système unifié |
| **Synchronisation** | Manuelle et fragile | Automatique et fiable |
| **Contrôles** | Logique dupliquée | Composant unique |
| **Maintenance** | Complexe (2 endroits) | Simple (1 endroit) |
| **Performance** | Conversion constante | Optimisée |
| **Bugs** | Désynchronisation fréquente | Impossible |

## 🎯 **Résultat final**

**Un objet = Une source de vérité = Deux représentations**

Plus de duplication, plus de désynchronisation, plus de complexité inutile. Le système respecte parfaitement le principe DRY et les meilleures pratiques 2025.

## 🔧 **Migration**

Pour migrer l'ancien système :
1. Remplacer les objets Fabric.js par `UnifiedObject`
2. Utiliser `useUnifiedObjectManager` au lieu de la logique manuelle
3. Remplacer `PanneauLateral` par `ObjectControls`
4. Supprimer `convertir2DTo3D()` (plus nécessaire)

Le nouveau système est **rétrocompatible** et peut être intégré progressivement.
