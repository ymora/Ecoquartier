import { FaEye, FaExchangeAlt, FaMapMarkedAlt } from 'react-icons/fa';
import './ModeSelector.css';

function ModeSelector({ modeActuel, onModeChange }) {
  // Ordre et angles personnalisés : Fiche à gauche, Comparer à droite, Plan en bas
  // Angles ajustés pour diviser le cercle en 3 secteurs de 120° parfaitement alignés
  const modes = [
    { id: 'normal', label: 'Fiches', icon: FaEye, color: '#2e7d32', angleStart: 180 }, // Gauche (180°)
    { id: 'comparaison', label: 'Comparer', icon: FaExchangeAlt, color: '#1976d2', angleStart: 60 }, // Droite (60°)
    { id: 'planification', label: 'Planifier', icon: FaMapMarkedAlt, color: '#f57c00', angleStart: 300 } // Bas (300°)
  ];

  return (
    <div className="mode-selector-circle">
      <svg viewBox="0 0 100 100" className="circle-svg">
        {/* Segments du cercle */}
        {modes.map((mode) => {
          const startAngle = mode.angleStart;
          const endAngle = startAngle + 120;
          const largeArcFlag = 0;
          
          const startX = 50 + 48 * Math.cos((startAngle * Math.PI) / 180);
          const startY = 50 + 48 * Math.sin((startAngle * Math.PI) / 180);
          const endX = 50 + 48 * Math.cos((endAngle * Math.PI) / 180);
          const endY = 50 + 48 * Math.sin((endAngle * Math.PI) / 180);
          
          return (
            <path
              key={mode.id}
              d={`M 50 50 L ${startX} ${startY} A 48 48 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
              className={`circle-segment ${modeActuel === mode.id ? 'active' : ''}`}
              style={{ fill: modeActuel === mode.id ? mode.color : 'transparent' }}
              onClick={() => onModeChange(mode.id)}
            />
          );
        })}
        
        {/* Bordure du cercle en noir */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="#000" strokeWidth="3" />
        
        {/* Lignes de séparation en noir */}
        {modes.map((mode) => {
          const angle = mode.angleStart;
          const x = 50 + 48 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 48 * Math.sin((angle * Math.PI) / 180);
          return (
            <line
              key={`line-${mode.id}`}
              x1="50"
              y1="50"
              x2={x}
              y2={y}
              stroke="#000"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      
      {/* Icônes positionnées au centre de chaque segment */}
      {modes.map((mode) => {
        const Icon = mode.icon;
        // Calculer l'angle du milieu de chaque segment de 120°
        const middleAngle = mode.angleStart + 60; // Milieu du segment
        const radians = (middleAngle * Math.PI) / 180;
        const x = 50 + 28 * Math.cos(radians);
        const y = 50 + 28 * Math.sin(radians);
        
        return (
          <button
            key={`icon-${mode.id}`}
            className={`mode-icon-btn ${modeActuel === mode.id ? 'active' : ''}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              color: modeActuel === mode.id ? 'white' : mode.color
            }}
            onClick={() => onModeChange(mode.id)}
            title={mode.label}
            aria-label={mode.label}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

export default ModeSelector;

