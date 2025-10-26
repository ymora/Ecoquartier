import { Html } from '@react-three/drei';

function Citerne3D({ 
  position = [0, 0, 0], 
  diametre = 1.5,
  longueur = 2.5,
  hauteur = 1.5,
  volume = 3000,
  elevationSol = -2.5,
  onClick = null
}) {
  return (
    <group position={[position[0], elevationSol, position[2]]} onClick={onClick}>
      {/* Citerne enterrée (cylindre couché) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[diametre / 2, diametre / 2, longueur, 16]} />
        <meshStandardMaterial 
          color="#00acc1"
          transparent 
          opacity={0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Couvercle au niveau du sol */}
      <mesh position={[0, -elevationSol, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <circleGeometry args={[0.4, 16]} />
        <meshStandardMaterial 
          color="#666666"
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>
      
      {/* Pas de label en 3D - l'objet se reconnaît visuellement */}
    </group>
  );
}

export default Citerne3D;

