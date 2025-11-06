/**
 * Timeline Neo Garden Ultra-Sophistiquée
 * Design Premium avec gradients et glassmorphism avancé
 */
import { memo } from 'react';
import { FaSeedling, FaClock, FaSun, FaCamera, FaEye } from 'react-icons/fa';
import './NeoTimeline.css';

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
    { id: 'printemps', emoji: '🌸', label: 'Printemps', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
    { id: 'ete', emoji: '☀️', label: 'Été', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { id: 'automne', emoji: '🍂', label: 'Automne', color: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
    { id: 'hiver', emoji: '❄️', label: 'Hiver', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' }
  ];

  const getAnneeText = () => {
    if (anneeProjection === 0) return '🌱 Plantation';
    if (anneeProjection >= 20) return '🌳 Maturité Complète';
    const pourcent = Math.round((anneeProjection / 20) * 100);
    return `An ${anneeProjection} • ${pourcent}% maturité`;
  };

  const getHeureText = () => {
    const heure = Math.round(((heureJournee / 180) * 12) + 6);
    const min = heure < 10 ? `0${heure}` : heure;
    if (heureJournee < 30) return `🌅 ${min}h00 • Aube`;
    if (heureJournee < 75) return `🌄 ${min}h00 • Matin`;
    if (heureJournee < 105) return `☀️ ${min}h00 • Midi`;
    if (heureJournee < 150) return `🌆 ${min}h00 • Après-midi`;
    return `🌇 ${min}h00 • Crépuscule`;
  };

  return (
    <div className="neo-timeline-premium">
      {/* Gradient animé en fond */}
      <div className="timeline-gradient-bg"></div>
      
      <div className="neo-timeline-container-premium">
        
        {/* Card 1: Croissance - Vert */}
        <div className="neo-card-premium growth-card">
          <div className="card-glow" style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent)' }}></div>
          <div className="card-shine"></div>
          
          <div className="card-header-premium">
            <div className="card-icon-premium" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <FaSeedling />
            </div>
            <span className="card-title-premium">Croissance</span>
          </div>
          
          <div className="card-body-premium">
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={anneeProjection}
              onChange={(e) => onAnneeChange(parseInt(e.target.value))}
              className="neo-slider-premium"
              style={{ '--slider-color': '#10b981', '--slider-glow': 'rgba(16, 185, 129, 0.5)' }}
            />
            <div className="card-value-premium">{getAnneeText()}</div>
          </div>
        </div>

        {/* Card 2: Heure - Orange */}
        <div className="neo-card-premium time-card">
          <div className="card-glow" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent)' }}></div>
          <div className="card-shine"></div>
          
          <div className="card-header-premium">
            <div className="card-icon-premium" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <FaClock />
            </div>
            <span className="card-title-premium">Heure du Jour</span>
          </div>
          
          <div className="card-body-premium">
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={heureJournee}
              onChange={(e) => onHeureChange(parseInt(e.target.value))}
              className="neo-slider-premium"
              style={{ '--slider-color': '#f59e0b', '--slider-glow': 'rgba(245, 158, 11, 0.5)' }}
            />
            <div className="card-value-premium">{getHeureText()}</div>
          </div>
        </div>

        {/* Card 3: Saison - Rose/Multi */}
        <div className="neo-card-premium season-card">
          <div className="card-glow" style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent)' }}></div>
          <div className="card-shine"></div>
          
          <div className="card-header-premium">
            <div className="card-icon-premium" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>
              <FaSun />
            </div>
            <span className="card-title-premium">Saison</span>
          </div>
          
          <div className="card-body-premium">
            <div className="season-buttons-premium">
              {saisons.map(s => (
                <button
                  key={s.id}
                  className={`season-btn-premium ${saison === s.id ? 'active' : ''}`}
                  onClick={() => onSaisonChange(s.id)}
                  title={s.label}
                  style={{
                    '--season-color': s.color,
                    '--season-glow': s.glow
                  }}
                >
                  <span className="season-emoji">{s.emoji}</span>
                  <span className="season-label">{s.label.substring(0, 3)}</span>
                  {saison === s.id && <span className="season-glow-effect"></span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 4: Vue - Bleu */}
        <div className="neo-card-premium view-card">
          <div className="card-glow" style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent)' }}></div>
          <div className="card-shine"></div>
          
          <div className="card-header-premium">
            <div className="card-icon-premium" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              <FaEye />
            </div>
            <span className="card-title-premium">Vue & Actions</span>
          </div>
          
          <div className="card-body-premium">
            <div className="view-buttons-premium">
              <button
                className={`view-btn-premium ${!mode3D ? 'active' : ''}`}
                onClick={() => onToggleMode3D && onToggleMode3D(false)}
              >
                🗺️ 2D
                {!mode3D && <span className="btn-glow-effect"></span>}
              </button>
              <button
                className={`view-btn-premium ${mode3D ? 'active' : ''}`}
                onClick={() => onToggleMode3D && onToggleMode3D(true)}
              >
                🧊 3D
                {mode3D && <span className="btn-glow-effect"></span>}
              </button>
            </div>
            <button
              className="recenter-btn-premium"
              onClick={onRecentrer}
              title="Recentrer la vue"
            >
              <FaCamera />
              <span>Recentrer</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
});

NeoTimeline.displayName = 'NeoTimeline';

export default NeoTimeline;
