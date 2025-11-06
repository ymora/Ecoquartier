/**
 * Timeline Neo Garden - Cartes glassmorphism modernes
 */
import { memo } from 'react';
import { FaSeedling, FaClock, FaSun, FaEye, FaCamera } from 'react-icons/fa';

const NeoTimeline = memo(({
  anneeProjection = 0,
  onAnneeChange,
  heureJournee = 90,
  onHeureChange,
  saison = 'ete',
  onSaisonChange,
  mode3D = false,
  onToggleMode3D,
  onRecentrer
}) => {

  const saisons = [
    { id: 'printemps', emoji: '🌸', label: 'Printemps', color: '#ec4899' },
    { id: 'ete', emoji: '☀️', label: 'Été', color: '#f59e0b' },
    { id: 'automne', emoji: '🍂', label: 'Automne', color: '#f97316' },
    { id: 'hiver', emoji: '❄️', label: 'Hiver', color: '#3b82f6' }
  ];

  const getAnneeText = () => {
    if (anneeProjection === 0) return '🌱 Plantation';
    if (anneeProjection >= 20) return '🌳 Maturité';
    return `An ${anneeProjection}`;
  };

  const getHeureText = () => {
    const heure = Math.round(((heureJournee / 180) * 12) + 6);
    const minutes = heure < 10 ? '0' + heure : heure;
    if (heureJournee < 30) return `🌅 ${minutes}h`;
    if (heureJournee < 75) return `🌄 ${minutes}h`;
    if (heureJournee < 105) return `☀️ ${minutes}h`;
    if (heureJournee < 150) return `🌆 ${minutes}h`;
    return `🌇 ${minutes}h`;
  };

  return (
    <div className="neo-timeline">
      
      {/* Card 1: Croissance */}
      <div className="neo-timeline-card growth">
        <div className="neo-timeline-card-header">
          <FaSeedling className="neo-timeline-icon" />
          <span className="neo-timeline-title">Croissance</span>
        </div>
        <div className="neo-timeline-body">
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={anneeProjection}
            onChange={(e) => onAnneeChange(parseInt(e.target.value))}
            className="neo-slider"
            style={{ '--card-accent-color': 'var(--neo-green)' }}
          />
          <div className="neo-timeline-value">{getAnneeText()}</div>
        </div>
      </div>

      {/* Card 2: Heure */}
      <div className="neo-timeline-card time">
        <div className="neo-timeline-card-header">
          <FaClock className="neo-timeline-icon" />
          <span className="neo-timeline-title">Heure du jour</span>
        </div>
        <div className="neo-timeline-body">
          <input
            type="range"
            min="0"
            max="180"
            step="5"
            value={heureJournee}
            onChange={(e) => onHeureChange(parseInt(e.target.value))}
            className="neo-slider"
            style={{ '--card-accent-color': 'var(--neo-orange)' }}
          />
          <div className="neo-timeline-value">{getHeureText()}</div>
        </div>
      </div>

      {/* Card 3: Saison */}
      <div className="neo-timeline-card season">
        <div className="neo-timeline-card-header">
          <FaSun className="neo-timeline-icon" />
          <span className="neo-timeline-title">Saison</span>
        </div>
        <div className="neo-timeline-body">
          <div className="neo-timeline-buttons">
            {saisons.map(s => (
              <button
                key={s.id}
                className={`neo-season-btn ${saison === s.id ? 'active' : ''}`}
                onClick={() => onSaisonChange(s.id)}
                title={s.label}
                style={{
                  '--season-color': s.color
                }}
              >
                <span style={{ fontSize: '18px' }}>{s.emoji}</span>
                <span>{s.label.substring(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card 4: Vue */}
      <div className="neo-timeline-card view">
        <div className="neo-timeline-card-header">
          <FaEye className="neo-timeline-icon" />
          <span className="neo-timeline-title">Vue & Actions</span>
        </div>
        <div className="neo-timeline-body">
          <div className="neo-action-buttons">
            <button
              className={`neo-action-btn ${!mode3D ? 'active' : ''}`}
              onClick={() => onToggleMode3D && onToggleMode3D(false)}
            >
              🗺️ 2D
            </button>
            <button
              className={`neo-action-btn ${mode3D ? 'active' : ''}`}
              onClick={() => onToggleMode3D && onToggleMode3D(true)}
            >
              🧊 3D
            </button>
          </div>
          <button
            className="neo-action-btn"
            onClick={onRecentrer}
            title="Recentrer la vue"
          >
            <FaCamera /> Recentrer
          </button>
        </div>
      </div>

    </div>
  );
});

NeoTimeline.displayName = 'NeoTimeline';

export default NeoTimeline;

