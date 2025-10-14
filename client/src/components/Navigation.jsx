import { useState } from 'react';
import { FaBars, FaTree, FaLeaf, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Navigation.css';

function Navigation({ plantes, selectedId, onSelect }) {
  const [isOpen, setIsOpen] = useState(true);
  const [arbresExpanded, setArbresExpanded] = useState(true);
  const [arbustesExpanded, setArbustesExpanded] = useState(true);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const toggleArbres = () => {
    setArbresExpanded(!arbresExpanded);
  };

  const toggleArbustes = () => {
    setArbustesExpanded(!arbustesExpanded);
  };

  // Séparer arbres et arbustes
  const arbres = plantes.filter(p => p.type === 'arbre');
  const arbustes = plantes.filter(p => p.type === 'arbuste');

  return (
    <>
      <button 
        className="nav-toggle"
        onClick={toggleNav}
        aria-label="Toggle navigation"
      >
        <FaBars />
      </button>
      <nav className={`navigation ${isOpen ? 'open' : 'closed'}`}>
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
                className={`nav-item ${selectedId === arbre.id ? 'active' : ''}`}
                onClick={() => onSelect(arbre.id)}
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
                className={`nav-item ${selectedId === arbuste.id ? 'active' : ''}`}
                onClick={() => onSelect(arbuste.id)}
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

