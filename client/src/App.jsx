import { useState } from 'react';
import { FaBug } from 'react-icons/fa';
import Navigation from './components/Navigation';
import ArbusteDetail from './components/ArbusteDetail';
import Comparateur from './components/Comparateur';
import Disclaimer from './components/Disclaimer';
import ModeSelector from './components/ModeSelector';
import LogViewer from './components/LogViewer';
import plantesData from './data/arbustesData';
import './App.css';

function App() {
  const [selectedPlante, setSelectedPlante] = useState(plantesData[0]);
  const [mode, setMode] = useState('normal'); // 'normal', 'comparaison', ou 'planification'
  const [menuOpen, setMenuOpen] = useState(true);
  const [disclaimerClosed, setDisclaimerClosed] = useState(false);
  const [logViewerOpen, setLogViewerOpen] = useState(false);

  const handleSelectPlante = (planteId) => {
    const plante = plantesData.find(p => p.id === planteId);
    if (plante) {
      setSelectedPlante(plante);
    }
  };

  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
  };

  const handleDisclaimerClose = () => {
    setDisclaimerClosed(true);
  };

  return (
    <div className="app">
      
      {/* Sélecteur de mode unifié */}
      <ModeSelector 
        modeActuel={mode}
        onModeChange={setMode}
      />

      {mode === 'normal' ? (
        // Mode Normal - Fiches détaillées
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
        // Mode Comparaison ou Planification
        <main className="content full-width">
          <Comparateur 
            plantes={plantesData} 
            preselectedPlante={selectedPlante}
            modePlanification={mode === 'planification'}
          />
        </main>
      )}

      <Disclaimer 
        onClose={handleDisclaimerClose} 
        onOpenLogs={() => setLogViewerOpen(true)}
      />

      {/* Log Viewer (debug) */}
      <LogViewer 
        isOpen={logViewerOpen}
        onClose={() => setLogViewerOpen(false)}
      />
    </div>
  );
}

export default App;
