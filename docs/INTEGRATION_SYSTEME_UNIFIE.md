# Guide d'intégration du système unifié 2D/3D

## Vue d'ensemble

Le système unifié 2D/3D permet une synchronisation en temps réel entre les vues 2D et 3D, avec des contrôles d'objets unifiés et des optimisations de performance.

## Architecture

### 1. Gestion d'état unifié (`UnifiedStateContext`)

```jsx
import { UnifiedStateProvider, useUnifiedState } from '../contexts/UnifiedStateContext';

function App() {
  return (
    <UnifiedStateProvider>
      <YourComponent />
    </UnifiedStateProvider>
  );
}

function YourComponent() {
  const { state, actions, getters } = useUnifiedState();
  
  // Utiliser l'état unifié
  const handleViewModeChange = (mode) => {
    actions.setViewMode(mode);
  };
  
  return (
    <div>
      <button onClick={() => handleViewModeChange('2d')}>Vue 2D</button>
      <button onClick={() => handleViewModeChange('3d')}>Vue 3D</button>
    </div>
  );
}
```

### 2. Contrôles d'objets unifiés

```jsx
import { useUnifiedObjectControls } from '../hooks/useUnifiedObjectControls';
import UnifiedObjectControls from '../components/UnifiedObjectControls';

function ObjectEditor({ objectId, objectType }) {
  const { controls } = useUnifiedObjectControls();
  
  // Mise à jour d'une propriété
  const handlePropertyChange = (property, value) => {
    controls.updateNestedProperty(objectId, property, value);
  };
  
  return (
    <UnifiedObjectControls
      objectId={objectId}
      objectType={objectType}
      onPropertyChange={handlePropertyChange}
    />
  );
}
```

### 3. Rendu unifié

```jsx
import { useUnifiedRendering } from '../hooks/useUnifiedRendering';

function ViewRenderer() {
  const { get2DData, get3DData, sync2DTo3D, sync3DTo2D } = useUnifiedRendering();
  
  // Obtenir les données formatées
  const data2D = get2DData();
  const data3D = get3DData();
  
  // Synchronisation
  const handle2DChange = (canvasData) => {
    sync2DTo3D(canvasData);
  };
  
  const handle3DChange = (objectId, newPosition) => {
    sync3DTo2D(objectId, newPosition);
  };
  
  return (
    <div>
      {/* Rendu 2D */}
      <Canvas2D data={data2D} onChange={handle2DChange} />
      
      {/* Rendu 3D */}
      <Canvas3D data={data3D} onChange={handle3DChange} />
    </div>
  );
}
```

### 4. Optimisations de performance

```jsx
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';

function OptimizedComponent() {
  const { 
    createThrottledFunction, 
    shouldRender, 
    getPerformanceMetrics 
  } = usePerformanceOptimization();
  
  // Throttling des fonctions coûteuses
  const throttledUpdate = useMemo(() => 
    createThrottledFunction(updateFunction, 100), 
    [createThrottledFunction]
  );
  
  // Vérification des re-renders
  if (!shouldRender('MyComponent', props)) {
    return null;
  }
  
  // Métriques de performance
  const metrics = getPerformanceMetrics();
  console.log('Performance:', metrics);
  
  return <div>Optimized content</div>;
}
```

## Intégration complète

### 1. Composant principal unifié

```jsx
import UnifiedApplication from '../components/UnifiedApplication';

function App() {
  return <UnifiedApplication />;
}
```

### 2. Synchronisation automatique

```jsx
import UnifiedSyncManager from '../components/UnifiedSyncManager';

function App() {
  const [canvas2D, setCanvas2D] = useState(null);
  const [canvas3D, setCanvas3D] = useState(null);
  
  return (
    <div>
      {/* Vos composants 2D/3D */}
      
      <UnifiedSyncManager
        canvas2D={canvas2D}
        canvas3D={canvas3D}
        onSync2DTo3D={handle2DTo3D}
        onSync3DTo2D={handle3DTo2D}
        syncInterval={100}
      />
    </div>
  );
}
```

### 3. Exemple d'utilisation

```jsx
import UnifiedSystemExample from '../examples/UnifiedSystemExample';

function App() {
  return <UnifiedSystemExample />;
}
```

## Configuration

### 1. Paramètres de vue

```jsx
const { actions } = useUnifiedState();

// Modifier les paramètres de vue
actions.setViewParams({
  anneeProjection: 5,
  saison: 'printemps',
  heureJournee: 120,
  orientation: 'nord-haut',
  dimensions: { largeur: 30, hauteur: 30 }
});
```

