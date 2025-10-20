import { useState, useRef, useEffect } from 'react';
import './SelecteurHeure.css';

/**
 * Sélecteur d'heure avec demi-jauge et aiguille
 * Heures réelles de lever/coucher selon les saisons en France
 */
function SelecteurHeure({ 
  heureActuelle = 'midi',
  saison = 'ete',
  onHeureChange = () => {},
  isOpen = false,
  onClose = () => {}
}) {
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const gaugeRef = useRef(null);

  // Heures de lever/coucher selon les saisons en France (UTC+1/+2)
  const heuresSoleil = {
    hiver: { lever: '8:30', coucher: '17:00' },    // 21 décembre
    printemps: { lever: '7:00', coucher: '19:00' }, // 21 mars
    ete: { lever: '6:00', coucher: '21:30' },       // 21 juin
    automne: { lever: '7:30', coucher: '18:30' }    // 21 septembre
  };

  // Positions angulaires des heures
  const positionsHeures = {
    lever: 45,      // 7h30 (lever moyen)
    matin: 90,      // 9h00
    midi: 180,      // 12h00
    soir: 270,      // 15h00
    coucher: 315    // 18h00 (coucher moyen)
  };

  // Calculer l'angle initial selon l'heure actuelle
  useEffect(() => {
    const angleInitial = positionsHeures[heureActuelle] || 180;
    setAngle(angleInitial);
  }, [heureActuelle]);

  // Convertir angle en heure
  const angleToHeure = (angle) => {
    // Normaliser l'angle (0-360°)
    let normalizedAngle = ((angle % 360) + 360) % 360;
    
    // Convertir en position sur la demi-jauge (45° à 315°)
    if (normalizedAngle < 45) normalizedAngle = 45;
    if (normalizedAngle > 315) normalizedAngle = 315;
    
    // Mapper sur les heures disponibles
    const heures = ['lever', 'matin', 'midi', 'soir', 'coucher'];
    const positions = [45, 90, 180, 270, 315];
    
    // Trouver la position la plus proche
    let closestIndex = 0;
    let minDistance = Math.abs(normalizedAngle - positions[0]);
    
    for (let i = 1; i < positions.length; i++) {
      const distance = Math.abs(normalizedAngle - positions[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return heures[closestIndex];
  };

  // Gérer le clic sur la jauge
  const handleGaugeClick = (e) => {
    if (!gaugeRef.current) return;
    
    const rect = gaugeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculer l'angle (en degrés)
    let newAngle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    newAngle = (newAngle + 90 + 360) % 360; // Ajuster pour commencer en haut
    
    // Limiter à la demi-jauge (45° à 315°)
    if (newAngle < 45) newAngle = 45;
    if (newAngle > 315) newAngle = 315;
    
    setAngle(newAngle);
    const nouvelleHeure = angleToHeure(newAngle);
    onHeureChange(nouvelleHeure);
  };

  // Gérer le drag de l'aiguille
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !gaugeRef.current) return;
    
    const rect = gaugeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    let newAngle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    newAngle = (newAngle + 90 + 360) % 360;
    
    if (newAngle < 45) newAngle = 45;
    if (newAngle > 315) newAngle = 315;
    
    setAngle(newAngle);
    const nouvelleHeure = angleToHeure(newAngle);
    onHeureChange(nouvelleHeure);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Ajouter les event listeners pour le drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Labels des heures
  const labelsHeures = {
    lever: '🌅 Lever',
    matin: '🌄 Matin', 
    midi: '☀️ Midi',
    soir: '🌆 Soir',
    coucher: '🌇 Coucher'
  };

  // Heures réelles selon la saison
  const heuresReelles = heuresSoleil[saison] || heuresSoleil.ete;

  if (!isOpen) return null;

  return (
    <div className="selecteur-heure-modal">
      <div className="selecteur-heure-content">
        <div className="selecteur-heure-header">
          <h3>🕐 Heure de la journée</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="selecteur-heure-body">
          {/* Demi-jauge */}
          <div 
            ref={gaugeRef}
            className="gauge-container"
            onClick={handleGaugeClick}
          >
            <svg width="200" height="120" viewBox="0 0 200 120">
              {/* Arc de la jauge */}
              <path
                d="M 30 100 A 70 70 0 0 1 170 100"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
                strokeLinecap="round"
              />
              
              {/* Arc coloré selon l'heure */}
              <path
                d="M 30 100 A 70 70 0 0 1 170 100"
                fill="none"
                stroke={heureActuelle === 'midi' ? '#ffd700' : 
                       heureActuelle === 'lever' || heureActuelle === 'coucher' ? '#ff6b35' : '#4caf50'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(angle - 45) * 1.2} 270`}
                strokeDashoffset="0"
              />
              
              {/* Marques des heures */}
              {Object.entries(positionsHeures).map(([heure, pos]) => (
                <g key={heure}>
                  <line
                    x1={100 + 60 * Math.cos((pos - 90) * Math.PI / 180)}
                    y1={100 + 60 * Math.sin((pos - 90) * Math.PI / 180)}
                    x2={100 + 50 * Math.cos((pos - 90) * Math.PI / 180)}
                    y2={100 + 50 * Math.sin((pos - 90) * Math.PI / 180)}
                    stroke="#666"
                    strokeWidth="2"
                  />
                  <text
                    x={100 + 40 * Math.cos((pos - 90) * Math.PI / 180)}
                    y={100 + 40 * Math.sin((pos - 90) * Math.PI / 180) + 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#666"
                  >
                    {labelsHeures[heure].split(' ')[1]}
                  </text>
                </g>
              ))}
              
              {/* Aiguille */}
              <line
                x1="100"
                y1="100"
                x2={100 + 45 * Math.cos((angle - 90) * Math.PI / 180)}
                y2={100 + 45 * Math.sin((angle - 90) * Math.PI / 180)}
                stroke="#333"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={handleMouseDown}
              />
              
              {/* Centre de l'aiguille */}
              <circle cx="100" cy="100" r="4" fill="#333" />
            </svg>
          </div>
          
          {/* Informations */}
          <div className="heure-info">
            <div className="heure-actuelle">
              <strong>{labelsHeures[heureActuelle]}</strong>
            </div>
            <div className="heure-reelle">
              {heureActuelle === 'lever' && `🌅 Lever: ${heuresReelles.lever}`}
              {heureActuelle === 'coucher' && `🌇 Coucher: ${heuresReelles.coucher}`}
              {heureActuelle === 'midi' && `☀️ Midi: 12:00`}
              {heureActuelle === 'matin' && `🌄 Matin: 9:00`}
              {heureActuelle === 'soir' && `🌆 Soir: 15:00`}
            </div>
            <div className="saison-info">
              📅 {saison.charAt(0).toUpperCase() + saison.slice(1)} - France (UTC+1/+2)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelecteurHeure;
