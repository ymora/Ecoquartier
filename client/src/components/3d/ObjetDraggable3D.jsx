import { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Wrapper pour rendre un objet 3D draggable (VERSION AMÉLIORÉE)
 * Permet de déplacer l'objet sur le plan horizontal (XZ)
 * Fixe : événements globaux, désactivation OrbitControls, curseur
 */
function ObjetDraggable3D({ 
  children, 
  position, 
  type,
  enabled = true,
  onDragStart,
  onDrag,
  onDragEnd,
  maisonBounds = null // Pour validation collision
}) {
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { camera, gl, raycaster, controls } = useThree();
  
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // Plan horizontal Y=0
  const intersection = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const startPosition = useRef(position);
  const currentPosition = useRef(position);
  
  const handlePointerDown = (e) => {
    if (!enabled) return;
    
    e.stopPropagation();
    
    // Enregistrer position de départ
    startPosition.current = [...position];
    currentPosition.current = [...position];
    
    // Calculer le décalage entre le point de clic et le centre de l'objet
    if (groupRef.current) {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera({ x, y }, camera);
      raycaster.ray.intersectPlane(dragPlane.current, intersection.current);
      offset.current.copy(intersection.current).sub(groupRef.current.position);
    }
    
    setIsDragging(true);
    if (onDragStart) onDragStart();
    
    // ✅ Désactiver OrbitControls proprement
    if (controls) controls.enabled = false;
    gl.domElement.style.cursor = 'grabbing';
  };
  
  // ✅ Événements globaux pour capturer les mouvements même hors de l'objet
  useEffect(() => {
    if (!isDragging) return;
    
    const handleGlobalPointerMove = (e) => {
      if (!enabled || !groupRef.current) return;
      
      // Calculer nouvelle position
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera({ x, y }, camera);
      
      if (raycaster.ray.intersectPlane(dragPlane.current, intersection.current)) {
        const newPos = intersection.current.clone().sub(offset.current);
        
        // Validation collision avec maison
        if (maisonBounds && type !== 'maison') {
          const isInsideMaison = 
            newPos.x > maisonBounds.minX &&
            newPos.x < maisonBounds.maxX &&
            newPos.z > maisonBounds.minZ &&
            newPos.z < maisonBounds.maxZ;
          
          if (isInsideMaison) {
            // Bloquer : ne pas mettre à jour la position
            return;
          }
        }
        
        // Mettre à jour position du groupe
        groupRef.current.position.set(newPos.x, position[1], newPos.z);
        currentPosition.current = [newPos.x, position[1], newPos.z];
        
        if (onDrag) {
          onDrag({ x: newPos.x, y: position[1], z: newPos.z });
        }
      }
    };
    
    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      gl.domElement.style.cursor = hovered ? 'grab' : 'auto';
      
      // ✅ Réactiver OrbitControls
      if (controls) controls.enabled = true;
      
      if (onDragEnd && groupRef.current) {
        const finalPos = currentPosition.current;
        onDragEnd({
          type,
          oldPosition: { x: startPosition.current[0], y: startPosition.current[1], z: startPosition.current[2] },
          newPosition: { x: finalPos[0], y: finalPos[1], z: finalPos[2] }
        });
      }
    };
    
    // Écouter au niveau du document
    document.addEventListener('pointermove', handleGlobalPointerMove);
    document.addEventListener('pointerup', handleGlobalPointerUp);
    
    return () => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isDragging, enabled, camera, gl, raycaster, controls, position, type, maisonBounds, hovered, onDrag, onDragEnd]);
  
  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerOver={(e) => { 
        e.stopPropagation(); 
        if (enabled && !isDragging) {
          setHovered(true);
          gl.domElement.style.cursor = 'grab';
        }
      }}
      onPointerOut={(e) => { 
        e.stopPropagation(); 
        setHovered(false);
        if (!isDragging) gl.domElement.style.cursor = 'auto';
      }}
    >
      {children}
      
      {/* ✅ Indicateur visuel amélioré quand survolé */}
      {enabled && hovered && !isDragging && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.2, 32]} />
          <meshBasicMaterial color="#2196f3" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}
      
      {/* ✅ Indicateur visuel amélioré pendant le drag */}
      {enabled && isDragging && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.3, 32]} />
          <meshBasicMaterial color="#4caf50" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

export default ObjetDraggable3D;