### 2. Gestion des objets

```jsx
const { controls } = useUnifiedObjectControls();

// Ajouter un objet
controls.addObject('maison', {
  id: 'maison-1',
  type: 'maison',
  position: [0, 0, 0],
  dimensions: { largeur: 10, profondeur: 8, hauteur: 7 },
  properties: { angle: 0, elevationSol: 0 }
});

// Modifier un objet
controls.updateObjectProperties('maison-1', {
  position: [5, 0, 5],
  dimensions: { largeur: 12, profondeur: 10, hauteur: 8 }
});

// Supprimer un objet
controls.removeObject('maison-1');
```

### 3. Synchronisation

```jsx
const { syncHandlers } = useUnifiedState();

// Synchronisation 2D → 3D
syncHandlers.handle2DTo3DSync(canvasData);

// Synchronisation 3D → 2D
syncHandlers.handle3DTo2DSync(objectId, newPosition, newProperties);
```

## Types d'objets supportés

### 1. Maisons
```jsx
{
  type: 'maison',
  dimensions: {
    largeur: 10,      // mètres
    profondeur: 8,    // mètres
    hauteur: 7        // mètres
  },
  properties: {
    angle: 0,                    // degrés
    elevationSol: 0,            // mètres
    profondeurFondations: 1.2   // mètres
  }
}
```

### 2. Citernes
```jsx
{
  type: 'citerne',
  dimensions: {
    diametre: 2,     // mètres
    profondeur: 3    // mètres
  },
  properties: {
    volume: 5000,        // litres
    elevationSol: 0      // mètres
  }
}
```

### 3. Arbres
```jsx
{
  type: 'arbre',
  dimensions: {
    hauteur: 8,           // mètres
    envergure: 6,        // mètres
    profondeurRacines: 2 // mètres
  },
  properties: {
    arbreData: { name: 'Chêne', type: 'arbre' },
    validationStatus: 'ok'
  }
}
```

## Optimisations de performance

### 1. Throttling
```jsx
const throttledFunction = createThrottledFunction(expensiveFunction, 100);
```

### 2. Debouncing
```jsx
const debouncedFunction = createDebouncedFunction(expensiveFunction, 300);
```

### 3. Mémorisation
```jsx
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### 4. Lazy loading
```jsx
const LazyComponent = createLazyComponent(() => import('./HeavyComponent'));
```

## Dépannage

### 1. Problèmes de synchronisation
```jsx
// Vérifier l'état de synchronisation
const { state } = useUnifiedState();
console.log('Sync state:', state.syncState);

// Forcer la synchronisation
const { syncHandlers } = useUnifiedState();
syncHandlers.handle2DTo3DSync();
```

### 2. Problèmes de performance
```jsx
// Obtenir les métriques
const { getPerformanceMetrics } = usePerformanceOptimization();
const metrics = getPerformanceMetrics();
console.log('Performance:', metrics);
```

### 3. Debug des données
```jsx
// Accéder aux données globalement
window.unifiedSync = {
  forceSync,
  get2DData,
  get3DData
};
```

## Exemples d'utilisation

### 1. Application simple
```jsx
import { UnifiedStateProvider } from '../contexts/UnifiedStateContext';
import UnifiedApplication from '../components/UnifiedApplication';

function App() {
  return (
    <UnifiedStateProvider>
      <UnifiedApplication />
    </UnifiedStateProvider>
  );
}
```

### 2. Application personnalisée
```jsx
import { UnifiedStateProvider } from '../contexts/UnifiedStateContext';
import { useUnifiedState } from '../contexts/UnifiedStateContext';
import { useUnifiedObjectControls } from '../hooks/useUnifiedObjectControls';

function CustomApp() {
  return (
    <UnifiedStateProvider>
      <CustomAppContent />
    </UnifiedStateProvider>
  );
}

function CustomAppContent() {
  const { state, actions } = useUnifiedState();
  const { controls } = useUnifiedObjectControls();
  
  return (
    <div>
      {/* Votre interface personnalisée */}
    </div>
  );
}
```

## Conclusion

Le système unifié 2D/3D offre une solution complète pour la synchronisation en temps réel entre les vues 2D et 3D, avec des contrôles d'objets unifiés et des optimisations de performance. Il est conçu pour être facilement intégré dans des applications existantes tout en offrant une expérience utilisateur fluide et performante.