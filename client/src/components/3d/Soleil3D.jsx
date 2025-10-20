import { memo } from 'react';
import { Html } from '@react-three/drei';

/**
 * Composant Soleil 3D avec position selon la saison
 * Latitude Bessancourt : 49°N
 * 
 * Angles solaires à midi (azimut sud) :
 * - Hiver (21 déc) : 18° (soleil bas)
 * - Printemps/Automne (21 mars/sept) : 41° (soleil moyen)
 * - Été (21 juin) : 64° (soleil haut)
 */
function Soleil3D({ 
  saison = 'ete',
  heureJournee = 'midi',
  distance = 30
}) {
  // Angles solaires selon la saison (élévation à midi)
  const anglesSolaires = {
    hiver: 18,
    printemps: 41,
    automne: 41,
    ete: 64
  };
  
  // Azimut selon l'heure (angle horizontal, 0° = Sud)
  const azimuthAngles = {
    'lever': -90,    // Est
    'matin': -45,    // Sud-Est
    'midi': 0,       // Sud
    'soir': 45,      // Sud-Ouest
    'coucher': 90    // Ouest
  };
  
  // Élévation de base
  const elevationBase = anglesSolaires[saison] || 41;
  
  // Ajuster l'élévation selon l'heure
  let elevation = elevationBase;
  if (heureJournee === 'lever' || heureJournee === 'coucher') {
    elevation = elevation * 0.3; // Soleil très bas
  } else if (heureJournee === 'matin' || heureJournee === 'soir') {
    elevation = elevation * 0.7;
  }
  
  const azimuth = azimuthAngles[heureJournee] || 0;
  
  // Conversion en radians
  const elevationRad = (elevation * Math.PI) / 180;
  const azimuthRad = (azimuth * Math.PI) / 180;
  
  // Position 3D du soleil
  const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
  const y = distance * Math.sin(elevationRad);
  const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);
  
  // Taille du soleil selon la saison (plus grand en été)
  const tailleSoleil = saison === 'ete' ? 2.5 : saison === 'hiver' ? 1.8 : 2.0;
  
  // Couleur selon la saison
  const couleursSoleil = {
    hiver: '#FFD700', // Jaune pâle
    printemps: '#FFA500', // Orange doux
    automne: '#FF8C00', // Orange
    ete: '#FFD700' // Jaune brillant
  };
  
  const couleur = couleursSoleil[saison] || '#FFD700';
  
  // Emoji selon saison
  const emojisSaison = {
    hiver: '❄️',
    printemps: '🌸',
    automne: '🍂',
    ete: '☀️'
  };
  
  const emoji = emojisSaison[saison] || '☀️';
  
  // Noms des saisons
  const nomsSaisons = {
    hiver: 'Hiver',
    printemps: 'Printemps',
    automne: 'Automne',
    ete: 'Été'
  };
  
  return (
    <group position={[x, y, z]}>
      {/* Soleil (sphère lumineuse) */}
      <mesh>
        <sphereGeometry args={[tailleSoleil, 32, 32]} />
        <meshBasicMaterial 
          color={couleur}
          emissive={couleur}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Halo lumineux autour du soleil */}
      <mesh>
        <sphereGeometry args={[tailleSoleil * 1.4, 32, 32]} />
        <meshBasicMaterial 
          color={couleur}
          transparent
          opacity={0.2}
        />
      </mesh>
      
      {/* Rayons du soleil (lignes radiales) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const rayonLength = tailleSoleil * 1.8;
        return (
          <mesh 
            key={i}
            position={[
              Math.cos(rad) * rayonLength,
              Math.sin(rad) * rayonLength,
              0
            ]}
            rotation={[0, 0, rad]}
          >
            <boxGeometry args={[0.1, tailleSoleil * 0.8, 0.1]} />
            <meshBasicMaterial 
              color={couleur}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
      
      {/* Label saison - Nom uniquement */}
      <Html position={[0, tailleSoleil + 1, 0]} center>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '4px 10px', 
          borderRadius: '5px',
          fontSize: '11px',
          fontWeight: '600',
          color: '#ff6f00',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255, 111, 0, 0.3)'
        }}>
          {emoji} {nomsSaisons[saison]}
        </div>
      </Html>
      
      {/* Ligne pointillée vers le sol (rayon vertical) */}
      <mesh position={[0, -y / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, y, 8]} />
        <meshBasicMaterial 
          color="#FFD700"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Optimisation : Éviter re-renders du soleil 3D
export default memo(Soleil3D);

