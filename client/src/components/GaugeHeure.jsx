import { useState, useRef, useEffect } from 'react';
import TimelineSection from './TimelineSection';
import './GaugeHeure.css';

/**
 * Jauge d'heure intégrée dans le panneau latéral (version compacte)
 */
function GaugeHeure({ 
  heureActuelle = 'midi',
  saison = 'ete',
  onHeureChange = () => {}
}) {
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const gaugeRef = useRef(null);

  // Heures de lever/coucher selon les saisons en France
  const heuresSoleil = {
    hiver: { lever: '8:30', coucher: '17:00' },
    printemps: { lever: '7:00', coucher: '19:00' },
    ete: { lever: '6:00', coucher: '21:30' },
    automne: { lever: '7:30', coucher: '18:30' }
  };

  // Calculer l'angle initial (180° = midi au centre)
  useEffect(() => {
    // Convertir l'heure en angle si nécessaire
    const angleInitial = typeof heureActuelle === 'number' ? heureActuelle : 180;
    setAngle(angleInitial);
  }, [heureActuelle]);

  // Convertir angle en description d'heure fluide
  const angleToDescription = (angle) => {
    let normalizedAngle = ((angle % 360) + 360) % 360;
    
    // Limiter à la demi-jauge (0° = matin/gauche, 180° = soir/droite)
    if (normalizedAngle < 0) normalizedAngle = 0;
    if (normalizedAngle > 180) normalizedAngle = 180;
    
    // Calculer l'heure réelle (6h à 21h, soit 15 heures sur 180°)
    const heuresReelles = heuresSoleil[saison] || heuresSoleil.ete;
    const heureLever = parseFloat(heuresReelles.lever.replace(':', '.').replace('30', '5'));
    const heureCoucher = parseFloat(heuresReelles.coucher.replace(':', '.').replace('30', '5'));
    const dureeJournee = heureCoucher - heureLever;
    
    const heureActuelle = heureLever + (normalizedAngle / 180) * dureeJournee;
    const heureEntiere = Math.floor(heureActuelle);
    const minutes = Math.round((heureActuelle - heureEntiere) * 60);
    
    return {
      angle: normalizedAngle,
      heure: `${heureEntiere}h${minutes.toString().padStart(2, '0')}`,
      description: getDescriptionHeure(normalizedAngle)
    };
  };

  // Description textuelle selon la position
  const getDescriptionHeure = (angle) => {
    if (angle < 30) return '🌅 Lever du soleil';
    if (angle < 60) return '🌄 Début de matinée';
    if (angle < 90) return '☀️ Milieu de matinée';
    if (angle < 120) return '☀️ Fin de matinée';
    if (angle < 150) return '🌞 Début d\'après-midi';
    if (angle < 180) return '🌆 Fin d\'après-midi';
    return '🌇 Coucher du soleil';
  };

  // Calculer l'angle à partir de la position de la souris
  const calculateAngleFromMouse = (clientX, clientY) => {
    if (!gaugeRef.current) return angle;
    
    const rect = gaugeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + 44; // ✅ Position ajustée du centre de l'arc (y=44 dans le viewBox)
    
    const mouseX = clientX - centerX;
    const mouseY = centerY - clientY; // Y vers le haut
    
    // Calculer l'angle en radians puis convertir en degrés
    let angleRad = Math.atan2(mouseY, mouseX);
    let newAngle = angleRad * (180 / Math.PI);
    
    // atan2 donne un angle de -180 à 180, on veut 0 à 180
    // 0° = gauche (matin), 180° = droite (soir)
    // Pour atan2: 180° = gauche, 0° = droite
    // On inverse donc: newAngle = 180 - newAngle
    newAngle = 180 - newAngle;
    
    // ✅ Logique améliorée pour les butées : garder le côté le plus proche
    if (newAngle < 0 || newAngle > 180) {
      // Déterminer de quel côté la souris est la plus proche
      const distanceFromLeft = Math.abs(newAngle - 0);
      const distanceFromRight = Math.abs(newAngle - 180);
      const distanceFromRight360 = Math.abs(newAngle - 360);
      const distanceFromLeftNeg = Math.abs(newAngle - (-180));
      
      // Trouver la distance minimale
      const minDistance = Math.min(
        distanceFromLeft,
        distanceFromRight,
        distanceFromRight360,
        distanceFromLeftNeg
      );
      
      // Maintenir l'angle du côté le plus proche
      if (minDistance === distanceFromLeft || minDistance === distanceFromLeftNeg) {
        newAngle = 0; // Côté matin
      } else {
        newAngle = 180; // Côté soir
      }
    }
    
    return newAngle;
  };

  // Gérer le clic sur la jauge (FLUIDE - pas de crans)
  const handleGaugeClick = (e) => {
    const newAngle = calculateAngleFromMouse(e.clientX, e.clientY);
    setAngle(newAngle);
    onHeureChange(newAngle);
  };

  // Gérer le mousedown sur toute la jauge (pas seulement l'aiguille)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    // Mettre à jour immédiatement l'angle
    const newAngle = calculateAngleFromMouse(e.clientX, e.clientY);
    setAngle(newAngle);
    onHeureChange(newAngle);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newAngle = calculateAngleFromMouse(e.clientX, e.clientY);
    setAngle(newAngle);
    onHeureChange(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Event listeners pour le drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, angle]);

  const heuresReelles = heuresSoleil[saison] || heuresSoleil.ete;
  const heureInfo = angleToDescription(angle);

  return (
    <TimelineSection 
      width={180}
      bottomText={
        <><span className="timeline-icon" style={{ fontSize: '0.8rem' }}>🕐</span> {heureInfo.heure}</>
      }
    >
      {/* Demi-jauge horizontale fluide - RÉDUITE ET VISIBLE */}
      <div 
        ref={gaugeRef}
        className="gauge-heure-container"
        onMouseDown={handleMouseDown}
        style={{ transform: 'scale(0.7)', transformOrigin: 'top center', marginTop: '0px', marginBottom: '-8px' }}
      >
        <svg width="200" height="50" viewBox="0 0 200 50">
          {/* Arc de base - descendu pour être complètement visible */}
          <path
            d="M 60 44 A 25 25 0 0 1 140 44"
            fill="none"
            stroke="#bdbdbd"
            strokeWidth="6"
            strokeLinecap="round"
          />
          
          {/* Arc coloré selon l'heure (gradient du matin au soir) */}
          <defs>
            <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#ff6b35', stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: '#ff6b35', stopOpacity: 1}} />
            </linearGradient>
          </defs>
          
          <path
            d="M 60 44 A 25 25 0 0 1 140 44"
            fill="none"
            stroke="url(#sunGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${angle * 0.78} 160`}
            strokeDashoffset="0"
            opacity="0.9"
          />
          
          {/* Marques intermédiaires */}
          {[45, 90, 135].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 100 + 27 * Math.cos(Math.PI - rad);
            const y1 = 44 - 27 * Math.sin(Math.PI - rad);
            const x2 = 100 + 23 * Math.cos(Math.PI - rad);
            const y2 = 44 - 23 * Math.sin(Math.PI - rad);
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#666"
                strokeWidth="1.5"
              />
            );
          })}
          
          {/* Labels aux extrémités */}
          <text x="55" y="48" fontSize="9" fill="#666" textAnchor="middle" fontWeight="600">
            🌅 Lever
          </text>
          <text x="145" y="48" fontSize="9" fill="#666" textAnchor="middle" fontWeight="600">
            Coucher 🌇
          </text>
          
          {/* Aiguille */}
          <line
            x1="100"
            y1="44"
            x2={100 + 22 * Math.cos(Math.PI - (angle * Math.PI) / 180)}
            y2={44 - 22 * Math.sin(Math.PI - (angle * Math.PI) / 180)}
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ pointerEvents: 'none' }}
          />
          
          {/* Centre de l'aiguille */}
          <circle cx="100" cy="44" r="3" fill="#333" />
        </svg>
      </div>
    </TimelineSection>
  );
}

export default GaugeHeure;

