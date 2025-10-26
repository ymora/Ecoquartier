import { useState, useCallback, useMemo, useEffect } from 'react';
import { UnifiedStateProvider } from '../contexts/UnifiedStateContext';
import { useUnifiedState } from '../contexts/UnifiedStateContext';
import { useUnifiedObjectControls } from '../hooks/useUnifiedObjectControls';
import { useUnifiedRendering } from '../hooks/useUnifiedRendering';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
import UnifiedObjectControls from './UnifiedObjectControls';
import UnifiedSyncManager from './UnifiedSyncManager';
import CanvasTerrain from './CanvasTerrain';
import CanvasTerrain3D from './CanvasTerrain3D';
import PanneauLateral from './PanneauLateral';
import './UnifiedApplication.css';

/**
 * Composant principal unifié pour l'application 2D/3D
 * Intègre tous les systèmes de synchronisation et d'optimisation
 */

function UnifiedApplicationContent() {
  const { state, actions } = useUnifiedState();
  const { controls } = useUnifiedObjectControls();
  const { get2DData, get3DData, getViewParams } = useUnifiedRendering();
  const { createThrottledFunction, shouldRender } = usePerformanceOptimization();
  
  // États locaux
  const [canvas2D, setCanvas2D] = useState(null);
  const [canvas3D, setCanvas3D] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Données formatées pour les vues
  const data2D = useMemo(() => get2DData(), [get2DData]);
  const data3D = useMemo(() => get3DData(), [get3DData]);
  const viewParams = useMemo(() => getViewParams(), [getViewParams]);
  
  // Gestion des erreurs
  const handleError = useCallback((error) => {
    console.error('❌ Erreur application unifiée:', error);
    setError(error.message);
  }, []);
  
  // Gestion du chargement
  const handleLoading = useCallback((loading) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
    }
  }, []);
  
  // Changement de vue
  const handleViewModeChange = useCallback((mode) => {
    actions.setViewMode(mode);
  }, [actions]);
  
  // Gestion des objets
  const handleObjectSelection = useCallback((object) => {
    if (object) {
      controls.selectObject(object.id);
    } else {
      controls.deselectObject();
    }
  }, [controls]);
  
  // Gestion des propriétés d'objets
  const handleObjectPropertyChange = useCallback((objectId, property, value) => {
    controls.updateNestedProperty(objectId, property, value);
  }, [controls]);
  
  // Synchronisation 2D → 3D
  const handleSync2DTo3D = useCallback((canvasData) => {
    console.log('🔄 Synchronisation 2D → 3D');
    // La synchronisation est gérée par UnifiedSyncManager
  }, []);
  
  // Synchronisation 3D → 2D
  const handleSync3DTo2D = useCallback((data3D) => {
    console.log('🔄 Synchronisation 3D → 2D');
    // La synchronisation est gérée par UnifiedSyncManager
  }, []);
  
  // Gestion des paramètres de vue
  const handleViewParamsChange = useCallback((params) => {
    actions.setViewParams(params);
  }, [actions]);
  
  // Gestion des animations
  const handleAnimationChange = useCallback((animationState) => {
    actions.setAnimationState(animationState);
  }, [actions]);
  
  // Optimisation des re-renders
  const shouldRenderCanvas = useCallback((componentName, props) => {
    return shouldRender(componentName, props);
  }, [shouldRender]);
  
  // Throttling des fonctions coûteuses
  const throttledSync2DTo3D = useMemo(() => 
    createThrottledFunction(handleSync2DTo3D, 100), 
    [createThrottledFunction, handleSync2DTo3D]
  );
  
  const throttledSync3DTo2D = useMemo(() => 
    createThrottledFunction(handleSync3DTo2D, 100), 
    [createThrottledFunction, handleSync3DTo2D]
  );
  
  // Gestion des erreurs
  useEffect(() => {
    const handleGlobalError = (event) => {
      handleError(event.error);
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason);
    });
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, [handleError]);
  
  // Rendu conditionnel selon le mode de vue
  const renderView = useCallback(() => {
    if (state.viewMode === '3d') {
      return (
        <div className="view-container view-3d">
          <CanvasTerrain3D
            planData={data3D}
            anneeProjection={viewParams.anneeProjection}
            saison={viewParams.saison}
            heureJournee={viewParams.heureJournee}
            orientation={viewParams.orientation}
            dimensions={viewParams.dimensions}
            onObjetPositionChange={handleObjectPropertyChange}
            onObjetSelectionChange={handleObjectSelection}
            onViewParamsChange={handleViewParamsChange}
            onAnimationChange={handleAnimationChange}
            onError={handleError}
            onLoading={handleLoading}
          />
        </div>
      );
    } else {
      return (
        <div className="view-container view-2d">
          <CanvasTerrain
            planData={data2D}
            dimensions={viewParams.dimensions}
            onObjetSelectionChange={handleObjectSelection}
            onObjetPropertyChange={handleObjectPropertyChange}
            onViewParamsChange={handleViewParamsChange}
            onError={handleError}
            onLoading={handleLoading}
            onCanvasReady={setCanvas2D}
          />
        </div>
      );
    }
  }, [
    state.viewMode,
    data2D,
    data3D,
    viewParams,
    handleObjectSelection,
    handleObjectPropertyChange,
    handleViewParamsChange,
    handleAnimationChange,
    handleError,
    handleLoading
  ]);
  
  // Rendu des contrôles d'objets
  const renderObjectControls = useCallback(() => {
    if (!state.selectedObject) return null;
    
    return (
      <div className="object-controls-panel">
        <UnifiedObjectControls
          objectId={state.selectedObject.id}
          objectType={state.selectedObject.type}
          onPropertyChange={handleObjectPropertyChange}
          compact={state.viewMode === '3d'}
        />
      </div>
    );
  }, [state.selectedObject, state.viewMode, handleObjectPropertyChange]);
  
  // Rendu du panneau latéral
  const renderSidePanel = useCallback(() => {
    return (
      <div className="side-panel">
        <PanneauLateral
          canvas={canvas2D}
          dimensions={viewParams.dimensions}
          onDimensionsChange={(dims) => handleViewParamsChange({ dimensions: dims })}
          onObjetSelectionChange={handleObjectSelection}
          onObjetPropertyChange={handleObjectPropertyChange}
          onViewModeChange={handleViewModeChange}
          onError={handleError}
          onLoading={handleLoading}
        />
      </div>
    );
  }, [
    canvas2D,
    viewParams.dimensions,
    handleViewParamsChange,
    handleObjectSelection,
    handleObjectPropertyChange,
    handleViewModeChange,
    handleError,
    handleLoading
  ]);
  
  // Rendu des indicateurs de synchronisation
  const renderSyncIndicators = useCallback(() => {
    if (!state.syncState.isSyncing) return null;
    
    return (
      <div className="sync-indicators">
        <div className="sync-indicator">
          <div className="sync-spinner"></div>
          <span>Synchronisation...</span>
        </div>
      </div>
    );
  }, [state.syncState.isSyncing]);
  
  // Rendu des erreurs
  const renderError = useCallback(() => {
    if (!error) return null;
    
    return (
      <div className="error-panel">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <div className="error-message">{error}</div>
          <button 
            className="error-close"
            onClick={() => setError(null)}
          >
            ✕
          </button>
        </div>
      </div>
    );
  }, [error]);
  
  // Rendu du chargement
  const renderLoading = useCallback(() => {
    if (!isLoading) return null;
    
    return (
      <div className="loading-panel">
        <div className="loading-spinner"></div>
        <span>Chargement...</span>
      </div>
    );
  }, [isLoading]);
  
  return (
    <div className="unified-application">
      {/* En-tête avec contrôles de vue */}
      <header className="app-header">
        <div className="view-controls">
          <button
            className={`view-button ${state.viewMode === '2d' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('2d')}
          >
            🗺️ Vue 2D
          </button>
          <button
            className={`view-button ${state.viewMode === '3d' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('3d')}
          >
            🧊 Vue 3D
          </button>
        </div>
        
        <div className="app-title">
          Les Haies de l'Écocartier de Bessancourt
        </div>
        
        <div className="app-status">
          {state.syncState.isSyncing && (
            <div className="sync-status">🔄 Synchronisation</div>
          )}
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="app-main">
        {/* Panneau latéral */}
        {renderSidePanel()}
        
        {/* Zone de vue */}
        <div className="view-area">
          {renderView()}
          
          {/* Contrôles d'objets */}
          {renderObjectControls()}
        </div>
      </main>
      
      {/* Indicateurs de synchronisation */}
      {renderSyncIndicators()}
      
      {/* Gestionnaire de synchronisation */}
      <UnifiedSyncManager
        canvas2D={canvas2D}
        canvas3D={canvas3D}
        onSync2DTo3D={throttledSync2DTo3D}
        onSync3DTo2D={throttledSync3DTo2D}
        syncInterval={100}
      />
      
      {/* Panneaux d'état */}
      {renderError()}
      {renderLoading()}
    </div>
  );
}

// Composant principal avec provider
function UnifiedApplication() {
  return (
    <UnifiedStateProvider>
      <UnifiedApplicationContent />
    </UnifiedStateProvider>
  );
}

export default UnifiedApplication;
