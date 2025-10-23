import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Pavé enherbé ultra-réaliste
 * - Pavés béton 12cm × 12cm × 5cm
 * - 3cm d'herbe entre les pavés
 * - Brins d'herbe animés par le vent
 */
function PaveEnherbe3D({ 
  position = [0, 0, 0], 
  largeur = 2, 
  profondeur = 2,
  onClick = null
}) {
  const herbeGroupRef = useRef();
  
  // Configuration des pavés
  const TAILLE_PAVE = 0.10; // 10 cm
  const EPAISSEUR_PAVE = 0.05; // 5 cm
  const ESPACEMENT_HERBE = 0.04; // 4 cm entre les pavés
  const HAUTEUR_HERBE = 0.12; // 12 cm de hauteur d'herbe (visible entre les pavés)
  
  // Calculer le nombre de pavés selon les dimensions
  const nbPavesX = Math.floor(largeur / (TAILLE_PAVE + ESPACEMENT_HERBE));
  const nbPavesZ = Math.floor(profondeur / (TAILLE_PAVE + ESPACEMENT_HERBE));
  
  // Générer les positions des pavés
  const paves = useMemo(() => {
    const positions = [];
    const offsetX = -largeur / 2;
    const offsetZ = -profondeur / 2;
    
    for (let x = 0; x < nbPavesX; x++) {
      for (let z = 0; z < nbPavesZ; z++) {
        const posX = offsetX + x * (TAILLE_PAVE + ESPACEMENT_HERBE) + TAILLE_PAVE / 2;
        const posZ = offsetZ + z * (TAILLE_PAVE + ESPACEMENT_HERBE) + TAILLE_PAVE / 2;
        positions.push([posX, EPAISSEUR_PAVE / 2, posZ]);
      }
    }
    
    return positions;
  }, [largeur, profondeur, nbPavesX, nbPavesZ]);
  
  // Générer les brins d'herbe entre les pavés (instancing pour performance)
  const instancesHerbe = useMemo(() => {
    const positions = [];
    const scales = [];
    const rotations = [];
    const phases = []; // Phase de l'animation de vent (aléatoire)
    
    const offsetX = -largeur / 2;
    const offsetZ = -profondeur / 2;
    
    // Brins d'herbe dans les espaces entre pavés
    for (let x = 0; x < nbPavesX; x++) {
      for (let z = 0; z < nbPavesZ; z++) {
        // Position du pavé
        const paveX = offsetX + x * (TAILLE_PAVE + ESPACEMENT_HERBE);
        const paveZ = offsetZ + z * (TAILLE_PAVE + ESPACEMENT_HERBE);
        
        // Herbe à DROITE du pavé
        if (x < nbPavesX - 1) {
          const nbBrins = 12; // Brins d'herbe dans cet espace
          for (let i = 0; i < nbBrins; i++) {
            const herbePosX = paveX + TAILLE_PAVE + Math.random() * ESPACEMENT_HERBE;
            const herbePosZ = paveZ + Math.random() * TAILLE_PAVE;
            
            // Position au-dessus du sol pour être visible
            positions.push(herbePosX, HAUTEUR_HERBE / 2, herbePosZ);
            
            // Variation de taille (hauteur)
            const scaleX = 0.6 + Math.random() * 0.4; // Largeur du brin
            const scaleY = 0.7 + Math.random() * 0.6; // Hauteur variable
            scales.push(scaleX, scaleY, scaleX);
            
            // Rotation aléatoire autour de l'axe Y
            rotations.push(0, Math.random() * Math.PI * 2, 0);
            
            // Phase aléatoire pour animation
            phases.push(Math.random() * Math.PI * 2);
          }
        }
        
        // Herbe EN BAS du pavé
        if (z < nbPavesZ - 1) {
          const nbBrins = 12;
          for (let i = 0; i < nbBrins; i++) {
            const herbePosX = paveX + Math.random() * TAILLE_PAVE;
            const herbePosZ = paveZ + TAILLE_PAVE + Math.random() * ESPACEMENT_HERBE;
            
            positions.push(herbePosX, HAUTEUR_HERBE / 2, herbePosZ);
            
            const scale = 0.8 + Math.random() * 0.4;
            scales.push(scale, scale, scale);
            
            rotations.push(0, Math.random() * Math.PI * 2, 0);
            phases.push(Math.random() * Math.PI * 2);
          }
        }
        
        // Herbe dans le COIN (intersection)
        if (x < nbPavesX - 1 && z < nbPavesZ - 1) {
          const nbBrins = 8;
          for (let i = 0; i < nbBrins; i++) {
            const herbePosX = paveX + TAILLE_PAVE + Math.random() * ESPACEMENT_HERBE;
            const herbePosZ = paveZ + TAILLE_PAVE + Math.random() * ESPACEMENT_HERBE;
            
            positions.push(herbePosX, HAUTEUR_HERBE / 2, herbePosZ);
            
            const scale = 0.7 + Math.random() * 0.4;
            scales.push(scale, scale, scale);
            
            rotations.push(0, Math.random() * Math.PI * 2, 0);
            phases.push(Math.random() * Math.PI * 2);
          }
        }
      }
    }
    
    return { 
      positions: new Float32Array(positions), 
      scales: new Float32Array(scales),
      rotations: new Float32Array(rotations),
      phases: new Float32Array(phases),
      count: positions.length / 3
    };
  }, [largeur, profondeur, nbPavesX, nbPavesZ]);
  
  // Animation de l'herbe au vent
  useFrame((state) => {
    if (!herbeGroupRef.current || !instancesHerbe || instancesHerbe.count === 0) return;
    
    const time = state.clock.getElapsedTime();
    const instancedMesh = herbeGroupRef.current;
    
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    for (let i = 0; i < instancesHerbe.count; i++) {
      // Position de base
      position.set(
        instancesHerbe.positions[i * 3],
        instancesHerbe.positions[i * 3 + 1],
        instancesHerbe.positions[i * 3 + 2]
      );
      
      // Scale
      scale.set(
        instancesHerbe.scales[i * 3],
        instancesHerbe.scales[i * 3 + 1],
        instancesHerbe.scales[i * 3 + 2]
      );
      
      // Rotation de base + oscillation du vent
      const phase = instancesHerbe.phases[i];
      const baseRotY = instancesHerbe.rotations[i * 3 + 1];
      
      // ✅ Vent qui fait balancer l'herbe : inclinaison en X et Z
      const windX = Math.sin(time * 2 + phase) * 0.4; // Balancement avant-arrière
      const windZ = Math.cos(time * 1.8 + phase * 0.7) * 0.35; // Balancement latéral
      
      rotation.set(windX, baseRotY, windZ);
      quaternion.setFromEuler(rotation);
      
      // ✅ Position légèrement décalée pour l'effet de balancement depuis la base
      const offsetY = Math.abs(Math.sin(windX)) * scale.y * HAUTEUR_HERBE * 0.1;
      position.y += offsetY;
      
      // Composer la matrice
      matrix.compose(position, quaternion, scale);
      instancedMesh.setMatrixAt(i, matrix);
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <group position={position} onClick={onClick}>
      {/* Base en terre (sous les pavés) */}
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[largeur, 0.05, profondeur]} />
        <meshStandardMaterial 
          color="#795548"
          roughness={0.95}
        />
      </mesh>
      
      {/* Fond vert avec contour - D'ABORD pour être sous les pavés */}
      <group>
        {/* Base verte principale avec légère émissivité */}
        <mesh position={[0, EPAISSEUR_PAVE / 2, 0]} receiveShadow>
          <boxGeometry args={[largeur, 0.001, profondeur]} />
          <meshStandardMaterial 
            color="#66bb6a"
            roughness={0.95}
            emissive="#4caf50"
            emissiveIntensity={0.25}
          />
        </mesh>
        
        {/* Contour léger autour de toute la zone (bordure rectangulaire) */}
        <mesh position={[0, EPAISSEUR_PAVE / 2 + 0.001, 0]}>
          <boxGeometry args={[largeur + 0.01, 0.002, profondeur + 0.01]} />
          <meshStandardMaterial 
            color="#8bc34a"
            roughness={0.9}
            emissive="#7cb342"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>
      
      {/* Pavés béton 10cm × 10cm avec contour */}
      {paves.map((pavePos, idx) => (
        <group key={`pave-${idx}`} position={pavePos}>
          {/* Pavé principal */}
          <mesh 
            castShadow
            receiveShadow
          >
            <boxGeometry args={[TAILLE_PAVE, EPAISSEUR_PAVE, TAILLE_PAVE]} />
            <meshStandardMaterial 
              color="#9e9e9e"
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          {/* Contour (bordure légèrement plus sombre) */}
          <mesh position={[0, EPAISSEUR_PAVE / 2, 0]}>
            <boxGeometry args={[TAILLE_PAVE + 0.003, 0.002, TAILLE_PAVE + 0.003]} />
            <meshStandardMaterial 
              color="#757575"
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        </group>
      ))}
      
      {/* ✅ Herbe entre les pavés : BRINS VERTICAUX qui bougent au vent */}
      {instancesHerbe && instancesHerbe.count > 0 && (
        <instancedMesh 
          ref={herbeGroupRef}
          args={[null, null, instancesHerbe.count]}
          castShadow
          frustumCulled={false}
        >
          {/* ✅ Géométrie verticale : cylindre fin pour brin d'herbe (hauteur augmentée) */}
          <cylinderGeometry args={[0.003, 0.004, HAUTEUR_HERBE * 1.5, 8, 1]} />
          <meshStandardMaterial 
            color="#66bb6a"
            roughness={0.85}
            metalness={0}
            emissive="#4caf50"
            emissiveIntensity={0.3}
          />
        </instancedMesh>
      )}
    </group>
  );
}

export default PaveEnherbe3D;

