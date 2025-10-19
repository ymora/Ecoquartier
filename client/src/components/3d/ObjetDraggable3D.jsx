import { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Wrapper pour rendre un objet 3D draggable
 * Permet de déplacer l'objet sur le plan horizontal (XZ)
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
  const { camera, gl, raycaster } = useThree();
  
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // Plan horizontal Y=0
  const intersection = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const startPosition = useRef(position);
  
  const handlePointerDown = (e) => {
    if (!enabled) return;
    
    e.stopPropagation();
    
    // Enregistrer position de départ
    startPosition.current = [...position];
    
    // Calculer le décalage entre le point de clic et le centre de l'objet
    if (groupRef.current) {
      raycaster.ray.intersectPlane(dragPlane.current, intersection.current);
      offset.current.copy(intersection.current).sub(groupRef.current.position);
    }
    
    setIsDragging(true);
    if (onDragStart) onDragStart();
    
    // Désactiver OrbitControls pendant le drag
    gl.domElement.style.cursor = 'move';
  };
  
  const handlePointerMove = (e) => {
    if (!isDragging || !enabled) return;
    
    e.stopPropagation();
    
    // Calculer nouvelle position
    raycaster.setFromCamera(
      {
        x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1
      },
      camera
    );
    
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
      if (groupRef.current) {
        groupRef.current.position.set(newPos.x, position[1], newPos.z);
      }
      
      if (onDrag) {
        onDrag({ x: newPos.x, y: position[1], z: newPos.z });
      }
    }
  };
  
  const handlePointerUp = (e) => {
    if (!isDragging) return;
    
    e.stopPropagation();
    setIsDragging(false);
    gl.domElement.style.cursor = 'auto';
    
    if (onDragEnd && groupRef.current) {
      const finalPosition = groupRef.current.position;
      onDragEnd({
        type,
        oldPosition: { x: startPosition.current[0], y: startPosition.current[1], z: startPosition.current[2] },
        newPosition: { x: finalPosition.x, y: finalPosition.y, z: finalPosition.z }
      });
    }
  };
  
  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={(e) => { e.stopPropagation(); if (enabled) setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {children}
      
      {/* Indicateur visuel quand survolé */}
      {enabled && hovered && !isDragging && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#2196f3" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Indicateur visuel pendant le drag */}
      {enabled && isDragging && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#4caf50" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}

export default ObjetDraggable3D;

