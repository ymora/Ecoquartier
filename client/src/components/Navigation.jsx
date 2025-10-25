import { useState, useEffect } from 'react';
import { FaBars, FaTree, FaLeaf, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ICONS } from '../config/icons';
import './Navigation.css';

function Navigation({ plantes, selectedId, onSelect, onMenuToggle, disclaimerClosed }) {
  // Détecter si mobile (pour overlay uniquement)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(!isMobile); // Ouvert au chargement si desktop
  const [arbresExpanded, setArbresExpanded] = useState(true);
  const [arbustesExpanded, setArbustesExpanded] = useState(true);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);

  // Détecter redimensionnement (pour overlay)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fermeture automatique après 3 secondes (APRÈS fermeture du disclaimer)
  useEffect(() => {
    if (!isMobile && !firstLoadComplete && disclaimerClosed) {
      const timer = setTimeout(() => {
        setIsOpen(false);
        if (onMenuToggle) onMenuToggle(false);
        setFirstLoadComplete(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isMobile, firstLoadComplete, onMenuToggle, disclaimerClosed]);

  // Auto-ouverture au survol de la zone gauche (desktop uniquement, après premier chargement)
  useEffect(() => {
    if (isMobile || !firstLoadComplete) return; // Pas d'auto-ouverture sur mobile ou pendant les 3 premières secondes
    
    const handleMouseMove = (e) => {
      // Zone de déclenchement : 50px depuis le bord gauche
      const triggerZone = 50;
      
      if (e.clientX <= triggerZone && !isOpen) {
        setIsOpen(true);
        if (onMenuToggle) onMenuToggle(true);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, isOpen, onMenuToggle, firstLoadComplete]);

  // Fermeture quand la souris sort du menu (desktop uniquement)
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsOpen(false);
      if (onMenuToggle) onMenuToggle(false);
    }
  };

  const toggleNav = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  const toggleArbres = () => {
    setArbresExpanded(!arbresExpanded);
  };

  const toggleArbustes = () => {
    setArbustesExpanded(!arbustesExpanded);
  };

  // Fermer le menu sur mobile après sélection
  const handleSelect = (id) => {
    onSelect(id);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Séparer arbres et arbustes
  const arbres = plantes.filter(p => p.type === 'arbre');
  const arbustes = plantes.filter(p => p.type === 'arbuste');

  return (
    <>
      {/* Overlay mobile pour fermer le menu */}
      {isMobile && isOpen && (
        <div 
          className="nav-overlay visible" 
          onClick={toggleNav}
          aria-label="Fermer le menu"
        />
      )}

      {/* Bouton toggle uniquement sur mobile */}
      {isMobile && (
        <button 
          className="btn btn-secondary nav-toggle"
          onClick={toggleNav}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <FaBars />
        </button>
      )}
      
      <nav 
        className={`navigation ${isOpen ? 'open' : 'closed'}`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Section Arbres */}
        <div className="nav-section">
          <button 
            className="nav-header clickable"
            onClick={toggleArbres}
            aria-expanded={arbresExpanded}
          >
            <FaTree className="nav-icon" />
            <h2>Arbres ({arbres.length})</h2>
            {arbresExpanded ? <FaChevronUp className="nav-chevron" /> : <FaChevronDown className="nav-chevron" />}
          </button>
          <div className={`nav-items ${arbresExpanded ? 'expanded' : 'collapsed'}`}>
            {arbres.map(arbre => (
              <button
                key={arbre.id}
                className={`btn btn-secondary nav-item ${selectedId === arbre.id ? 'active' : ''}`}
                onClick={() => handleSelect(arbre.id)}
              >
                <span className="nav-item-name">{arbre.name}</span>
                <span className="nav-item-scientific">{arbre.nomScientifique}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Arbustes */}
        <div className="nav-section">
          <button 
            className="nav-header clickable"
            onClick={toggleArbustes}
            aria-expanded={arbustesExpanded}
          >
            <FaLeaf className="nav-icon" />
            <h2>Arbustes ({arbustes.length})</h2>
            {arbustesExpanded ? <FaChevronUp className="nav-chevron" /> : <FaChevronDown className="nav-chevron" />}
          </button>
          <div className={`nav-items ${arbustesExpanded ? 'expanded' : 'collapsed'}`}>
            {arbustes.map(arbuste => (
              <button
                key={arbuste.id}
                className={`btn btn-secondary nav-item ${selectedId === arbuste.id ? 'active' : ''}`}
                onClick={() => handleSelect(arbuste.id)}
              >
                <span className="nav-item-name">{arbuste.name}</span>
                <span className="nav-item-scientific">{arbuste.nomScientifique}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;

