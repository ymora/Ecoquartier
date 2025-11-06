/**
 * Application principale - Interface Neo Garden complète
 * Thème sombre professionnel appliqué à tout le site
 */
import { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import NeoApp from './components/neo/NeoApp';
import NeoPlantSelector from './components/neo/NeoPlantSelector';
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
  const [selectedPlantes, setSelectedPlantes] = useState([]); // Pour le comparateur
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [selectorCollapsed, setSelectorCollapsed] = useState(false);
  
  // États planificateur
  const [anneeProjection, setAnneeProjection] = useState(0);
  const [heureJournee, setHeureJournee] = useState(90);
  const [saison, setSaison] = useState('ete');
  const [mode3D, setMode3D] = useState(false);
  
  // Appliquer le thème Neo Garden au body
  useEffect(() => {
    document.body.classList.add('neo-theme');
    
    // Écouter l'événement pour ouvrir les logs
    const handleOpenLogs = () => setLogViewerOpen(true);
    window.addEventListener('openLogViewer', handleOpenLogs);
    
    return () => {
      document.body.classList.remove('neo-theme');
      window.removeEventListener('openLogViewer', handleOpenLogs);
    };
  }, []);

  // Callbacks optimisés
  const handleSelectPlante = useCallback((planteId) => {
    const plante = plantesData.find(p => p.id === planteId);
    if (plante) {
      setSelectedPlante(plante);
    }
  }, []);

  const handleTogglePlante = useCallback((plante) => {
    setSelectedPlantes(prev => {
      const exists = prev.find(p => p.id === plante.id);
      if (exists) {
        return prev.filter(p => p.id !== plante.id);
      }
      return [...prev, plante];
    });
  }, []);

  const handleRecentrer = useCallback(() => {
    console.log('Recentrer la vue');
    // TODO: Implémenter recentrage canvas
  }, []);

  // Rendu de la sidebar selon le mode
  const renderSidebar = () => {
    switch (mode) {
      case 'normal':
      case 'comparaison':
        return (
          <NeoPlantSelector
            plantes={plantesData}
            selectedPlante={selectedPlante}
            selectedPlantes={selectedPlantes}
            onSelectPlante={handleSelectPlante}
            onTogglePlante={handleTogglePlante}
            multiSelect={mode === 'comparaison'}
            collapsed={selectorCollapsed}
            onToggleCollapse={() => setSelectorCollapsed(!selectorCollapsed)}
          />
        );
      case 'planification':
        return null; // Pas de sidebar en mode planification
      default:
        return null;
    }
  };

  // Rendu du contenu selon le mode
  const renderContent = () => {
    switch (mode) {
      case 'normal':
        // Mode Fiches Détaillées - Sidebar gérée séparément
        return (
          <Suspense fallback={<LoadingFallback />}>
            <div className="neo-content-full">
              <ArbusteDetail arbuste={selectedPlante} menuOpen={false} />
            </div>
          </Suspense>
        );

      case 'comparaison':
        // Mode Comparateur - Sidebar gérée séparément
        return (
          <Suspense fallback={<LoadingFallback />}>
            <div className="neo-content-full">
              <Comparateur 
                plantes={selectedPlantes.length > 0 ? selectedPlantes : plantesData} 
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
        sidebarContent={renderSidebar()}
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
