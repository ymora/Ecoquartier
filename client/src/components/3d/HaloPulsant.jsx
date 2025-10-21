/**
 * HaloPulsant.jsx
 * 🎨 Halo pulsant animé avec dégradé unifié
 * Animation : Le halo grandit depuis le tronc et s'estompe progressivement
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Composant HaloPulsant
 * @param {string} status - 'critical', 'error', 'warning', 'ok'
 * @param {Array} position - Position [x, y, z]
 * @param {number} envergure - Envergure actuelle de l'arbre
 */
export default function HaloPulsant({ status, position, envergure }) {
  const haloRef = useRef();
  const timeRef = useRef(0);
  
  // ⚠️ Protection : Si envergure invalide, ne rien afficher
  if (!envergure || envergure <= 0 || isNaN(envergure)) {
    console.warn('HaloPulsant: envergure invalide', { envergure, status });
    return null;
  }
  
  // Déterminer la couleur selon le statut
  const getCouleurHalo = () => {
    switch (status) {
      case 'critical':
        return new THREE.Color('#b71c1c'); // Rouge foncé
      case 'error':
        return new THREE.Color('#ff5722'); // Orange-rouge
      case 'warning':
        return new THREE.Color('#ffc107'); // Orange-jaune
      default:
        return null; // Pas de halo si 'ok'
    }
  };
  
  const couleur = getCouleurHalo();
  
  // Pas de halo si l'arbre est conforme
  if (!couleur) return null;
  
  // Animation du halo
  useFrame((state, delta) => {
    if (!haloRef.current) return;
    
    // Incrémenter le temps
    timeRef.current += delta;
    
    // Cycle de 2 secondes
    const cycle = timeRef.current % 2;
    const progress = cycle / 2; // 0 à 1
    
    // Taille du halo : grandit depuis le tronc (0.5) jusqu'à l'envergure + 1m
    const rayonMin = envergure / 2 + 0.5;
    const rayonMax = envergure / 2 + 1.5;
    const rayon = rayonMin + (rayonMax - rayonMin) * progress;
    
    // Opacité : diminue progressivement (fade out)
    const opaciteMax = status === 'critical' ? 0.8 : status === 'error' ? 0.7 : 0.6;
    const opacite = opaciteMax * (1 - progress);
    
    // Appliquer les transformations
    haloRef.current.scale.setScalar(rayon / (envergure / 2 + 0.5));
    haloRef.current.material.opacity = opacite;
  });
  
  return (
    <group position={position}>
      {/* Halo animé avec dégradé radial */}
      <mesh
        ref={haloRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.15, 0]} // Légèrement au-dessus du sol
      >
        <ringGeometry args={[envergure / 2 + 0.4, envergure / 2 + 0.6, 64]} />
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
        <ringGeometry args={[envergure / 2 - 0.1, envergure / 2 + 0.1, 64]} />
        <meshBasicMaterial
          color={couleur}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}


