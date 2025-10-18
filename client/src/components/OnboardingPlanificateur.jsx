import { useState } from 'react';
import { FaTimes, FaArrowRight } from 'react-icons/fa';
import './OnboardingPlanificateur.css';

function OnboardingPlanificateur({ onClose }) {
  const [etape, setEtape] = useState(1);
  const totalEtapes = 5;

  const handleNext = () => {
    if (etape < totalEtapes) {
      setEtape(etape + 1);
    } else {
      localStorage.setItem('planificateur_onboarding_vu', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('planificateur_onboarding_vu', 'true');
    onClose();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="onboarding-close" onClick={handleSkip}>
          <FaTimes />
        </button>

        <div className="onboarding-content">
          {etape === 1 && (
            <>
              <h2>🌳 Bienvenue dans le Planificateur de Terrain !</h2>
              <p>Créez le plan parfait de votre jardin en respectant toutes les règles légales et botaniques.</p>
              <div className="onboarding-feature">
                <span className="feature-icon">✅</span>
                <div>
                  <strong>Validation 3D automatique</strong>
                  <p>Distances légales, profondeurs racines, Code Civil</p>
                </div>
              </div>
              <div className="onboarding-feature">
                <span className="feature-icon">📅</span>
                <div>
                  <strong>Projection temporelle</strong>
                  <p>Visualisez vos arbres dans 5, 10, 20 ans</p>
                </div>
              </div>
              <div className="onboarding-feature">
                <span className="feature-icon">📊</span>
                <div>
                  <strong>Statistiques temps réel</strong>
                  <p>Biodiversité, arrosage, entretien, conformité</p>
                </div>
              </div>
            </>
          )}

          {etape === 2 && (
            <>
              <h2>📊 Dashboard (Gauche)</h2>
              <div className="onboarding-screenshot">
                <div className="mock-dashboard">
                  <div className="mock-header">📊 Statistiques</div>
                  <div className="mock-stat">🌳 Arbres : 3</div>
                  <div className="mock-stat">🦋 Biodiversité : ⭐⭐⭐⭐</div>
                  <div className="mock-stat">⚖️ Conformité : 100%</div>
                  <div className="mock-section">🌍 Composition du sol</div>
                </div>
              </div>
              <p>Le dashboard affiche en temps réel les statistiques de votre projet.</p>
              <ul>
                <li>Nombre d'arbres, surfaces</li>
                <li>Score de biodiversité</li>
                <li>Arrosage et entretien estimés</li>
                <li><strong>Composition du sol</strong> (éditable)</li>
              </ul>
            </>
          )}

          {etape === 3 && (
            <>
              <h2>🛠️ Palette d'Outils (Droite)</h2>
              <div className="onboarding-screenshot">
                <div className="mock-palette">
                  <div className="mock-section-title">🏗️ Structures</div>
                  <div className="mock-buttons">🏠 🏡 🟩</div>
                  <div className="mock-section-title">🔧 Réseaux</div>
                  <div className="mock-buttons">🚰 💧 🚧</div>
                  <div className="mock-section-title">👁️ Affichage</div>
                  <div className="mock-buttons">👁️ ☀️</div>
                </div>
              </div>
              <p>Créez votre plan en ajoutant des éléments :</p>
              <ul>
                <li><strong>🏠 Maison</strong> : Double-clic pour éditer hauteur</li>
                <li><strong>🚰 Canalisations</strong> : Double-clic pour courber</li>
                <li><strong>🚧 Clôtures</strong> : Limite légale de propriété</li>
                <li><strong>👁️ Zones</strong> : Voir distances interdites</li>
                <li><strong>☀️ Ombre</strong> : Selon saison et hauteur</li>
              </ul>
            </>
          )}

          {etape === 4 && (
            <>
              <h2>📅 Timeline de Croissance (Bas)</h2>
              <div className="onboarding-screenshot">
                <div className="mock-timeline">
                  <div className="mock-slider">
                    🌱 ━━━●━━━━━━ 🌳
                  </div>
                  <div className="mock-label">5 ans - Croissance en cours</div>
                </div>
              </div>
              <p>Glissez le curseur pour voir vos arbres grandir !</p>
              <ul>
                <li><strong>Année 0</strong> : Jeunes plants (1.5m, ⌀5cm tronc)</li>
                <li><strong>5-10 ans</strong> : Croissance progressive</li>
                <li><strong>20+ ans</strong> : Maturité (taille adulte)</li>
                <li>Les <strong>ellipses s'agrandissent</strong> automatiquement</li>
                <li>Le <strong>diamètre du tronc</strong> augmente</li>
              </ul>
            </>
          )}

          {etape === 5 && (
            <>
              <h2>⚖️ Validation Intelligente</h2>
              <p>Le planificateur vérifie automatiquement :</p>
              <div className="onboarding-validation">
                <div className="validation-item ok">
                  <span>✅</span>
                  <div>
                    <strong>Vert</strong>
                    <p>Conforme à toutes les règles</p>
                  </div>
                </div>
                <div className="validation-item warning">
                  <span>⚠️</span>
                  <div>
                    <strong>Orange</strong>
                    <p>Avertissements, à vérifier</p>
                  </div>
                </div>
                <div className="validation-item error">
                  <span>⚖️</span>
                  <div>
                    <strong>Rouge</strong>
                    <p>ILLÉGAL - Code Civil non respecté</p>
                  </div>
                </div>
              </div>
              <p><strong>Pendant le déplacement :</strong></p>
              <ul>
                <li>Lignes rouges vers obstacles trop proches</li>
                <li>Cercle du tronc (taille selon âge)</li>
                <li>Panneau latéral avec détails</li>
              </ul>
              <p><strong>Raccourcis clavier :</strong></p>
              <ul>
                <li><kbd>Suppr</kbd> : Effacer sélection</li>
                <li><kbd>Ctrl+D</kbd> : Dupliquer</li>
                <li><kbd>↑ ↓ ← →</kbd> : Déplacer (1m)</li>
                <li><strong>Double-clic ligne</strong> : Ajouter point</li>
              </ul>
            </>
          )}
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-progress">
            {Array.from({ length: totalEtapes }, (_, i) => (
              <span 
                key={i} 
                className={`progress-dot ${i + 1 <= etape ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="onboarding-actions">
            <button className="btn-skip" onClick={handleSkip}>
              Passer
            </button>
            <button className="btn-next" onClick={handleNext}>
              {etape === totalEtapes ? 'Commencer !' : 'Suivant'}
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPlanificateur;

