import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaBug } from 'react-icons/fa';
import './Disclaimer.css';

function Disclaimer({ onClose, onOpenLogs }) {
  const isAlreadyAccepted = localStorage.getItem('disclaimer-accepted') === 'true';
  const [isVisible, setIsVisible] = useState(!isAlreadyAccepted); // Pas visible si déjà accepté
  const [isAccepted, setIsAccepted] = useState(isAlreadyAccepted);

  // Notifier la fermeture APRÈS un délai pour laisser le temps à l'utilisateur de voir le menu
  useEffect(() => {
    if (isAlreadyAccepted && onClose) {
      // Délai de 100ms pour s'assurer que tout est rendu
      const timer = setTimeout(() => {
        onClose();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Une seule fois au montage

  // Bloquer le scroll de la page principale quand le modal est visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup : restaurer le scroll quand le composant est démonté
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setIsAccepted(true);
    setIsVisible(false);
    if (onClose) onClose(); // Notifier la fermeture
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose(); // Notifier la fermeture
  };

  const handleToggle = () => {
    setIsVisible(true);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-spacer"></div>
        <p>&copy; 2025 Les Haies de l'Écocartier de Bessancourt. Tous droits réservés.</p>
        <div className="footer-buttons">
          {!isVisible && (
            <button 
              className="disclaimer-toggle-inline"
              onClick={handleToggle}
              title="Informations légales et avertissements"
              aria-label="Ouvrir les informations légales"
            >
              !
            </button>
          )}
          {onOpenLogs && (
            <button 
              className="disclaimer-toggle-inline logs-btn"
              onClick={onOpenLogs}
              title="Journal des logs (debug)"
              aria-label="Ouvrir le journal des logs"
            >
              <FaBug />
            </button>
          )}
        </div>
      </footer>
      
      {isVisible && (
      <div className="disclaimer-overlay">
        <div className="disclaimer-modal">
          <div className="disclaimer-header">
            <FaExclamationTriangle className="disclaimer-icon" />
            <h2>Informations Légales et Avertissements</h2>
            <p className="disclaimer-subtitle">Veuillez prendre connaissance des informations ci-dessous avant d'utiliser ce site</p>
          </div>

        <div className="disclaimer-content">
          <h3>🌿 À propos de ce site</h3>
          <p>
            Ce site présente les arbres et arbustes pour haies champêtres de l'écocartier de Bessancourt.  
            Sources : ouvrages botaniques, textes officiels (Code Civil, Code Rural), expérience horticole professionnelle.
          </p>
          <p className="verified" style={{ marginTop: '1rem' }}>
            <strong>✅ SOURCES OFFICIELLES VÉRIFIÉES</strong> :  
            <a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F614" target="_blank" rel="noopener noreferrer">Service-Public.gouv.fr</a>,  
            <a href="https://www.lpo.fr/" target="_blank" rel="noopener noreferrer">LPO France</a>
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
              <strong>Réglementation locale</strong> : Le PLU de Bessancourt peut imposer des règles plus strictes.  
              <strong>Contactez la mairie (01 30 40 44 47)</strong> avant toute plantation.
            </li>
            <li>
              <strong>Taille des haies et élagage</strong> : Pour protéger les oiseaux nicheurs.  
              <strong>Agriculteurs</strong> : Interdiction légale (arrêté préfectoral, généralement 15 mars - 31 juillet, variable selon département).  
              <strong>Particuliers</strong> : Recommandation forte de la LPO (début printemps - fin août).  
              Consultez l'arrêté préfectoral du Val d'Oise pour les dates exactes.
            </li>
            <li>
              <strong>Variations locales</strong> : Toutes les données botaniques (taille, floraison, rusticité, système racinaire) 
              sont des moyennes pouvant varier selon climat, sol, exposition et entretien.
            </li>
            <li>
              <strong>Urgences</strong> :  
              Intoxication → <strong>15 (SAMU)</strong> ou <strong>01 40 05 48 48 (Centre Antipoison Paris)</strong>
            </li>
          </ul>

          <h3>🔍 Niveau de Fiabilité</h3>
          <div className="reliability-grid">
            <div className="reliability-item high">
              <strong>✅ Haute</strong>
              <ul>
                <li>Noms botaniques et familles</li>
                <li>Textes officiels (voir ci-dessus)</li>
              </ul>
            </div>
            <div className="reliability-item medium">
              <strong>🟡 Moyenne (±20%)</strong>
              <ul>
                <li>Tailles, floraisons, rusticité</li>
                <li>Système racinaire, interdictions taille</li>
              </ul>
            </div>
            <div className="reliability-item low">
              <strong>⚠️ Variable</strong>
              <ul>
                <li>Distances infrastructures</li>
                <li>Croissance, sensibilité maladies</li>
              </ul>
            </div>
          </div>

          <h3>📞 Contacts Utiles</h3>
          <ul>
            <li><strong>Mairie de Bessancourt</strong> : <a href="tel:0130404447">01 30 40 44 47</a></li>
            <li><strong>SAMU</strong> : <a href="tel:15">15</a> | <strong>Centre Antipoison Paris</strong> : <a href="tel:0140054848">01 40 05 48 48</a></li>
            <li><strong>Préfecture Val d'Oise</strong> : Arrêtés préfectoraux taille haies</li>
          </ul>

          <h3>⚠️ Responsabilité</h3>
          <p className="disclaimer-legal">
            <strong>Site informatif uniquement.</strong>  Les auteurs ne peuvent être tenus responsables 
            des variations locales, dégâts, litiges de voisinage ou intoxications.
          </p>
          <p className="disclaimer-legal">
            <strong>Recommandation</strong> : Consultez un professionnel (mairie, pépiniériste, paysagiste) 
            avant plantation, notamment près des limites de propriété.
          </p>
        </div>

                <div className="disclaimer-footer">
                  <button className="accept-button" onClick={handleAccept}>
                    ✅ J'ai compris et j'accepte
                  </button>
                  <p className="disclaimer-note">
                    Vous pouvez réafficher cet avertissement en cliquant sur le cercle [!] dans le pied de page.
                  </p>
                </div>
      </div>
    </div>
      )}
    </>
  );
}

export default Disclaimer;

