import { Html } from '@react-three/drei';

function Canalisation3D({ 
  x1 = 0, 
  y1 = 0, 
  x2 = 5, 
  y2 = 5, 
  profondeur = 0.6,
  diametre = 0.1
}) {
  // Calculer position centrale et rotation
  const dx = x2 - x1;
  const dy = y2 - y1;
  const longueur = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  
  return (
    <group position={[centerX, -profondeur, centerY]}>
      {/* Tuyau horizontal */}
      <mesh rotation={[0, 0, angle]} castShadow>
        <cylinderGeometry args={[diametre / 2, diametre / 2, longueur, 12]} />
        <meshStandardMaterial 
          color="#2196f3"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Tranchée (wireframe pour voir à travers) */}
      <mesh rotation={[0, angle, 0]}>
        <boxGeometry args={[longueur, 0.3, 0.5]} />
        <meshStandardMaterial 
          color="#607d8b"
          transparent 
          opacity={0.2}
          wireframe
        />
      </mesh>
      
      {/* Label simplifié - Nom uniquement */}
      <Html position={[0, 0.5, 0]} center>
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          padding: '3px 8px', 
          borderRadius: '4px',
          fontSize: '10px',
          color: '#1976d2',
          whiteSpace: 'nowrap',
          fontWeight: 'bold'
        }}>
          🚰 Canalisation
        </div>
      </Html>
    </group>
  );
}

export default Canalisation3D;

