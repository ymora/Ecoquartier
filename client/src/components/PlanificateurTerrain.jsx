import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import CanvasTerrain from './CanvasTerrain';
import OnboardingPlanificateur from './OnboardingPlanificateur';
import './PlanificateurTerrain.css';

function PlanificateurTerrain({ plantes, arbresPreselectionnes = [], onClose }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Vérifier si l'utilisateur a déjà vu l'onboarding
  useEffect(() => {
    const dejavu = localStorage.getItem('planificateur_onboarding_vu');
    if (!dejavu) {
      setShowOnboarding(true);
    }
  }, []);
  const [dimensions, setDimensions] = useState({ largeur: 30, hauteur: 30 });
  const [orientation, setOrientation] = useState('nord-haut');
  const [plan, setPlan] = useState(null);
  const [arbresSelectionnes] = useState(arbresPreselectionnes.length > 0 ? arbresPreselectionnes : [plantes[0]]);

  const handlePlanComplete = (planData) => {
    setPlan(planData);
  };

  return (
    <>
      {/* Onboarding au premier lancement */}
      {showOnboarding && (
        <OnboardingPlanificateur onClose={() => setShowOnboarding(false)} />
      )}
      
      <div className="planificateur-modal-overlay" onClick={onClose}>
        <div className="planificateur-modal" onClick={(e) => e.stopPropagation()}>
        {/* En-tête simplifié */}
        <div className="planificateur-header-compact">
          <h2>📐 Planificateur de Terrain</h2>
          
          <div className="arbres-badges-inline">
            {arbresSelectionnes.map((arbre, index) => (
              <span key={index} className="arbre-badge-mini">
                {arbre.name}
              </span>
            ))}
          </div>

                <div className="validation-legend">
                   <span className="legend-item"><span className="dot green"></span> ✅ Conforme</span>
                   <span className="legend-item"><span className="dot orange"></span> ⚠️ Attention</span>
                   <span className="legend-item"><span className="dot red"></span> ⚖️ Illégal (voisinage/Code Civil)</span>
                 </div>

                <button 
                  className="help-btn" 
                  onClick={() => setShowOnboarding(true)}
                  aria-label="Aide"
                  title="Afficher l'aide"
                >
                  ❓
                </button>
                
                <button className="close-btn" onClick={onClose} aria-label="Fermer">
                  <FaTimes />
                </button>
        </div>

        {/* Contenu - Un seul écran avec validation en temps réel */}
        <div className="planificateur-content">
          <CanvasTerrain
            dimensions={dimensions}
            orientation={orientation}
            onDimensionsChange={setDimensions}
            onOrientationChange={setOrientation}
            onPlanComplete={handlePlanComplete}
            arbresAPlanter={arbresSelectionnes}
          />
        </div>
      </div>
      </div>
    </>
  );
}

export default PlanificateurTerrain;

