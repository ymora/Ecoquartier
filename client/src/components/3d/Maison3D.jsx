import { Html } from '@react-three/drei';

function Maison3D({ 
  position = [0, 0, 0], 
  largeur = 10, 
  profondeur = 8, 
  hauteur = 7,
  profondeurFondations = 1.2,
  onClick
}) {
  const hauteurToit = 2;
  
  return (
    <group position={position} onClick={onClick}>
      {/* FONDATIONS sous terre (gris wireframe) */}
      <mesh position={[0, -profondeurFondations / 2, 0]}>
        <boxGeometry args={[largeur + 1, profondeurFondations, profondeur + 1]} />
        <meshStandardMaterial 
          color="#666666" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
      
      {/* MURS (blanc/beige) */}
      <mesh position={[0, hauteur / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[largeur, hauteur, profondeur]} />
        <meshStandardMaterial 
          color="#e0e0e0"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* TOIT (rouge - pyramide) */}
      <mesh position={[0, hauteur + hauteurToit / 2, 0]} castShadow>
        <coneGeometry args={[largeur * 0.7, hauteurToit, 4]} />
        <meshStandardMaterial 
          color="#c62828"
          roughness={0.6}
        />
      </mesh>
      
      {/* Label */}
      <Html position={[0, hauteur + hauteurToit + 0.5, 0]} center>
        <div style={{ 
          background: 'white', 
          padding: '6px 12px', 
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#ff6f00',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          border: '2px solid #ff6f00'
        }}>
          🏠 Maison
        </div>
      </Html>
      
      {/* Label dimensions */}
      <Html position={[0, -0.3, 0]} center>
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          padding: '3px 8px', 
          borderRadius: '4px',
          fontSize: '11px',
          color: '#666',
          whiteSpace: 'nowrap'
        }}>
          {`${largeur}m × ${profondeur}m × H:${hauteur}m`}
        </div>
      </Html>
      
      {/* Label fondations */}
      <Html position={[0, -profondeurFondations - 0.3, 0]} center>
        <div style={{ 
          background: 'rgba(100,100,100,0.8)', 
          padding: '2px 6px', 
          borderRadius: '3px',
          fontSize: '9px',
          color: 'white',
          whiteSpace: 'nowrap'
        }}>
          {`Fondations: ${profondeurFondations}m prof.`}
        </div>
      </Html>
    </group>
  );
}

export default Maison3D;

