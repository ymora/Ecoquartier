import { useState, lazy, Suspense, useCallback } from 'react';
import Navigation from './components/Navigation';
import Disclaimer from './components/Disclaimer';
import ModeSelector from './components/ModeSelector';
import ModernHeader from './components/ModernHeader';
import LogViewer from './components/LogViewer';
import ThemeToggle from './components/ThemeToggle';
import NeoApp from './components/neo/NeoApp';
import NeoTimeline from './components/neo/NeoTimeline';
import ErrorBoundary from './components/ErrorBoundary';
import plantesData from './data/arbustesData';
import './styles/theme.css';
import './styles/theme-dark.css';
import './styles/neo-garden.css';
import './App.css';


// 🚀 Lazy loading des composants lourds pour optimiser le chargement initial
const ArbusteDetail = lazy(() => import('./components/ArbusteDetail'));
const Comparateur = lazy(() => import('./components/Comparateur'));

// Fallback de chargement élégant
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#4caf50',
      fontWeight: '500'
    }}>
      <div>⏳ Chargement...</div>
    </div>
  );
}

function App() {
  const [selectedPlante, setSelectedPlante] = useState(plantesData[0]); // Premier arbre par défaut
  const [mode, setMode] = useState('normal'); // 'normal', 'comparaison', ou 'planification'
  const [menuOpen, setMenuOpen] = useState(true);
  const [disclaimerClosed, setDisclaimerClosed] = useState(false);
  const [logViewerOpen, setLogViewerOpen] = useState(false);
  const [useNeoGarden, setUseNeoGarden] = useState(true); // Toggle interface Neo Garden
  
  // États pour le planificateur Neo
  const [anneeProjection, setAnneeProjection] = useState(0);
  const [heureJournee, setHeureJournee] = useState(90);
  const [saison, setSaison] = useState('ete');
  const [mode3D, setMode3D] = useState(false);

  // 🚀 Optimisation : useCallback pour éviter les re-renders inutiles
  const handleSelectPlante = useCallback((planteId) => {
    const plante = plantesData.find(p => p.id === planteId);
    if (plante) {
      setSelectedPlante(plante);
    }
  }, []); // Pas de dépendances : plantesData est constant

  const handleMenuToggle = useCallback((isOpen) => {
    setMenuOpen(isOpen);
  }, []);

  const handleDisclaimerClose = useCallback(() => {
    setDisclaimerClosed(true);
  }, []);

  // Rendu avec Neo Garden (mode planification uniquement)
  if (mode === 'planification' && useNeoGarden) {
    return (
      <ErrorBoundary>
        <NeoApp
          currentMode={mode}
          onModeChange={setMode}
          sidebarContent={
            <div style={{ padding: '1rem', color: '#d4d4d4' }}>
              <p style={{ fontSize: '12px', marginBottom: '1rem' }}>Panneau en construction...</p>
            </div>
          }
          canvasContent={
            <Suspense fallback={<LoadingFallback />}>
              <Comparateur 
                plantes={plantesData} 
                preselectedPlante={selectedPlante}
                modePlanification={true}
              />
            </Suspense>
          }
          timelineProps={{
            anneeProjection,
            onAnneeChange: setAnneeProjection,
            heureJournee,
            onHeureChange: setHeureJournee,
            saison,
            onSaisonChange: setSaison,
            mode3D,
            onToggleMode3D: (is3D) => setMode3D(is3D),
            onRecentrer: () => console.log('Recentrer')
          }}
          showTimeline={true}
        />

        <LogViewer 
          isOpen={logViewerOpen}
          onClose={() => setLogViewerOpen(false)}
        />
      </ErrorBoundary>
    );
  }

  // Rendu classique pour les autres modes
  return (
    <ErrorBoundary>
      <div className="app">
      
      {/* Nouvelle interface moderne (optionnelle) */}
      {useNeoGarden ? (
        <ModernHeader 
          currentMode={mode}
          onModeChange={setMode}
        />
      ) : (
        /* Sélecteur de mode classique */
        <ModeSelector 
          modeActuel={mode}
          onModeChange={setMode}
        />
      )}

      {/* 🚀 Suspense pour gérer le lazy loading */}
      <Suspense fallback={<LoadingFallback />}>
        {mode === 'normal' ? (
          // Mode Normal - Fiches détaillées
          selectedPlante ? (
            <div className="main-layout">
              <Navigation 
                plantes={plantesData}
                selectedId={selectedPlante.id}
                onSelect={handleSelectPlante}
                onMenuToggle={handleMenuToggle}
                disclaimerClosed={disclaimerClosed}
              />
              <main className={`content ${menuOpen ? 'menu-open' : ''}`}>
                <ArbusteDetail arbuste={selectedPlante} menuOpen={menuOpen} />
              </main>
            </div>
          ) : (
            <div className="main-layout">
              <Navigation 
                plantes={plantesData}
                selectedId={null}
                onSelect={handleSelectPlante}
                onMenuToggle={handleMenuToggle}
                disclaimerClosed={disclaimerClosed}
              />
              <main className="content">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h2>🌳 Les Haies de l'Écocartier de Bessancourt</h2>
                  <p>Sélectionnez un arbre ou un arbuste pour commencer</p>
                </div>
              </main>
            </div>
          )
        ) : (
          // Mode Comparaison ou Planification
          <main className="content full-width">
            <Comparateur 
              plantes={plantesData} 
              preselectedPlante={selectedPlante}
              modePlanification={mode === 'planification'}
            />
          </main>
        )}
      </Suspense>

      <Disclaimer 
        onClose={handleDisclaimerClose} 
        onOpenLogs={() => setLogViewerOpen(true)}
      />

      {/* Log Viewer (debug) */}
      <LogViewer 
        isOpen={logViewerOpen}
        onClose={() => setLogViewerOpen(false)}
      />

      {/* Bouton toggle thème sombre/clair (seulement en mode classique) */}
      {!useNeoGarden && <ThemeToggle />}
    </div>
    </ErrorBoundary>
  );
}

export default App;
