import { memo } from 'react';
import { Html } from '@react-three/drei';

function Sol3D({ 
  largeur = 30, 
  hauteur = 30,
  offsetX = 0,
  offsetZ = 0,
  transparent = false,
  couchesSol = [
    { nom: 'Terre végétale', profondeur: 30, couleur: '#8d6e63' },
    { nom: 'Sous-sol', profondeur: 200, couleur: '#a1887f' },
    { nom: 'Marne', profondeur: 250, couleur: '#bdbdbd' }
  ]
}) {
  // Icônes par couche
  const icones = ['🌱', '🪨', '⛰️'];
  
  // Calculer les profondeurs cumulées
  let profondeurCumulee = 0;
  const couches = couchesSol.map((couche) => {
    const profondeurM = couche.profondeur / 100;
    const position = profondeurCumulee + profondeurM / 2;
    profondeurCumulee += profondeurM;
    
    return {
      ...couche,
      profondeurM,
      positionY: -position,
      profondeurCumuleeAvant: profondeurCumulee - profondeurM
    };
  });
  
  // Centre du terrain adaptatif
  const centreX = offsetX + largeur / 2;
  const centreZ = offsetZ + hauteur / 2;
  
  return (
    <group position={[centreX, 0, centreZ]}>
      {/* SOL SURFACE (herbe verte) - Transparent si mode activé */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.07, 0]} 
        receiveShadow
      >
        <planeGeometry args={[largeur, hauteur]} />
        <meshStandardMaterial 
          color="#8bc34a"
          roughness={0.9}
          transparent={transparent}
          opacity={transparent ? 0.15 : 1.0}
          depthWrite={!transparent}
        />
      </mesh>
      
      {/* COUCHES DE SOL (dynamique) */}
      {couches.map((couche, index) => (
        <group key={index}>
          {/* Couche de sol */}
          <mesh position={[0, couche.positionY, 0]}>
            <boxGeometry args={[largeur, couche.profondeurM, hauteur]} />
            <meshStandardMaterial 
              color={couche.couleur}
              transparent 
              opacity={transparent ? 0.25 - index * 0.05 : 0.85 - index * 0.1}
              roughness={0.95}
              metalness={index * 0.05}
              depthWrite={!transparent}
            />
          </mesh>
          
          {/* Bordure visible entre les couches (sauf pour la dernière) */}
          {index < couches.length - 1 && (
            <>
              <mesh position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[largeur, hauteur]} />
                <meshBasicMaterial 
                  color="#4a3728"
                  opacity={0.9}
                  transparent
                />
              </mesh>
              
              {/* Lignes orange de séparation */}
              <mesh position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), largeur / 2]} rotation={[0, 0, 0]}>
                <boxGeometry args={[largeur, 0.05, 0.1]} />
                <meshBasicMaterial color="#ff9800" />
              </mesh>
              <mesh position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), -largeur / 2]} rotation={[0, 0, 0]}>
                <boxGeometry args={[largeur, 0.05, 0.1]} />
                <meshBasicMaterial color="#ff9800" />
              </mesh>
            </>
          )}
          
          {/* Label de la couche */}
          <Html position={[-largeur / 2 - 2, couche.positionY, 0]}>
            <div style={{ 
              background: `rgba(${index === 0 ? '121,85,72' : index === 1 ? '161,136,127' : '189,189,189'},0.95)`, 
              padding: '6px 10px', 
              borderRadius: '6px',
              fontSize: '12px',
              color: 'white',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              border: `2px solid ${couche.couleur}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              {icones[index] || '📦'} {couche.nom}
              <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.9 }}>
                ↕️ {couche.profondeur}cm ({(couche.profondeur / 100).toFixed(2)}m)
              </div>
            </div>
          </Html>
        </group>
      ))}
      
      {/* Ligne de référence niveau 0 (sous l'herbe) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[largeur + 2, 0.01, hauteur + 2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Optimisation : Éviter re-renders du sol 3D
export default memo(Sol3D);

