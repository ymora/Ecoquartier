/**
 * Header Neo Garden - Design 2025
 */
import { memo } from 'react';
import { FaLeaf, FaSearch, FaMoon, FaSun, FaUser } from 'react-icons/fa';

const NeoHeader = memo(({ 
  currentMode, 
  onModeChange,
  isDarkTheme,
  onThemeToggle 
}) => {
  const modes = [
    { id: 'normal', label: 'Fiches', icon: '📋' },
    { id: 'comparaison', label: 'Comparateur', icon: '🔍' },
    { id: 'planification', label: 'Planificateur', icon: '🌳' }
  ];

  return (
    <header className="neo-header">
      <div className="neo-header-left">
        <div className="neo-logo">
          <FaLeaf />
        </div>
        <h1 className="neo-brand-title">
          Les Haies de l'Écocartier
          <span className="neo-brand-subtitle">• Bessancourt</span>
        </h1>
      </div>

      <nav className="neo-header-nav">
        {modes.map(mode => (
          <button
            key={mode.id}
            className={`neo-nav-link ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => onModeChange(mode.id)}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </nav>

      <div className="neo-header-actions">
        <button className="neo-icon-btn" title="Rechercher">
          <FaSearch />
        </button>
        <button 
          className="neo-icon-btn" 
          onClick={onThemeToggle}
          title={isDarkTheme ? 'Mode clair' : 'Mode sombre'}
        >
          {isDarkTheme ? <FaSun /> : <FaMoon />}
        </button>
        <button className="neo-icon-btn" title="Profil">
          <FaUser />
        </button>
      </div>
    </header>
  );
});

NeoHeader.displayName = 'NeoHeader';

export default NeoHeader;

