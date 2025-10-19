import { useRef } from 'react';
import { Html } from '@react-three/drei';

function Arbre3D({ 
  position = [0, 0, 0], 
  arbreData, 
  hauteur = 6, 
  envergure = 4, 
  profondeurRacines = 1.5,
  validationStatus = 'ok',
  onClick
}) {
  const groupRef = useRef();
  
  // Couleurs selon validation
  const couleurs = {
    ok: '#2e7d32',
    warning: '#ff9800',
    error: '#f44336'
  };
  
  const couleur = couleurs[validationStatus] || couleurs.ok;
  
  // Calculer taille du tronc proportionnelle
  const rayonTronc = Math.min(0.3, hauteur * 0.04);
  const rayonTroncBase = rayonTronc * 1.2; // Base légèrement plus large
  
  return (
    <group ref={groupRef} position={position} onClick={onClick}>
      {/* TRONC (marron) */}
      <mesh position={[0, hauteur / 2, 0]} castShadow>
        <cylinderGeometry args={[rayonTronc, rayonTroncBase, hauteur, 12]} />
        <meshStandardMaterial 
          color="#795548" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* COURONNE (verte - ellipsoïde aplati) */}
      <mesh position={[0, hauteur + envergure * 0.3, 0]} castShadow>
        <sphereGeometry args={[envergure / 2, 16, 12]} />
        <meshStandardMaterial 
          color={couleur}
          transparent 
          opacity={0.7}
          roughness={0.6}
        />
      </mesh>
      
      {/* RACINES sous terre (wireframe pour transparence) */}
      <mesh position={[0, -profondeurRacines / 2, 0]}>
        <coneGeometry args={[envergure / 3, profondeurRacines, 8]} />
        <meshStandardMaterial 
          color={validationStatus === 'error' ? '#ff0000' : '#8B4513'}
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
      
      {/* Label nom (au-dessus) */}
      <Html position={[0, hauteur + envergure * 0.5 + 0.5, 0]} center>
        <div style={{ 
          background: 'white', 
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#1b5e20',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          border: '1px solid #1b5e20'
        }}>
          {arbreData?.name || 'Arbre'}
        </div>
      </Html>
      
      {/* Label dimensions */}
      <Html position={[0, -0.2, 0]} center>
        <div style={{ 
          background: 'rgba(255,255,255,0.9)', 
          padding: '2px 6px', 
          borderRadius: '3px',
          fontSize: '10px',
          color: '#666',
          whiteSpace: 'nowrap'
        }}>
          {`${envergure.toFixed(1)}m × ${hauteur.toFixed(1)}m`}
        </div>
      </Html>
    </group>
  );
}

export default Arbre3D;

