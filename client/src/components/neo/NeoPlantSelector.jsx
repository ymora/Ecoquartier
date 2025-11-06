/**
 * Sélecteur de plantes unifié pour tous les modes
 * Design Neo Garden avec glassmorphism
 */
import { memo, useState } from 'react';
import { FaSearch, FaTree, FaSeedling, FaTimes } from 'react-icons/fa';
import './NeoPlantSelector.css';

const NeoPlantSelector = memo(({ 
  plantes,
  selectedPlante,
  selectedPlantes = [], // Pour le mode comparateur (multi-sélection)
  onSelectPlante,
  onTogglePlante, // Pour le comparateur
  multiSelect = false, // true = comparateur, false = fiches
  collapsed = false,
  onToggleCollapse
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('tous'); // 'tous', 'arbre', 'arbuste'

  // Filtrer les plantes selon la recherche et le type
  const plantesFiltered = plantes.filter(plante => {
    const matchSearch = !searchQuery || 
      plante.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plante.nomScientifique?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchType = filterType === 'tous' || plante.type === filterType;
    
    return matchSearch && matchType;
  });

  const arbres = plantesFiltered.filter(p => p.type === 'arbre');
  const arbustes = plantesFiltered.filter(p => p.type === 'arbuste');

  const isSelected = (plante) => {
    if (multiSelect) {
      return selectedPlantes.some(p => p.id === plante.id);
    }
    return selectedPlante?.id === plante.id;
  };

  const handleClick = (plante) => {
    if (multiSelect) {
      onTogglePlante(plante);
    } else {
      onSelectPlante(plante.id);
    }
  };

  return (
    <aside className={`neo-plant-selector ${collapsed ? 'collapsed' : ''}`}>
      {/* Header avec recherche */}
      <div className="selector-header">
        <div className="selector-title">
          <span className="selector-icon">🌳</span>
          {!collapsed && <span>Sélection des Plantes</span>}
        </div>
        {!collapsed && multiSelect && (
          <div className="selector-count">
            {selectedPlantes.length} sélectionnée{selectedPlantes.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Barre de recherche */}
          <div className="selector-search">
            <FaSearch className="search-icon-small" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="selector-search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Filtres type */}
          <div className="selector-filters">
            <button
              className={`filter-btn ${filterType === 'tous' ? 'active' : ''}`}
              onClick={() => setFilterType('tous')}
            >
              Tous ({plantes.length})
            </button>
            <button
              className={`filter-btn ${filterType === 'arbre' ? 'active' : ''}`}
              onClick={() => setFilterType('arbre')}
            >
              <FaTree /> Arbres ({plantes.filter(p => p.type === 'arbre').length})
            </button>
            <button
              className={`filter-btn ${filterType === 'arbuste' ? 'active' : ''}`}
              onClick={() => setFilterType('arbuste')}
            >
              <FaSeedling /> Arbustes ({plantes.filter(p => p.type === 'arbuste').length})
            </button>
          </div>
        </>
      )}

      {/* Liste des plantes */}
      <div className="selector-content">
        {!collapsed ? (
          <>
            {/* Arbres */}
            {(filterType === 'tous' || filterType === 'arbre') && arbres.length > 0 && (
              <div className="selector-category">
                <div className="category-title">
                  <FaTree /> Arbres ({arbres.length})
                </div>
                {arbres.map(plante => (
                  <button
                    key={plante.id}
                    className={`plant-item ${isSelected(plante) ? 'selected' : ''}`}
                    onClick={() => handleClick(plante)}
                  >
                    <span className="plant-icon">🌳</span>
                    <div className="plant-info">
                      <span className="plant-name">{plante.name}</span>
                      <span className="plant-scientific">{plante.nomScientifique}</span>
                    </div>
                    {isSelected(plante) && <span className="selected-badge">✓</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Arbustes */}
            {(filterType === 'tous' || filterType === 'arbuste') && arbustes.length > 0 && (
              <div className="selector-category">
                <div className="category-title">
                  <FaSeedling /> Arbustes ({arbustes.length})
                </div>
                {arbustes.map(plante => (
                  <button
                    key={plante.id}
                    className={`plant-item ${isSelected(plante) ? 'selected' : ''}`}
                    onClick={() => handleClick(plante)}
                  >
                    <span className="plant-icon">🌿</span>
                    <div className="plant-info">
                      <span className="plant-name">{plante.name}</span>
                      <span className="plant-scientific">{plante.nomScientifique}</span>
                    </div>
                    {isSelected(plante) && <span className="selected-badge">✓</span>}
                  </button>
                ))}
              </div>
            )}

            {plantesFiltered.length === 0 && (
              <div className="selector-empty">
                <p>Aucune plante trouvée</p>
                <button 
                  className="btn-reset-search"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('tous');
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            )}
          </>
        ) : (
          // Mode réduit - icônes uniquement
          <div className="selector-icons-only">
            {plantesFiltered.slice(0, 10).map(plante => (
              <button
                key={plante.id}
                className={`plant-icon-btn ${isSelected(plante) ? 'selected' : ''}`}
                onClick={() => handleClick(plante)}
                title={plante.name}
              >
                {plante.type === 'arbre' ? '🌳' : '🌿'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bouton toggle */}
      <button
        className="selector-toggle"
        onClick={onToggleCollapse}
        title={collapsed ? 'Étendre' : 'Réduire'}
      >
        {collapsed ? '→' : '←'}
      </button>
    </aside>
  );
});

NeoPlantSelector.displayName = 'NeoPlantSelector';

export default NeoPlantSelector;

