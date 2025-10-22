import { Html } from '@react-three/drei';

function Citerne3D({ 
  position = [0, 0, 0], 
  largeur = 2, 
  profondeur = 2,
  profondeurEnterree = 2.5,
  volume = 3000
}) {
  return (
    <group position={[position[0], -profondeurEnterree / 2, position[2]]}>
      {/* Citerne enterrée (cylindre couché) */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[profondeur / 2, profondeur / 2, largeur, 16]} />
        <meshStandardMaterial 
          color="#00acc1"
          transparent 
          opacity={0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Couvercle au niveau du sol */}
      <mesh position={[0, profondeurEnterree / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

