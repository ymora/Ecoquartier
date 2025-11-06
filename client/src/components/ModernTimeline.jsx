/**
 * Timeline moderne et compacte pour le planificateur
 * Remplace l'ancienne timeline avec une interface plus claire
 */
import { memo } from 'react';
import { FaSeedling, FaClock, FaSun, FaSnowflake, FaLeaf, FaEye, FaArrowsAlt, FaCamera } from 'react-icons/fa';
import './ModernTimeline.css';

const ModernTimeline = memo(({
  // Projection temporelle
  anneeProjection = 0,
  onAnneeChange,
  
  // Heure du jour
  heureJournee = 90,
  onHeureChange,
  
  // Saison
  saison = 'ete',
  onSaisonChange,
  
  // Vue 3D
  mode3D = false,
  onToggleMode3D,
  onRecentrer
}) => {
  
  const saisons = [
    { id: 'printemps', label: 'Printemps', icon: '🌸', color: '#f48fb1' },
    { id: 'ete', label: 'Été', icon: '☀️', color: '#ffb74d' },
    { id: 'automne', label: 'Automne', icon: '🍂', color: '#ff8a65' },
    { id: 'hiver', label: 'Hiver', icon: '❄️', color: '#81c784' }
  ];

  const getAnneText = () => {
    if (anneeProjection === 0) return 'Plantation (An 0)';
    if (anneeProjection === 10) return 'Maturité (10+ ans)';
    return `An ${anneeProjection}`;
  };

  const getHeureText = () => {
    const heure = Math.round(((heureJournee / 180) * 12) + 6);
    if (heureJournee < 30) return `🌅 ${heure}h (Aube)`;
    if (heureJournee < 75) return `🌄 ${heure}h (Matin)`;
    if (heureJournee < 105) return `☀️ ${heure}h (Midi)`;
    if (heureJournee < 150) return `🌆 ${heure}h (Après-midi)`;
    return `🌇 ${heure}h (Soir)`;
  };

  return (
    <div className="modern-timeline">
      <div className="modern-timeline-container">
        
        {/* Section 1: Projection temporelle */}
        <div className="timeline-card">
          <div className="timeline-card-header">
            <FaSeedling className="timeline-icon" />
            <span className="timeline-title">Croissance</span>
          </div>
          <div className="timeline-card-body">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={anneeProjection}
              onChange={(e) => onAnneeChange(parseInt(e.target.value))}
              className="timeline-slider"
            />
            <div className="timeline-value">
              {getAnneText()}
            </div>
          </div>
        </div>

        {/* Section 2: Heure du jour */}
        <div className="timeline-card">
          <div className="timeline-card-header">
            <FaClock className="timeline-icon" />
            <span className="timeline-title">Heure</span>
          </div>
          <div className="timeline-card-body">
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={heureJournee}
              onChange={(e) => onHeureChange(parseInt(e.target.value))}
              className="timeline-slider"
            />
            <div className="timeline-value">
              {getHeureText()}
            </div>
          </div>
        </div>

        {/* Section 3: Saison */}
        <div className="timeline-card timeline-card-wide">
          <div className="timeline-card-header">
            <FaLeaf className="timeline-icon" />
            <span className="timeline-title">Saison</span>
          </div>
          <div className="timeline-card-body">
            <div className="season-buttons">
              {saisons.map(s => (
                <button
                  key={s.id}
                  className={`season-btn ${saison === s.id ? 'active' : ''}`}
                  onClick={() => onSaisonChange(s.id)}
                  title={s.label}
                  style={{
                    '--season-color': s.color
                  }}
                >
                  <span className="season-icon">{s.icon}</span>
                  <span className="season-label">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Vue et Actions */}
        <div className="timeline-card timeline-card-actions">
          <div className="timeline-card-header">
            <FaEye className="timeline-icon" />
            <span className="timeline-title">Vue & Actions</span>
          </div>
          <div className="timeline-card-body">
            <div className="action-buttons">
              <button
                className={`action-btn ${mode3D ? 'active' : ''}`}
                onClick={onToggleMode3D}
                title={mode3D ? 'Passer en 2D' : 'Passer en 3D'}
              >
                {mode3D ? '🧊 3D' : '🗺️ 2D'}
              </button>
              <button
                className="action-btn"
                onClick={onRecentrer}
                title="Recentrer la vue"
              >
                <FaCamera />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

ModernTimeline.displayName = 'ModernTimeline';

export default ModernTimeline;

