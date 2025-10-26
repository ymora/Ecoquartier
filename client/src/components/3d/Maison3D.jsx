import { memo } from 'react';
import * as THREE from 'three';

function Maison3D({ 
  position = [0, 0, 0], 
  largeur = 10, 
  profondeur = 8, 
  hauteur = 7,
  elevationSol = 0,
  angle = 0,
<<<<<<< HEAD
  typeToit = '2pans', // ✅ Ajout du type de toit : 'plat', 'monopente', '2pans'
  penteToit = 3, // ✅ Pente du toit en degrés (angle d'inclinaison)
  orientationToit = 0, // ✅ Orientation du toit monopente (0°, 90°, 180°, 270°)
  onClick
}) {
  // Convertir l'angle de pente en degrés en hauteur de toit
  // Pour le toit à 2 pans : utiliser la largeur
  // Pour le toit monopente : utiliser la dimension appropriée selon l'orientation
  const dimensionPente = typeToit === 'monopente' && (orientationToit === 90 || orientationToit === 270) ? profondeur : largeur;
  const hauteurToit = Math.tan((penteToit * Math.PI) / 180) * (dimensionPente / 2);
=======
  typeToit = 'deux-pentes', // 'plan', 'monopente', 'deux-pentes'
  onClick
}) {
  // Profondeur des fondations fixe à 1.2m (standard)
  const profondeurFondations = 1.2;
  const hauteurToit = typeToit === 'plan' ? 0.1 : 2.5;
>>>>>>> 919d988e5a225390d7f1a00a8fa300c5c1a7500e
  
  // Convertir l'angle en radians et inverser pour correspondre à Fabric.js
  // Fabric.js : angle positif = rotation horaire (vers le bas)
  // Three.js : angle positif = rotation antihoraire (vers le haut)
  const angleRad = -(angle * Math.PI) / 180;
  
<<<<<<< HEAD
  // Créer la géométrie du toit selon le type
  const createToitGeometry = () => {
    switch (typeToit) {
      case 'plat':
        // Toit plat - simple boîte
        return new THREE.BoxGeometry(largeur, 0.2, profondeur);
        
      case 'monopente':
        // Toit monopente - forme triangulaire adaptée à l'orientation et aux dimensions
        const shape = new THREE.Shape();
        const penteY = hauteurToit;
        
        // Adapter la géométrie selon l'orientation pour optimiser la couverture
        if (orientationToit === 0 || orientationToit === 180) {
          // Pente vers l'avant/arrière - utiliser la largeur (côté le plus long si rectangulaire)
          const dimensionPente = Math.max(largeur, profondeur);
          shape.moveTo(-dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, penteY);
          shape.lineTo(-dimensionPente / 2, 0);
        } else {
          // Pente vers les côtés - utiliser la profondeur (côté le plus court si rectangulaire)
          const dimensionPente = Math.min(largeur, profondeur);
          shape.moveTo(-dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, 0);
          shape.lineTo(dimensionPente / 2, penteY);
          shape.lineTo(-dimensionPente / 2, 0);
        }
        
        const extrudeSettings = {
          steps: 1,
          depth: orientationToit === 0 || orientationToit === 180 ? 
                 Math.min(largeur, profondeur) : 
                 Math.max(largeur, profondeur),
          bevelEnabled: false
        };
        
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
      case '2pans':
      default:
        // Toit à 2 pans - forme triangulaire
        const shape2pans = new THREE.Shape();
        const penteY2pans = hauteurToit;
        
        // Dessiner le profil du toit (triangle)
        shape2pans.moveTo(-largeur / 2, 0);
        shape2pans.lineTo(0, penteY2pans);
        shape2pans.lineTo(largeur / 2, 0);
        shape2pans.lineTo(-largeur / 2, 0);
        
        const extrudeSettings2pans = {
          steps: 1,
          depth: profondeur,
          bevelEnabled: false
        };
        
        return new THREE.ExtrudeGeometry(shape2pans, extrudeSettings2pans);
    }
=======
  // Créer différents types de toits
  const createToitGeometry = () => {
    if (typeToit === 'plan') {
      // Toit plan - simple boîte plate
      return new THREE.BoxGeometry(largeur, 0.1, profondeur);
    }
    
    if (typeToit === 'monopente') {
      // Toit monopente - forme de prisme
      const shape = new THREE.Shape();
      const penteY = hauteurToit;
      
      shape.moveTo(-largeur / 2, 0);
      shape.lineTo(largeur / 2, 0);
      shape.lineTo(largeur / 2, penteY);
      shape.lineTo(-largeur / 2, 0);
      
      const extrudeSettings = {
        steps: 1,
        depth: profondeur,
        bevelEnabled: false
      };
      
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }
    
    // Toit à deux pentes (défaut)
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
>>>>>>> 919d988e5a225390d7f1a00a8fa300c5c1a7500e
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
      
<<<<<<< HEAD
      {/* TOIT selon le type - GROUPE COMPLET avec tous les éléments */}
      <group 
        position={[
          0, 
          hauteur + (typeToit === 'plat' ? 0.1 : 0), 
          typeToit === 'plat' ? 0 : 0
        ]}
        rotation={[
          0, 
          (typeToit === 'monopente' || typeToit === '2pans') ? (orientationToit * Math.PI) / 180 : 0, 
          0
        ]}
      >
        {/* Toit principal */}
        <mesh 
          position={[0, 0, typeToit === 'plat' ? 0 : -profondeur / 2]}
=======
      {/* TOIT selon le type */}
      {typeToit === 'plan' ? (
        // Toit plan
        <mesh 
          position={[0, hauteur + 0.05, 0]} 
>>>>>>> 919d988e5a225390d7f1a00a8fa300c5c1a7500e
          castShadow
        >
          <primitive object={createToitGeometry()} />
          <meshStandardMaterial 
<<<<<<< HEAD
            color={
              typeToit === 'plat' ? "#666666" : 
              typeToit === 'monopente' ? "#8B0000" : 
              "#b71c1c"
            } // ✅ Couleurs différentes selon le type de toit
=======
            color="#8b4513"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ) : typeToit === 'monopente' ? (
        // Toit monopente
        <mesh 
          position={[0, hauteur, -profondeur / 2]} 
          rotation={[0, 0, 0]}
          castShadow
        >
          <primitive object={createToitGeometry()} />
          <meshStandardMaterial 
            color="#b71c1c"
>>>>>>> 919d988e5a225390d7f1a00a8fa300c5c1a7500e
            roughness={0.7}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
<<<<<<< HEAD
        
        {/* Faîtage du toit (arête supérieure) - seulement pour toit à 2 pans */}
        {typeToit === '2pans' && (
          <mesh position={[0, hauteurToit, 0]} castShadow>
            <boxGeometry args={[0.15, 0.15, profondeur + 0.2]} />
            <meshStandardMaterial color="#8b0000" roughness={0.5} />
          </mesh>
        )}
        
        {/* Cheminée - seulement pour toit à 2 pans */}
        {typeToit === '2pans' && (
          <mesh position={[-largeur * 0.25, hauteurToit * 0.7, 0]} castShadow>
            <boxGeometry args={[0.6, 1.2, 0.6]} />
            <meshStandardMaterial color="#8b4513" roughness={0.8} />
          </mesh>
        )}
      </group>
=======
      ) : (
        // Toit à deux pentes (défaut)
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
      )}
      
      {/* Faîtage du toit (seulement pour les toits à DEUX pentes) */}
      {typeToit === 'deux-pentes' && (
        <mesh position={[0, hauteur + hauteurToit, 0]} castShadow>
          <boxGeometry args={[0.15, 0.15, profondeur + 0.2]} />
          <meshStandardMaterial color="#8b0000" roughness={0.5} />
        </mesh>
      )}
      
      {/* Cheminée (seulement pour les toits à DEUX pentes) */}
      {typeToit === 'deux-pentes' && (
        <mesh position={[-largeur * 0.25, hauteur + hauteurToit * 0.7, 0]} castShadow>
          <boxGeometry args={[0.6, 1.2, 0.6]} />
          <meshStandardMaterial color="#8b4513" roughness={0.8} />
        </mesh>
      )}
>>>>>>> 919d988e5a225390d7f1a00a8fa300c5c1a7500e
      
      {/* ✅ Pas de label - la maison est reconnaissable visuellement */}
    </group>
  );
}

// Optimisation : Éviter re-renders de la maison 3D
export default memo(Maison3D);

