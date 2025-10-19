import { Html } from '@react-three/drei';

function Sol3D({ 
  largeur = 30, 
  hauteur = 30,
  couchesSol = [
    { nom: 'Terre végétale', profondeur: 30, couleur: '#795548' },
    { nom: 'Marne calcaire', profondeur: 70, couleur: '#bdbdbd' }
  ]
}) {
  // Convertir cm en m
  const profondeurTerre = couchesSol[0].profondeur / 100;
  const profondeurMarne = couchesSol[1].profondeur / 100;
  
  return (
    <group>
      {/* SOL SURFACE (herbe verte) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[largeur, hauteur]} />
        <meshStandardMaterial 
          color="#8bc34a"
          roughness={0.9}
        />
      </mesh>
      
      {/* GRILLE au sol (pour référence) */}
      <gridHelper 
        args={[largeur, largeur, '#cccccc', '#eeeeee']} 
        position={[0, 0.01, 0]}
      />
      
      {/* COUCHE 1 : Terre végétale (plus opaque et texturée) */}
      <mesh position={[0, -profondeurTerre / 2, 0]}>
        <boxGeometry args={[largeur, profondeurTerre, hauteur]} />
        <meshStandardMaterial 
          color={couchesSol[0].couleur}
          transparent 
          opacity={0.85}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      
      {/* Bordure visible entre les couches */}
      <mesh position={[0, -profondeurTerre, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[largeur, hauteur]} />
        <meshBasicMaterial 
          color="#4a3728"
          opacity={0.9}
          transparent
        />
      </mesh>
      
      {/* Label Terre végétale avec flèche de profondeur */}
      <Html position={[-largeur / 2 - 2, -profondeurTerre / 2, 0]}>
        <div style={{ 
          background: 'rgba(121,85,72,0.95)', 
          padding: '6px 10px', 
          borderRadius: '6px',
          fontSize: '12px',
          color: 'white',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: '2px solid #5d4037',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          🌱 {couchesSol[0].nom}
          <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.9 }}>
            ↕️ {couchesSol[0].profondeur}cm
          </div>
        </div>
      </Html>
      
      {/* COUCHE 2 : Marne/sous-sol (plus visible) */}
      <mesh position={[0, -profondeurTerre - profondeurMarne / 2, 0]}>
        <boxGeometry args={[largeur, profondeurMarne, hauteur]} />
        <meshStandardMaterial 
          color={couchesSol[1].couleur}
          transparent 
          opacity={0.7}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Label Marne avec flèche de profondeur */}
      <Html position={[-largeur / 2 - 2, -profondeurTerre - profondeurMarne / 2, 0]}>
        <div style={{ 
          background: 'rgba(158,158,158,0.95)', 
          padding: '6px 10px', 
          borderRadius: '6px',
          fontSize: '12px',
          color: 'white',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: '2px solid #9e9e9e',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          ⛰️ {couchesSol[1].nom}
          <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.9 }}>
            ↕️ {couchesSol[1].profondeur}cm
          </div>
        </div>
      </Html>
      
      {/* Ligne de séparation visible entre couches */}
      <mesh position={[0, -profondeurTerre, largeur / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[largeur, 0.05, 0.1]} />
        <meshBasicMaterial color="#ff9800" />
      </mesh>
      <mesh position={[0, -profondeurTerre, -largeur / 2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[largeur, 0.05, 0.1]} />
        <meshBasicMaterial color="#ff9800" />
      </mesh>
      
      {/* Ligne de référence niveau 0 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[largeur + 2, 0.02, hauteur + 2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default Sol3D;

