import { useMemo, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Hook pour gérer le système LOD (Level of Detail)
 * Optimise les performances en réduisant la complexité des objets éloignés
 */

export function useLODSystem() {
  const { camera } = useThree();
  const lastCameraPosition = useRef(camera.position.clone());
  
  // Calculer la distance à la caméra
  const getDistanceToCamera = useCallback((objectPosition) => {
    return camera.position.distanceTo(new THREE.Vector3(...objectPosition));
  }, [camera]);
  
  // Déterminer le niveau de détail selon la distance
  const getLODLevel = useCallback((objectPosition, maxDistance = 100) => {
    const distance = getDistanceToCamera(objectPosition);
    
    if (distance < maxDistance * 0.3) return 'high';
    if (distance < maxDistance * 0.6) return 'medium';
    return 'low';
  }, [getDistanceToCamera]);
  
  // Optimiser les géométries selon le LOD
  const optimizeGeometry = useCallback((geometry, lodLevel) => {
    if (lodLevel === 'low') {
      // Simplifier la géométrie pour LOD bas
      if (geometry.attributes.position && geometry.attributes.position.count > 1000) {
        const simplifiedGeometry = geometry.clone();
        // Décimer les vertices
        const decimatedGeometry = new THREE.BufferGeometry();
        const positionAttribute = geometry.attributes.position;
        const newCount = Math.floor(positionAttribute.count * 0.3);
        
        const newPositions = new Float32Array(newCount * 3);
        const step = Math.floor(positionAttribute.count / newCount);
        
        for (let i = 0; i < newCount; i++) {
          const sourceIndex = i * step;
          newPositions[i * 3] = positionAttribute.array[sourceIndex * 3];
          newPositions[i * 3 + 1] = positionAttribute.array[sourceIndex * 3 + 1];
          newPositions[i * 3 + 2] = positionAttribute.array[sourceIndex * 3 + 2];
        }
        
        decimatedGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
        return decimatedGeometry;
      }
    }
    
    return geometry;
  }, []);
  
  // Optimiser les matériaux selon le LOD
  const optimizeMaterial = useCallback((material, lodLevel) => {
    const optimizedMaterial = material.clone();
    
    if (lodLevel === 'low') {
      // Désactiver les fonctionnalités coûteuses
      optimizedMaterial.shadowSide = THREE.FrontSide;
      optimizedMaterial.side = THREE.FrontSide;
      optimizedMaterial.transparent = false;
      optimizedMaterial.alphaTest = 0.5;
    } else if (lodLevel === 'medium') {
      // Paramètres équilibrés
      optimizedMaterial.shadowSide = THREE.DoubleSide;
      optimizedMaterial.side = THREE.DoubleSide;
    }
    
    return optimizedMaterial;
  }, []);
  
  // Détecter les changements de position de la caméra
  const hasCameraMoved = useMemo(() => {
    const currentPosition = camera.position.clone();
    const moved = !currentPosition.equals(lastCameraPosition.current);
    if (moved) {
      lastCameraPosition.current = currentPosition;
    }
    return moved;
  }, [camera.position]);
  
  return {
    getDistanceToCamera,
    getLODLevel,
    optimizeGeometry,
    optimizeMaterial,
    hasCameraMoved
  };
}

export default useLODSystem;
