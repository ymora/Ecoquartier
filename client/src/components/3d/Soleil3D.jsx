import { memo } from 'react';
import { Html } from '@react-three/drei';

/**
 * Composant Soleil 3D avec position selon la saison et l'angle fluide
 * Latitude Bessancourt : 49°N
 * 
 * Angles solaires à midi (azimut sud) :
 * - Hiver (21 déc) : 18° (soleil bas)
 * - Printemps/Automne (21 mars/sept) : 41° (soleil moyen)
 * - Été (21 juin) : 64° (soleil haut)
 */
function Soleil3D({ 
  saison = 'ete',
  angleJournee = 90, // Angle de 0° (matin) à 180° (soir)
  heureJournee = null, // DEPRECATED: gardé pour compatibilité
  distance = 30
}) {
  // Angles solaires selon la saison (élévation à midi)
  const anglesSolaires = {
    hiver: 18,
    printemps: 41,
    automne: 41,
    ete: 64
  };
  
  // Élévation maximale à midi selon la saison
  const elevationMax = anglesSolaires[saison] || 41;
  
  // Convertir l'angle de la journée (0-180°) en azimut et élévation
  // angleJournee: 0° = lever (Est), 90° = midi (Sud), 180° = coucher (Ouest)
  
  // Azimut : -90° (Est) → 0° (Sud) → +90° (Ouest)
  const azimuth = (angleJournee - 90) * 1; // Linéaire de -90 à +90
  
  // Élévation : courbe parabolique (bas au lever/coucher, haut à midi)
  // Utiliser une courbe en sin pour simuler la trajectoire du soleil
  const angleNormalized = (angleJournee / 180) * Math.PI; // 0 à π
  const elevationFactor = Math.sin(angleNormalized); // 0 → 1 → 0
  
  // Élévation minimale (lever/coucher) = 5°, maximale (midi) = elevationMax
  const elevationMin = 5;
  const elevation = elevationMin + (elevationMax - elevationMin) * elevationFactor;
  
  // Conversion en radians
  const elevationRad = (elevation * Math.PI) / 180;
  const azimuthRad = (azimuth * Math.PI) / 180;
  
  // Position 3D du soleil
  const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
  const y = distance * Math.sin(elevationRad);
  const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);
  
  // Taille du soleil uniforme et réaliste
  const tailleSoleil = 3.5;
  
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
        <meshStandardMaterial 
          color={couleur}
          emissive={couleur}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.0}
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

