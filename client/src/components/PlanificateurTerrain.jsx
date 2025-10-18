import { useState } from 'react';
import { FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import CanvasTerrain from './CanvasTerrain';
import ResultatsPlanification from './ResultatsPlanification';
import './PlanificateurTerrain.css';

function PlanificateurTerrain({ plantes, arbresPreselectionnes = [], onClose }) {
  // Si arbres présélectionnés, commencer à l'étape 1 (Plan), sinon erreur
  const [etape, setEtape] = useState(1); // 1: Plan (avec arbres), 2: Résultats
  const [dimensions, setDimensions] = useState({ largeur: 30, hauteur: 30 });
  const [orientation, setOrientation] = useState('nord-haut');
  const [plan, setPlan] = useState(null);
  const [arbresSelectionnes] = useState(arbresPreselectionnes.length > 0 ? arbresPreselectionnes : [plantes[0]]);
  const [suggestions, setSuggestions] = useState([]);

  const handlePlanComplete = (planData) => {
    setPlan(planData);
  };

  const passerEtapeAnalyse = () => {
    if (plan) {
      setEtape(2);
    } else {
      alert('Veuillez d\'abord dessiner votre terrain');
    }
  };

  const retourPlan = () => {
    setEtape(1);
  };

  const resetPlanificateur = () => {
    setEtape(1);
    setPlan(null);
    setSuggestions([]);
  };

  return (
    <div className="planificateur-modal-overlay" onClick={onClose}>
      <div className="planificateur-modal" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="planificateur-header">
          <h2>📐 Planificateur de terrain</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            <FaTimes />
          </button>
        </div>

        {/* Barre compacte : Arbres + Étapes sur une seule ligne */}
        <div className="arbres-selectionnes-info">
          <div className="arbres-section">
            <h4>🌳 Arbres ({arbresSelectionnes.length}) :</h4>
            <div className="arbres-badges">
              {arbresSelectionnes.map((arbre, index) => (
                <span key={index} className="arbre-badge">
                  {arbre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Indicateur d'étapes intégré */}
          <div className="etapes-indicator">
            <div className={`etape ${etape >= 1 ? 'active' : ''} ${etape > 1 ? 'complete' : ''}`}>
              <div className="etape-numero">1</div>
              <div className="etape-label">Dessiner & Placer</div>
            </div>
            <div className="etape-ligne"></div>
            <div className={`etape ${etape >= 2 ? 'active' : ''}`}>
              <div className="etape-numero">2</div>
              <div className="etape-label">Analyse</div>
            </div>
          </div>
        </div>

        {/* Contenu selon l'étape */}
        <div className="planificateur-content">
          {/* Étape 1 - Dessiner le plan et placer les arbres manuellement */}
          <div style={{ display: etape === 1 ? 'block' : 'none' }}>
            <CanvasTerrain
              dimensions={dimensions}
              orientation={orientation}
              onDimensionsChange={setDimensions}
              onOrientationChange={setOrientation}
              onPlanComplete={handlePlanComplete}
              arbresAPlanter={arbresSelectionnes}
            />
          </div>

          {/* Étape 2 - Analyse et suggestions */}
          {etape === 2 && (
            <ResultatsPlanification
              plan={plan}
              arbres={arbresSelectionnes}
              dimensions={dimensions}
              orientation={orientation}
              onSuggestionsCalculees={setSuggestions}
            />
          )}
        </div>

        {/* Boutons de navigation */}
        <div className="planificateur-footer">
          {etape > 1 && (
            <button className="btn-secondary" onClick={retourPlan}>
              <FaArrowLeft /> Modifier le plan
            </button>
          )}
          
          <div className="footer-spacer"></div>

          {etape === 1 && (
            <button className="btn-primary" onClick={passerEtapeAnalyse}>
              Analyser <FaArrowRight />
            </button>
          )}

          {etape === 2 && (
            <button className="btn-secondary" onClick={resetPlanificateur}>
              🔄 Nouveau plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanificateurTerrain;

