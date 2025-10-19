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
      
      {/* COUCHE 1 : Terre végétale */}
      <mesh position={[0, -profondeurTerre / 2, 0]}>
        <boxGeometry args={[largeur, profondeurTerre, hauteur]} />
        <meshStandardMaterial 
          color={couchesSol[0].couleur}
          transparent 
          opacity={0.5}
        />
      </mesh>
      
      {/* Label Terre végétale */}
      <Html position={[-largeur / 2 - 1, -profondeurTerre / 2, 0]}>
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          padding: '3px 8px', 
          borderRadius: '4px',
          fontSize: '11px',
          color: '#795548',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: '1px solid #795548'
        }}>
          {`${couchesSol[0].nom} (${couchesSol[0].profondeur}cm)`}
        </div>
      </Html>
      
      {/* COUCHE 2 : Marne/sous-sol */}
      <mesh position={[0, -profondeurTerre - profondeurMarne / 2, 0]}>
        <boxGeometry args={[largeur, profondeurMarne, hauteur]} />
        <meshStandardMaterial 
          color={couchesSol[1].couleur}
          transparent 
          opacity={0.3}
        />
      </mesh>
      
      {/* Label Marne */}
      <Html position={[-largeur / 2 - 1, -profondeurTerre - profondeurMarne / 2, 0]}>
        <div style={{ 
          background: 'rgba(255,255,255,0.8)', 
          padding: '3px 8px', 
          borderRadius: '4px',
          fontSize: '11px',
          color: '#666',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          border: '1px solid #999'
        }}>
          {`${couchesSol[1].nom} (${couchesSol[1].profondeur}cm)`}
        </div>
      </Html>
      
      {/* Ligne de référence niveau 0 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[largeur + 2, 0.02, hauteur + 2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default Sol3D;

