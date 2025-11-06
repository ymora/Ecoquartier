/**
 * Application principale - Interface Neo Garden complète
 * Thème sombre professionnel appliqué à tout le site
 */
import { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import NeoApp from './components/neo/NeoApp';
import NeoTimeline from './components/neo/NeoTimeline';
import LogViewer from './components/LogViewer';
import ErrorBoundary from './components/ErrorBoundary';
import plantesData from './data/arbustesData';
import useLocalStorage from './hooks/useLocalStorage';
import './styles/neo-garden.css';
import './App.css';

// Lazy loading des composants lourds
const ArbusteDetail = lazy(() => import('./components/ArbusteDetail'));
const Comparateur = lazy(() => import('./components/Comparateur'));

// Fallback de chargement
function LoadingFallback() {
  return (
    <div className="neo-loading">
      <div className="neo-loading-spinner"></div>
      <div className="neo-loading-text">Chargement...</div>
    </div>
  );
}

function App() {
  // États principaux
  const [mode, setMode] = useState('normal');
  const [selectedPlante, setSelectedPlante] = useState(plantesData[0]);
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  
  // États planificateur
  const [anneeProjection, setAnneeProjection] = useState(0);
  const [heureJournee, setHeureJournee] = useState(90);
  const [saison, setSaison] = useState('ete');
  const [mode3D, setMode3D] = useState(false);
  
  // Appliquer le thème Neo Garden au body
  useEffect(() => {
    document.body.classList.add('neo-theme');
    return () => document.body.classList.remove('neo-theme');
  }, []);

  // Callbacks optimisés
  const handleSelectPlante = useCallback((planteId) => {
    const plante = plantesData.find(p => p.id === planteId);
    if (plante) {
      setSelectedPlante(plante);
    }
  }, []);

  const handleRecentrer = useCallback(() => {
    console.log('Recentrer la vue');
    // TODO: Implémenter recentrage canvas
  }, []);

  // Rendu du contenu selon le mode
  const renderContent = () => {
    switch (mode) {
      case 'normal':
        // Mode Fiches Détaillées
        return (
          <Suspense fallback={<LoadingFallback />}>
            <div className="neo-fiches-container">
              <div className="neo-fiches-sidebar">
                {plantesData.map(plante => (
                  <button
                    key={plante.id}
                    className={`neo-sidebar-item ${selectedPlante?.id === plante.id ? 'active' : ''}`}
                    onClick={() => handleSelectPlante(plante.id)}
                  >
                    <span className="neo-sidebar-icon">
                      {plante.type === 'arbre' ? '🌳' : '🌿'}
                    </span>
                    <span>{plante.name}</span>
                  </button>
                ))}
              </div>
              <div className="neo-fiches-content">
                <ArbusteDetail arbuste={selectedPlante} menuOpen={false} />
              </div>
            </div>
          </Suspense>
        );

      case 'comparaison':
        // Mode Comparateur
        return (
          <Suspense fallback={<LoadingFallback />}>
            <div className="neo-comparateur-wrapper">
              <Comparateur 
                plantes={plantesData} 
                preselectedPlante={selectedPlante}
                modePlanification={false}
              />
            </div>
          </Suspense>
        );

      case 'planification':
        // Mode Planificateur avec timeline
        return (
          <div className="neo-planificateur-wrapper">
            <Suspense fallback={<LoadingFallback />}>
              <Comparateur 
                plantes={plantesData} 
                preselectedPlante={selectedPlante}
                modePlanification={true}
              />
            </Suspense>
          </div>
        );

      default:
        return <LoadingFallback />;
    }
  };

  return (
    <ErrorBoundary>
      <NeoApp
        currentMode={mode}
        onModeChange={setMode}
        sidebarContent={null}
        canvasContent={renderContent()}
        timelineProps={mode === 'planification' ? {
          anneeProjection,
          onAnneeChange: setAnneeProjection,
          heureJournee,
          onHeureChange: setHeureJournee,
          saison,
          onSaisonChange: setSaison,
          mode3D,
          onToggleMode3D: (is3D) => setMode3D(is3D),
          onRecentrer: handleRecentrer
        } : null}
        showTimeline={mode === 'planification'}
      />

      {/* Log Viewer (debug) */}
      <LogViewer 
        isOpen={logViewerOpen}
        onClose={() => setLogViewerOpen(false)}
      />
    </ErrorBoundary>
  );
}

export default App;
