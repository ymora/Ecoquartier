import { useState, useEffect } from 'react';
import { FaTimes, FaCube, FaMap } from 'react-icons/fa';
import CanvasTerrain from './CanvasTerrain';
import CanvasTerrain3D from './CanvasTerrain3D';
import OnboardingPlanificateur from './OnboardingPlanificateur';
import './PlanificateurTerrain.css';

function PlanificateurTerrain({ plantes, arbresPreselectionnes = [], onClose }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mode3D, setMode3D] = useState(false); // Toggle 2D/3D

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
  const [arbresSelectionnes, setArbresSelectionnes] = useState(arbresPreselectionnes.length > 0 ? arbresPreselectionnes : []);

  // Note: Logs purgés - Utiliser logger.js ou 🐛 bouton si besoin debug

  const handlePlanComplete = (planData) => {
    setPlan(planData);
  };
  
  const toggleArbre = (arbre) => {
    if (arbresSelectionnes.find(a => a.id === arbre.id)) {
      // Retirer si déjà sélectionné
      setArbresSelectionnes(arbresSelectionnes.filter(a => a.id !== arbre.id));
    } else {
      // Ajouter
      setArbresSelectionnes([...arbresSelectionnes, arbre]);
    }
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
          
          <div className="header-info">
            🌳 <strong>{arbresSelectionnes.length}</strong> arbre{arbresSelectionnes.length > 1 ? 's' : ''} sélectionné{arbresSelectionnes.length > 1 ? 's' : ''}
          </div>
          
          <button 
            className="help-btn" 
            onClick={() => setShowOnboarding(true)}
            aria-label="Aide"
            title="Afficher l'aide"
          >
            ❓
          </button>
          
          {/* Toggle 2D/3D */}
          <div className="toggle-dimension">
            <button 
              className={!mode3D ? 'active' : ''}
              onClick={() => setMode3D(false)}
              title="Vue 2D (plan)"
            >
              <FaMap /> 2D
            </button>
            <button 
              className={mode3D ? 'active' : ''}
              onClick={() => setMode3D(true)}
              title="Vue 3D (perspective)"
            >
              <FaCube /> 3D
            </button>
          </div>
          
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            <FaTimes />
          </button>
        </div>

        {/* Contenu - Un seul écran avec validation en temps réel */}
        <div className="planificateur-content">
          {mode3D ? (
            <CanvasTerrain3D
              dimensions={dimensions}
              planData={plan}
              arbresAPlanter={arbresSelectionnes}
              anneeProjection={0}
              couchesSol={[
                { nom: 'Terre végétale', profondeur: 30, couleur: '#795548', type: 'terre' },
                { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd', type: 'marne' }
              ]}
            />
          ) : (
            <CanvasTerrain
              dimensions={dimensions}
              orientation={orientation}
              onDimensionsChange={setDimensions}
              onOrientationChange={setOrientation}
              onPlanComplete={handlePlanComplete}
              arbresAPlanter={arbresSelectionnes}
              plantes={plantes}
              arbresSelectionnes={arbresSelectionnes}
              onToggleArbre={toggleArbre}
            />
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default PlanificateurTerrain;

