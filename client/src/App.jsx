/**
 * Application principale - Interface Neo Garden complète
 * Thème sombre professionnel appliqué à tout le site
 */
import { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import NeoApp from './components/neo/NeoApp';
import NeoPlantSelector from './components/neo/NeoPlantSelector';
import NeoModeIndicator from './components/neo/NeoModeIndicator';
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
  const [mode, setMode] = useState('explorer'); // Mode unifié : 'explorer' ou 'planification'
  const [selectedPlantes, setSelectedPlantes] = useState([plantesData[0]]); // Toujours un tableau
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

  // Callbacks optimisés - Un seul callback pour gérer la sélection
  const handleTogglePlante = useCallback((plante) => {
    setSelectedPlantes(prev => {
      const exists = prev.find(p => p.id === plante.id);
      if (exists) {
        // Si déjà sélectionné, on retire
        const newSelection = prev.filter(p => p.id !== plante.id);
        // Garder au moins 1 plante sélectionnée
        return newSelection.length > 0 ? newSelection : [plante];
      }
      // Ajouter à la sélection
      return [...prev, plante];
    });
  }, []);

  const handleRecentrer = useCallback(() => {
    console.log('Recentrer la vue');
    // TODO: Implémenter recentrage canvas
  }, []);

  // Rendu de la sidebar selon le mode
  const renderSidebar = () => {
    if (mode === 'explorer') {
      return (
        <NeoPlantSelector
          plantes={plantesData}
          selectedPlante={selectedPlantes[0]} // Première plante
          selectedPlantes={selectedPlantes}
          onSelectPlante={(planteId) => {
            const plante = plantesData.find(p => p.id === planteId);
            if (plante) setSelectedPlantes([plante]); // Sélection unique
          }}
          onTogglePlante={handleTogglePlante}
          multiSelect={true} // Toujours multi-sélection
          collapsed={selectorCollapsed}
          onToggleCollapse={() => setSelectorCollapsed(!selectorCollapsed)}
        />
      );
    }
    return null; // Pas de sidebar en mode planification
  };

  // Rendu du contenu selon le mode
  const renderContent = () => {
    if (mode === 'explorer') {
      // Mode Explorer - Intelligent : Fiche si 1 plante, Tableau si 2+
      return (
        <Suspense fallback={<LoadingFallback />}>
          <div className="neo-content-full">
            {selectedPlantes.length === 1 ? (
              // Vue Fiche Détaillée (1 plante)
              <ArbusteDetail arbuste={selectedPlantes[0]} menuOpen={false} />
            ) : (
              // Vue Tableau Comparatif (2+ plantes)
              <Comparateur 
                plantes={selectedPlantes} 
                preselectedPlante={selectedPlantes[0]}
                modePlanification={false}
              />
            )}
          </div>
        </Suspense>
      );

    } else if (mode === 'planification') {
      // Mode Planificateur avec timeline
      return (
        <div className="neo-planificateur-wrapper">
          <Suspense fallback={<LoadingFallback />}>
            <Comparateur 
              plantes={plantesData} 
              preselectedPlante={selectedPlantes[0]}
              modePlanification={true}
            />
          </Suspense>
        </div>
      );
    }
    
    return <LoadingFallback />;
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
