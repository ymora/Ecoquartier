import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hook avancé pour le système LOD (Level of Detail)
 * Optimise les performances en fonction de la distance et de la complexité de la scène
 */

export function useAdvancedLOD() {
  const { camera, scene } = useThree();
  const lastCameraPosition = useRef(camera.position.clone());
  const performanceMetrics = useRef({
    frameCount: 0,
    lastFrameTime: 0,
    averageFPS: 60,
    isLowEndDevice: false
  });
  
  // Détecter les appareils bas de gamme
  const detectLowEndDevice = useCallback(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return true;
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return renderer.includes('Intel') || 
             renderer.includes('Mali') || 
             renderer.includes('Adreno 3') ||
             renderer.includes('PowerVR');
    }
    
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return true;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
    
    return false;
  }, []);
  
  // Calculer la distance à la caméra
  const getDistanceToCamera = useCallback((objectPosition) => {
    return camera.position.distanceTo(new THREE.Vector3(...objectPosition));
  }, [camera]);
  
  // Déterminer le niveau de détail selon la distance et les performances
  const getLODLevel = useCallback((objectPosition, maxDistance = 100) => {
    const distance = getDistanceToCamera(objectPosition);
    const { averageFPS, isLowEndDevice } = performanceMetrics.current;
    
    // Ajuster selon les performances
    let adjustedMaxDistance = maxDistance;
    if (averageFPS < 30) adjustedMaxDistance *= 0.5;
    else if (averageFPS < 45) adjustedMaxDistance *= 0.7;
    
    // Ajuster selon le type d'appareil
    if (isLowEndDevice) adjustedMaxDistance *= 0.6;
    
    if (distance < adjustedMaxDistance * 0.2) return 'high';
    if (distance < adjustedMaxDistance * 0.5) return 'medium';
    return 'low';
  }, [getDistanceToCamera]);
  
  // Optimiser les géométries selon le LOD
  const optimizeGeometry = useCallback((geometry, lodLevel) => {
    if (lodLevel === 'low') {
      // Simplifier drastiquement la géométrie
      if (geometry.attributes.position && geometry.attributes.position.count > 500) {
        const simplifiedGeometry = geometry.clone();
        const positionAttribute = geometry.attributes.position;
        const newCount = Math.floor(positionAttribute.count * 0.2);
        
        const newPositions = new Float32Array(newCount * 3);
        const step = Math.floor(positionAttribute.count / newCount);
        
        for (let i = 0; i < newCount; i++) {
          const sourceIndex = i * step;
          newPositions[i * 3] = positionAttribute.array[sourceIndex * 3];
          newPositions[i * 3 + 1] = positionAttribute.array[sourceIndex * 3 + 1];
          newPositions[i * 3 + 2] = positionAttribute.array[sourceIndex * 3 + 2];
        }
        
        simplifiedGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
        return simplifiedGeometry;
      }
    } else if (lodLevel === 'medium') {
      // Simplification modérée
      if (geometry.attributes.position && geometry.attributes.position.count > 1000) {
        const simplifiedGeometry = geometry.clone();
        const positionAttribute = geometry.attributes.position;
        const newCount = Math.floor(positionAttribute.count * 0.5);
        
        const newPositions = new Float32Array(newCount * 3);
        const step = Math.floor(positionAttribute.count / newCount);
        
        for (let i = 0; i < newCount; i++) {
          const sourceIndex = i * step;
          newPositions[i * 3] = positionAttribute.array[sourceIndex * 3];
          newPositions[i * 3 + 1] = positionAttribute.array[sourceIndex * 3 + 1];
          newPositions[i * 3 + 2] = positionAttribute.array[sourceIndex * 3 + 2];
        }
        
        simplifiedGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
        return simplifiedGeometry;
      }
    }
    
    return geometry;
  }, []);
  
  // Optimiser les matériaux selon le LOD
  const optimizeMaterial = useCallback((material, lodLevel) => {
    const optimizedMaterial = material.clone();
    
    if (lodLevel === 'low') {
      // Désactiver toutes les fonctionnalités coûteuses
      optimizedMaterial.shadowSide = THREE.FrontSide;
      optimizedMaterial.side = THREE.FrontSide;
      optimizedMaterial.transparent = false;
      optimizedMaterial.alphaTest = 0.5;
      optimizedMaterial.roughness = 0.8;
      optimizedMaterial.metalness = 0.1;
    } else if (lodLevel === 'medium') {
      // Paramètres équilibrés
      optimizedMaterial.shadowSide = THREE.DoubleSide;
      optimizedMaterial.side = THREE.DoubleSide;
      optimizedMaterial.transparent = true;
      optimizedMaterial.alphaTest = 0.1;
    }
    
    return optimizedMaterial;
  }, []);
  
  // Frustum culling optimisé
  const frustumCull = useCallback((objects) => {
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4();
    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);
    
    return objects.filter(obj => {
      if (!obj.geometry || !obj.geometry.boundingSphere) return true;
      
      const sphere = obj.geometry.boundingSphere.clone();
      sphere.applyMatrix4(obj.matrixWorld);
      
      return frustum.intersectsSphere(sphere);
    });
  }, [camera]);
  
  // Occlusion culling basique
  const occlusionCull = useCallback((objects) => {
    // Tri par distance à la caméra
    const sortedObjects = objects.sort((a, b) => {
      const distA = camera.position.distanceTo(a.position);
      const distB = camera.position.distanceTo(b.position);
      return distA - distB;
    });
    
    // Garder seulement les objets les plus proches selon les performances
    const { averageFPS, isLowEndDevice } = performanceMetrics.current;
    let maxObjects = 100;
    
    if (isLowEndDevice) maxObjects = 50;
    else if (averageFPS < 30) maxObjects = 60;
    else if (averageFPS < 45) maxObjects = 80;
    
    return sortedObjects.slice(0, maxObjects);
  }, [camera]);
  
  // Mettre à jour les métriques de performance
  const updatePerformanceMetrics = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - performanceMetrics.current.lastFrameTime;
    
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      performanceMetrics.current.averageFPS = 
        (performanceMetrics.current.averageFPS * 0.9) + (fps * 0.1);
    }
    
    performanceMetrics.current.lastFrameTime = now;
    performanceMetrics.current.frameCount++;
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
  
  // Initialiser la détection d'appareil
  useEffect(() => {
    performanceMetrics.current.isLowEndDevice = detectLowEndDevice();
  }, [detectLowEndDevice]);
  
  // Boucle de performance
  useEffect(() => {
    const interval = setInterval(updatePerformanceMetrics, 1000);
    return () => clearInterval(interval);
  }, [updatePerformanceMetrics]);
  
  return {
    getDistanceToCamera,
    getLODLevel,
    optimizeGeometry,
    optimizeMaterial,
    frustumCull,
    occlusionCull,
    hasCameraMoved,
    performanceMetrics: performanceMetrics.current
  };
}

export default useAdvancedLOD;
