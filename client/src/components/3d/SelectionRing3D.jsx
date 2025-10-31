/**
 * SelectionRing3D.jsx
 * 🎯 Anneau de sélection unifié pour tous les objets 3D
 * Positionné automatiquement au-dessus de l'objet
 */

import * as THREE from 'three';

/**
 * Composant d'anneau de sélection unifié
 * @param {boolean} visible - Si l'anneau doit être visible
 * @param {string} color - Couleur de l'anneau
 * @param {number} size - Taille de l'anneau
 * @param {number} height - Hauteur au-dessus de l'objet (défaut: 2m)
 * @param {number} opacity - Opacité de l'anneau
 * @param {boolean} animated - Si l'anneau doit être animé
 */
export default function SelectionRing3D({ 
  visible = true, 
  color = '#2196f3', 
  size = 1, 
  height = 2,
  opacity = 0.6,
  animated = false 
}) {
  if (!visible) return null;

  return (
    <group>
      {/* Anneau principal */}
      <mesh position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size, size * 1.2, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={opacity} 
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Anneau secondaire pour l'animation */}
      {animated && (
        <mesh position={[0, height + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.1, size * 1.3, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={opacity * 0.5} 
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
