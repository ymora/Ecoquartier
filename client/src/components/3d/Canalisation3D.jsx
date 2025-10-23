function Canalisation3D({ 
  x1 = 0, 
  y1 = 0, 
  x2 = 5, 
  y2 = 5, 
  profondeur = 0.6,
  diametre = 0.1,
  onClick = null
}) {
  // Calculer position centrale et rotation
  const dx = x2 - x1;
  const dy = y2 - y1;
  const longueur = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  
  return (
    <group position={[centerX, -profondeur, centerY]} onClick={onClick}>
      {/* ✅ Tuyau HORIZONTAL sous terre (rotation corrigée) */}
      <mesh rotation={[0, angle, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[diametre / 2, diametre / 2, longueur, 12]} />
        <meshStandardMaterial 
          color="#2196f3"
          roughness={0.3}
          metalness={0.7}
          emissive="#1565c0"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* ✅ Pas de tranchée - tuyau seul suffit */}
      {/* ✅ Pas de label - canalisation reconnaissable par sa couleur bleue */}
    </group>
  );
}

export default Canalisation3D;

