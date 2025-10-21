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
      {/* SOL SURFACE (herbe verte) - ✅ TOUJOURS OPAQUE pour voir les pavés enherbés */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.07, 0]} 
        receiveShadow
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
          <mesh position={[0, couche.positionY, 0]}>
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
        </group>
      ))}
      
      {/* ✅ UN SEUL Label pour TOUTES les couches - Évite superposition */}
      <Html position={[-largeur / 2 - 2, -0.5, 0]}>
        <div style={{ 
          background: transparent ? 'rgba(0, 0, 0, 0.85)' : 'rgba(121, 85, 72, 0.95)', 
          padding: '8px 12px', 
          borderRadius: '8px',
          fontSize: '10px',
          color: 'white',
          fontWeight: 'bold',
          border: '2px solid #8d6e63',
          boxShadow: '0 3px 10px rgba(0,0,0,0.4)',
          lineHeight: '1.4'
        }}>
          <div style={{ fontSize: '11px', marginBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px' }}>
            🌍 Composition du sol
          </div>
          {couches.map((couche, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              gap: '8px',
              padding: '2px 0',
              fontSize: '10px'
            }}>
              <span style={{ opacity: 0.9 }}>
                {icones[index] || '📦'} {couche.nom}
              </span>
              <span style={{ 
                color: '#ffd54f', 
                fontWeight: 'bold',
                minWidth: '40px',
                textAlign: 'right'
              }}>
                {couche.profondeur}cm
              </span>
            </div>
          ))}
          <div style={{ 
            marginTop: '4px', 
            paddingTop: '4px', 
            borderTop: '1px solid rgba(255,255,255,0.3)',
            fontSize: '9px',
            color: '#ffd54f',
            fontWeight: 'bold'
          }}>
            Total: {(profondeurCumulee * 100).toFixed(0)}cm
          </div>
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

