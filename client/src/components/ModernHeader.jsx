/**
 * Composant Header moderne avec navigation fluide
 */
import { useState, memo } from 'react';
import { FaBars, FaTimes, FaLeaf, FaSun, FaMoon } from 'react-icons/fa';
import './ModernHeader.css';

const ModernHeader = memo(({ onModeChange, currentMode, onThemeToggle, isDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const modes = [
    { id: 'normal', label: 'Fiches Détaillées', icon: '📋', description: 'Consultez les informations complètes' },
    { id: 'comparaison', label: 'Comparateur', icon: '🔍', description: 'Comparez plusieurs plantes' },
    { id: 'planification', label: 'Planificateur 3D', icon: '🌳', description: 'Visualisez votre jardin en 3D' }
  ];

  const handleModeClick = (modeId) => {
    onModeChange(modeId);
    setMenuOpen(false);
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo et titre */}
        <div className="header-brand">
          <div className="brand-icon">
            <FaLeaf />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Les Haies de l'Écocartier</h1>
            <p className="brand-subtitle">Bessancourt</p>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {modes.map(mode => (
            <button
              key={mode.id}
              className={`nav-item ${currentMode === mode.id ? 'active' : ''}`}
              onClick={() => handleModeClick(mode.id)}
              title={mode.description}
            >
              <span className="nav-icon">{mode.icon}</span>
              <span className="nav-label">{mode.label}</span>
              {currentMode === mode.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Toggle thème sombre/clair */}
          {onThemeToggle && (
            <button
              className="action-btn theme-toggle"
              onClick={onThemeToggle}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          )}

          {/* Menu burger (mobile) */}
          <button
            className="action-btn menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
});

ModernHeader.displayName = 'ModernHeader';

export default ModernHeader;

