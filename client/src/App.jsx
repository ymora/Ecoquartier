import { useState } from 'react';
import { FaExchangeAlt, FaEye, FaMapMarkedAlt, FaBug } from 'react-icons/fa';
import Navigation from './components/Navigation';
import ArbusteDetail from './components/ArbusteDetail';
import Comparateur from './components/Comparateur';
import Disclaimer from './components/Disclaimer';
import PlanificateurTerrain from './components/PlanificateurTerrain';
import LogViewer from './components/LogViewer';
import plantesData from './data/arbustesData';
import './App.css';

function App() {
  const [selectedPlante, setSelectedPlante] = useState(plantesData[0]);
  const [modeComparaison, setModeComparaison] = useState(false);
  const [modePlanification, setModePlanification] = useState(false); // Planification au lieu de tableau comparaison
  const [menuOpen, setMenuOpen] = useState(true);
  const [disclaimerClosed, setDisclaimerClosed] = useState(false); // Toujours false au départ
  const [arbresComparaison, setArbresComparaison] = useState([]); // Arbres sélectionnés en mode comparaison
  const [logViewerOpen, setLogViewerOpen] = useState(false); // Journal des logs

  const handleSelectPlante = (planteId) => {
    const plante = plantesData.find(p => p.id === planteId);
    if (plante) {
      setSelectedPlante(plante);
    }
  };

  const toggleModeComparaison = () => {
    setModeComparaison(!modeComparaison);
  };

  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
  };

  const handleDisclaimerClose = () => {
    setDisclaimerClosed(true);
  };

  return (
    <div className="app">
      
      {/* Boutons de bascule Mode */}
      <button 
        className="mode-toggle"
        onClick={toggleModeComparaison}
        aria-label={modeComparaison ? "Mode normal" : "Mode comparaison"}
      >
        {modeComparaison ? (
          <>
            <FaEye /> Mode Normal
          </>
        ) : (
          <>
            <FaExchangeAlt /> Comparer
          </>
        )}
      </button>

      {/* Bouton Planifier visible uniquement en mode comparaison */}
      {modeComparaison && (
        <button 
          className="mode-toggle planificateur-toggle"
          onClick={() => setModePlanification(!modePlanification)}
          aria-label={modePlanification ? "Voir tableau" : "Planifier mon terrain"}
        >
          {modePlanification ? (
            <>
              <FaExchangeAlt /> Tableau
            </>
          ) : (
            <>
              <FaMapMarkedAlt /> Planifier
            </>
          )}
        </button>
      )}

      {/* Bouton Logs (debug) */}
      <button 
        className="mode-toggle logs-toggle"
        onClick={() => setLogViewerOpen(true)}
        aria-label="Voir les logs (debug)"
        title="Journal des logs (debug)"
      >
        <FaBug />
      </button>

      {modeComparaison ? (
        // Mode Comparaison (tableau ou planification)
        <main className="content full-width">
          <Comparateur 
            plantes={plantesData} 
            preselectedPlante={selectedPlante}
            onArbresSelectionnes={setArbresComparaison}
            modePlanification={modePlanification}
          />
        </main>
      ) : (
        // Mode Normal
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
      )}

      <Disclaimer onClose={handleDisclaimerClose} />

      {/* Log Viewer (debug) */}
      <LogViewer 
        isOpen={logViewerOpen}
        onClose={() => setLogViewerOpen(false)}
      />
    </div>
  );
}

export default App;
