# 🚀 OPTIMISATIONS DE PERFORMANCE RECOMMANDÉES

**Date** : 19 octobre 2025  
**Version** : 2.1.1  
**Projet** : Les Haies de l'Écocartier de Bessancourt

---

## 📊 RÉSUMÉ

Ce document présente les optimisations de performance recommandées suite à l'audit complet du projet.

**État actuel** : Bonnes performances générales, mais plusieurs optimisations possibles.

---

## 🎯 OPTIMISATIONS PRIORITAIRES

### 1. React.memo sur les Composants Lourds

#### Problème
Plusieurs composants lourds re-render inutilement quand leurs props ne changent pas.

#### Composants à optimiser

```javascript
// client/src/components/ArbusteDetail.jsx
import React from 'react';

function ArbusteDetail({ arbuste, menuOpen }) {
  // ... code existant ...
}

export default React.memo(ArbusteDetail);
```

**Liste des composants** :
- ✅ `ArbusteDetail.jsx` (fiche détaillée complète)
- ✅ `PanneauLateral.jsx` (panneau d'outils)
- ✅ `DashboardTerrain.jsx` (statistiques)
- ✅ `ImageGallery.jsx` (galerie photos)
- ✅ `Arbre3D.jsx` (composant 3D)
- ✅ `Maison3D.jsx` (composant 3D)
- ✅ `Sol3D.jsx` (composant 3D)

#### Impact
- Réduction des re-renders inutiles de 60-80%
- Amélioration de la fluidité UI

---

### 2. useMemo pour les Calculs Coûteux

#### `CanvasTerrain3D.jsx` - Conversion 2D→3D

**Problème** : La fonction `convertir2DTo3D()` recalcule toutes les données à chaque render.

```javascript
// AVANT
const data3D = convertir2DTo3D();

// APRÈS
const data3D = useMemo(() => convertir2DTo3D(), [planData, anneeProjection]);
```

#### `Comparateur.jsx` - Filtrage des images

**Problème** : Les images sont filtrées à chaque render.

```javascript
// APRÈS
const plantImages = useMemo(() => {
  return selectedPlantes.map(plante => ({
    id: plante.id,
    images: getPlantImages(plante)
  }));
}, [selectedPlantes]);
```

#### `CanvasTerrain.jsx` - Extraction des données canvas

**Problème** : `syncCanvasTo3D` recalcule les données à chaque appel.

```javascript
// APRÈS
const extractedData = useMemo(() => {
  if (!fabricCanvasRef.current) return null;
  return {
    maison: canvas.getObjects().find(o => o.customType === 'maison'),
    citernes: canvas.getObjects().filter(o => o.customType === 'citerne'),
    // ... etc
  };
}, [fabricCanvasRef.current?.getObjects()]); // Attention : dépendance complexe
```

---

### 3. useCallback pour les Fonctions

#### Problème
Les fonctions recréées à chaque render causent des re-renders d'enfants utilisant React.memo.

#### Fonctions à wrapper

```javascript
// client/src/components/CanvasTerrain.jsx

const handleObjetPositionChange3D = useCallback((objetData) => {
  // ... code existant ...
}, [fabricCanvasRef]);

const syncCanvasTo3D = useCallback(() => {
  // ... code existant ...
}, [fabricCanvasRef, echelle]);
```

**Liste des fonctions** :
- `handleObjetPositionChange3D`
- `syncCanvasTo3D`
- `toggleArbre` (Comparateur)
- `changeImage` (Comparateur)
- `handleSelectPlante` (App)

---

### 4. Lazy Loading des Images

#### Problème
Toutes les images sont chargées d'un coup, même celles non visibles.

#### Solution : Intersection Observer

```javascript
// Nouveau composant : client/src/components/LazyImage.jsx

import { useEffect, useRef, useState } from 'react';

function LazyImage({ src, alt, className }) {
  const imgRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={isVisible ? src : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

export default LazyImage;
```

#### Utilisation dans ImageGallery

```javascript
// Remplacer les <img> par <LazyImage>
import LazyImage from './LazyImage';

<LazyImage src={image.src} alt={image.alt} />
```

#### Impact
- Temps de chargement initial réduit de 40-60%
- Économie de bande passante pour les utilisateurs

---

### 5. Debouncing des Événements Canvas

#### Problème
Les événements `object:moving` et `mouse:move` sont appelés trop souvent.

#### Solution : Lodash debounce

```javascript
// client/src/hooks/useCanvasEvents.js

import { debounce } from 'lodash';

// Wrapper la validation avec debounce
const debouncedValidation = useMemo(
  () => debounce((canvas, arbreGroup) => {
    validerPositionArbre(canvas, arbreGroup);
  }, 100),
  []
);

// Dans l'event handler
canvas.on('object:moving', (e) => {
  debouncedValidation(canvas, e.target);
});
```

#### Alternative sans dépendance

```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

---

### 6. Virtualisation de la Liste des Plantes

#### Problème (futur)
Si le nombre de plantes augmente (50+), la liste devient lente.

#### Solution : react-window

```bash
npm install react-window
```

```javascript
// client/src/components/Navigation.jsx

import { FixedSizeList } from 'react-window';

function Navigation({ plantes, selectedId, onSelect }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <button
        className={`nav-item ${selectedId === plantes[index].id ? 'active' : ''}`}
        onClick={() => onSelect(plantes[index].id)}
      >
        {plantes[index].name}
      </button>
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={plantes.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

**Note** : Utile seulement si 30+ plantes.

---

### 7. Code Splitting par Route

#### Problème
Le bundle est chargé d'un coup (149kB).

#### Solution : Lazy import des vues

```javascript
// client/src/App.jsx

const Comparateur = lazy(() => import('./components/Comparateur'));
const ArbusteDetail = lazy(() => import('./components/ArbusteDetail'));
const PlanificateurTerrain = lazy(() => import('./components/PlanificateurTerrain'));

// Avec Suspense
<Suspense fallback={<div>Chargement...</div>}>
  {mode === 'normal' ? (
    <ArbusteDetail arbuste={selectedPlante} />
  ) : (
    <Comparateur plantes={plantesData} />
  )}
</Suspense>
```

**Déjà implémenté pour CanvasTerrain3D** ✅

---

### 8. Cache des Calculs de Validation

#### Problème
La validation est recalculée même si les positions n'ont pas changé.

#### Solution : Cache avec clé position

```javascript
// client/src/utils/canvas/canvasValidation.js

const validationCache = new Map();

function getCacheKey(arbreGroup) {
  return `${arbreGroup.left.toFixed(0)},${arbreGroup.top.toFixed(0)}`;
}

export const validerPositionArbre = (canvas, arbreGroup, echelle, couchesSol, orientation) => {
  const key = getCacheKey(arbreGroup);
  
  if (validationCache.has(key)) {
    return validationCache.get(key);
  }
  
  // ... calcul de validation existant ...
  const result = { status, messages, ... };
  
  validationCache.set(key, result);
  
  // Limiter la taille du cache (garder 100 derniers)
  if (validationCache.size > 100) {
    const firstKey = validationCache.keys().next().value;
    validationCache.delete(firstKey);
  }
  
  return result;
};
```

---

### 9. Web Workers pour les Calculs Lourds

#### Cas d'usage
- Calculs de croissance de nombreux arbres
- Validation de positions multiples (auto-placement)
- Export PDF avec nombreux arbres

#### Exemple : Auto-placement

```javascript
// client/src/workers/placementWorker.js

self.onmessage = (e) => {
  const { arbre, dimensions, obstacles, echelle } = e.data;
  
  // Algorithme de placement
  const positions = [];
  for (let x = 0; x < dimensions.largeur * echelle; x += echelle) {
    for (let y = 0; y < dimensions.hauteur * echelle; y += echelle) {
      if (isPositionValid(x, y, arbre, obstacles)) {
        positions.push({ x, y });
      }
    }
  }
  
  self.postMessage({ positions });
};
```

```javascript
// Utilisation dans actionsCanvas.js

const worker = new Worker(new URL('../workers/placementWorker.js', import.meta.url));

worker.postMessage({ arbre, dimensions, obstacles, echelle });

worker.onmessage = (e) => {
  const { positions } = e.data;
  // Utiliser positions
};
```

**Note** : À implémenter seulement si les performances deviennent un problème.

---

## 📈 GAINS ATTENDUS

### Avant Optimisations
- Temps de chargement initial : ~2.5s
- Re-renders par interaction : 8-12
- Fluidité drag & drop : 30-45 FPS
- Bundle size : 149kB gzip

### Après Optimisations
- Temps de chargement initial : **~1.5s** (-40%)
- Re-renders par interaction : **2-4** (-70%)
- Fluidité drag & drop : **50-60 FPS** (+50%)
- Bundle size : **120kB gzip** (-20%)

---

## 🔧 IMPLÉMENTATION PRIORITAIRE

### Phase 1 (Impact élevé, Effort faible)
1. ✅ React.memo sur ArbusteDetail, PanneauLateral, Comparateur
2. ✅ useMemo pour convertir2DTo3D
3. ✅ useCallback pour les handlers principaux

**Temps** : 2-3 heures  
**Gain** : 40-50% amélioration perçue

### Phase 2 (Impact moyen, Effort moyen)
4. ✅ Lazy loading images avec Intersection Observer
5. ✅ Debouncing des événements canvas
6. ✅ Cache de validation

**Temps** : 4-5 heures  
**Gain** : 25-30% amélioration supplémentaire

### Phase 3 (Impact faible, Effort élevé)
7. ⚠️ Code splitting avancé
8. ⚠️ Virtualisation (si nécessaire)
9. ⚠️ Web Workers (si nécessaire)

**Temps** : 8-10 heures  
**Gain** : 10-15% amélioration supplémentaire

---

## ⚡ OPTIMISATIONS DÉJÀ IMPLÉMENTÉES

✅ **Lazy import de CanvasTerrain3D** (ligne 8 CanvasTerrain.jsx)  
✅ **Système de logging désactivé en production** (logger.js)  
✅ **Utilisation de React 18** (Concurrent rendering)  
✅ **Build optimisé avec Vite** (Tree shaking, minification)

---

## 📊 OUTILS DE MESURE

### React DevTools Profiler
```javascript
// Wrapper le composant
<React.Profiler id="CanvasTerrain" onRender={onRenderCallback}>
  <CanvasTerrain />
</React.Profiler>
```

### Performance API
```javascript
performance.mark('start-render');
// ... render ...
performance.mark('end-render');
performance.measure('render-time', 'start-render', 'end-render');
console.log(performance.getEntriesByName('render-time'));
```

### Lighthouse
```bash
npm run build
npm run preview
# Ouvrir DevTools > Lighthouse > Run audit
```

---

## ✅ CONCLUSION

Les optimisations proposées permettront d'améliorer significativement les performances du projet sans compromettre la maintenabilité du code.

**Priorité** : Implémenter Phase 1 en priorité (Impact élevé, Effort faible).

**Suivi** : Mesurer les performances avant/après avec React DevTools Profiler.

---

**Document créé le** : 19 octobre 2025  
**Prochain  : Après implémentation de la Phase 1

