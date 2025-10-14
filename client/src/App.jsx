import { useState } from 'react';
import { FaExchangeAlt, FaEye } from 'react-icons/fa';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ArbusteDetail from './components/ArbusteDetail';
import Comparateur from './components/Comparateur';
import Disclaimer from './components/Disclaimer';
import plantesData from './data/arbustesData';
import './App.css';

function App() {
  const [selectedPlante, setSelectedPlante] = useState(plantesData[0]);
  const [modeComparaison, setModeComparaison] = useState(false);

  const handleSelectPlante = (planteId) => {
    const plante = plantesData.find(p => p.id === planteId);
    if (plante) {
      setSelectedPlante(plante);
    }
  };

  const toggleModeComparaison = () => {
    setModeComparaison(!modeComparaison);
  };

  return (
    <div className="app">
      <Disclaimer />
      
      <Header />
      
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
            <Comparateur 
              plantes={plantesData}
              onClose={() => setModeComparaison(false)}
            />
          </main>
        </div>
      ) : (
        // Mode Normal
        <div className="main-layout">
          <Navigation 
            plantes={plantesData}
            selectedId={selectedPlante.id}
            onSelect={handleSelectPlante}
          />
          <main className="content">
            <ArbusteDetail arbuste={selectedPlante} />
          </main>
        </div>
      )}

      <footer className="footer">
        <p>&copy; 2025 Les Haies de l'Écocartier de Bessancourt. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

export default App;
