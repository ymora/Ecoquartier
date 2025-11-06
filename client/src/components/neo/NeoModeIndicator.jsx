/**
 * Indicateur de mode intelligent (Fiche vs Comparaison)
 */
import { memo } from 'react';
import './NeoModeIndicator.css';

const NeoModeIndicator = memo(({ selectedCount }) => {
  if (selectedCount === 0) return null;

  const isFicheMode = selectedCount === 1;

  return (
    <div className={`neo-mode-indicator ${isFicheMode ? 'fiche' : 'comparison'}`}>
      <span className="mode-icon">
        {isFicheMode ? '📋' : '🔍'}
      </span>
      <div className="mode-text">
        <span className="mode-title">
          {isFicheMode ? 'Vue Fiche' : 'Vue Comparaison'}
        </span>
        <span className="mode-desc">
          {isFicheMode 
            ? '1 plante sélectionnée' 
            : `${selectedCount} plantes sélectionnées`
          }
        </span>
      </div>
      {!isFicheMode && (
        <span className="mode-badge">Tableau</span>
      )}
    </div>
  );
});

NeoModeIndicator.displayName = 'NeoModeIndicator';

export default NeoModeIndicator;

