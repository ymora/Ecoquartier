import { FaEye, FaExchangeAlt, FaMapMarkedAlt } from 'react-icons/fa';
import './ModeSelector.css';

function ModeSelector({ modeActuel, onModeChange }) {
  const modes = [
    { id: 'normal', label: 'Fiches', icon: <FaEye />, color: '#2e7d32' },
    { id: 'comparaison', label: 'Comparer', icon: <FaExchangeAlt />, color: '#1976d2' },
    { id: 'planification', label: 'Planifier', icon: <FaMapMarkedAlt />, color: '#f57c00' }
  ];

  return (
    <div className="mode-selector">
      {modes.map(mode => (
        <button
          key={mode.id}
          className={`mode-btn ${modeActuel === mode.id ? 'active' : ''}`}
          onClick={() => onModeChange(mode.id)}
          style={{
            '--mode-color': mode.color,
            backgroundColor: modeActuel === mode.id ? mode.color : 'transparent',
            color: modeActuel === mode.id ? 'white' : mode.color,
            borderColor: mode.color
          }}
          aria-label={mode.label}
        >
          {mode.icon}
          <span className="mode-label">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}

export default ModeSelector;

