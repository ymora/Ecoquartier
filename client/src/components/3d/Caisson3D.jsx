import Label3D from './Label3D';

function Caisson3D({ 
  position = [0, 0, 0], 
  largeur = 5, 
  profondeur = 3,
  hauteur = 1,
  volume = 15,
  angle = 0,
  elevationSol = -1.0,
  onClick = null
}) {
  return (
    <group position={[position[0], elevationSol, position[2]]} rotation={[0, -(angle * Math.PI / 180), 0]} onClick={onClick}>
      {/* Caisson rectangulaire enterré */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[largeur, hauteur, profondeur]} />
        <meshStandardMaterial 
          color="#2196f3"
          transparent 
          opacity={0.6}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>
      
      {/* Couvercle au niveau du sol (trou d'accès) */}
      <mesh position={[0, hauteur / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial 
          color="#666666"
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>
      
      {/* Label avec volume */}
      <Label3D position={[0, hauteur / 2 + 0.3, 0]}>
        🟦 {volume}m³ ({largeur}×{profondeur}×{hauteur}m)
      </Label3D>
    </group>
  );
}

export default Caisson3D;

