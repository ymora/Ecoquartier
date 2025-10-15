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

  const handleToggle = () => {
    setIsVisible(true);
  };

  // Afficher uniquement le bouton si modal fermé
  if (!isVisible) {
    return (
      <button 
        className="disclaimer-toggle"
        onClick={handleToggle}
        title="Informations légales et avertissements"
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
            <strong>✅ VÉRIFIÉES</strong> : Les informations réglementaires (Code Civil articles 671-673, distances légales) 
            sont conformes à la législation française en vigueur. L'interdiction de taille varie selon les départements 
            (généralement 15 mars - 31 juillet, mais peut différer selon arrêté préfectoral local).
            <br />
            <small>(Sources : <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F614" target="_blank" rel="noopener noreferrer">Service-Public.gouv.fr</a>, <a href="https://www.lpo.fr/la-lpo-en-actions/mobilisation-citoyenne/oiseaux-en-danger/taille-des-haies" target="_blank" rel="noopener noreferrer">LPO France</a>, 2025)</small>
          </p>

          <h3>📏 Code Civil - Distances de Plantation</h3>
          <div className="verified">
            <strong>Article 671 du Code Civil (distances obligatoires)</strong> :
            <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              <li><strong>Arbres/haies de plus de 2 mètres de hauteur</strong> : minimum <strong>2 mètres</strong> de la limite de propriété</li>
              <li><strong>Arbres/haies de 2 mètres ou moins</strong> : minimum <strong>0,50 mètre (50 cm)</strong> de la limite de propriété</li>
            </ul>
            <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.9rem' }}>
              ⚠️ Ces distances peuvent être modifiées par usages locaux ou règlement de copropriété. 
              Consultez votre mairie et le PLU local.
            </p>
          </div>

          <h3>⚠️ Limitations et Précautions</h3>
          <ul className="warning-list">
            <li>
              <strong>PLU Local</strong> : Les règles peuvent être plus strictes selon le Plan Local 
              d'Urbanisme de Bessancourt. <strong>Consultez votre mairie (01 30 40 44 47)</strong> avant plantation.
            </li>
            <li>
              <strong>Interdiction de Taille</strong> : La période d'interdiction de taille des haies pour 
              protection des oiseaux nicheurs varie selon les départements. <strong>Période courante : 15 mars au 31 juillet</strong>. 
              Vérifiez l'arrêté préfectoral de votre département (Val d'Oise 95).
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
              mais la sensibilité varie. En cas d'intoxication : <strong>15 (SAMU)</strong> ou 
              <strong> Centre Antipoison Paris 01 40 05 48 48</strong>.
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
                <li>Code Civil articles 671-673 (textes officiels)</li>
                <li>Distances plantation (2m / 0,50m)</li>
                <li>Noms botaniques</li>
                <li>Familles botaniques</li>
              </ul>
            </div>
            <div className="reliability-item medium">
              <strong>🟡 Fiabilité Moyenne</strong>
              <ul>
                <li>Interdiction taille (variable selon département)</li>
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
            <li>
              <strong>Mairie de Bessancourt</strong> : <a href="tel:0130404447">01 30 40 44 47</a> (PLU, règles locales)
            </li>
            <li>
              <strong>Service-Public.gouv.fr</strong> : <a href="https://www.service-public.fr/particuliers/vosdroits/F614" target="_blank" rel="noopener noreferrer">Fiche F614 - Plantation et distances</a>
            </li>
            <li>
              <strong>Centre Antipoison Paris (Île-de-France)</strong> : <a href="tel:0140054848">01 40 05 48 48</a>
            </li>
            <li>
              <strong>SAMU (urgence vitale)</strong> : <a href="tel:15">15</a>
            </li>
            <li>
              <strong>LPO France</strong> : <a href="https://www.lpo.fr/" target="_blank" rel="noopener noreferrer">Protection oiseaux et haies</a>
            </li>
            <li>
              <strong>Préfecture Val d'Oise</strong> : Arrêtés préfectoraux sur la taille des haies
            </li>
            <li>
              <strong>Conseiller horticole/pépiniériste</strong> : Pour validation projet spécifique
            </li>
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

