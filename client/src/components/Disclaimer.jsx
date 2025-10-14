import { useState } from 'react';
import { FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';
import './Disclaimer.css';

function Disclaimer() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAccepted, setIsAccepted] = useState(
    localStorage.getItem('disclaimer-accepted') === 'true'
  );

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setIsAccepted(true);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isAccepted || !isVisible) {
    return (
      <button 
        className="disclaimer-toggle"
        onClick={() => setIsVisible(true)}
        title="Informations légales"
      >
        <FaInfoCircle />
      </button>
    );
  }

  return (
    <div className="disclaimer-overlay">
      <div className="disclaimer-modal">
        <button className="disclaimer-close" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="disclaimer-header">
          <FaExclamationTriangle className="disclaimer-icon" />
          <h2>Avertissement Important</h2>
        </div>

        <div className="disclaimer-content">
          <h3>🌿 À propos de ce site</h3>
          <p>
            Ce site présente des informations sur les arbres et arbustes pour haies champêtres 
            de l'écocartier de Bessancourt. Les informations fournies sont issues de :
          </p>
          <ul>
            <li>✅ Ouvrages botaniques de référence</li>
            <li>✅ Code Civil français (Articles 671-673) - <strong>vérifié</strong></li>
            <li>✅ Code Rural français (protection oiseaux) - <strong>vérifié</strong></li>
            <li>✅ Expérience horticole professionnelle</li>
            <li>⚠️ Généralisation de données botaniques (peuvent varier selon conditions locales)</li>
          </ul>

          <h3>⚖️ Informations Légales</h3>
          <p className="verified">
            <strong>✅ VÉRIFIÉES</strong> : Les informations réglementaires (Code Civil, distances légales, 
            interdiction de taille 16 mars - 15 août) sont conformes à la législation française en vigueur 
            (source : Service-Public.gouv.fr, LPO France, 2025).
          </p>

          <h3>⚠️ Limitations et Précautions</h3>
          <ul className="warning-list">
            <li>
              <strong>PLU Local</strong> : Les règles peuvent être plus strictes selon le Plan Local 
              d'Urbanisme de Bessancourt. <strong>Consultez votre mairie</strong> avant plantation.
            </li>
            <li>
              <strong>Conditions Locales</strong> : Les hauteurs, rusticités et périodes peuvent varier 
              selon votre terrain, exposition et microclimat.
            </li>
            <li>
              <strong>Données Botaniques</strong> : Les informations (taille, floraison, sol) sont des 
              moyennes. Variations possibles selon climat, sol et entretien.
            </li>
            <li>
              <strong>Toxicité</strong> : Les informations sur la toxicité sont issues de bases toxicologiques 
              mais la sensibilité varie. En cas d'intoxication : <strong>Centre Antipoison 15</strong>.
            </li>
            <li>
              <strong>Système Racinaire</strong> : Estimations basées sur littérature horticole. Variations 
              importantes possibles selon sol et conditions.
            </li>
          </ul>

          <h3>🔍 Fiabilité des Données</h3>
          <div className="reliability-grid">
            <div className="reliability-item high">
              <strong>✅ Haute Fiabilité</strong>
              <ul>
                <li>Code Civil (textes officiels)</li>
                <li>Interdiction taille 16/03-15/08</li>
                <li>Noms botaniques</li>
                <li>Familles botaniques</li>
              </ul>
            </div>
            <div className="reliability-item medium">
              <strong>🟡 Fiabilité Moyenne</strong>
              <ul>
                <li>Tailles à maturité (±20%)</li>
                <li>Périodes de floraison (±2 semaines)</li>
                <li>Rusticité (selon conditions)</li>
                <li>Système racinaire (estimatif)</li>
              </ul>
            </div>
            <div className="reliability-item low">
              <strong>⚠️ Variable</strong>
              <ul>
                <li>Distances infrastructures (estimées)</li>
                <li>Vitesse de croissance (dépend sol)</li>
                <li>Sensibilité maladies (climat)</li>
              </ul>
            </div>
          </div>

          <h3>📞 Ressources Officielles</h3>
          <ul>
            <li><strong>PLU Bessancourt</strong> : Mairie de Bessancourt - 01 34 16 17 18</li>
            <li><strong>Service-Public.gouv.fr</strong> : Fiche F614 (Distances de plantation)</li>
            <li><strong>Centre Antipoison</strong> : 15 (SAMU) en cas d'intoxication</li>
            <li><strong>LPO France</strong> : Info protection oiseaux et haies</li>
            <li><strong>Conseiller horticole</strong> : Pour validation projet spécifique</li>
          </ul>

          <h3>⚠️ Responsabilité</h3>
          <p className="disclaimer-legal">
            Ce site est fourni à titre <strong>informatif</strong> uniquement. L'écocartier de Bessancourt 
            et les auteurs ne peuvent être tenus responsables :
          </p>
          <ul>
            <li>Des variations locales des données botaniques</li>
            <li>Des dégâts causés par une plantation inappropriée</li>
            <li>Des litiges de voisinage liés aux plantations</li>
            <li>Des intoxications (humains ou animaux)</li>
          </ul>
          <p className="disclaimer-legal">
            <strong>Recommandation</strong> : Consultez toujours un professionnel (paysagiste, pépiniériste, 
            mairie) avant plantation, surtout près des limites de propriété ou infrastructures.
          </p>
        </div>

        <div className="disclaimer-footer">
          <button className="accept-button" onClick={handleAccept}>
            ✅ J'ai compris et j'accepte
          </button>
          <p className="disclaimer-note">
            Vous pouvez réafficher cet avertissement en cliquant sur l'icône ⓘ en haut à droite.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Disclaimer;

