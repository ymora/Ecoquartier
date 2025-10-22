import { memo } from 'react';
import * as THREE from 'three';

function Maison3D({ 
  position = [0, 0, 0], 
  largeur = 10, 
  profondeur = 8, 
  hauteur = 7,
  profondeurFondations = 1.2,
  angle = 0,
  onClick
}) {
  const hauteurToit = 2.5;
  
  // Convertir l'angle en radians (THREE.js utilise des radians)
  const angleRad = (angle * Math.PI) / 180;
  
  // Créer un toit à 2 pans réaliste
  const createToitGeometry = () => {
    const shape = new THREE.Shape();
    const penteY = hauteurToit;
    
    // Dessiner le profil du toit (triangle)
    shape.moveTo(-largeur / 2, 0);
    shape.lineTo(0, penteY);
    shape.lineTo(largeur / 2, 0);
    shape.lineTo(-largeur / 2, 0);
    
    const extrudeSettings = {
      steps: 1,
      depth: profondeur,
      bevelEnabled: false
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };
  
  // Dimensions sous-sol
  const hauteurFondationsSemelles = 0.4; // 40cm de hauteur pour les semelles
  const hauteurMursSousSol = 2.1; // 2.1m de hauteur pour les murs du sous-sol
  const profondeurTotaleSousSol = hauteurFondationsSemelles + hauteurMursSousSol; // 2.5m total
  
  return (
    <group position={position} rotation={[0, angleRad, 0]} onClick={onClick}>
      {/* FONDATIONS / SEMELLES sous terre (40cm, plus larges que la maison) */}
      <mesh position={[0, -profondeurTotaleSousSol + hauteurFondationsSemelles / 2, 0]}>
        <boxGeometry args={[largeur + 1, hauteurFondationsSemelles, profondeur + 1]} />
        <meshStandardMaterial 
          color="#666666" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
      
      {/* MURS DU SOUS-SOL (2.1m, même taille que la maison) */}
      <mesh position={[0, -hauteurMursSousSol / 2, 0]}>
        <boxGeometry args={[largeur, hauteurMursSousSol, profondeur]} />
        <meshStandardMaterial 
          color="#999999" 
          transparent 
          opacity={0.6}
          roughness={0.9}
        />
      </mesh>
      
      {/* MURS RDC + ÉTAGES (beige avec texture brique simulée) */}
      <mesh position={[0, hauteur / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[largeur, hauteur, profondeur]} />
        <meshStandardMaterial 
          color="#f5e6d3"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>
      
      {/* Détails fenêtres (façade avant) */}
      <mesh position={[0, hauteur * 0.6, profondeur / 2 + 0.02]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.1]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[-2.5, hauteur * 0.6, profondeur / 2 + 0.02]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.1]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[2.5, hauteur * 0.6, profondeur / 2 + 0.02]} castShadow>
        <boxGeometry args={[1.2, 1.5, 0.1]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* Porte d'entrée */}
      <mesh position={[0, hauteur * 0.2, profondeur / 2 + 0.02]} castShadow>
        <boxGeometry args={[1, 2.2, 0.15]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Poignée de porte */}
      <mesh position={[0.3, hauteur * 0.2, profondeur / 2 + 0.1]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.9} />
      </mesh>
      
      {/* TOIT à 2 pans (tuiles rouges) */}
      <mesh 
        position={[0, hauteur, -profondeur / 2]} 
        rotation={[0, 0, 0]}
        castShadow
      >
        <primitive object={createToitGeometry()} />
        <meshStandardMaterial 
          color="#b71c1c"
          roughness={0.7}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Faîtage du toit (arête supérieure) */}
      <mesh position={[0, hauteur + hauteurToit, 0]} castShadow>
        <boxGeometry args={[0.15, 0.15, profondeur + 0.2]} />
        <meshStandardMaterial color="#8b0000" roughness={0.5} />
      </mesh>
      
      {/* Cheminée */}
      <mesh position={[-largeur * 0.25, hauteur + hauteurToit * 0.7, 0]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.6]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      
      {/* ✅ Pas de label - la maison est reconnaissable visuellement */}
    </group>
  );
}

// Optimisation : Éviter re-renders de la maison 3D
export default memo(Maison3D);

