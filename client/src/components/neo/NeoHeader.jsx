/**
 * Header Neo Garden - Design Ultra-Sophistiqué 2025
 * Gradients, glassmorphism, animations élégantes
 */
import { memo, useState } from 'react';
import { FaLeaf, FaSearch, FaMoon, FaSun, FaUser, FaBars, FaTimes, FaSignInAlt } from 'react-icons/fa';
import useLocalStorage from '../../hooks/useLocalStorage';
import './NeoHeader.css';

const NeoHeader = memo(({ 
  currentMode, 
  onModeChange,
  onOpenLogs
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('neoTheme', true);
  const [searchQuery, setSearchQuery] = useState('');

  const modes = [
    { 
      id: 'normal', 
      label: 'Fiches Détaillées', 
      icon: '📋',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      id: 'comparaison', 
      label: 'Comparateur', 
      icon: '🔍',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      id: 'planification', 
      label: 'Planificateur 3D', 
      icon: '🌳',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  return (
    <header className="neo-header-premium">
      {/* Gradient animé en arrière-plan */}
      <div className="neo-header-gradient"></div>
      
      {/* Effet de particules lumineuses */}
      <div className="neo-header-particles">
        <span className="particle"></span>
        <span className="particle"></span>
        <span className="particle"></span>
      </div>

      <div className="neo-header-content">
        {/* Logo et titre avec effet lumineux */}
        <div className="neo-header-brand">
          <div className="neo-logo-premium">
            <div className="logo-glow"></div>
            <FaLeaf />
          </div>
          <div className="neo-brand-text">
            <h1 className="neo-brand-title-premium">
              Les Haies de l'Écocartier
            </h1>
            <p className="neo-brand-subtitle-premium">
              <span className="subtitle-icon">📍</span>
              Bessancourt
              <span className="subtitle-badge">Premium</span>
            </p>
          </div>
        </div>

        {/* Navigation avec effet de carte */}
        <nav className={`neo-nav-premium ${menuOpen ? 'open' : ''}`}>
          {modes.map((mode, index) => (
            <button
              key={mode.id}
              className={`neo-nav-btn-premium ${currentMode === mode.id ? 'active' : ''}`}
              onClick={() => {
                onModeChange(mode.id);
                setMenuOpen(false);
              }}
              style={{
                '--btn-gradient': mode.gradient,
                '--animation-delay': `${index * 0.1}s`
              }}
            >
              <span className="nav-btn-bg" style={{ background: mode.gradient }}></span>
              <span className="nav-btn-icon">{mode.icon}</span>
              <span className="nav-btn-text">{mode.label}</span>
              <span className="nav-btn-glow"></span>
            </button>
          ))}
        </nav>

        {/* Actions avec effet glassmorphism */}
        <div className="neo-header-actions-premium">
          {/* Recherche */}
          <button 
            className="neo-action-btn-premium search" 
            onClick={() => setSearchOpen(!searchOpen)}
            title="Rechercher une plante"
          >
            <FaSearch />
            <span className="btn-ripple"></span>
          </button>
          
          {/* Toggle Thème Clair/Sombre */}
          <button 
            className="neo-action-btn-premium moon" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
            <span className="btn-ripple"></span>
          </button>
          
          {/* Journal des logs (Debug) */}
          <button 
            className="neo-action-btn-premium user" 
            onClick={onOpenLogs}
            title="Journal des logs (Debug)"
          >
            <FaSignInAlt />
            <span className="btn-ripple"></span>
          </button>

          {/* Menu burger pour mobile */}
          <button 
            className="neo-menu-burger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Barre de recherche dépliante */}
      {searchOpen && (
        <div className="neo-search-bar">
          <div className="search-bar-content">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un arbre ou arbuste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            <button 
              className="search-close"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
            >
              <FaTimes />
            </button>
          </div>
          {searchQuery && (
            <div className="search-results">
              <p className="search-hint">Recherche : "{searchQuery}"</p>
              <p className="search-hint-sub">Fonctionnalité en développement...</p>
            </div>
          )}
        </div>
      )}
    </header>
  );
});

NeoHeader.displayName = 'NeoHeader';

export default NeoHeader;
