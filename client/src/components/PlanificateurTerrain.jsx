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
          
          <div className="arbres-selection">
            <div className="arbres-selection-header">
              <strong>🌳 Arbres à planter ({arbresSelectionnes.length}) :</strong>
            </div>
            
            {/* ARBRES - Catégorie */}
            <div className="arbres-categorie">
              <div className="categorie-label">🌳 Arbres</div>
              <div className="arbres-checkboxes">
                {plantes.filter(p => p.type === 'arbre').map((arbre) => (
                  <label key={arbre.id} className="arbre-checkbox-label">
                    <input
                      type="checkbox"
                      checked={arbresSelectionnes.find(a => a.id === arbre.id) !== undefined}
                      onChange={() => toggleArbre(arbre)}
                    />
                    <span className="arbre-name">{arbre.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* ARBUSTES - Catégorie */}
            <div className="arbres-categorie">
              <div className="categorie-label">🌿 Arbustes</div>
              <div className="arbres-checkboxes">
                {plantes.filter(p => p.type === 'arbuste').map((arbre) => (
                  <label key={arbre.id} className="arbre-checkbox-label">
                    <input
                      type="checkbox"
                      checked={arbresSelectionnes.find(a => a.id === arbre.id) !== undefined}
                      onChange={() => toggleArbre(arbre)}
                    />
                    <span className="arbre-name">{arbre.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

                <div className="validation-legend">
                   <span className="legend-item">✅ Conforme</span>
                   <span className="legend-item">⚠️ Attention</span>
                   <span className="legend-item">⚖️ Illégal (voisinage/Code Civil)</span>
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

