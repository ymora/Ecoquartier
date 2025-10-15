import { useState } from 'react';
import { FaExchangeAlt, FaEye } from 'react-icons/fa';
import Navigation from './components/Navigation';
import ArbusteDetail from './components/ArbusteDetail';
import Comparateur from './components/Comparateur';
import Disclaimer from './components/Disclaimer';
import plantesData from './data/arbustesData';
import './App.css';

function App() {
  const [selectedPlante, setSelectedPlante] = useState(plantesData[0]);
  const [modeComparaison, setModeComparaison] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [disclaimerClosed, setDisclaimerClosed] = useState(false); // Toujours false au départ

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
      
      {/* Bouton de bascule Mode */}
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

      {modeComparaison ? (
        // Mode Comparaison
        <div className="main-layout">
          <main className="content full-width">
            <Comparateur plantes={plantesData} />
          </main>
        </div>
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
    </div>
  );
}

export default App;
