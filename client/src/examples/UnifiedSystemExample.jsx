import { useState, useCallback, useEffect } from 'react';
import { UnifiedStateProvider } from '../contexts/UnifiedStateContext';
import { useUnifiedState } from '../contexts/UnifiedStateContext';
import { useUnifiedObjectControls } from '../hooks/useUnifiedObjectControls';
import { useUnifiedRendering } from '../hooks/useUnifiedRendering';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import UnifiedObjectControls from '../components/UnifiedObjectControls';
import './UnifiedSystemExample.css';

/**
 * Exemple d'intégration du système unifié
 * Démonstration des fonctionnalités 2D/3D synchronisées
 */

function UnifiedSystemExampleContent() {
  const { state, actions } = useUnifiedState();
  const { controls } = useUnifiedObjectControls();
  const { get2DData, get3DData, getViewParams } = useUnifiedRendering();
  const { getPerformanceMetrics } = usePerformanceOptimization();
  
  // États locaux pour l'exemple
  const [testObjects, setTestObjects] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  
  // Créer des objets de test
  const createTestObjects = useCallback(() => {
    const objects = [
      {
        id: 'test-maison-1',
        type: 'maison',
        position: [0, 0, 0],
        dimensions: { largeur: 10, profondeur: 8, hauteur: 7 },
        properties: { angle: 0, elevationSol: 0, profondeurFondations: 1.2 },
        customType: 'maison'
      },
      {
        id: 'test-citerne-1',
        type: 'citerne',
        position: [15, 0, 5],
        dimensions: { diametre: 2, profondeur: 3 },
        properties: { volume: 5000, elevationSol: 0 },
        customType: 'citerne'
      },
      {
        id: 'test-arbre-1',
        type: 'arbre',
        position: [5, 0, 10],
        dimensions: { hauteur: 8, envergure: 6, profondeurRacines: 2 },
        properties: { 
          arbreData: { name: 'Chêne', type: 'arbre' },
          validationStatus: 'ok'
        },
        customType: 'arbre-a-planter'
      }
    ];
    
    // Ajouter les objets à l'état unifié
    objects.forEach(obj => {
      actions.addObject(obj.type, obj);
    });
    
    setTestObjects(objects);
  }, [actions]);
  
  // Supprimer les objets de test
  const removeTestObjects = useCallback(() => {
    testObjects.forEach(obj => {
      actions.removeObject(obj.type, obj.id);
    });
    setTestObjects([]);
  }, [actions, testObjects]);
  
  // Modifier un objet de test
  const modifyTestObject = useCallback((objectId, property, value) => {
    controls.updateNestedProperty(objectId, property, value);
  }, [controls]);
  
  // Tester la synchronisation
  const testSynchronization = useCallback(() => {
    console.log('🧪 Test de synchronisation...');
    
    // Modifier un objet
    if (testObjects.length > 0) {
      const obj = testObjects[0];
      modifyTestObject(obj.id, 'position', [obj.position[0] + 1, obj.position[1], obj.position[2] + 1]);
    }
    
    // Vérifier les données 2D et 3D
    const data2D = get2DData();
    const data3D = get3DData();
    
    console.log('📊 Données 2D:', data2D);
    console.log('📊 Données 3D:', data3D);
  }, [testObjects, modifyTestObject, get2DData, get3DData]);
  
  // Tester les performances
  const testPerformance = useCallback(() => {
    console.log('⚡ Test de performance...');
    
    const metrics = getPerformanceMetrics();
    setPerformanceMetrics(metrics);
    
    console.log('📈 Métriques:', metrics);
  }, [getPerformanceMetrics]);
  
  // Simulation de modifications en temps réel
  const startSimulation = useCallback(() => {
    setIsRunning(true);
    
    const interval = setInterval(() => {
      if (testObjects.length > 0) {
        const obj = testObjects[Math.floor(Math.random() * testObjects.length)];
        const newPosition = [
          obj.position[0] + (Math.random() - 0.5) * 2,
          obj.position[1],
          obj.position[2] + (Math.random() - 0.5) * 2
        ];
        
        modifyTestObject(obj.id, 'position', newPosition);
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
      setIsRunning(false);
    };
  }, [testObjects, modifyTestObject]);
  
  // Arrêter la simulation
  const stopSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  // Mettre à jour les métriques de performance
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = getPerformanceMetrics();
      setPerformanceMetrics(metrics);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [getPerformanceMetrics]);
  
  // Rendu des contrôles de test
  const renderTestControls = () => (
    <div className="test-controls">
      <h3>🧪 Contrôles de test</h3>
      
      <div className="test-buttons">
        <button onClick={createTestObjects} disabled={testObjects.length > 0}>
          ➕ Créer objets de test
        </button>
        
        <button onClick={removeTestObjects} disabled={testObjects.length === 0}>
          ➖ Supprimer objets de test
        </button>
        
        <button onClick={testSynchronization} disabled={testObjects.length === 0}>
          🔄 Tester synchronisation
        </button>
        
        <button onClick={testPerformance}>
          ⚡ Tester performance
        </button>
        
        <button 
          onClick={isRunning ? stopSimulation : startSimulation}
          className={isRunning ? 'running' : ''}
        >
          {isRunning ? '⏹️ Arrêter simulation' : '▶️ Démarrer simulation'}
        </button>
      </div>
      
      <div className="test-info">
        <p>Objets de test: {testObjects.length}</p>
        <p>Mode de vue: {state.viewMode}</p>
        <p>Objet sélectionné: {state.selectedObject?.id || 'Aucun'}</p>
      </div>
    </div>
  );
  
  // Rendu des métriques de performance
  const renderPerformanceMetrics = () => {
    if (!performanceMetrics) return null;
    
    return (
      <div className="performance-metrics">
        <h3>📊 Métriques de performance</h3>
        
        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Renders:</span>
            <span className="metric-value">{performanceMetrics.renderCount}</span>
          </div>
          
          <div className="metric">
            <span className="metric-label">Temps render:</span>
            <span className="metric-value">{performanceMetrics.lastRenderTime.toFixed(2)}ms</span>
          </div>
          
          <div className="metric">
            <span className="metric-label">Mémoire:</span>
            <span className="metric-value">
              {performanceMetrics.memoryUsage ? 
                (performanceMetrics.memoryUsage / 1024 / 1024).toFixed(1) + 'MB' : 
                'N/A'
              }
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  // Rendu des données d'état
  const renderStateData = () => (
    <div className="state-data">
      <h3>📋 Données d'état</h3>
      
      <div className="data-sections">
        <div className="data-section">
          <h4>Plan Data</h4>
          <pre>{JSON.stringify(state.planData, null, 2)}</pre>
        </div>
        
        <div className="data-section">
          <h4>View Params</h4>
          <pre>{JSON.stringify(state.viewParams, null, 2)}</pre>
        </div>
        
        <div className="data-section">
          <h4>Sync State</h4>
          <pre>{JSON.stringify(state.syncState, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="unified-system-example">
      <header className="example-header">
        <h1>🧪 Exemple du système unifié 2D/3D</h1>
        <p>Démonstration des fonctionnalités de synchronisation et d'optimisation</p>
      </header>
      
      <main className="example-main">
        <div className="example-sidebar">
          {renderTestControls()}
          {renderPerformanceMetrics()}
        </div>
        
        <div className="example-content">
          <div className="view-controls">
            <button
              className={`view-button ${state.viewMode === '2d' ? 'active' : ''}`}
              onClick={() => actions.setViewMode('2d')}
            >
              🗺️ Vue 2D
            </button>
            <button
              className={`view-button ${state.viewMode === '3d' ? 'active' : ''}`}
              onClick={() => actions.setViewMode('3d')}
            >
              🧊 Vue 3D
            </button>
          </div>
          
          <div className="view-area">
            {state.viewMode === '2d' ? (
              <div className="view-2d-placeholder">
                <h2>Vue 2D</h2>
                <p>Canvas 2D avec objets synchronisés</p>
                <div className="objects-list">
                  {Object.values(state.planData).flat().map(obj => (
                    <div key={obj.id} className="object-item">
                      <span className="object-type">{obj.type}</span>
                      <span className="object-position">
                        [{obj.position[0].toFixed(1)}, {obj.position[2].toFixed(1)}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="view-3d-placeholder">
                <h2>Vue 3D</h2>
                <p>Canvas 3D avec objets synchronisés</p>
                <div className="objects-list">
                  {Object.values(state.planData).flat().map(obj => (
                    <div key={obj.id} className="object-item">
                      <span className="object-type">{obj.type}</span>
                      <span className="object-position">
                        [{obj.position[0].toFixed(1)}, {obj.position[2].toFixed(1)}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {state.selectedObject && (
            <div className="object-controls">
              <UnifiedObjectControls
                objectId={state.selectedObject.id}
                objectType={state.selectedObject.type}
                compact={true}
              />
            </div>
          )}
        </div>
      </main>
      
      <footer className="example-footer">
        {renderStateData()}
      </footer>
    </div>
  );
}

// Composant principal avec provider
function UnifiedSystemExample() {
  return (
    <UnifiedStateProvider>
      <UnifiedSystemExampleContent />
    </UnifiedStateProvider>
  );
}

export default UnifiedSystemExample;
