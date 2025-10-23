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
    { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd' },
    { nom: 'Sous-sol', profondeur: 200, couleur: '#a1887f' }
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
      {/* SOL SURFACE (herbe verte) - ✅ TOUJOURS OPAQUE pour voir les pavés enherbés */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.07, 0]} 
        receiveShadow
        raycast={() => null} // ✅ Désactiver l'interaction pour permettre clic sur objets en dessous
      >
        <planeGeometry args={[largeur, hauteur]} />
        <meshStandardMaterial 
          color="#8bc34a"
          roughness={0.9}
        />
      </mesh>
      
      {/* COUCHES DE SOL (dynamique) */}
      {couches.map((couche, index) => (
        <group key={index}>
          {/* Couche de sol - ✅ Transparence augmentée pour voir les racines */}
          <mesh 
            position={[0, couche.positionY, 0]}
            raycast={() => null} // ✅ Désactiver l'interaction pour permettre clic sur objets en dessous
          >
            <boxGeometry args={[largeur, couche.profondeurM, hauteur]} />
            <meshStandardMaterial 
              color={couche.couleur}
              transparent 
              opacity={transparent ? 0.25 - index * 0.05 : 0.85 - index * 0.1}
              roughness={0.95}
              metalness={index * 0.05}
              depthWrite={!transparent}
              side={2}
            />
          </mesh>
          
          {/* Bordure visible entre les couches (sauf pour la dernière) - Masquée si transparent */}
          {!transparent && index < couches.length - 1 && (
            <>
              <mesh 
                position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), 0]} 
                rotation={[-Math.PI / 2, 0, 0]}
                raycast={() => null}
              >
                <planeGeometry args={[largeur, hauteur]} />
                <meshBasicMaterial 
                  color="#4a3728"
                  opacity={0.9}
                  transparent
                />
              </mesh>
              
              {/* Lignes orange de séparation */}
              <mesh 
                position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), largeur / 2]} 
                rotation={[0, 0, 0]}
                raycast={() => null}
              >
                <boxGeometry args={[largeur, 0.05, 0.1]} />
                <meshBasicMaterial color="#ff9800" />
              </mesh>
              <mesh 
                position={[0, -(couche.profondeurCumuleeAvant + couche.profondeurM), -largeur / 2]} 
                rotation={[0, 0, 0]}
                raycast={() => null}
              >
                <boxGeometry args={[largeur, 0.05, 0.1]} />
                <meshBasicMaterial color="#ff9800" />
              </mesh>
            </>
          )}
        </group>
      ))}
      
      {/* ✅ Labels sur 2 lignes - Terre végétale + Marne */}
      <Html position={[-largeur / 2 - 1.5, -0.2, 0]}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '5px 10px', 
          borderRadius: '8px',
          fontSize: '10px',
          color: '#333',
          fontWeight: '600',
          border: '1.5px solid #8d6e63',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          lineHeight: '1.4',
          minWidth: '140px',
          textAlign: 'left'
        }}>
          <div style={{ whiteSpace: 'nowrap' }}>{icones[0]} {couches[0]?.nom} {couches[0]?.profondeur}cm</div>
          {couches[1] && <div style={{ whiteSpace: 'nowrap' }}>{icones[1]} {couches[1]?.nom} {couches[1]?.profondeur}cm</div>}
        </div>
      </Html>
      
      {/* Ligne de référence niveau 0 (sous l'herbe) - Masquée si transparent */}
      {!transparent && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[largeur + 2, 0.01, hauteur + 2]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

// Optimisation : Éviter re-renders du sol 3D
export default memo(Sol3D);

