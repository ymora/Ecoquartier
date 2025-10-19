/**
 * Zones de validation 3D - Affichage des conflits entre racines et infrastructures
 */

function ZonesValidation3D({ 
  arbrePosition,
  profondeurRacines,
  envergure,
  obstacles = [],
  afficher = true
}) {
  if (!afficher) return null;
  
  return (
    <group>
      {/* Zone de racines (sphère aplatie rouge si conflit) */}
      {obstacles.map((obstacle, idx) => {
        // Calculer distance entre arbre et obstacle
        const dx = arbrePosition[0] - obstacle.position[0];
        const dy = arbrePosition[2] - obstacle.position[2];
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Vérifier conflit de profondeur
        let conflit = false;
        let couleur = '#4caf50'; // Vert par défaut
        
        if (obstacle.type === 'fondations') {
          if (profondeurRacines > obstacle.profondeur && distance < obstacle.distanceMin) {
            conflit = true;
            couleur = '#f44336'; // Rouge
          }
        }
        
        if (obstacle.type === 'canalisation') {
          if (profondeurRacines > obstacle.profondeur && distance < obstacle.distanceMin) {
            conflit = true;
            couleur = '#ff9800'; // Orange
          }
        }
        
        if (!conflit) return null;
        
        // Ligne de conflit entre arbre et obstacle
        return (
          <group key={`conflit-${idx}`}>
            {/* Ligne rouge montrant le conflit */}
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
              <meshBasicMaterial color={couleur} transparent opacity={0.6} />
              <mesh 
                position={[
                  (arbrePosition[0] + obstacle.position[0]) / 2,
                  -profondeurRacines / 2,
                  (arbrePosition[2] + obstacle.position[2]) / 2
                ]}
                rotation={[0, 0, Math.atan2(dy, dx)]}
              />
            </mesh>
            
            {/* Zone de conflit (sphère rouge transparente) */}
            <mesh 
              position={[arbrePosition[0], -profondeurRacines / 2, arbrePosition[2]]}
            >
              <sphereGeometry args={[envergure / 3, 12, 12]} />
              <meshBasicMaterial 
                color={couleur}
                transparent 
                opacity={0.2}
                wireframe
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default ZonesValidation3D;

