function Cloture3D({ 
  x1 = 0, 
  y1 = 0, 
  x2 = 10, 
  y2 = 0, 
  hauteur = 1.8 
}) {
  // Calculer position centrale et rotation
  const dx = x2 - x1;
  const dy = y2 - y1;
  const longueur = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  
  return (
    <group position={[centerX, hauteur / 2, centerY]}>
      {/* Clôture (panneau mince) */}
      <mesh rotation={[0, angle, 0]} castShadow receiveShadow>
        <boxGeometry args={[longueur, hauteur, 0.05]} />
        <meshStandardMaterial 
          color="#ffd54f"
          transparent 
          opacity={0.6}
          roughness={0.7}
          side={2} // DoubleSide
        />
      </mesh>
      
      {/* Poteaux (tous les 2m) */}
      {Array.from({ length: Math.floor(longueur / 2) + 1 }).map((_, i) => {
        const posX = -longueur / 2 + i * 2;
        return (
          <mesh 
            key={i}
            position={[posX * Math.cos(angle), 0, posX * Math.sin(angle)]}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, hauteur, 8]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

export default Cloture3D;

