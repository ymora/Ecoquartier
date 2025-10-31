/**
 * HaloPulsant.jsx
 * 🎨 Halo pulsant animé avec dégradé unifié
 * Animation : Le halo grandit depuis le tronc et s'estompe progressivement
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SelectionRing3D from './SelectionRing3D';

/**
 * Composant HaloPulsant
 * @param {string} couleur - Couleur du halo
 * @param {number} taille - Taille du halo
 */
export default function HaloPulsant({ couleur = '#f44336', taille = 2 }) {
  const haloRef = useRef();
  const timeRef = useRef(0);
  
  // Animation du halo - toujours appelé pour éviter les hooks conditionnels
  useFrame((state, delta) => {
    if (!haloRef.current) return;
    
    // Incrémenter le temps
    timeRef.current += delta;
    
    // Cycle de 2 secondes
    const cycle = timeRef.current % 2;
    const progress = cycle / 2; // 0 à 1
    
    // Taille du halo : grandit depuis le centre
    const rayonMin = taille * 0.8;
    const rayonMax = taille * 1.2;
    const rayon = rayonMin + (rayonMax - rayonMin) * progress;
    
    // Opacité : diminue progressivement (fade out)
    const opaciteMax = 0.7;
    const opacite = opaciteMax * (1 - progress);
    
    // Appliquer les transformations
    haloRef.current.scale.setScalar(rayon / (taille * 0.8));
    haloRef.current.material.opacity = opacite;
  });
  
  return (
    <group>
      {/* Halo animé avec dégradé radial */}
      <mesh
        ref={haloRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.15, 0]} // Légèrement au-dessus du sol
      >
        <ringGeometry args={[taille * 0.4, taille * 0.6, 64]} />
        <meshBasicMaterial
          color={couleur}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          depthWrite={false} // Pour éviter les artefacts de transparence
        />
      </mesh>
      
      {/* Cercle de base (statique) pour indiquer la zone */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.12, 0]}
      >
        <ringGeometry args={[taille * 0.35, taille * 0.45, 64]} />
        <meshBasicMaterial
          color={couleur}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* ✅ Anneau de sélection unifié au-dessus */}
      <SelectionRing3D 
        visible={true}
        color={couleur}
        size={taille}
        height={2}
        opacity={0.6}
        animated={true}
      />
    </group>
  );
}


